/**
 * 사용량 기록 화면 (PRD §3.6).
 * 헤더 → 초록 info 배너 → 통합 식재료 리스트(수량 편집) → Sticky 초록 "조리 완료 처리하기".
 * 데이터는 useAggIngredients() 훅 경유, 수량은 시드 qty로 prefill.
 */
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon } from '@/components';
import { useAggIngredients } from '@/hooks/useAggIngredients';
import { color, font, radius, space } from '@/theme/theme';

export default function UsageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: aggList } = useAggIngredients();
  const [edited, setEdited] = useState<Record<number, string>>({});

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
          <Icon name="arrow-back-ios" size={20} color={color.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>사용량 기록</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.infoBanner}>
          <Icon name="eco" size={18} color={color.ecoText} />
          <Text style={styles.infoBannerText}>실제 사용량 → 소진율·절감량 자동 계산</Text>
        </View>

        {aggList.map((item, i) => (
          <View key={item.name} style={styles.ingredientRow}>
            <Text style={styles.ingredientEmoji}>{item.emoji}</Text>
            <Text style={styles.ingredientName}>{item.name}</Text>
            <TextInput
              style={styles.amountInput}
              value={edited[i] ?? item.qty}
              onChangeText={(v) => setEdited((prev) => ({ ...prev, [i]: v }))}
              keyboardType="default"
              placeholder={item.qty}
              placeholderTextColor={color.placeholder}
            />
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + space.x2 }]}>
        <Button label="조리 완료 처리하기" onPress={() => router.back()} style={styles.cookBtn} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: color.appBg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.screenX,
    paddingTop: space.sm,
    paddingBottom: space.x2,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: font.size.title,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  headerSpacer: {
    width: 36,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: color.ecoBgSoft2,
    borderWidth: 1,
    borderColor: color.ecoBorder,
    borderRadius: radius.lg,
    padding: space.x2,
    marginHorizontal: space.screenX,
    marginBottom: space.x6,
  },
  infoBannerText: {
    flex: 1,
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.ecoDeep,
    letterSpacing: font.tracking.snug,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x2,
    paddingVertical: space.x2,
    borderBottomWidth: 1,
    borderBottomColor: color.hair,
    marginHorizontal: space.screenX,
  },
  ingredientEmoji: {
    fontSize: 22,
  },
  ingredientName: {
    flex: 1,
    fontSize: font.size.bodySm,
    fontFamily: font.family.semibold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  amountInput: {
    minWidth: 80,
    textAlign: 'right',
    borderWidth: 1,
    borderColor: color.borderInput,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    fontSize: font.size.sm,
    fontFamily: font.family.medium,
    color: color.ink,
  },
  footer: {
    paddingHorizontal: space.screenX,
    paddingTop: space.x2,
    borderTopWidth: 1,
    borderTopColor: color.hair,
    backgroundColor: color.appBg,
  },
  cookBtn: {
    backgroundColor: color.eco,
  },
});
