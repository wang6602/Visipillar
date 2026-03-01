import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/theme';

const CameraScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [description, setDescription] = useState('');
  const [cameraReady, setCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.permissionText}>Initializing camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          We need your camera to photograph machinery parts for identification.
        </Text>
        <TouchableOpacity style={styles.permissionButton} activeOpacity={0.8} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || !cameraReady || isCapturing) return;

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.45,
        base64: false,
        exif: false,
        skipProcessing: false,
      });

      navigation.navigate('Loading', {
        photoUri: photo.uri,
        description: description.trim(),
      });
    } catch (err) {
      const msg = String(err?.message || err || 'Unknown camera error');
      if (!msg.toLowerCase().includes('unmounted')) {
        console.warn('Capture failed:', err);
      }
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.cameraWrapper}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            onCameraReady={() => setCameraReady(true)}
          />

          <View style={styles.overlay} pointerEvents="none">
            <View style={styles.crosshairH} />
            <View style={styles.crosshairV} />
          </View>

          <View style={styles.instructionBadge} pointerEvents="none">
            <Text style={styles.instructionText}>Center the damaged part in the frame</Text>
          </View>
        </View>

        <View style={styles.bottomPanel}>
          <TextInput
            style={styles.textInput}
            placeholder="Optional: Describe location or context..."
            placeholderTextColor={COLORS.textMuted}
            value={description}
            onChangeText={setDescription}
            returnKeyType="done"
            maxLength={200}
          />

          <TouchableOpacity
            style={[styles.captureButton, (!cameraReady || isCapturing) && styles.captureButtonDisabled]}
            activeOpacity={0.8}
            onPress={handleCapture}
            disabled={!cameraReady || isCapturing}
          >
            <Text style={styles.captureButtonText}>
              {isCapturing ? 'PROCESSING...' : 'ANALYZE PART'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  cameraWrapper: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairH: {
    position: 'absolute',
    width: 40,
    height: 2,
    backgroundColor: COLORS.primary,
    opacity: 0.6,
  },
  crosshairV: {
    position: 'absolute',
    width: 2,
    height: 40,
    backgroundColor: COLORS.primary,
    opacity: 0.6,
  },
  instructionBadge: {
    position: 'absolute',
    top: SPACING.lg,
    alignSelf: 'center',
    backgroundColor: COLORS.overlay,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  instructionText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  permissionTitle: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  permissionText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
  },
  permissionButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.md,
    fontWeight: '800',
  },
  bottomPanel: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    paddingBottom: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  textInput: {
    backgroundColor: COLORS.surfaceLight,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.md,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  captureButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.lg,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default CameraScreen;