import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { ProgressRing } from '@/components/ProgressRing';
import { useReport } from '@/hooks';
import { color, font, gradient, radius, shadow, space } from '@/theme/theme';

const CHART_H = 160;

/** 리포트 화면 (PRD §3.12). 월별 절감 추이 + 누적 stat. */
export default function ReportScreen() {
  const { report, bars, co2, monthLabel, canPrev, canNext, prevMonth, nextMonth, loading } =
    useReport();

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]} edges={['top']}>
        <ActivityIndicator color={color.brand} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>리포트</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 월 네비게이션 */}
        <View style={styles.monthNav}>
          <Pressable onPress={prevMonth} disabled={!canPrev} hitSlop={6} style={styles.navBtn}>
            <Icon name="chevron-left" size={22} color={canPrev ? color.ink2 : color.textFaint} />
          </Pressable>
          <Text style={styles.monthLabel}>{monthLabel}</Text>
          <Pressable onPress={nextMonth} disabled={!canNext} hitSlop={6} style={styles.navBtn}>
            <Icon name="chevron-right" size={22} color={canNext ? color.ink2 : color.textFaint} />
          </Pressable>
        </View>

        {/* Hero — 음식물 절감 + 소진율 */}
        <LinearGradient
          colors={gradient.brandWarm}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroLeft}>
            <Text style={styles.heroLabel}>음식물 절감</Text>
            <View style={styles.heroValueRow}>
              <Text style={styles.heroValue}>{report.saved}</Text>
              <Text style={styles.heroUnit}>kg</Text>
            </View>
          </View>
          <ProgressRing
            size={94}
            strokeWidth={11}
            progress={report.rate / 100}
            color={color.white}
            bgColor={color.onBrandTrack}
          >
            <View style={styles.ringInner}>
              <Text style={styles.ringRate}>{report.rate}%</Text>
              <Text style={styles.ringCaption}>소진율</Text>
            </View>
          </ProgressRing>
        </LinearGradient>

        {/* Eco 라인 */}
        <View style={styles.ecoLine}>
          <Icon name="eco" size={24} color={color.ecoText} />
          <Text style={styles.ecoText}>
            약 <Text style={styles.ecoHighlight}>{co2}kg</Text>의 탄소 배출을 줄인 셈이에요. 작은 한
            끼가 모여 캠퍼스를 바꿔요.
          </Text>
        </View>

        {/* Stat 카드 4개 */}
        <View style={styles.statGrid}>
          <StatCard icon="restaurant" value={report.joined} unit="회" label="참여 모임" />
          <StatCard icon="group" value={report.people} unit="명" label="함께한 사람" />
          <StatCard icon="shopping-basket" value={report.provided} unit="개" label="제공한 재료" />
          <StatCard icon="task-alt" value={report.used} unit="개" label="사용한 재료" />
        </View>

        {/* 월별 절감 추이 */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>월별 절감 추이</Text>
          <View style={styles.chartRow}>
            {bars.map((b) => (
              <View key={b.short} style={styles.barCol}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(4, Math.round((b.h / 100) * CHART_H)),
                      backgroundColor: b.isCurrent ? color.brand : color.ecoBorder,
                    },
                  ]}
                />
                <Text style={styles.barLabel}>{b.short}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type StatCardProps = {
  icon: 'restaurant' | 'group' | 'shopping-basket' | 'task-alt';
  value: number;
  unit: string;
  label: string;
};

function StatCard({ icon, value, unit, label }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Icon name={icon} size={25} color={color.ecoText} />
      <View style={styles.statValueRow}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statUnit}>{unit}</Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.appBg },
  center: { alignItems: 'center', justifyContent: 'center' },
  header: { paddingHorizontal: space.screenX, paddingTop: space.sm, paddingBottom: space.x2 },
  title: {
    fontSize: font.size.h2,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tightH,
  },
  scroll: { paddingHorizontal: space.screenX, paddingBottom: space.x10 },

  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.x7,
    marginBottom: space.x6,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.borderInput,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    fontSize: font.size.body,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
    minWidth: 106,
    textAlign: 'center',
  },

  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x6,
    borderRadius: radius.x5,
    padding: space.x9,
    ...shadow.hero,
  },
  heroLeft: { flex: 1, minWidth: 0 },
  heroLabel: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.onBrand,
    letterSpacing: font.tracking.snug,
  },
  heroValueRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: space.xs },
  heroValue: {
    fontSize: 38,
    fontFamily: font.family.bold,
    color: color.white,
    letterSpacing: -1.5,
  },
  heroUnit: {
    fontSize: font.size.title,
    fontFamily: font.family.semibold,
    color: color.white,
    marginLeft: 2,
  },
  ringInner: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: color.brandHi,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringRate: {
    fontSize: 21,
    fontFamily: font.family.bold,
    color: color.white,
    letterSpacing: font.tracking.tight,
  },
  ringCaption: { fontSize: 10, fontFamily: font.family.semibold, color: color.onBrand },

  ecoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.card,
    paddingVertical: space.x4,
    paddingHorizontal: space.x6,
    marginTop: space.x4,
  },
  ecoText: {
    flex: 1,
    fontSize: font.size.capSm,
    fontFamily: font.family.semibold,
    color: color.ink3,
    lineHeight: font.size.capSm * font.lineHeight.base,
    letterSpacing: font.tracking.snug,
  },
  ecoHighlight: { fontFamily: font.family.bold, color: color.ecoText },

  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xl, marginTop: space.x4 },
  statCard: {
    flexGrow: 1,
    flexBasis: '47%',
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.card,
    padding: space.x6,
  },
  statValueRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: space.sm + 3 },
  statValue: {
    fontSize: font.size.h3,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  statUnit: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.textFaint,
    marginLeft: 2,
  },
  statLabel: {
    fontSize: font.size.micro,
    fontFamily: font.family.semibold,
    color: color.textMute,
    marginTop: 1,
    letterSpacing: font.tracking.snug,
  },

  chartCard: {
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.card2,
    padding: space.x7,
    marginTop: space.x4,
  },
  chartTitle: {
    fontSize: font.size.sm,
    fontFamily: font.family.bold,
    color: color.ink,
    marginBottom: space.x6,
    letterSpacing: font.tracking.snug,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: space.x2,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: space.md,
  },
  bar: { width: '100%', maxWidth: 40, borderRadius: radius.chip },
  barLabel: { fontSize: font.size.tiny, fontFamily: font.family.semibold, color: color.textFaint },
});
