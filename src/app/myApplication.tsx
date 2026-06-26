/**
 * 신청 내역 화면 — 투표 단계 (PRD §3.9).
 * 모임 정보 → 정원 마감 배너 → 저탄소/일반 섹션별 메뉴 카드 → 후보 마음에 안 들어요 카드.
 * 선택한 메뉴가 일반/저탄소면 → 투표 완료하기 버튼.
 * 후보 마음에 안 들어요 선택 → 재추천 사유 입력 + 재추천 요청하기 버튼.
 */
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar, Icon } from '@/components';
import { decidedMenu, voteMenus } from '@/data';
import type { VoteMenu } from '@/types';
import { color, font, gradient, radius, shadow, space } from '@/theme/theme';

const MEETING_INFO = {
  title: '1호관 517호 A팀',
  date: '06.26 (금) 18:00',
  place: '1호관 517호',
  members: '4/4명',
};

/** 라디오 버튼 (선택/미선택) */
function RadioDot({ selected, brand }: { selected: boolean; brand?: boolean }) {
  if (selected) {
    return (
      <View
        style={[styles.radioDotOuter, brand ? styles.radioDotOuterBrand : styles.radioDotOuterEco]}
      >
        <View style={styles.radioDotInner} />
      </View>
    );
  }
  return <View style={styles.radioDotEmpty} />;
}

/** 메뉴 투표 카드 */
function MenuVoteCard({
  menu,
  selected,
  onSelect,
}: {
  menu: VoteMenu;
  selected: boolean;
  onSelect: () => void;
}) {
  const isLowCarbon = menu.type === '저탄소';
  const co2Number = menu.co2.replace('kg', '').trim();

  return (
    <Pressable onPress={onSelect} style={[styles.menuCard, selected && styles.menuCardSelected]}>
      {/* 상단: 메뉴명 + 타입 뱃지 + 라디오 */}
      <View style={styles.menuCardTop}>
        <View style={styles.menuCardTitleRow}>
          <Text style={styles.menuCardName}>{menu.name}</Text>
          <View
            style={[styles.typeBadge, isLowCarbon ? styles.typeBadgeEco : styles.typeBadgeNormal]}
          >
            <Text
              style={[
                styles.typeBadgeText,
                isLowCarbon ? styles.typeBadgeTextEco : styles.typeBadgeTextNormal,
              ]}
            >
              {menu.type}
            </Text>
          </View>
        </View>
        <RadioDot selected={selected} brand={!isLowCarbon} />
      </View>

      {/* 설명 */}
      <Text style={styles.menuCardDesc}>{menu.desc}</Text>

      {/* 음식물 절감 */}
      <View style={styles.menuCardRow}>
        <Text style={styles.leafIcon}>🌱</Text>
        <Text style={styles.co2Text}>음식물 {co2Number}kg 절감</Text>
      </View>

      {/* 추가 구매 or 없음 */}
      {menu.purchase ? (
        <View style={styles.menuCardRow}>
          <Icon name="shopping-cart" size={14} color={color.gold} />
          <Text style={styles.purchaseText}>
            {menu.purchase.item} · 담당 {menu.purchase.buyer}(자동) · {menu.purchase.cost}
          </Text>
        </View>
      ) : (
        <View style={styles.menuCardRow}>
          <Icon name="check-circle" size={14} color={color.eco} />
          <Text style={styles.noPurchaseText}>추가구매 없이 완성돼요</Text>
        </View>
      )}
    </Pressable>
  );
}

/** 후보 마음에 들지 않아요 카드 */
function DislikeCard({ selected, onSelect }: { selected: boolean; onSelect: () => void }) {
  return (
    <Pressable
      onPress={onSelect}
      style={[styles.dislikeCard, selected && styles.dislikeCardSelected]}
    >
      <View style={styles.dislikeCardInner}>
        <View style={styles.dislikeIconWrap}>
          <Icon name="replay" size={22} color={selected ? color.brand : color.textMute} />
        </View>
        <View style={styles.dislikeTextCol}>
          <Text style={[styles.dislikeTitle, selected && styles.dislikeTitleSelected]}>
            후보가 마음에 들지 않아요
          </Text>
          <Text style={styles.dislikeSubtitle}>AI에게 다른 메뉴를 다시 추천받아요</Text>
        </View>
      </View>
      {selected ? (
        <View style={styles.checkCircle}>
          <Icon name="check" size={16} color={color.white} />
        </View>
      ) : (
        <View style={styles.radioDotEmpty} />
      )}
    </Pressable>
  );
}

/** 모임 정보 카드 (투표/결과 단계 공용) */
function MeetingInfoCard() {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoRow}>
        <Icon name="event" size={18} color={color.brand} />
        <Text style={styles.infoText}>{MEETING_INFO.date}</Text>
      </View>
      <View style={styles.infoDivider} />
      <View style={styles.infoRow}>
        <Icon name="location-on" size={18} color={color.brand} />
        <Text style={styles.infoText}>{MEETING_INFO.place}</Text>
      </View>
      <View style={styles.infoDivider} />
      <View style={styles.infoRow}>
        <Icon name="group" size={18} color={color.brand} />
        <Text style={styles.infoText}>{MEETING_INFO.members}</Text>
      </View>
    </View>
  );
}

/** 번호가 매겨진 조리 스텝 행 */
function StepRow({ index, text }: { index: number; text: string }) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepNum}>
        <Text style={styles.stepNumText}>{index}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

/** 투표로 결정된 메뉴(결과) 화면 */
function VoteResultView({ onBack }: { onBack: () => void }) {
  const menu = decidedMenu;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={8} style={styles.backBtn}>
          <Icon name="arrow-back-ios" size={20} color={color.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>신청 내역</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.meetingTitle}>{MEETING_INFO.title}</Text>
        <MeetingInfoCard />

        {/* 투표로 결정된 메뉴 */}
        <View style={styles.sectionHeader}>
          <Icon name="how-to-vote" size={18} color={color.eco} />
          <Text style={styles.sectionTitle}>투표로 결정된 메뉴</Text>
        </View>

        <LinearGradient
          colors={gradient.cream}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.decidedCard}
        >
          <View style={styles.decidedEmojiTile}>
            <Text style={styles.decidedEmoji}>{menu.emoji}</Text>
          </View>
          <View style={styles.decidedTextCol}>
            <Text style={styles.decidedName}>{menu.name}</Text>
            <Text style={styles.decidedMeta}>
              {menu.votes} · 조리 {menu.time} · {menu.servings}
            </Text>
          </View>
          <View style={styles.decidedCheck}>
            <Icon name="check" size={16} color={color.white} />
          </View>
        </LinearGradient>

        {/* 레시피 */}
        <View style={[styles.sectionHeader, styles.sectionHeaderTop]}>
          <Text style={styles.plainSectionTitle}>레시피</Text>
        </View>
        <View style={styles.stepsCard}>
          {menu.recipe.map((step, i) => (
            <StepRow key={i} index={i + 1} text={step} />
          ))}
        </View>

        {/* 역할 분배 & 준비물 */}
        <View style={[styles.sectionHeader, styles.sectionHeaderTop]}>
          <View>
            <Text style={styles.plainSectionTitle}>역할 분배 & 준비물</Text>
            <Text style={styles.sectionSubBlock}>
              각자 맡은 역할과 단계별 조리 방법을 확인하세요
            </Text>
          </View>
        </View>

        {menu.roles.map((role, ri) => (
          <View key={ri} style={[styles.roleCard, role.isMe && styles.roleCardMe]}>
            <View style={styles.roleHeader}>
              <Avatar
                name={role.who}
                color={role.isMe ? color.purple : color.iconFaint}
                size="md"
              />
              <View style={styles.roleHeadCol}>
                <View style={styles.roleNameRow}>
                  <Text style={styles.roleName}>{role.who}</Text>
                  {role.isMe ? (
                    <View style={styles.meBadge}>
                      <Text style={styles.meBadgeText}>나</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.roleLabel}>{role.role}</Text>
              </View>
              <View style={styles.roleBringCol}>
                <Text style={styles.roleBringLabel}>추가구매필요</Text>
                <Text style={styles.roleBringValue}>{role.bring}</Text>
              </View>
            </View>
            <View style={styles.roleDivider} />
            {role.steps.map((step, si) => (
              <StepRow key={si} index={si + 1} text={step} />
            ))}
          </View>
        ))}

        {/* 공동 구매 품목 */}
        <View style={[styles.sectionHeader, styles.sectionHeaderTop]}>
          <View>
            <Text style={styles.plainSectionTitle}>공동 구매 품목</Text>
            <Text style={styles.sectionSubBlock}>추가구매 가능자 중 담당자가 자동 배정됐어요</Text>
          </View>
        </View>

        <View style={styles.purchaseCard}>
          <View style={styles.purchaseTile}>
            <Icon name="shopping-cart" size={20} color={color.gold} />
          </View>
          <View style={styles.purchaseTextCol}>
            <Text style={styles.purchaseItem}>{menu.purchase.item}</Text>
            <Text style={styles.purchaseCost}>예상 구매비 약 {menu.purchase.cost}</Text>
          </View>
          <View style={styles.purchaseBuyerCol}>
            <Text style={styles.purchaseBuyerLabel}>구매 담당</Text>
            <View style={styles.purchaseBuyerRow}>
              <Text style={styles.purchaseBuyerName}>{menu.purchase.buyer}</Text>
              <View style={styles.autoBadge}>
                <Text style={styles.autoBadgeText}>자동</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.settleNoteRow}>
          <Icon name="payments" size={15} color={color.textMute} />
          <Text style={styles.settleNoteText}>구매비는 앱 밖에서 참여자끼리 자율 정산해요.</Text>
        </View>

        {/* 절감 안내 배너 */}
        <View style={styles.ecoBanner}>
          <Text style={styles.ecoBannerIcon}>🌱</Text>
          <Text style={styles.ecoBannerText}>
            이 메뉴로 음식물 약 {menu.co2}을 아낄 수 있어요. 모임 당일 잊지 말고 준비물을
            챙겨오세요!
          </Text>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default function MyApplicationScreen() {
  const router = useRouter();
  const [stage, setStage] = useState<'vote' | 'progress'>('vote');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  const isDislike = selectedKey === 'E';
  const canSubmit = selectedKey !== null && (!isDislike || reason.trim().length > 0);

  const lowCarbonMenus = voteMenus.filter((m) => m.type === '저탄소');
  const normalMenus = voteMenus.filter((m) => m.type === '일반');

  function handleSubmit() {
    if (!canSubmit) return;
    if (isDislike) {
      // TODO(API): 재추천 요청 — 입력한 사유를 백엔드 AI에 전달.
      router.back();
      return;
    }
    // 실제 메뉴에 투표 완료 → 투표로 결정된 메뉴(결과) 단계로 전환.
    setStage('progress');
  }

  // ── 투표로 결정된 메뉴(결과) 단계 ──
  if (stage === 'progress') {
    return <VoteResultView onBack={() => router.back()} />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
          <Icon name="arrow-back-ios" size={20} color={color.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>신청 내역</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 모임 제목 */}
        <Text style={styles.meetingTitle}>{MEETING_INFO.title}</Text>

        {/* 모임 정보 카드 */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon name="event" size={18} color={color.brand} />
            <Text style={styles.infoText}>{MEETING_INFO.date}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Icon name="location-on" size={18} color={color.brand} />
            <Text style={styles.infoText}>{MEETING_INFO.place}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Icon name="group" size={18} color={color.brand} />
            <Text style={styles.infoText}>{MEETING_INFO.members}</Text>
          </View>
        </View>

        {/* 정원 마감 배너 */}
        <View style={styles.fullBanner}>
          <Icon name="how-to-vote" size={18} color={color.brand} />
          <Text style={styles.fullBannerText}>
            정원이 마감됐어요! 모든 참여자의 재료·알레르기·요리 실력을 바탕으로 AI가 4가지 메뉴를
            추천했어요. 함께 만들 메뉴에 투표해주세요.
          </Text>
        </View>

        {/* ── 저탄소 요리 섹션 ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🍃</Text>
          <Text style={styles.sectionTitle}>저탄소 요리</Text>
          <Text style={styles.sectionSub}>탄소 배출이 적어요</Text>
        </View>

        {lowCarbonMenus.map((menu) => (
          <MenuVoteCard
            key={menu.key}
            menu={menu}
            selected={selectedKey === menu.key}
            onSelect={() => setSelectedKey(menu.key)}
          />
        ))}

        {/* ── 일반 요리 섹션 ── */}
        <View style={[styles.sectionHeader, styles.sectionHeaderNormal]}>
          <Icon name="restaurant" size={18} color={color.ink3} />
          <Text style={styles.sectionTitleNormal}>일반 요리</Text>
        </View>

        {normalMenus.map((menu) => (
          <MenuVoteCard
            key={menu.key}
            menu={menu}
            selected={selectedKey === menu.key}
            onSelect={() => setSelectedKey(menu.key)}
          />
        ))}

        {/* 후보 마음에 들지 않아요 */}
        <DislikeCard selected={isDislike} onSelect={() => setSelectedKey('E')} />

        {/* 재추천 사유 입력 (후보 불만족 선택 시) */}
        {isDislike && (
          <View style={styles.reasonCard}>
            <Text style={styles.reasonLabel}>
              재추천 사유 <Text style={styles.reasonRequired}>*</Text>
            </Text>
            <TextInput
              style={styles.reasonInput}
              multiline
              numberOfLines={4}
              placeholder="어떤 점이 아쉬웠는지 적어주세요. 입력한 내용을 반영해 AI가 다시 추천해요. (예: 알레르기 재료 포함, 메뉴가 너무 비슷함)"
              placeholderTextColor={color.placeholder}
              value={reason}
              onChangeText={setReason}
              textAlignVertical="top"
            />
          </View>
        )}

        {/* 하단 여백 (버튼 높이만큼) */}
        <View style={styles.bottomPad} />
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            isDislike ? styles.submitBtnDislike : styles.submitBtnVote,
            !canSubmit && styles.submitBtnDisabled,
            pressed && canSubmit && styles.submitBtnPressed,
          ]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <Text style={[styles.submitBtnText, !canSubmit && styles.submitBtnTextDisabled]}>
            {isDislike ? '재추천 요청하기' : '투표 완료하기'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: color.appBg,
  },

  // ── 헤더 ──
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
  headerSpacer: { width: 36 },

  // ── 스크롤 ──
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: space.screenX,
    paddingTop: space.x6,
    paddingBottom: 16,
  },

  // ── 모임 제목 ──
  meetingTitle: {
    fontSize: font.size.h1,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tighter,
    marginBottom: space.x6,
  },

  // ── 모임 정보 카드 ──
  infoCard: {
    backgroundColor: color.white,
    borderRadius: radius.card,
    paddingVertical: space.x4,
    paddingHorizontal: space.x6,
    marginBottom: space.x6,
    ...shadow.card,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    paddingVertical: space.x4,
  },
  infoDivider: {
    height: 1,
    backgroundColor: color.hair,
  },
  infoText: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.semibold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },

  // ── 정원 마감 배너 ──
  fullBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.md,
    backgroundColor: color.redBgSoft,
    borderRadius: radius.card,
    padding: space.x6,
    marginBottom: space.x8,
  },
  fullBannerText: {
    flex: 1,
    fontSize: font.size.sm,
    fontFamily: font.family.medium,
    color: color.ink3,
    lineHeight: 21,
    letterSpacing: font.tracking.snug,
  },

  // ── 섹션 헤더 ──
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginBottom: space.x4,
    marginTop: space.xs,
  },
  sectionHeaderNormal: {
    marginTop: space.x8,
  },
  sectionIcon: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  sectionTitleNormal: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  sectionSub: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.textMute,
    letterSpacing: font.tracking.snug,
  },

  // ── 메뉴 투표 카드 ──
  menuCard: {
    backgroundColor: color.white,
    borderRadius: radius.card,
    padding: space.x6,
    marginBottom: space.x4,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...shadow.card,
  },
  menuCardSelected: {
    borderColor: color.brand,
  },
  menuCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: space.sm,
  },
  menuCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    flex: 1,
    marginRight: space.md,
  },
  menuCardName: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  typeBadge: {
    paddingVertical: 2,
    paddingHorizontal: space.sm,
    borderRadius: radius.chip,
  },
  typeBadgeEco: {
    backgroundColor: color.ecoBgSoft,
  },
  typeBadgeNormal: {
    backgroundColor: color.amberBgSoft,
  },
  typeBadgeText: {
    fontSize: font.size.micro,
    fontFamily: font.family.bold,
    letterSpacing: font.tracking.base,
  },
  typeBadgeTextEco: {
    color: color.ecoText,
  },
  typeBadgeTextNormal: {
    color: color.gold,
  },
  menuCardDesc: {
    fontSize: font.size.sm,
    fontFamily: font.family.medium,
    color: color.ink3,
    lineHeight: 21,
    letterSpacing: font.tracking.snug,
    marginBottom: space.md,
  },
  menuCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginTop: space.xs,
  },
  leafIcon: {
    fontSize: 13,
  },
  co2Text: {
    fontSize: font.size.sm,
    fontFamily: font.family.semibold,
    color: color.ecoText,
    letterSpacing: font.tracking.snug,
  },
  purchaseText: {
    fontSize: font.size.sm,
    fontFamily: font.family.medium,
    color: color.gold,
    letterSpacing: font.tracking.snug,
  },
  noPurchaseText: {
    fontSize: font.size.sm,
    fontFamily: font.family.semibold,
    color: color.ecoText,
    letterSpacing: font.tracking.snug,
  },

  // ── 라디오 ──
  radioDotEmpty: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: color.iconFaint,
    backgroundColor: color.white,
  },
  radioDotOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDotOuterEco: {
    borderColor: color.eco,
    backgroundColor: color.ecoBgSoft,
  },
  radioDotOuterBrand: {
    borderColor: color.brand,
    backgroundColor: color.redBgSoft,
  },
  radioDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: color.brand,
  },

  // ── 후보 마음에 들지 않아요 ──
  dislikeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.white,
    borderRadius: radius.card,
    padding: space.x6,
    marginTop: space.x8,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...shadow.card,
  },
  dislikeCardSelected: {
    borderColor: color.brand,
    backgroundColor: color.redBgSoft3,
  },
  dislikeCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x4,
    flex: 1,
  },
  dislikeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: color.greyChipBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dislikeTextCol: {
    flex: 1,
    gap: 2,
  },
  dislikeTitle: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  dislikeTitleSelected: {
    color: color.brand,
  },
  dislikeSubtitle: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.textMute,
    letterSpacing: font.tracking.snug,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: color.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── 재추천 사유 카드 ──
  reasonCard: {
    backgroundColor: color.white,
    borderRadius: radius.card,
    padding: space.x6,
    marginTop: space.x4,
    gap: space.md,
    borderWidth: 1,
    borderColor: color.border,
  },
  reasonLabel: {
    fontSize: font.size.sm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  reasonRequired: {
    color: color.brand,
  },
  reasonInput: {
    minHeight: 100,
    fontSize: font.size.sm,
    fontFamily: font.family.medium,
    color: color.ink,
    letterSpacing: font.tracking.snug,
    lineHeight: 22,
  },

  // ── 하단 버튼 ──
  bottomPad: { height: 24 },
  bottomBar: {
    paddingHorizontal: space.screenX,
    paddingTop: space.x4,
    paddingBottom: space.x8,
    backgroundColor: color.appBg,
  },
  submitBtn: {
    height: 54,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnVote: {
    backgroundColor: color.brand,
  },
  submitBtnDislike: {
    backgroundColor: color.brand,
  },
  submitBtnDisabled: {
    backgroundColor: color.redBgSoft,
  },
  submitBtnPressed: {
    opacity: 0.9,
  },
  submitBtnText: {
    fontSize: font.size.body,
    fontFamily: font.family.bold,
    color: color.white,
    letterSpacing: font.tracking.snug,
  },
  submitBtnTextDisabled: {
    color: color.brandStrong,
    opacity: 0.5,
  },

  // ── 투표 결과(결정된 메뉴) 단계 ──
  sectionHeaderTop: {
    marginTop: space.x8,
    alignItems: 'flex-start',
  },
  plainSectionTitle: {
    fontSize: font.size.title,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  sectionSubBlock: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.textMute,
    letterSpacing: font.tracking.snug,
    marginTop: 3,
  },

  // 결정된 메뉴 카드
  decidedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x4,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: gradient.creamBd,
    padding: space.x5,
  },
  decidedEmojiTile: {
    width: 52,
    height: 52,
    borderRadius: radius.x2,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decidedEmoji: {
    fontSize: 28,
  },
  decidedTextCol: {
    flex: 1,
    gap: 4,
  },
  decidedName: {
    fontSize: font.size.lg,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  decidedMeta: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.ink3,
    letterSpacing: font.tracking.snug,
  },
  decidedCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: color.eco,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 조리 스텝
  stepsCard: {
    backgroundColor: color.white,
    borderRadius: radius.card,
    padding: space.x5,
    gap: space.x4,
    ...shadow.card,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.x2,
  },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: color.redBgSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumText: {
    fontSize: font.size.micro,
    fontFamily: font.family.bold,
    color: color.brandStrong,
  },
  stepText: {
    flex: 1,
    fontSize: font.size.sm,
    fontFamily: font.family.medium,
    color: color.ink2,
    lineHeight: 21,
    letterSpacing: font.tracking.snug,
  },

  // 역할 카드
  roleCard: {
    backgroundColor: color.white,
    borderRadius: radius.card,
    padding: space.x5,
    marginBottom: space.x4,
    gap: space.x4,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...shadow.card,
  },
  roleCardMe: {
    borderColor: color.purple,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  roleHeadCol: {
    flex: 1,
    gap: 2,
  },
  roleNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  roleName: {
    fontSize: font.size.body,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  meBadge: {
    backgroundColor: color.purple,
    borderRadius: radius.chip,
    paddingHorizontal: space.sm,
    paddingVertical: 1,
  },
  meBadgeText: {
    fontSize: font.size.tiny,
    fontFamily: font.family.bold,
    color: color.white,
  },
  roleLabel: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.textMute,
    letterSpacing: font.tracking.snug,
  },
  roleBringCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  roleBringLabel: {
    fontSize: font.size.micro,
    fontFamily: font.family.medium,
    color: color.textFaint,
    letterSpacing: font.tracking.snug,
  },
  roleBringValue: {
    fontSize: font.size.sm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  roleDivider: {
    height: 1,
    backgroundColor: color.hair,
  },

  // 공동 구매
  purchaseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x4,
    backgroundColor: color.white,
    borderRadius: radius.card,
    padding: space.x5,
    ...shadow.card,
  },
  purchaseTile: {
    width: 44,
    height: 44,
    borderRadius: radius.x2,
    backgroundColor: color.amberBgSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseTextCol: {
    flex: 1,
    gap: 3,
  },
  purchaseItem: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  purchaseCost: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.textMute,
    letterSpacing: font.tracking.snug,
  },
  purchaseBuyerCol: {
    alignItems: 'flex-end',
    gap: 3,
  },
  purchaseBuyerLabel: {
    fontSize: font.size.micro,
    fontFamily: font.family.medium,
    color: color.textFaint,
    letterSpacing: font.tracking.snug,
  },
  purchaseBuyerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  purchaseBuyerName: {
    fontSize: font.size.sm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  autoBadge: {
    backgroundColor: color.gold,
    borderRadius: radius.chip,
    paddingHorizontal: space.sm,
    paddingVertical: 1,
  },
  autoBadgeText: {
    fontSize: font.size.tiny,
    fontFamily: font.family.bold,
    color: color.white,
  },
  settleNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginTop: space.x4,
    paddingHorizontal: space.xs,
  },
  settleNoteText: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.textMute,
    letterSpacing: font.tracking.snug,
  },

  // 절감 안내 배너
  ecoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.md,
    backgroundColor: color.ecoBgSoft2,
    borderWidth: 1,
    borderColor: color.ecoBorder,
    borderRadius: radius.card,
    padding: space.x5,
    marginTop: space.x8,
  },
  ecoBannerIcon: {
    fontSize: 15,
  },
  ecoBannerText: {
    flex: 1,
    fontSize: font.size.sm,
    fontFamily: font.family.semibold,
    color: color.ecoDeep,
    lineHeight: 21,
    letterSpacing: font.tracking.snug,
  },
});
