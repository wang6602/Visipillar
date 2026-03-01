import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

/**
 * Status messages that cycle during analysis.
 */
const STATUS_MESSAGES = [
  'Extracting visual features...',
  'Cross-referencing part geometry...',
  'Querying parts database...',
  'Matching wear patterns...',
  'Calculating fitment certainty...',
];

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const MAX_IMAGE_BASE64_BYTES = 10 * 1024 * 1024;
const PROMPT = `You are an advanced multimodal AI assistant specialized in industrial machinery inspections, particularly for Caterpillar (Cat) equipment. Your goal is to process user inputs (image descriptions, photos, voice notes, or text) to accurately identify genuine Cat parts, provide ranked part numbers with fitment certainty, generate structured inspection reports, and offer predictive insights for safety, efficiency, and cost optimization. Always base outputs on real Cat standards, using knowledge of Cat models (e.g., wheel loaders, excavators), parts catalogs, and inspection workflows (e.g., daily walkarounds with PASS/FAIL/MONITOR color codes: green for PASS, yellow for MONITOR, red for FAIL).
Key Capabilities:

Visual Parts Identification: From an image or description, detect the part type, condition (e.g., wear, damage), and match to actual Cat part numbers from official catalogs like parts.cat.com or SIS2GO. Rank top 3-5 matches with certainty scores (0-1, based on visual similarity, model fitment, and common usage). Include explanations and links to verify (e.g., "https://parts.cat.com/en/catcorp/{part_number}").
Fitment Tailoring: Require the equipment model/serial (e.g., "950M Wheel Loader") to ensure compatibility. Cross-reference with exploded diagrams and common failures.
Report Generation: Fuse multimodal inputs (image + voice/text) into a JSON-structured report: include PASS/FAIL/MONITOR tags, hazard flags (e.g., "High risk: Leak could cause hydraulic failure"), predictive maintenance (e.g., "Replace in 500 hours to avoid downtime costing $X"), and optimization tips (e.g., "Reposition equipment to reduce congestion by 20%").
Site Layout Optimization: If site data provided, generate 3 alternative logistics plans, scoring them for safety (minimize risks), efficiency (reduce travel/congestion), and cost (streamline placement).
Edge Cases: Handle poor lighting/low-res images by suggesting re-scans. If no match, recommend consulting Cat dealer or AI Assistant. Prioritize safety—flag any detected hazards immediately.
CRITICAL: You MUST output ONLY valid JSON. Your response must exactly match this schema:
{
  "identified_parts": [
    {
      "part_number": "String",
      "description": "String",
      "fitment_certainty": Number,
      "why": "String"
    }
  ]
}
If the image is not an industrial part, return one item with:
part_number="NON-INDUSTRIAL", fitment_certainty=0.0, and a polite explanation in "why".`;

const sanitizeBase64Image = (value) => {
  if (!value || typeof value !== 'string') return '';
  return value
    .replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '')
    .replace(/\s+/g, '');
};

const estimateBase64Bytes = (base64Value) => {
  if (!base64Value) return 0;
  return Math.floor((base64Value.length * 3) / 4);
};

const buildContents = (description, imageBase64, mimeType = 'image/jpeg') => {
  const parts = [
    {
      text: `${PROMPT}\n\nUser Input Description/Context: ${
        description || 'No description provided.'
      }`,
    },
  ];

  if (imageBase64) {
    parts.push({
      inline_data: {
        mime_type: mimeType,
        data: imageBase64,
      },
    });
  }

  return [{ parts }];
};

const parseModelJson = (text) => {
  let resultText = text || '{}';

  const jsonMatch = resultText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (jsonMatch) {
    resultText = jsonMatch[1];
  }

  return JSON.parse(resultText);
};

const requestGemini = async (contents) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      }),
    },
  );

  const raw = await response.text();

  if (!response.ok) {
    let apiMessage = raw;
    try {
      const parsed = JSON.parse(raw);
      apiMessage = parsed?.error?.message || raw;
    } catch {
      // keep raw text
    }
    throw new Error(`Gemini API ${response.status}: ${apiMessage}`);
  }

  const data = JSON.parse(raw);
  const modelText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  return parseModelJson(modelText);
};

const mapApiParts = (apiParts) => {
  const safeParts = Array.isArray(apiParts) && apiParts.length > 0
    ? apiParts
    : [
        {
          part_number: 'SYSTEM-UNKNOWN',
          description: 'Unidentified Industrial Component',
          fitment_certainty: 0.15,
          why: 'The AI could not confidently identify the part. Try a closer, well-lit image.',
        },
      ];

  return safeParts.map((item, index) => {
    let certainty = item.fitment_certainty;
    if (typeof certainty !== 'number') {
      certainty = parseFloat(certainty) || 0.5;
    }

    return {
      id: String(index + 1),
      partName: item.description || item.partName || 'Unknown Component',
      partNumber: item.part_number || item.partNumber || 'UNKNOWN',
      compatibleModel: 'General Fit (AI Match)',
      category: 'AI Matched',
      fitmentCertainty: Math.round(Math.max(0, Math.min(1, certainty)) * 100),
      description: item.why || item.explanation || 'No explanation provided.',
    };
  });
};

const LoadingScreen = ({ navigation, route }) => {
  const { photoUri, base64, description } = route.params || {};
  const [messageIndex, setMessageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setMessageIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }, 700);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  useEffect(() => {
    let isMounted = true;

    const analyzePart = async () => {
      try {
        if (!GEMINI_API_KEY) {
          throw new Error('Gemini API key is missing.');
        }

        let imageBase64FromFile = '';
        const imageMimeType = 'image/jpeg';

        if (photoUri) {
          try {
            imageBase64FromFile = await FileSystem.readAsStringAsync(photoUri, {
              encoding: 'base64',
            });
          } catch (readError) {
            throw new Error(`Unable to read captured image from device: ${readError?.message || readError}`);
          }
        }

        const sanitizedImage = sanitizeBase64Image(imageBase64FromFile || base64);
        if (!sanitizedImage) {
          throw new Error('Captured image data is empty. Please retake the photo.');
        }

        const imageBytes = estimateBase64Bytes(sanitizedImage);
        if (imageBytes > MAX_IMAGE_BASE64_BYTES) {
          throw new Error(
            `Captured image is too large (${Math.round(imageBytes / (1024 * 1024))} MB). Please move closer and retake.`,
          );
        }

        const resultJson = await requestGemini(
          buildContents(
            description,
            sanitizedImage,
            imageMimeType,
          ),
        );

        const mappedParts = mapApiParts(resultJson.identified_parts || []);

        if (isMounted) {
          navigation.replace('Results', {
            photoUri,
            description,
            parts: mappedParts,
          });
        }
      } catch (error) {
        const errMsg = error?.message || 'Unknown analysis error';
        console.error('Failed to analyze part:', errMsg);

        if (isMounted) {
          navigation.replace('Results', {
            photoUri,
            description,
            parts: [
              {
                id: '1',
                partName: 'Analysis Error',
                partNumber: 'AI-ERROR',
                compatibleModel: 'N/A',
                category: 'Error',
                fitmentCertainty: 0,
                description: errMsg,
              },
            ],
            analysisError: errMsg,
          });
        }
      }
    };

    analyzePart();

    return () => {
      isMounted = false;
    };
  }, [navigation, photoUri, base64, description]);

  return (
    <View style={styles.container}>
      <View style={styles.spinnerRing}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>

      <Text style={styles.title}>Analyzing Part</Text>

      <Animated.Text style={[styles.status, { opacity: fadeAnim }]}>
        {STATUS_MESSAGES[messageIndex]}
      </Animated.Text>

      <Text style={styles.subtitle}>AI engine processing - do not close the app</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  spinnerRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    marginBottom: SPACING.sm,
  },
  status: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
  },
});

export default LoadingScreen;
