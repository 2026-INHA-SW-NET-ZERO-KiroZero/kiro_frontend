import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { useAllergyOptions, useProfile } from '@/hooks';
import { color, font, radius, shadow, space } from '@/theme/theme';
import type { SkillLevel } from '@/types';

const SKILLS: SkillLevel[] = ['상', '중', '하'];

/** 프로필 수정 화면 (PRD §3.14). 요리 숙련도 + 알레르기 토글. 즉시 반영, 저장 시 PUT 후 복귀. */
export default function EditProfileScreen() {
  const { skillLevel, allergies, setSkill, toggleAllergy, save, saving } = useProfile();
  const { data: allergyOptions, loading: optionsLoading } = useAllergyOptions();

  const onSave = async () => {
    await save();
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={6} style={styles.backBtn}>
          <Icon name="arrow-back-ios-new" size={24} color={color.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>프로필 수정</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 요리 숙련도 */}
        <Text style={styles.sectionTitle}>요리 숙련도</Text>
        <View style={styles.segment}>
          {SKILLS.map((level) => {
            const active = level === skillLevel;
            return (
              <Pressable
                key={level}
                onPress={() => setSkill(level)}
                style={[styles.segmentItem, active && styles.segmentItemActive]}
              >
                <Text
                  style={[
                    styles.segmentLabel,
                    active ? styles.segmentLabelActive : styles.segmentLabelInactive,
                  ]}
                >
                  {level}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 알레르기 */}
        <View style={styles.allergyHeader}>
          <Text style={styles.sectionTitle}>알레르기</Text>
          <Text style={styles.allergyHint}>해당하는 항목을 모두 선택</Text>
        </View>
        <View style={styles.allergyGrid}>
          {optionsLoading ? (
            <ActivityIndicator color={color.brand} style={styles.optionsLoading} />
          ) : (
            allergyOptions.map((a) => {
              const selected = allergies.includes(a.tag);
              return (
                <Pressable
                  key={a.tag}
                  onPress={() => toggleAllergy(a.tag)}
                  style={[styles.toggleChip, selected ? styles.toggleChipOn : styles.toggleChipOff]}
                >
                  <Text
                    style={[
                      styles.toggleChipText,
                      selected ? styles.toggleChipTextOn : styles.toggleChipTextOff,
                    ]}
                  >
                    {a.label}
                  </Text>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Sticky 저장 */}
      <LinearGradient colors={[color.appBgFade, color.appBg]} style={styles.saveBar}>
        <Pressable onPress={onSave} disabled={saving} style={styles.saveBtn}>
          {saving ? (
            <ActivityIndicator color={color.white} />
          ) : (
            <Text style={styles.saveBtnText}>저장하기</Text>
          )}
        </Pressable>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.appBg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: space.xs,
    paddingHorizontal: space.x2,
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
  scroll: { paddingHorizontal: space.screenX, paddingBottom: 110 },

  sectionTitle: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  segment: {
    flexDirection: 'row',
    gap: space.sm,
    backgroundColor: color.greyChipBg,
    padding: space.xs,
    borderRadius: radius.x2,
    marginTop: space.x2,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: space.x3,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentItemActive: { backgroundColor: color.white, ...shadow.card },
  segmentLabel: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    letterSpacing: font.tracking.snug,
  },
  segmentLabelActive: { color: color.brand },
  segmentLabelInactive: { color: color.textMute },

  allergyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.x11,
    marginBottom: space.x2,
  },
  allergyHint: {
    fontSize: font.size.micro,
    fontFamily: font.family.semibold,
    color: color.textFaint,
    letterSpacing: font.tracking.snug,
  },
  allergyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  optionsLoading: { alignSelf: 'flex-start', marginTop: space.md },
  toggleChip: {
    borderWidth: 1.5,
    paddingVertical: space.lg,
    paddingHorizontal: space.x5,
    borderRadius: radius.lg,
  },
  toggleChipOn: { borderColor: color.brand, backgroundColor: color.redBgSoft },
  toggleChipOff: { borderColor: color.borderInput, backgroundColor: color.white },
  toggleChipText: {
    fontSize: font.size.smx,
    fontFamily: font.family.semibold,
    letterSpacing: font.tracking.snug,
  },
  toggleChipTextOn: { color: color.brandStrong },
  toggleChipTextOff: { color: color.textMute },

  saveBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: space.screenX,
    paddingTop: space.x4,
    paddingBottom: space.x6,
  },
  saveBtn: {
    backgroundColor: color.brand,
    paddingVertical: space.x7,
    borderRadius: radius.card,
    alignItems: 'center',
    ...shadow.brandBtn,
  },
  saveBtnText: {
    fontSize: font.size.body,
    fontFamily: font.family.bold,
    color: color.white,
    letterSpacing: font.tracking.snug,
  },
});
