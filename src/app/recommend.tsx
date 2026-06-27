/**
 * AI 추천 메뉴 화면 (PRD §3.5).
 * 헤더 → 크림 info 카드 → 메뉴 후보 3개 카드(랭크칩·이모지·이름·시간·난이도·재료칩·선택 버튼).
 * 데이터는 useMenuCandidates() 훅 경유.
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Icon } from '@/components';
import { useRecommendation } from '@/hooks/useMenus';
import type { MenuCandidate } from '@/types';
import { color, font, gradient, radius, shadow, space } from '@/theme/theme';

export default function RecommendScreen() {
  const router = useRouter();
  const { slotId } = useLocalSearchParams<{ slotId?: string }>();
  const { status, candidates, loading, generate, generating } = useRecommendation(
    Number(slotId ?? '0'),
  );
  const [chosenIdx, setChosenIdx] = useState<number | null>(null);

  const showGenerateBtn = !loading && status === 'OPEN' && candidates.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
          <Icon name="arrow-back-ios" size={20} color={color.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>추천 메뉴</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {showGenerateBtn ? (
          <View style={styles.generateWrap}>
            <Text style={styles.generateTitle}>아직 AI 추천이 없어요</Text>
            <Text style={styles.generateSub}>
              버튼을 누르면 재료 기반으로 최적 메뉴를 추천해 드려요
            </Text>
            <Button
              label={generating ? '추천 생성 중…' : 'AI 추천 생성하기'}
              onPress={generate}
              disabled={generating}
              style={styles.generateBtn}
            />
          </View>
        ) : (
          <>
            <LinearGradient
              colors={gradient.cream}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.infoCard}
            >
              <Text style={styles.infoTitle}>💡 추천 점수 기준</Text>
              <Text style={styles.infoBody}>
                재료 소진율 · 추가구매 최소화 · 조리 난이도를 종합해 계산해요
              </Text>
            </LinearGradient>

            {candidates.map((menu, idx) => (
              <MenuCard
                key={menu.name}
                menu={menu}
                rank={idx}
                selected={chosenIdx === idx}
                onChoose={() => {
                  setChosenIdx(idx);
                  router.back();
                }}
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuCard({
  menu,
  rank,
  selected,
  onChoose,
}: {
  menu: MenuCandidate;
  rank: number;
  selected: boolean;
  onChoose: () => void;
}) {
  const isBest = rank === 0;
  return (
    <View style={[styles.card, selected && styles.cardSelected]}>
      <View style={[styles.rankChip, isBest ? styles.rankChipBest : styles.rankChipAlt]}>
        <Text
          style={[styles.rankChipText, isBest ? styles.rankChipTextBest : styles.rankChipTextAlt]}
        >
          {isBest ? 'BEST 추천' : `후보 ${rank + 1}`}
        </Text>
      </View>

      <View style={styles.titleRow}>
        <View style={styles.emojiTile}>
          <Text style={styles.emojiText}>{menu.emoji}</Text>
        </View>
        <View style={styles.titleCol}>
          <Text style={styles.menuName}>{menu.name}</Text>
          <Text style={styles.metaText}>
            ⏱ {menu.time} · {menu.diff}
          </Text>
        </View>
      </View>

      <Text style={styles.desc}>{menu.desc}</Text>

      <View style={styles.chipRow}>
        {menu.needed.map((ing) => (
          <View key={ing.n} style={styles.neededChip}>
            <Text style={styles.neededChipText}>
              {ing.n} {ing.q}
            </Text>
          </View>
        ))}
      </View>

      {menu.missing.length > 0 ? (
        <View style={styles.missingBlock}>
          <Text style={styles.missingLabel}>추가 구매 필요</Text>
          <View style={styles.chipRow}>
            {menu.missing.map((ing) => (
              <View key={ing.n} style={styles.missingChip}>
                <Text style={styles.missingChipText}>
                  {ing.n} {ing.q}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <Text style={styles.noBuyText}>✅ 추가 구매 없이 가능해요</Text>
      )}

      <Button label="이 메뉴로 할게요" onPress={onChoose} style={styles.chooseBtn} />
    </View>
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
    paddingBottom: 80,
  },
  // ---- info 카드 ----
  infoCard: {
    marginHorizontal: space.screenX,
    marginBottom: space.x6,
    padding: space.x6,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: gradient.creamBd,
    gap: space.sm,
  },
  infoTitle: {
    fontSize: font.size.sm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  infoBody: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.ink3,
    lineHeight: 18,
    letterSpacing: font.tracking.snug,
  },
  // ---- 메뉴 카드 ----
  card: {
    backgroundColor: color.white,
    marginHorizontal: space.screenX,
    marginBottom: space.x6,
    padding: space.x6,
    borderRadius: radius.card,
    ...shadow.card,
  },
  cardSelected: {
    borderWidth: 1.5,
    borderColor: color.eco,
  },
  rankChip: {
    paddingVertical: space.xs,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    marginBottom: space.x4,
  },
  rankChipBest: {
    backgroundColor: color.ecoBgSoft,
  },
  rankChipAlt: {
    backgroundColor: color.greyChipBg,
  },
  rankChipText: {
    fontSize: font.size.micro,
    fontFamily: font.family.bold,
    letterSpacing: font.tracking.base,
  },
  rankChipTextBest: {
    color: color.ecoText,
  },
  rankChipTextAlt: {
    color: color.textMute,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x2,
  },
  emojiTile: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: color.greyChipBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 22,
  },
  titleCol: {
    flex: 1,
    gap: 2,
  },
  menuName: {
    fontSize: font.size.title,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  metaText: {
    fontSize: font.size.sm,
    fontFamily: font.family.medium,
    color: color.textMute,
    letterSpacing: font.tracking.snug,
  },
  desc: {
    fontSize: font.size.body,
    fontFamily: font.family.medium,
    color: color.ink3,
    lineHeight: 23,
    letterSpacing: font.tracking.snug,
    marginTop: space.x4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  neededChip: {
    paddingVertical: space.sm,
    paddingHorizontal: space.lg,
    borderRadius: radius.chip2,
    backgroundColor: color.greyChipBg,
  },
  neededChipText: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.ink3,
    letterSpacing: font.tracking.snug,
  },
  missingBlock: {
    marginTop: space.x4,
    gap: space.md,
  },
  missingLabel: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.brandStrong,
    letterSpacing: font.tracking.snug,
  },
  missingChip: {
    paddingVertical: space.sm,
    paddingHorizontal: space.lg,
    borderRadius: radius.chip2,
    backgroundColor: color.redBgSoft,
  },
  missingChipText: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.brandStrong,
    letterSpacing: font.tracking.snug,
  },
  noBuyText: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.ecoText,
    letterSpacing: font.tracking.snug,
    marginTop: space.x4,
  },
  chooseBtn: {
    marginTop: space.x6,
  },
  generateWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.screenX,
    paddingTop: 80,
    gap: space.x4,
  },
  generateTitle: {
    fontSize: font.size.title,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
    textAlign: 'center',
  },
  generateSub: {
    fontSize: font.size.body,
    fontFamily: font.family.medium,
    color: color.ink3,
    letterSpacing: font.tracking.snug,
    lineHeight: 22,
    textAlign: 'center',
  },
  generateBtn: {
    marginTop: space.x6,
    width: '100%',
  },
});
