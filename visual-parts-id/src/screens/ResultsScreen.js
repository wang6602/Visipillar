import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/theme';
import PartCard from '../components/PartCard';

/**
 * ResultsScreen - displays the captured photo thumbnail and a
 * ranked list of identified parts with fitment scores.
 */
const ResultsScreen = ({ navigation, route }) => {
  const { photoUri, description, parts = [], analysisError } = route.params || {};

  const handleScanAnother = () => {
    navigation.popToTop();
  };

  const handleOpenReport = () => {
    navigation.navigate('InspectionReport', {
      parts,
      photoUri,
      description,
    });
  };

  const renderHeader = () => (
    <View>
      {analysisError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorTitle}>Analysis failed</Text>
          <Text style={styles.errorText} numberOfLines={4}>
            {analysisError}
          </Text>
        </View>
      ) : null}

      <View style={styles.photoSection}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.placeholderThumb]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}

        <View style={styles.photoMeta}>
          <Text style={styles.photoLabel}>Captured Image</Text>
          {description ? (
            <Text style={styles.photoDescription} numberOfLines={2}>
              "{description}"
            </Text>
          ) : null}
          <Text style={styles.resultCount}>
            {parts.length} potential match{parts.length !== 1 ? 'es' : ''} found
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Identified Parts</Text>
    </View>
  );

  const renderFooter = () => (
    <View>
      <TouchableOpacity
        style={styles.reportButton}
        activeOpacity={0.8}
        onPress={handleOpenReport}
      >
        <Text style={styles.reportButtonText}>Open Inspection Report</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.scanButton}
        activeOpacity={0.8}
        onPress={handleScanAnother}
      >
        <Text style={styles.scanButtonText}>Scan Another Part</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={parts}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <PartCard part={item} isTopRanked={index === 0} />
        )}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  photoSection: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  errorBanner: {
    backgroundColor: '#4d1b1b',
    borderColor: '#ff6b6b',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  errorTitle: {
    color: '#ffb3b3',
    fontSize: FONT_SIZES.sm,
    fontWeight: '800',
    marginBottom: 2,
  },
  errorText: {
    color: '#ffd9d9',
    fontSize: FONT_SIZES.xs,
  },
  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: BORDER_RADIUS.md,
  },
  placeholderThumb: {
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.xs,
  },
  photoMeta: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  photoLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  photoDescription: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.sm,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  resultCount: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    marginBottom: SPACING.md,
  },
  reportButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  reportButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.md,
    fontWeight: '800',
  },
  scanButton: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scanButtonText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
});

export default ResultsScreen;
