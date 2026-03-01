import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/theme';
import FitmentBar from './FitmentBar';

/**
 * PartCard — displays a single candidate part match.
 *
 * Props:
 *   part          (object)   part data from API / mock
 *   isTopRanked   (bool)     show "Add to Logistics Plan" button
 */
const PartCard = ({ part, isTopRanked = false }) => {
  const handleAddToLogistics = () => {
    Alert.alert(
      'Added to Logistics Plan',
      `${part.partName} (${part.partNumber}) has been queued for procurement.`,
      [{ text: 'OK' }],
    );
  };

  return (
    <View style={[styles.card, isTopRanked && styles.cardHighlight]}>
      {/* Header row */}
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{part.category}</Text>
        </View>
        {isTopRanked && (
          <View style={styles.topBadge}>
            <Text style={styles.topBadgeText}>★ TOP MATCH</Text>
          </View>
        )}
      </View>

      {/* Part name & number */}
      <Text style={styles.partName}>{part.partName}</Text>
      <Text style={styles.partNumber}>{part.partNumber}</Text>

      {/* Compatible model tag */}
      <View style={styles.modelTag}>
        <Text style={styles.modelTagLabel}>Fits: </Text>
        <Text style={styles.modelTagValue}>{part.compatibleModel}</Text>
      </View>

      {/* Description */}
      <Text style={styles.description}>
        {part.description}
      </Text>

      {/* Fitment bar */}
      <FitmentBar certainty={part.fitmentCertainty} />

      {/* Add to Logistics button — top ranked only */}
      {isTopRanked && (
        <TouchableOpacity
          style={styles.logisticsButton}
          activeOpacity={0.8}
          onPress={handleAddToLogistics}
        >
          <Text style={styles.logisticsButtonText}>＋ Add to Logistics Plan</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHighlight: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryBadge: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  categoryText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  topBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  topBadgeText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.xs,
    fontWeight: '800',
  },

  /* Body */
  partName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    marginBottom: 2,
  },
  partNumber: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  modelTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  modelTagLabel: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  modelTagValue: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    lineHeight: 18,
  },

  /* CTA */
  logisticsButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  logisticsButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.md,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});

export default PartCard;
