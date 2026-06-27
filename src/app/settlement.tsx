/**
 * 정산 체크리스트 화면 (PRD §3.7).
 * 구매 항목(담당자·예상 비용) → 공용 키트 → 내 재료 → 예약 크레딧·환불 힌트.
 * 데이터는 useSettlement(slotId) 훅 경유 (`GET /api/v1/sessions/{slotId}/checklist`).
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon, SectionSlab } from '@/components';
import { useSettlement } from '@/hooks/useSettlement';
import { color, font, gradient, radius, shadow, space } from '@/theme/theme';

function formatKRW(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

export default function SettlementScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const slotId = Number(id ?? '0');
  const { data, loading } = useSettlement(slotId);

  const totalCost = (data?.purchaseItems ?? []).reduce((sum, item) => sum + item.estimatedCost, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
          <Icon name="arrow-back-ios" size={20} color={color.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>정산 체크리스트</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingBox}>
            <Text style={styles.loadingText}>불러오는 중…</Text>
          </View>
        ) : (
          <>
            {/* Hero — 총 구매 비용 */}
            <LinearGradient
              colors={gradient.brand}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.heroCard, shadow.hero]}
            >
              <Text style={styles.heroLabel}>{data?.menuName ?? '—'}</Text>
              <Text style={styles.heroPer}>{formatKRW(totalCost)}</Text>
              <Text style={styles.heroSub}>총 구매 예상 비용</Text>
              {(data?.reservationCredit ?? 0) > 0 && (
                <View style={styles.creditChip}>
                  <Icon name="savings" size={14} color={color.white} />
                  <Text style={styles.creditText}>
                    예약 크레딧 {formatKRW(data?.reservationCredit ?? 0)}
                  </Text>
                </View>
              )}
            </LinearGradient>

            {/* 구매 항목 */}
            {(data?.purchaseItems ?? []).length > 0 && (
              <>
                <SectionSlab marginTop={space.x8} marginBottom={0} />
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>구매 항목</Text>
                  {(data?.purchaseItems ?? []).map((item, i) => (
                    <View key={i} style={styles.receiptRow}>
                      <View style={styles.receiptLeft}>
                        <Text style={styles.receiptName}>{item.name}</Text>
                        <Text style={styles.receiptAssignee}>{item.assignedToNickname} 담당</Text>
                      </View>
                      <Text style={styles.receiptAmt}>{formatKRW(item.estimatedCost)}</Text>
                    </View>
                  ))}
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>합계</Text>
                    <Text style={styles.totalAmt}>{formatKRW(totalCost)}</Text>
                  </View>
                </View>
              </>
            )}

            {/* 공용 키트 */}
            {(data?.commonKitItems ?? []).length > 0 && (
              <>
                <SectionSlab marginTop={space.x8} marginBottom={0} />
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>공용 키트</Text>
                  <View style={styles.kitGrid}>
                    {(data?.commonKitItems ?? []).map((item, i) => (
                      <View key={i} style={styles.kitChip}>
                        <Text style={styles.kitChipText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )}

            {/* 내 재료 */}
            {(data?.myIngredients ?? []).length > 0 && (
              <>
                <SectionSlab marginTop={space.x8} marginBottom={0} />
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>내가 가져올 재료</Text>
                  {(data?.myIngredients ?? []).map((item) => (
                    <View key={item.sessionIngredientId} style={styles.ingRow}>
                      <Text style={styles.ingName}>{item.nameKo}</Text>
                      <Text style={styles.ingQty}>
                        {item.knownGrams != null ? `${item.knownGrams}g` : `${item.count}개`}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* 환불 힌트 */}
            {!!data?.refundHint && (
              <View style={styles.refundNote}>
                <Icon name="info" size={15} color={color.brandStrong} />
                <Text style={styles.refundNoteText}>{data.refundHint}</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
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
    paddingBottom: 40,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    paddingTop: space.x10,
  },
  loadingText: {
    fontSize: font.size.sm,
    fontFamily: font.family.medium,
    color: color.textFaint,
  },
  // ---- hero ----
  heroCard: {
    marginHorizontal: space.screenX,
    marginTop: space.x6,
    marginBottom: space.md,
    padding: space.x10,
    borderRadius: radius.card,
    alignItems: 'center',
    gap: space.sm,
  },
  heroLabel: {
    fontSize: font.size.sm,
    fontFamily: font.family.semibold,
    color: color.white,
    letterSpacing: font.tracking.snug,
    opacity: 0.92,
  },
  heroPer: {
    fontSize: font.size.h1,
    fontFamily: font.family.bold,
    color: color.white,
    letterSpacing: font.tracking.tightH,
  },
  heroSub: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.white,
    opacity: 0.85,
    letterSpacing: font.tracking.snug,
  },
  creditChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    marginTop: space.xs,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.pill,
    paddingVertical: space.xs,
    paddingHorizontal: space.md,
  },
  creditText: {
    fontSize: font.size.cap,
    fontFamily: font.family.bold,
    color: color.white,
    letterSpacing: font.tracking.snug,
  },
  // ---- 섹션 공용 ----
  section: {
    paddingHorizontal: space.screenX,
    paddingTop: space.x6,
    paddingBottom: space.x2,
  },
  sectionTitle: {
    fontSize: font.size.title,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
    marginBottom: space.x2,
  },
  // ---- 구매 항목 ----
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: color.hair,
  },
  receiptLeft: {
    flex: 1,
    gap: space.xs,
  },
  receiptName: {
    fontSize: font.size.sm,
    fontFamily: font.family.medium,
    color: color.ink3,
    letterSpacing: font.tracking.snug,
  },
  receiptAssignee: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.textFaint,
    letterSpacing: font.tracking.snug,
  },
  receiptAmt: {
    fontSize: font.size.sm,
    fontFamily: font.family.semibold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: space.x2,
  },
  totalLabel: {
    fontSize: font.size.body,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  totalAmt: {
    fontSize: font.size.body,
    fontFamily: font.family.bold,
    color: color.brandStrong,
    letterSpacing: font.tracking.tight,
  },
  // ---- 공용 키트 ----
  kitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  kitChip: {
    backgroundColor: color.appBgInput,
    borderWidth: 1,
    borderColor: color.borderInput,
    borderRadius: radius.chip,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
  },
  kitChipText: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.ink3,
    letterSpacing: font.tracking.snug,
  },
  // ---- 내 재료 ----
  ingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: color.hair,
  },
  ingName: {
    flex: 1,
    fontSize: font.size.sm,
    fontFamily: font.family.semibold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  ingQty: {
    fontSize: font.size.sm,
    fontFamily: font.family.bold,
    color: color.ink3,
    letterSpacing: font.tracking.snug,
  },
  // ---- 환불 힌트 ----
  refundNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
    marginHorizontal: space.screenX,
    marginTop: space.x6,
    marginBottom: space.x10,
    backgroundColor: color.redBgSoft,
    borderRadius: radius.lg,
    padding: space.x2,
  },
  refundNoteText: {
    flex: 1,
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.brandStrong,
    letterSpacing: font.tracking.snug,
    lineHeight: font.size.cap * 1.6,
  },
});
