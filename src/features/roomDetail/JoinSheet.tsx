import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button, Icon, SheetBase } from '@/components';
import { searchIngredients } from '@/lib/ingredientApi';
import { color, font, radius, space } from '@/theme/theme';
import type { JoinIngredientRequest, JoinSlotRequest } from '@/types';

type JoinRow = {
  ingredientId: number | null;
  nameKo: string;
  nameInput: string;
  count: string;
  gram: string;
  error: string | null;
};

type JoinSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: JoinSlotRequest) => void;
};

const EMPTY_ROW: JoinRow = {
  ingredientId: null,
  nameKo: '',
  nameInput: '',
  count: '',
  gram: '',
  error: null,
};

export function JoinSheet({ visible, onClose, onSubmit }: JoinSheetProps) {
  const [rows, setRows] = useState<JoinRow[]>([{ ...EMPTY_ROW }]);
  const [extraPossible, setExtraPossible] = useState(false);

  const confirmedRows = rows.filter((r) => r.ingredientId !== null && r.count.trim());
  const canSubmit = confirmedRows.length > 0;

  function updateRow(index: number, patch: Partial<JoinRow>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, { ...EMPTY_ROW }]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function handleNameSubmit(index: number) {
    const keyword = rows[index].nameInput.trim();
    if (!keyword) return;
    searchIngredients(keyword)
      .then((res) => {
        const match = res.ingredients[0];
        if (match) {
          updateRow(index, {
            ingredientId: match.ingredientId,
            nameKo: match.nameKo,
            error: null,
          });
        } else {
          updateRow(index, {
            ingredientId: null,
            nameKo: '',
            nameInput: '',
            error: '존재하지 않는 재료예요',
          });
        }
      })
      .catch(() => {
        updateRow(index, {
          ingredientId: null,
          nameKo: '',
          nameInput: '',
          error: '존재하지 않는 재료예요',
        });
      });
  }

  function handleSubmit() {
    const ingredients: JoinIngredientRequest[] = confirmedRows.map((r) => ({
      ingredientId: r.ingredientId as number,
      count: Number(r.count),
      ...(r.gram.trim() ? { knownGrams: Number(r.gram) } : {}),
    }));
    onSubmit({ canPurchase: extraPossible, ingredients });
  }

  return (
    <SheetBase visible={visible} onClose={onClose} title="가져갈 재료">
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {rows.map((row, index) => (
          <View key={index} style={styles.rowWrapper}>
            <View style={styles.row}>
              <View style={styles.nameInputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    styles.inputName,
                    row.ingredientId !== null && styles.inputConfirmed,
                    row.error !== null && styles.inputError,
                  ]}
                  value={row.ingredientId !== null ? row.nameKo : row.nameInput}
                  onChangeText={(v) =>
                    updateRow(index, { nameInput: v, ingredientId: null, nameKo: '', error: null })
                  }
                  onSubmitEditing={() => handleNameSubmit(index)}
                  placeholder="재료명 입력 후 엔터"
                  placeholderTextColor={color.placeholder}
                  returnKeyType="done"
                  editable={row.ingredientId === null}
                />
                {row.ingredientId !== null ? (
                  <Pressable
                    style={styles.clearBtn}
                    onPress={() => updateRow(index, { ...EMPTY_ROW })}
                    hitSlop={6}
                  >
                    <Icon name="close" size={14} color={color.textFaint} />
                  </Pressable>
                ) : null}
              </View>
              <TextInput
                style={[styles.input, styles.inputCount]}
                value={row.count}
                onChangeText={(v) => updateRow(index, { count: v })}
                placeholder="개수 *"
                placeholderTextColor={color.placeholder}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.inputGram]}
                value={row.gram}
                onChangeText={(v) => updateRow(index, { gram: v })}
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
            {row.error !== null ? <Text style={styles.errorText}>{row.error}</Text> : null}
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

        <Button
          label="신청하기"
          onPress={handleSubmit}
          disabled={!canSubmit}
          style={styles.submit}
        />
      </ScrollView>
    </SheetBase>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: space.md,
  },
  rowWrapper: {
    marginBottom: space.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  nameInputWrapper: {
    flex: 1,
    position: 'relative',
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
    width: '100%',
    paddingRight: space.x6,
  },
  inputConfirmed: {
    borderColor: color.eco,
    backgroundColor: color.ecoBgSoft,
  },
  inputError: {
    borderColor: color.brandStrong,
  },
  inputCount: {
    width: 78,
    textAlign: 'center',
  },
  inputGram: {
    width: 58,
    textAlign: 'center',
  },
  clearBtn: {
    position: 'absolute',
    right: space.x2,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  removeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: space.xs,
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.brandStrong,
    letterSpacing: font.tracking.base,
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
