import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { ProgressRing } from '@/components/ProgressRing';
import { SkillChip } from '@/components/SkillChip';
import { StatusBadge } from '@/components/StatusBadge';
import { usePastEval, usePastMeeting } from '@/hooks';
import { derivePastEval } from '@/lib';
import { color, font, gradient, radius, shadow, space } from '@/theme/theme';
import type { PastPart, SkillLevel } from '@/types';

const COOK_HERO = require('../../assets/cook-hero.png');

function isSkillLevel(value: string): value is SkillLevel {
  return value === '상' || value === '중' || value === '하';
}

/** 지난 모임 (PRD §3.10). 탄소 절감 결과 + (평가 완료 시) 소진 결과·환급 + 참여자. */
export default function PastApplicationScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: past } = usePastMeeting(id ?? 'past1');
  const { isEvaluated } = usePastEval();

  if (!past) {
    return <SafeAreaView style={styles.safe} edges={['top']} />;
  }

  const evaluated = isEvaluated(past.id);
  const result = derivePastEval(past);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={6} style={styles.backBtn}>
          <Icon name="arrow-back-ios-new" size={24} color={color.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>지난 모임</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.chipWrap}>
          <StatusBadge status="cooked" />
        </View>
        <Text style={styles.title}>{past.title}</Text>

        {/* 모임 정보 */}
        <View style={styles.infoCard}>
          <View style={[styles.infoRow, styles.infoRowBorder]}>
            <Icon name="calendar-today" size={21} color={color.ink4} />
            <Text style={styles.infoText}>{past.date}</Text>
          </View>
          <View style={[styles.infoRow, styles.infoRowBorder]}>
            <Icon name="location-on" size={21} color={color.ink4} />
            <Text style={styles.infoText}>{past.place}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="group" size={21} color={color.ink4} />
            <Text style={styles.infoText}>{past.members}</Text>
          </View>
        </View>

        {/* 평가 CTA / 완료 배너 */}
        {!evaluated ? (
          <Pressable onPress={() => router.push(`/pastEval?id=${past.id}`)} style={styles.cta}>
            <View style={styles.ctaIcon}>
              <Icon name="rate-review" size={24} color={color.white} />
            </View>
            <View style={styles.ctaBody}>
              <Text style={styles.ctaTitle}>아직 평가하지 않았어요</Text>
              <Text style={styles.ctaSub}>사진·재료 사용량을 남기면 절감량이 기록돼요</Text>
            </View>
            <Icon name="chevron-right" size={22} color={color.brand} />
          </Pressable>
        ) : (
          <View style={styles.doneBanner}>
            <Icon name="task-alt" size={24} color={color.brand} />
            <Text style={styles.doneBannerText}>모임 평가를 완료했어요</Text>
          </View>
        )}

        {/* 탄소 절감 결과 */}
        <SectionHeader icon="eco" iconColor={color.ecoSlab} label="탄소 절감 결과" first />
        <View style={styles.slab}>
          <View style={styles.slabLeft}>
            <Text style={styles.slabLabel}>버려질 뻔한 음식물</Text>
            <Text style={styles.slabValue}>{past.foodKg}</Text>
            <Text style={styles.slabCaption}>
              탄소 배출 약 <Text style={styles.slabCaptionStrong}>{past.co2}</Text> 감축{'\n'}이
              모임으로 함께 아꼈어요
            </Text>
          </View>
          <ProgressRing
            size={96}
            strokeWidth={11}
            progress={past.rate / 100}
            color={color.slabRingFill}
            bgColor={color.slabRingTrack}
          >
            <View style={styles.slabRingInner}>
              <Text style={styles.slabRingRate}>{past.rate}%</Text>
              <Text style={styles.slabRingCaption}>재료 소진율</Text>
            </View>
          </ProgressRing>
        </View>
        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <Icon name="directions-car" size={23} color={color.ecoText} />
            <Text style={styles.statValue}>{past.km}</Text>
            <Text style={styles.statCaption}>자동차 주행 분량의{'\n'}탄소를 줄였어요</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="restaurant" size={23} color={color.ecoText} />
            <Text style={styles.statValue}>{past.meals}</Text>
            <Text style={styles.statCaption}>한 끼 분량의 음식을{'\n'}아낀 셈이에요</Text>
          </View>
        </View>

        {/* 내 소진 결과 (평가 완료 시) */}
        {evaluated && (
          <>
            <SectionHeader icon="restaurant" iconColor={color.eco} label="내 소진 결과" />
            <View style={styles.card}>
              <View style={styles.eatHeader}>
                <View style={styles.eatHeaderLeft}>
                  <Text style={styles.eatLabel}>완성 음식 소비율</Text>
                  <Text style={styles.eatSub}>다 함께 먹고 남기지 않은 비율이에요</Text>
                </View>
                <Text style={styles.eatValue}>{result.eatPct}%</Text>
              </View>
              <PctBar
                pct={result.eatPct}
                height={9}
                track={color.barTrackEco}
                colors={gradient.ecoBar}
              />
              <View style={styles.usageBlock}>
                <Text style={styles.usageTitle}>내가 가져온 재료별 소진율</Text>
                <View style={styles.usageRows}>
                  {result.usageRows.map((u) => (
                    <View key={u.name}>
                      <View style={styles.usageRowHead}>
                        <Text style={styles.usageName}>{u.name}</Text>
                        <Text style={styles.usagePct}>{u.pct}%</Text>
                      </View>
                      <PctBar
                        pct={u.pct}
                        height={8}
                        track={color.barTrackWarm}
                        colors={gradient.redBar}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </>
        )}

        {/* 탄소중립 환급 (평가 완료 시) */}
        {evaluated && (
          <>
            <SectionHeader icon="eco" iconColor={color.ecoText} label="탄소중립 환급" />
            <View style={styles.card}>
              <View style={styles.refundTop}>
                <View style={styles.refundLeft}>
                  <Text style={styles.refundLabel}>환급 나뭇잎</Text>
                  <View style={styles.refundValueRow}>
                    <Text style={styles.refundValue}>{result.refund.credit.toLocaleString()}</Text>
                    <Text style={styles.refundUnit}>나뭇잎</Text>
                  </View>
                  <Text style={styles.refundCaption}>
                    예약 {result.refund.reserve.toLocaleString()} 나뭇잎 중{'\n'}성과에 따라
                    환급됐어요
                  </Text>
                </View>
                <ProgressRing
                  size={92}
                  strokeWidth={10}
                  progress={result.refund.score / 100}
                  color={color.ecoText}
                  bgColor={color.refundRingTrack}
                >
                  <View style={styles.refundRingInner}>
                    <Text style={styles.refundScore}>{result.refund.score}</Text>
                    <Text style={styles.refundScoreCaption}>환급 점수</Text>
                  </View>
                </ProgressRing>
              </View>
              <View style={styles.refundBreakdown}>
                <RefundRow
                  dot={color.ecoText}
                  label="저탄소 메뉴 선택"
                  value={`${result.refund.lowScore} / 40`}
                />
                <RefundRow
                  dot={color.refundDotUse}
                  label="재료 소진율"
                  value={`${result.refund.useScore} / 30`}
                />
                <RefundRow
                  dot={color.refundDotEat}
                  label="완성 음식 소비율"
                  value={`${result.refund.eatScore} / 30`}
                />
              </View>
            </View>
          </>
        )}

        {/* 함께 만든 메뉴 */}
        <Text style={styles.blockTitle}>함께 만든 메뉴</Text>
        <LinearGradient
          colors={gradient.cream}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.3 }}
          style={styles.menuCard}
        >
          {evaluated && (
            <View style={styles.menuThumb}>
              <Image source={COOK_HERO} style={styles.menuThumbImg} resizeMode="cover" />
            </View>
          )}
          <View style={styles.menuBody}>
            <Text style={styles.menuName}>{past.menu.name}</Text>
            <Text style={styles.menuMeta}>
              조리 {past.menu.time} · {past.menu.servings}
            </Text>
          </View>
          <Icon name="check-circle" size={28} color={color.eco} />
        </LinearGradient>

        {/* 함께한 참여자 */}
        <Text style={styles.partsTitle}>
          함께한 참여자 <Text style={styles.partsCount}>{past.members}</Text>
        </Text>
        <Text style={styles.partsSub}>각자 가져온 재료로 한 상을 완성했어요</Text>
        <View style={styles.partsList}>
          {past.parts.map((p, i) => (
            <PartRow key={`${p.label}-${i}`} part={p} />
          ))}
        </View>

        {/* 격려 배너 */}
        <View style={styles.volunteer}>
          <Icon name="volunteer-activism" size={22} color={color.ecoDeep} />
          <Text style={styles.volunteerText}>
            고생했어요! 이런 모임이 모여 캠퍼스의 음식물 쓰레기를 줄여가고 있어요.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type SectionHeaderProps = {
  icon: 'eco' | 'restaurant';
  iconColor: string;
  label: string;
  first?: boolean;
};

function SectionHeader({ icon, iconColor, label, first }: SectionHeaderProps) {
  return (
    <View style={[styles.sectionHeader, first && styles.sectionHeaderFirst]}>
      <Icon name={icon} size={20} color={iconColor} />
      <Text style={styles.sectionLabel}>{label}</Text>
    </View>
  );
}

type PctBarProps = {
  pct: number;
  height: number;
  track: string;
  colors: readonly [string, string];
};

function PctBar({ pct, height, track, colors }: PctBarProps) {
  return (
    <View style={[styles.barTrack, { height, backgroundColor: track }]}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.barFill, { width: `${pct}%` }]}
      />
    </View>
  );
}

type RefundRowProps = { dot: string; label: string; value: string };

function RefundRow({ dot, label, value }: RefundRowProps) {
  return (
    <View style={styles.refundRow}>
      <View style={styles.refundRowLeft}>
        <View style={[styles.refundDot, { backgroundColor: dot }]} />
        <Text style={styles.refundRowLabel}>{label}</Text>
      </View>
      <Text style={styles.refundRowValue}>{value}</Text>
    </View>
  );
}

function PartRow({ part }: { part: PastPart }) {
  return (
    <View style={[styles.partRow, part.isMe && styles.partRowMe]}>
      <View style={[styles.partAvatar, { backgroundColor: part.color }]}>
        <Icon name="person" size={24} color={color.white} />
      </View>
      <View style={styles.partBody}>
        <View style={styles.partLabelRow}>
          <Text style={styles.partLabel}>{part.label}</Text>
          {part.isMe && (
            <View style={styles.meBadge}>
              <Text style={styles.meBadgeText}>나</Text>
            </View>
          )}
          {isSkillLevel(part.skill) && <SkillChip level={part.skill} size="sm" />}
        </View>
        <Text style={styles.partBrought}>가져온 재료 · {part.brought}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.appBg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.x2,
    paddingTop: space.xs,
    paddingBottom: space.lg,
  },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    fontSize: font.size.body,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  headerSpacer: { width: 38 },
  scroll: { paddingHorizontal: space.screenX, paddingBottom: 40 },

  chipWrap: { flexDirection: 'row', marginTop: space.xs, marginBottom: space.lg },
  title: {
    fontSize: font.size.h3,
    fontFamily: font.family.bold,
    color: color.ink,
    lineHeight: font.size.h3 * font.lineHeight.tight,
    letterSpacing: font.tracking.tightH,
    marginBottom: space.x4,
  },

  infoCard: {
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.card2,
    paddingHorizontal: space.x6,
    paddingVertical: space.sm,
    marginBottom: space.x7,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: space.xl, paddingVertical: space.x2 },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: color.hair },
  infoText: {
    fontSize: font.size.md,
    fontFamily: font.family.semibold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
    backgroundColor: color.ctaRedBg,
    borderWidth: 1,
    borderColor: color.ctaRedBorder,
    borderRadius: radius.card2,
    paddingVertical: space.x6,
    paddingHorizontal: 17,
    marginBottom: space.x8,
  },
  ctaIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.xl,
    backgroundColor: color.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBody: { flex: 1, minWidth: 0 },
  ctaTitle: {
    fontSize: font.size.md,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  ctaSub: {
    fontSize: font.size.micro,
    fontFamily: font.family.semibold,
    color: color.ctaRedText,
    marginTop: 2,
    letterSpacing: font.tracking.snug,
  },

  doneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xl,
    backgroundColor: color.doneBannerBg,
    borderWidth: 1,
    borderColor: color.doneBannerBorder,
    borderRadius: radius.card2,
    paddingVertical: space.x5,
    paddingHorizontal: 17,
    marginBottom: space.x8,
  },
  doneBannerText: {
    fontSize: font.size.smx,
    fontFamily: font.family.bold,
    color: color.doneBannerText,
    letterSpacing: font.tracking.snug,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm + 1,
    marginTop: space.x11,
    marginBottom: space.x2,
  },
  sectionHeaderFirst: { marginTop: 0 },
  sectionLabel: {
    fontSize: font.size.body,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },

  slab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x6,
    backgroundColor: color.ecoSlab,
    borderRadius: radius.x5,
    padding: space.x9,
    ...shadow.hero,
  },
  slabLeft: { flex: 1, minWidth: 0 },
  slabLabel: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.ecoTint,
    letterSpacing: font.tracking.snug,
  },
  slabValue: {
    fontSize: 40,
    fontFamily: font.family.bold,
    color: color.white,
    letterSpacing: font.tracking.tightest,
    marginTop: space.xs,
    lineHeight: 40,
  },
  slabCaption: {
    fontSize: font.size.capSm,
    fontFamily: font.family.semibold,
    color: color.slabCaption,
    marginTop: space.sm + 3,
    letterSpacing: font.tracking.snug,
    lineHeight: font.size.capSm * font.lineHeight.snug,
  },
  slabCaptionStrong: { color: color.white, fontFamily: font.family.bold },
  slabRingInner: {
    width: 74,
    height: 74,
    borderRadius: radius.pill,
    backgroundColor: color.ecoSlab,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slabRingRate: {
    fontSize: font.size.h3,
    fontFamily: font.family.bold,
    color: color.white,
    letterSpacing: font.tracking.tight,
  },
  slabRingCaption: { fontSize: 10, fontFamily: font.family.semibold, color: color.ecoTint },

  statGrid: { flexDirection: 'row', gap: space.xl, marginTop: space.xl },
  statCard: {
    flex: 1,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.card,
    padding: space.x5,
  },
  statValue: {
    fontSize: font.size.h4,
    fontFamily: font.family.bold,
    color: color.ink,
    marginTop: space.md,
    letterSpacing: font.tracking.tight,
  },
  statCaption: {
    fontSize: font.size.micro2,
    fontFamily: font.family.semibold,
    color: color.textMute,
    marginTop: 1,
    letterSpacing: font.tracking.snug,
    lineHeight: font.size.micro2 * font.lineHeight.tight,
  },

  card: {
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.x5,
    padding: space.x8,
  },
  eatHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: space.sm + 3,
  },
  eatHeaderLeft: { flex: 1, minWidth: 0 },
  eatLabel: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.textFaint,
    letterSpacing: font.tracking.snug,
  },
  eatSub: {
    fontSize: font.size.micro,
    fontFamily: font.family.semibold,
    color: color.textFaint2,
    marginTop: 3,
    letterSpacing: font.tracking.snug,
  },
  eatValue: {
    fontSize: 30,
    fontFamily: font.family.bold,
    color: color.ecoText,
    letterSpacing: font.tracking.tighter,
    lineHeight: 30,
  },
  usageBlock: {
    marginTop: 19,
    paddingTop: space.x7,
    borderTopWidth: 1,
    borderTopColor: color.hair2,
  },
  usageTitle: {
    fontSize: font.size.smx,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
    marginBottom: space.x5,
  },
  usageRows: { gap: space.x5 },
  usageRowHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  usageName: {
    fontSize: font.size.smx,
    fontFamily: font.family.semibold,
    color: color.ink3,
    letterSpacing: font.tracking.snug,
  },
  usagePct: { fontSize: font.size.smx, fontFamily: font.family.bold, color: color.ink },

  barTrack: { borderRadius: radius.pill, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: radius.pill },

  refundTop: { flexDirection: 'row', alignItems: 'center', gap: space.x6 },
  refundLeft: { flex: 1, minWidth: 0 },
  refundLabel: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.textFaint,
    letterSpacing: font.tracking.snug,
  },
  refundValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: space.xs + 1, marginTop: 3 },
  refundValue: {
    fontSize: 36,
    fontFamily: font.family.bold,
    color: color.ecoText,
    letterSpacing: font.tracking.tightest,
    lineHeight: 36,
  },
  refundUnit: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.ecoText,
    letterSpacing: font.tracking.snug,
  },
  refundCaption: {
    fontSize: font.size.micro,
    fontFamily: font.family.semibold,
    color: color.textMute,
    marginTop: space.md,
    letterSpacing: font.tracking.snug,
    lineHeight: font.size.micro * font.lineHeight.snug,
  },
  refundRingInner: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refundScore: {
    fontSize: 23,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  refundScoreCaption: { fontSize: 10, fontFamily: font.family.bold, color: color.textFaint },
  refundBreakdown: {
    marginTop: space.x6,
    paddingTop: space.x5,
    borderTopWidth: 1,
    borderTopColor: color.hair2,
    gap: space.lg,
  },
  refundRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  refundRowLeft: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  refundDot: { width: 8, height: 8, borderRadius: 2 },
  refundRowLabel: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.ink3,
    letterSpacing: font.tracking.snug,
  },
  refundRowValue: { fontSize: font.size.smx, fontFamily: font.family.bold, color: color.ink },

  blockTitle: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.ink,
    marginTop: space.x11,
    marginBottom: space.x2,
    letterSpacing: font.tracking.snug,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x5,
    borderWidth: 1,
    borderColor: gradient.creamBd,
    borderRadius: radius.x4,
    padding: space.x7,
  },
  menuThumb: { width: 58, height: 58, borderRadius: radius.card, overflow: 'hidden' },
  menuThumbImg: { width: '100%', height: '100%' },
  menuBody: { flex: 1, minWidth: 0 },
  menuName: {
    fontSize: font.size.title,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  menuMeta: {
    fontSize: font.size.capSm,
    fontFamily: font.family.semibold,
    color: color.menuTimeBrown,
    marginTop: space.xs,
    letterSpacing: font.tracking.snug,
  },

  partsTitle: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.ink,
    marginTop: space.x11,
    marginBottom: space.sm,
    letterSpacing: font.tracking.snug,
  },
  partsCount: { color: color.textFaint },
  partsSub: {
    fontSize: font.size.micro,
    fontFamily: font.family.semibold,
    color: color.textFaint,
    marginBottom: space.x4,
    letterSpacing: font.tracking.snug,
  },
  partsList: { gap: space.lg },
  partRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x2,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.card,
    paddingVertical: space.x4,
    paddingHorizontal: space.x5,
  },
  partRowMe: { borderWidth: 2, borderColor: color.purple },
  partAvatar: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partBody: { flex: 1, minWidth: 0 },
  partLabelRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginBottom: 3 },
  partLabel: {
    fontSize: font.size.md,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  meBadge: {
    backgroundColor: color.purple,
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: radius.sm,
  },
  meBadgeText: { fontSize: 10, fontFamily: font.family.bold, color: color.white },
  partBrought: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.ink4,
    letterSpacing: font.tracking.snug,
  },

  volunteer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xl,
    backgroundColor: color.ecoBgSoft2,
    borderWidth: 1,
    borderColor: color.ecoBorder,
    borderRadius: radius.card,
    padding: space.x5,
    marginTop: space.x8,
  },
  volunteerText: {
    flex: 1,
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.ecoDeep,
    lineHeight: font.size.cap * font.lineHeight.base,
    letterSpacing: font.tracking.snug,
  },
});
