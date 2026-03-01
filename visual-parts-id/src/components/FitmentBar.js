import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/theme';

/**
 * FitmentBar — visual certainty indicator.
 *
 * Props:
 *   certainty  (number 0–100)  fitment score
 */
const FitmentBar = ({ certainty = 0 }) => {
  const clamped = Math.max(0, Math.min(100, certainty));

  const barColor =
    clamped > 80
      ? COLORS.fitmentGreen
      : clamped >= 50
        ? COLORS.fitmentYellow
        : COLORS.fitmentRed;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Fitment Certainty</Text>
        <Text style={[styles.percentage, { color: barColor }]}>{clamped}%</Text>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${clamped}%`, backgroundColor: barColor },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  percentage: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
  },
  track: {
    height: 8,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.full,
  },
});

export default FitmentBar;
