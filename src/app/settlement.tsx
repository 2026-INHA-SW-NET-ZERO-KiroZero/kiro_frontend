/**
 * 정산 화면 (PRD §3.7).
 * 빨강 그라데이션 hero(1인당 분담액) → 영수증 → 정산 현황(결제자·분담자) → 균등분배 안내.
 * 데이터는 useSettlement(id) 훅 경유. 금액은 toLocaleString('ko-KR')+'원' 포맷.
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
  const { data } = useSettlement(id ?? '');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
          <Icon name="arrow-back-ios" size={20} color={color.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>정산</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={gradient.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroCard, shadow.hero]}
        >
          <Text style={styles.heroLabel}>1인당 분담액</Text>
          <Text style={styles.heroPer}>{formatKRW(data.per)}</Text>
          <View style={styles.heroMeta}>
            <Text style={styles.heroMetaText}>총 {formatKRW(data.total)}</Text>
            <Text style={styles.heroMetaDot}>·</Text>
            <Text style={styles.heroMetaText}>결제자 {data.payer}</Text>
          </View>
        </LinearGradient>

        <SectionSlab marginTop={space.x8} marginBottom={0} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>영수증</Text>
          {data.items.map((item) => (
            <View key={item.n} style={styles.receiptRow}>
              <Text style={styles.receiptName}>{item.n}</Text>
              <Text style={styles.receiptAmt}>{formatKRW(item.a)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>합계</Text>
            <Text style={styles.totalAmt}>{formatKRW(data.total)}</Text>
          </View>
        </View>

        <SectionSlab marginTop={space.x8} marginBottom={0} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정산 현황</Text>
          <View style={styles.statusRow}>
            <Icon name="person" size={16} color={color.textFaint} />
            <Text style={styles.statusName}>{data.payer}</Text>
            <View style={styles.paidChip}>
              <Text style={styles.paidChipText}>결제 완료</Text>
            </View>
          </View>
          {data.debtors.map((d) => (
            <View key={d.n} style={styles.statusRow}>
              <Icon name="person" size={16} color={color.textFaint} />
              <Text style={styles.statusName}>{d.n}</Text>
              <Text style={styles.debtorAmt}>{formatKRW(d.a)} 보냄</Text>
            </View>
          ))}
        </View>

        <Text style={styles.equalNote}>균등분배 기준 자동 계산</Text>
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
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginTop: space.xs,
  },
  heroMetaText: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.white,
    letterSpacing: font.tracking.snug,
    opacity: 0.9,
  },
  heroMetaDot: {
    fontSize: font.size.cap,
    color: color.white,
    opacity: 0.6,
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
  // ---- 영수증 ----
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: color.hair,
  },
  receiptName: {
    fontSize: font.size.sm,
    fontFamily: font.family.medium,
    color: color.ink3,
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
  // ---- 정산 현황 ----
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: color.hair,
  },
  statusName: {
    flex: 1,
    fontSize: font.size.sm,
    fontFamily: font.family.semibold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  paidChip: {
    paddingVertical: space.xs,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    backgroundColor: color.ecoBgSoft,
  },
  paidChipText: {
    fontSize: font.size.micro,
    fontFamily: font.family.bold,
    color: color.ecoText,
    letterSpacing: font.tracking.base,
  },
  debtorAmt: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.textMute,
    letterSpacing: font.tracking.snug,
  },
  equalNote: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.textFaint,
    letterSpacing: font.tracking.snug,
    textAlign: 'center',
    paddingTop: space.x6,
    paddingBottom: space.x10,
  },
});
