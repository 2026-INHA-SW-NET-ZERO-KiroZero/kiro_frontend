import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { useAllergyOptions, useMe, useProfile, useReport } from '@/hooks';
import { color, font, gradient, radius, shadow, space } from '@/theme/theme';

/** MY 화면 (PRD §3.13). 프로필 요약 + 절감/숙련도/알레르기 + 활동 진입. */
export default function MyScreen() {
  const { data: me } = useMe();
  const { currentSaved } = useReport();
  const { skillLevel, allergies } = useProfile();
  const { data: allergyOptions } = useAllergyOptions();

  const allergyChips = allergyOptions.filter((a) => allergies.includes(a.label));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>MY</Text>
        <View style={styles.headerIcons}>
          <Icon name="search" size={25} color={color.ink} />
          <Pressable onPress={() => router.push('/notifications')} hitSlop={8}>
            <Icon name="notifications" size={25} color={color.ink} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 프로필 행 */}
        <View style={styles.profileRow}>
          <View style={styles.profileText}>
            <Text style={styles.name}>{me.name}</Text>
          </View>
          <Pressable onPress={() => router.push('/editProfile')} hitSlop={6} style={styles.editBtn}>
            <Text style={styles.editBtnText}>프로필 수정</Text>
          </Pressable>
        </View>

        {/* 이번 달 절감 카드 */}
        <Pressable onPress={() => router.push('/report')}>
          <LinearGradient
            colors={gradient.brandWarm}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.savedCard}
          >
            <View>
              <Text style={styles.savedLabel}>이번 달 음식물 절감</Text>
              <Text style={styles.savedValue}>{currentSaved}kg</Text>
            </View>
            <View style={styles.savedPill}>
              <Text style={styles.savedPillText}>리포트 보기</Text>
              <Icon name="chevron-right" size={20} color={color.white} />
            </View>
          </LinearGradient>
        </Pressable>

        {/* 요리 숙련도 / 나뭇잎 */}
        <View style={styles.miniRow}>
          <View style={styles.miniCard}>
            <Text style={styles.miniLabel}>요리 숙련도</Text>
            <View style={styles.miniValueRow}>
              <Icon name="restaurant" size={21} color={color.brand} />
              <Text style={styles.miniValue}>{skillLevel}</Text>
            </View>
          </View>
          <View style={styles.miniCard}>
            <Text style={styles.miniLabel}>나뭇잎</Text>
            <View style={styles.miniValueRow}>
              <Text style={styles.leafEmoji}>🍃</Text>
              <Text style={styles.miniValue}>{me.leaves}</Text>
            </View>
          </View>
        </View>

        {/* 알레르기 */}
        <View style={styles.allergyCard}>
          <Text style={styles.miniLabel}>알레르기</Text>
          {allergyChips.length > 0 ? (
            <View style={styles.allergyChips}>
              {allergyChips.map((a) => (
                <View key={a.label} style={styles.allergyChip}>
                  <Text style={styles.allergyChipText}>
                    {a.emoji} {a.label}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.allergyEmpty}>등록된 알레르기가 없어요</Text>
          )}
        </View>

        {/* 나의 활동 */}
        <Text style={styles.sectionTitle}>나의 활동</Text>
        <View style={styles.activityCard}>
          <Pressable
            onPress={() => router.push('/meetings')}
            style={[styles.activityRow, styles.activityRowDivider]}
          >
            <Text style={styles.activityEmoji}>📋</Text>
            <Text style={styles.activityLabel}>신청 내역</Text>
            <Icon name="chevron-right" size={21} color={color.iconFaint} />
          </Pressable>
          <Pressable onPress={() => router.push('/report')} style={styles.activityRow}>
            <Text style={styles.activityEmoji}>🧾</Text>
            <Text style={styles.activityLabel}>사용 내역</Text>
            <Icon name="chevron-right" size={21} color={color.iconFaint} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.appBg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.screenX,
    paddingTop: space.sm,
    paddingBottom: space.md,
  },
  title: {
    fontSize: font.size.h2,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tightH,
  },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: space.x5 },
  scroll: { paddingHorizontal: space.screenX, paddingBottom: space.x10 },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: space.lg,
    paddingBottom: space.x8,
  },
  profileText: { flex: 1, minWidth: 0 },
  name: {
    fontSize: font.size.h1,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tightH,
  },
  editBtn: {
    backgroundColor: color.neutralBtnBg,
    paddingVertical: space.lg,
    paddingHorizontal: space.x5,
    borderRadius: radius.md,
  },
  editBtnText: {
    fontSize: font.size.capSm,
    fontFamily: font.family.semibold,
    color: color.ink3,
    letterSpacing: font.tracking.snug,
  },

  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.x4,
    padding: space.x8,
    marginBottom: space.x2,
    ...shadow.hero,
  },
  savedLabel: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.onBrand,
    letterSpacing: font.tracking.snug,
  },
  savedValue: {
    fontSize: 26,
    fontFamily: font.family.bold,
    color: color.white,
    letterSpacing: font.tracking.tight,
    marginTop: space.xs,
  },
  savedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: color.onBrandPill,
    paddingVertical: space.sm + 3,
    paddingLeft: space.x4,
    paddingRight: space.x2,
    borderRadius: radius.lg,
  },
  savedPillText: { fontSize: font.size.cap, fontFamily: font.family.bold, color: color.white },

  miniRow: { flexDirection: 'row', gap: space.xl, marginBottom: space.xl },
  miniCard: {
    flex: 1,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.card,
    padding: space.x5,
  },
  miniLabel: {
    fontSize: font.size.capSm,
    fontFamily: font.family.semibold,
    color: color.textMute,
    letterSpacing: font.tracking.snug,
  },
  miniValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm + 1,
    marginTop: space.lg,
  },
  miniValue: {
    fontSize: font.size.body,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  leafEmoji: { fontSize: font.size.h5 },

  allergyCard: {
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.card,
    padding: space.x5,
    marginBottom: space.xl,
  },
  allergyChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: space.lg },
  allergyChip: {
    backgroundColor: color.chipReadBg,
    borderWidth: 1,
    borderColor: color.sectionGap,
    paddingVertical: space.sm - 1,
    paddingHorizontal: space.lg,
    borderRadius: radius.chip,
  },
  allergyChipText: {
    fontSize: font.size.micro2,
    fontFamily: font.family.semibold,
    color: color.ink3,
  },
  allergyEmpty: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.textFaint3,
    marginTop: space.lg,
    letterSpacing: font.tracking.snug,
  },

  sectionTitle: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.ink,
    marginTop: space.x10,
    marginBottom: space.x2,
    letterSpacing: font.tracking.snug,
  },
  activityCard: {
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.card2,
    paddingHorizontal: space.x6,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
    paddingVertical: space.x5,
  },
  activityRowDivider: { borderBottomWidth: 1, borderBottomColor: color.hair2 },
  activityEmoji: { fontSize: font.size.h4, width: 24, textAlign: 'center' },
  activityLabel: {
    flex: 1,
    fontSize: font.size.bodySm,
    fontFamily: font.family.semibold,
    color: color.listInk,
    letterSpacing: font.tracking.snug,
  },
});
