import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { INSPECTION_SECTIONS, REPORT_DISCLAIMER } from '../data/inspectionChecklist';

const COL_WIDTHS = {
  inspect: 240,
  checkA: 54,
  lookFor: 240,
  checkB: 54,
  comments: 360,
};

const TABLE_WIDTH =
  COL_WIDTHS.inspect +
  COL_WIDTHS.checkA +
  COL_WIDTHS.lookFor +
  COL_WIDTHS.checkB +
  COL_WIDTHS.comments;

const hasKeyword = (text, keywords = []) =>
  keywords.some((keyword) => text.includes(String(keyword).toLowerCase()));

const buildAutoAnnotations = (parts = []) => {
  const autoChecked = {};
  const autoComments = {};

  if (!Array.isArray(parts) || parts.length === 0) {
    return { autoChecked, autoComments };
  }

  const normalizedParts = parts.map((part) => {
    const partName = part.partName || part.description || 'Unknown Component';
    const reason = part.description || '';
    return {
      partName,
      reason,
      normalizedText: `${partName} ${reason}`.toLowerCase(),
    };
  });

  INSPECTION_SECTIONS.forEach((section) => {
    section.rows.forEach((row) => {
      const match = normalizedParts.find((part) =>
        hasKeyword(part.normalizedText, row.keywords),
      );

      if (match) {
        autoChecked[row.id] = true;
        autoComments[row.id] = `${match.partName}: ${match.reason}`.slice(0, 180);
      }
    });
  });

  return { autoChecked, autoComments };
};

const Field = ({ label, value, onChangeText, width }) => (
  <View style={[styles.field, { width }]}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={styles.fieldInput}
      multiline={false}
    />
  </View>
);

const TableCell = ({ width, children, style }) => (
  <View style={[styles.cell, { width }, style]}>{children}</View>
);

const InspectionReportScreen = ({ route }) => {
  const { parts = [] } = route.params || {};
  const now = useMemo(() => new Date(), []);
  const defaults = useMemo(
    () => ({
      date: now.toLocaleDateString('en-US'),
      time: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }),
    [now],
  );

  const annotations = useMemo(() => buildAutoAnnotations(parts), [parts]);

  const [operatorInspector, setOperatorInspector] = useState('');
  const [dateValue, setDateValue] = useState(defaults.date);
  const [timeValue, setTimeValue] = useState(defaults.time);
  const [machineHours, setMachineHours] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [inspectChecks, setInspectChecks] = useState(annotations.autoChecked);
  const [lookForChecks, setLookForChecks] = useState(annotations.autoChecked);
  const [comments, setComments] = useState(annotations.autoComments);

  useEffect(() => {
    setInspectChecks(annotations.autoChecked);
    setLookForChecks(annotations.autoChecked);
    setComments(annotations.autoComments);
  }, [annotations]);

  const toggleInspectCheck = (rowId) => {
    setInspectChecks((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  const toggleLookForCheck = (rowId) => {
    setLookForChecks((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  const updateComment = (rowId, value) => {
    setComments((prev) => ({ ...prev, [rowId]: value }));
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Daily Walkaround Inspection Report</Text>
        <Text style={styles.subtitle}>
          Auto-checks are prefilled from detected AI part issues. You can edit everything.
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator style={styles.horizontalWrap}>
          <View style={styles.sheet}>
            <View style={styles.headerRow}>
              <Field
                label="Operator/Inspector"
                value={operatorInspector}
                onChangeText={setOperatorInspector}
                width={TABLE_WIDTH * 0.36}
              />
              <Field label="Date" value={dateValue} onChangeText={setDateValue} width={TABLE_WIDTH * 0.16} />
              <Field label="Time" value={timeValue} onChangeText={setTimeValue} width={TABLE_WIDTH * 0.14} />
              <Field
                label="Machine Hours"
                value={machineHours}
                onChangeText={setMachineHours}
                width={TABLE_WIDTH * 0.28}
              />
            </View>

            <View style={[styles.headerRow, styles.serialRow]}>
              <Field
                label="Serial Number"
                value={serialNumber}
                onChangeText={setSerialNumber}
                width={TABLE_WIDTH}
              />
            </View>

            <View style={styles.table}>
              <View style={[styles.row, styles.headerTableRow]}>
                <TableCell width={COL_WIDTHS.inspect}>
                  <Text style={styles.headerText}>What are you inspecting?</Text>
                </TableCell>
                <TableCell width={COL_WIDTHS.checkA} style={styles.centeredCell}>
                  <Text style={styles.headerText}>✓</Text>
                </TableCell>
                <TableCell width={COL_WIDTHS.lookFor}>
                  <Text style={styles.headerText}>What are you looking for?</Text>
                </TableCell>
                <TableCell width={COL_WIDTHS.checkB} style={styles.centeredCell}>
                  <Text style={styles.headerText}>✓</Text>
                </TableCell>
                <TableCell width={COL_WIDTHS.comments}>
                  <Text style={styles.headerText}>Evaluator Comments</Text>
                </TableCell>
              </View>

              <View style={[styles.row, styles.disclaimerRow]}>
                <Text style={styles.disclaimerText}>{REPORT_DISCLAIMER}</Text>
              </View>

              {INSPECTION_SECTIONS.map((section) => (
                <View key={section.title}>
                  <View style={[styles.row, styles.sectionRow]}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                  </View>

                  {section.rows.map((row) => (
                    <View key={row.id} style={styles.row}>
                      <TableCell width={COL_WIDTHS.inspect}>
                        <Text style={styles.cellText}>{row.inspect}</Text>
                      </TableCell>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => toggleInspectCheck(row.id)}
                        style={[styles.cell, styles.centeredCell, { width: COL_WIDTHS.checkA }]}
                      >
                        <Text style={styles.checkboxText}>{inspectChecks[row.id] ? '[x]' : '[ ]'}</Text>
                      </TouchableOpacity>

                      <TableCell width={COL_WIDTHS.lookFor}>
                        <Text style={styles.cellText}>{row.lookFor}</Text>
                      </TableCell>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => toggleLookForCheck(row.id)}
                        style={[styles.cell, styles.centeredCell, { width: COL_WIDTHS.checkB }]}
                      >
                        <Text style={styles.checkboxText}>{lookForChecks[row.id] ? '[x]' : '[ ]'}</Text>
                      </TouchableOpacity>

                      <TableCell width={COL_WIDTHS.comments}>
                        <TextInput
                          value={comments[row.id] || ''}
                          onChangeText={(value) => updateComment(row.id, value)}
                          style={styles.commentInput}
                          multiline
                        />
                      </TableCell>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  page: {
    padding: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#222222',
    marginBottom: 8,
  },
  horizontalWrap: {
    borderWidth: 1,
    borderColor: '#111111',
    backgroundColor: '#ffffff',
  },
  sheet: {
    width: TABLE_WIDTH,
    padding: 8,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 6,
  },
  serialRow: {
    marginTop: 6,
    marginBottom: 8,
  },
  field: {
    gap: 3,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#111111',
    minHeight: 32,
    paddingHorizontal: 6,
    paddingVertical: 4,
    fontSize: 12,
    color: '#111111',
  },
  table: {
    borderWidth: 1,
    borderColor: '#111111',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#111111',
  },
  headerTableRow: {
    backgroundColor: '#f7f7f7',
  },
  disclaimerRow: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  disclaimerText: {
    fontSize: 10.2,
    color: '#111111',
  },
  sectionRow: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f2f2f2',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
  },
  cell: {
    minHeight: 38,
    borderRightWidth: 1,
    borderRightColor: '#111111',
    paddingHorizontal: 6,
    paddingVertical: 6,
    justifyContent: 'center',
  },
  centeredCell: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
  },
  cellText: {
    fontSize: 11.2,
    color: '#111111',
  },
  checkboxText: {
    fontSize: 12,
    color: '#111111',
    fontWeight: '700',
  },
  commentInput: {
    minHeight: 24,
    padding: 0,
    fontSize: 11,
    color: '#111111',
  },
});

export default InspectionReportScreen;
