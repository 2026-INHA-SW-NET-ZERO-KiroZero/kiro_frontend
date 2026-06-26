import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button, Icon, SheetBase } from '@/components';
import { color, font, radius, space } from '@/theme/theme';

type JoinRow = { name: string; count: string; gram: string };

type JoinSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

const EMPTY_ROW: JoinRow = { name: '', count: '', gram: '' };

export function JoinSheet({ visible, onClose, onSubmit }: JoinSheetProps) {
  const [rows, setRows] = useState<JoinRow[]>([{ ...EMPTY_ROW }]);
  const [extraPossible, setExtraPossible] = useState(false);

  const canSubmit = rows.some((r) => r.name.trim() && r.count.trim());

  function updateRow(index: number, key: keyof JoinRow, value: string) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [key]: value } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, { ...EMPTY_ROW }]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <SheetBase visible={visible} onClose={onClose} title="가져갈 재료">
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {rows.map((row, index) => (
          <View key={index} style={styles.row}>
            <TextInput
              style={[styles.input, styles.inputName]}
              value={row.name}
              onChangeText={(v) => updateRow(index, 'name', v)}
              placeholder="재료명"
              placeholderTextColor={color.placeholder}
            />
            <TextInput
              style={[styles.input, styles.inputCount]}
              value={row.count}
              onChangeText={(v) => updateRow(index, 'count', v)}
              placeholder="개수 *"
              placeholderTextColor={color.placeholder}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.inputGram]}
              value={row.gram}
              onChangeText={(v) => updateRow(index, 'gram', v)}
              placeholder="g"
              placeholderTextColor={color.placeholder}
              keyboardType="numeric"
            />
            {rows.length > 1 ? (
              <Pressable style={styles.removeBtn} onPress={() => removeRow(index)} hitSlop={6}>
                <Icon name="close" size={18} color={color.iconFaint} />
              </Pressable>
            ) : null}
          </View>
        ))}

        <Pressable style={styles.addRow} onPress={addRow}>
          <Icon name="add" size={18} color={color.eco} />
          <Text style={styles.addText}>재료 추가하기</Text>
        </Pressable>

        <View style={styles.warning}>
          <Text style={styles.warningText}>
            🚨 땅콩·갑각류 등 알레르기 유발 재료는 참여자 알레르기와 교차 확인해 주세요
          </Text>
        </View>

        <Pressable style={styles.extraRow} onPress={() => setExtraPossible((v) => !v)}>
          <Icon
            name={extraPossible ? 'check-circle' : 'radio-button-unchecked'}
            size={20}
            color={extraPossible ? color.eco : color.textFaint}
          />
          <Text style={styles.extraText}>추가 재료 구매 가능</Text>
        </Pressable>

        <Text style={styles.feeNote}>이용 요금 2,000원이 차감돼요</Text>

        <Button label="신청하기" onPress={onSubmit} disabled={!canSubmit} style={styles.submit} />
      </ScrollView>
    </SheetBase>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: space.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    marginBottom: space.lg,
  },
  input: {
    backgroundColor: color.appBgInput,
    borderWidth: 1,
    borderColor: color.borderInput,
    borderRadius: radius.md,
    paddingHorizontal: space.x2,
    paddingVertical: space.x2,
    fontSize: font.size.bodySm,
    fontFamily: font.family.medium,
    color: color.ink,
    letterSpacing: font.tracking.base,
  },
  inputName: {
    flex: 1,
  },
  inputCount: {
    width: 78,
    textAlign: 'center',
  },
  inputGram: {
    width: 58,
    textAlign: 'center',
  },
  removeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.md,
    marginBottom: space.x2,
  },
  addText: {
    fontSize: font.size.sm,
    fontFamily: font.family.bold,
    color: color.eco,
    letterSpacing: font.tracking.base,
  },
  warning: {
    backgroundColor: color.redBgSoft3,
    borderRadius: radius.lg,
    padding: space.x2,
    marginBottom: space.x6,
  },
  warningText: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.brandStrong,
    lineHeight: font.size.cap * font.lineHeight.snug,
    letterSpacing: font.tracking.base,
  },
  extraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.sm,
    marginBottom: space.md,
  },
  extraText: {
    fontSize: font.size.sm,
    fontFamily: font.family.semibold,
    color: color.ink2,
    letterSpacing: font.tracking.base,
  },
  feeNote: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.textFaint,
    marginBottom: space.x6,
    letterSpacing: font.tracking.base,
  },
  submit: {
    marginTop: space.xs,
  },
});
