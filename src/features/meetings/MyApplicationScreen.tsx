/**
 * 신청 내역 화면 (PRD §3.9 · dc.html `isMyApplication`) — 4단계.
 * stage = canceled → recruiting(미달) → voting(마감 & !votingDone) → result(마감 & votingDone).
 *
 * 데이터는 전부 훅 경유: useMyApplication(id), usePartyPool, useVoteMenus, useDecidedMenu.
 */
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { useDecidedMenu, useMyApplication, usePartyPool, useVoteRecommendation } from '@/hooks';
import { leaveSlot } from '@/lib/slotApi';
import type { MenuRole, PartyProfile, VoteMenu } from '@/types';
import {
  applicationStage,
  color,
  font,
  gradient,
  radius,
  shadow,
  skillChip,
  space,
} from '@/theme/theme';

/** 참여자 아바타 식별색 (dc.html `appPalette`). */
const APP_PALETTE = [color.purple, color.brand, color.eco, color.goldSoft];
/** E(재추천) 옵션의 합성 인덱스. */
const E_OPTION = 4;

type Stage = 'canceled' | 'recruiting' | 'voting' | 'result';

/** 요리실력 → 칩 색 (PartyProfile.skill은 string이라 안전 분기). */
function skillStyle(skill: string): { fg: string; bg: string } {
  if (skill === '상') return skillChip.상;
  if (skill === '중') return skillChip.중;
  return skillChip.하;
}

export function MyApplicationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const slotId = Number(id ?? '0');
  const { data: application } = useMyApplication(id ?? 'app1');
  const { data: partyPool } = usePartyPool(slotId);
  const {
    status: recStatus,
    voteMenus,
    generate: generateRec,
    generating,
    generateError,
  } = useVoteRecommendation(slotId);

  useEffect(() => {
    if (generateError) {
      Alert.alert('추천 생성 실패', generateError.message);
    }
  }, [generateError]);
  const { data: decided } = useDecidedMenu(slotId);

  const [myVote, setMyVote] = useState<number | null>(null);
  const [votingDone, setVotingDone] = useState(false);
  const [voteReason, setVoteReason] = useState('');
  const [canceling, setCanceling] = useState(false);

  if (!application) {
    return <SafeAreaView style={styles.safe} edges={['top']} />;
  }

  const { capacity, count } = application;
  const full = count >= capacity;
  const stage: Stage = application.canceled
    ? 'canceled'
    : !full
      ? 'recruiting'
      : votingDone
        ? 'result'
        : 'voting';

  const eSel = myVote === E_OPTION;
  const voteReady = myVote != null && (myVote !== E_OPTION || voteReason.trim().length > 0);

  const pickVote = (index: number) => {
    setMyVote(index);
    if (index !== E_OPTION) setVoteReason('');
  };

  const cancelApplication = () => {
    Alert.alert('신청 취소', '정말로 신청을 취소하시겠어요?', [
      { text: '돌아가기', style: 'cancel' },
      {
        text: '취소하기',
        style: 'destructive',
        onPress: async () => {
          setCanceling(true);
          try {
            await leaveSlot(slotId);
            router.back();
          } catch {
            Alert.alert('오류', '신청 취소에 실패했어요. 다시 시도해주세요.');
          } finally {
            setCanceling(false);
          }
        },
      },
    ]);
  };

  const submitVote = () => {
    if (myVote == null) return;
    if (myVote === E_OPTION) {
      if (!voteReason.trim()) return;
      setMyVote(null); // 재추천 요청 → 투표 리셋
      setVoteReason('');
      return;
    }
    setVotingDone(true);
  };

  const countText = `${count}/${capacity}명`;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
          <Icon name="arrow-back-ios-new" size={24} color={color.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>신청 내역</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          stage === 'voting' || stage === 'recruiting' ? styles.scrollWithSticky : null,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.appTitle}>{application.title}</Text>

        {/* 정보 카드 */}
        <View style={styles.infoCard}>
          <InfoRow icon="calendar-today" text={`${application.date} ${application.time}`} divider />
          <InfoRow icon="location-on" text={application.place} divider />
          <InfoRow icon="group" text={countText} />
        </View>

        {stage === 'canceled' && <CanceledStage capacity={capacity} countText={countText} />}

        {stage === 'recruiting' && (
          <RecruitingStage
            capacity={capacity}
            countText={countText}
            partyPool={partyPool}
            count={count}
          />
        )}

        {stage === 'voting' &&
          (recStatus === 'OPEN' && voteMenus.length === 0 ? (
            <View style={styles.generateWrap}>
              <Text style={styles.generateTitle}>아직 AI 추천이 없어요</Text>
              <Text style={styles.generateSub}>
                버튼을 누르면 재료 기반으로 최적 메뉴를 추천해 드려요
              </Text>
              <Pressable
                onPress={generateRec}
                disabled={generating}
                style={[styles.generateBtn, generating && styles.generateBtnDisabled]}
              >
                <Text style={styles.generateBtnText}>
                  {generating ? '추천 생성 중…' : 'AI 추천 생성하기'}
                </Text>
              </Pressable>
            </View>
          ) : (
            <VotingStage
              voteMenus={voteMenus}
              myVote={myVote}
              eSel={eSel}
              voteReason={voteReason}
              onPick={pickVote}
              onChangeReason={setVoteReason}
            />
          ))}

        {stage === 'result' && <ResultStage decided={decided} />}
      </ScrollView>

      {stage === 'recruiting' && (
        <LinearGradient colors={[color.appBgFade, color.appBg]} style={styles.sticky}>
          <Pressable onPress={cancelApplication} disabled={canceling} style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>{canceling ? '취소 중...' : '신청 취소하기'}</Text>
          </Pressable>
        </LinearGradient>
      )}

      {stage === 'voting' && (
        <LinearGradient colors={[color.appBgFade, color.appBg]} style={styles.sticky}>
          <Pressable
            onPress={submitVote}
            disabled={!voteReady}
            style={[
              styles.voteBtn,
              { backgroundColor: voteReady ? color.brand : applicationStage.voteBtnDisabled },
              voteReady && shadow.brandBtn,
            ]}
          >
            <Text style={styles.voteBtnText}>{eSel ? '재추천 요청하기' : '투표 완료하기'}</Text>
          </Pressable>
        </LinearGradient>
      )}
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  text,
  divider,
}: {
  icon: 'calendar-today' | 'location-on' | 'group';
  text: string;
  divider?: boolean;
}) {
  return (
    <View style={[styles.infoRow, divider && styles.infoRowDivider]}>
      <Icon name={icon} size={21} color={color.brand} />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

/* ----------------------------- canceled ----------------------------- */

function CanceledStage({ capacity, countText }: { capacity: number; countText: string }) {
  return (
    <>
      <View style={styles.canceledHero}>
        <View style={styles.canceledIcon}>
          <Icon name="event-busy" size={34} color={color.textFaint} />
        </View>
        <Text style={styles.canceledTitle}>인원 미달로 모집이 취소됐어요</Text>
        <Text style={styles.canceledSub}>
          {`마감 시간까지 정원 ${capacity}명이 모이지 않았어요. 모인 인원은 ${countText}이었어요.`}
        </Text>
      </View>
      <View style={styles.refundBox}>
        <Icon name="savings" size={22} color={color.ecoDeep} />
        <Text style={styles.refundText}>예약에 사용한 2,000 크레딧은 전액 환불됐어요.</Text>
      </View>
      <Text style={styles.canceledHint}>다른 열린 방에 참여해 남은 재료를 함께 소진해보세요.</Text>
    </>
  );
}

/* ---------------------------- recruiting ---------------------------- */

function RecruitingStage({
  capacity,
  countText,
  partyPool,
  count,
}: {
  capacity: number;
  countText: string;
  partyPool: PartyProfile[];
  count: number;
}) {
  return (
    <>
      <View style={styles.recruitBanner}>
        <Icon name="hourglass-top" size={20} color={color.ecoText} />
        <Text style={styles.recruitBannerText}>
          {`참여가 확정됐어요. 정원 ${capacity}명이 모두 차면 AI가 메뉴를 추천하고 투표가 시작돼요.`}
        </Text>
      </View>
      <Text style={styles.partsHeader}>
        참여자 <Text style={styles.partsHeaderCount}>{countText}</Text>
      </Text>
      <Text style={styles.partsSub}>개인정보 보호를 위해 모든 참여자는 익명으로 표시돼요</Text>
      <View style={styles.partList}>
        {partyPool.length > 0 &&
          Array.from({ length: count }, (_, idx) => (
            <ParticipantCard key={idx} idx={idx} profile={partyPool[idx % partyPool.length]} />
          ))}
      </View>
    </>
  );
}

function ParticipantCard({ idx, profile }: { idx: number; profile: PartyProfile }) {
  const isMe = idx === 0;
  const isHost = idx === 1;
  const skill = skillStyle(profile.skill);

  return (
    <View style={[styles.partCard, isMe && styles.partCardMe]}>
      <View style={styles.partTop}>
        <View
          style={[styles.partAvatar, { backgroundColor: APP_PALETTE[idx % APP_PALETTE.length] }]}
        >
          <Icon name="person" size={27} color={color.white} />
        </View>
        <Text style={styles.partName}>{isMe ? '나' : `참여자 ${idx}`}</Text>
        {isHost ? (
          <View style={styles.hostTag}>
            <Text style={styles.hostTagText}>방장</Text>
          </View>
        ) : null}
        {isMe ? (
          <View style={styles.meTag}>
            <Text style={styles.meTagText}>나</Text>
          </View>
        ) : null}
        <View style={styles.flex1} />
        <View style={[styles.skillTag, { backgroundColor: skill.bg }]}>
          <Text
            style={[styles.skillTagText, { color: skill.fg }]}
          >{`요리실력 ${profile.skill}`}</Text>
        </View>
      </View>

      <View style={styles.partBody}>
        <View style={styles.partAttrRow}>
          <Text style={styles.partAttrLabel}>알레르기</Text>
          <View style={styles.partAttrValue}>
            {profile.allergies.length > 0 ? (
              profile.allergies.map((a) => (
                <View key={a} style={styles.allergyChip}>
                  <Text style={styles.allergyChipText}>{a}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noneText}>없음</Text>
            )}
          </View>
        </View>
        <View style={styles.partAttrRow}>
          <Text style={styles.partAttrLabel}>가져올 음식</Text>
          <View style={styles.partAttrValue}>
            {profile.bring.map((b) => (
              <View key={b.n} style={styles.bringChip}>
                <Text style={styles.bringChipText}>{b.n}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.partExtra}>
          <Icon
            name={profile.extra ? 'check-circle' : 'cancel'}
            size={19}
            color={profile.extra ? color.ecoText : color.textFaint}
          />
          <Text
            style={[
              styles.partExtraText,
              { color: profile.extra ? color.ecoText : color.textFaint },
            ]}
          >
            {profile.extra ? '추가 재료 구매 가능' : '추가 재료 구매 불가'}
          </Text>
        </View>
      </View>
    </View>
  );
}

/* ------------------------------ voting ------------------------------ */

function VotingStage({
  voteMenus,
  myVote,
  eSel,
  voteReason,
  onPick,
  onChangeReason,
}: {
  voteMenus: VoteMenu[];
  myVote: number | null;
  eSel: boolean;
  voteReason: string;
  onPick: (index: number) => void;
  onChangeReason: (text: string) => void;
}) {
  const cards = voteMenus.map((menu, index) => ({ menu, index }));
  const lowCards = cards.filter((c) => c.menu.type === '저탄소');
  const normalCards = cards.filter((c) => c.menu.type === '일반');

  return (
    <>
      <View style={styles.voteBanner}>
        <Icon name="how-to-vote" size={20} color={color.brandStrong} />
        <Text style={styles.voteBannerText}>
          정원이 마감됐어요! 모든 참여자의 재료·알레르기·요리실력을 바탕으로 AI가 4가지 메뉴를
          추천했어요. 함께 만들 메뉴에 투표해주세요.
        </Text>
      </View>

      <View style={styles.voteGroupHeader}>
        <Icon name="eco" size={19} color={color.ecoText} />
        <Text style={styles.voteGroupTitleEco}>저탄소 요리</Text>
        <Text style={styles.voteGroupHint}>탄소 배출이 적어요</Text>
      </View>
      <View style={styles.voteList}>
        {lowCards.map((c) => (
          <VoteCard
            key={c.menu.key}
            menu={c.menu}
            selected={myVote === c.index}
            onPress={() => onPick(c.index)}
          />
        ))}
      </View>

      <View style={styles.voteGroupHeader}>
        <Icon name="restaurant" size={19} color={color.textMute} />
        <Text style={styles.voteGroupTitle}>일반 요리</Text>
      </View>
      <View style={styles.voteList}>
        {normalCards.map((c) => (
          <VoteCard
            key={c.menu.key}
            menu={c.menu}
            selected={myVote === c.index}
            onPress={() => onPick(c.index)}
          />
        ))}
      </View>

      <Pressable
        onPress={() => onPick(E_OPTION)}
        style={[
          styles.eOption,
          {
            backgroundColor: eSel ? applicationStage.eSelBg : color.white,
            borderWidth: eSel ? 2 : 1,
            borderColor: eSel ? color.brand : color.borderInput,
          },
        ]}
      >
        <Icon name="replay" size={22} color={color.textMute} />
        <View style={styles.flex1}>
          <Text style={styles.eOptionTitle}>후보가 마음에 들지 않아요</Text>
          <Text style={styles.eOptionSub}>AI에게 다른 메뉴를 다시 추천받아요</Text>
        </View>
        <View
          style={[
            styles.radio,
            {
              borderColor: eSel ? color.brand : applicationStage.eRingIdle,
              backgroundColor: eSel ? color.brand : applicationStage.eRingIdle,
            },
          ]}
        >
          {eSel ? <Icon name="check" size={18} color={color.white} /> : null}
        </View>
      </Pressable>

      {eSel ? (
        <View style={styles.reasonBox}>
          <View style={styles.reasonLabelRow}>
            <Text style={styles.reasonLabel}>재추천 사유</Text>
            <Text style={styles.reasonStar}>*</Text>
          </View>
          <TextInput
            value={voteReason}
            onChangeText={onChangeReason}
            multiline
            numberOfLines={3}
            placeholder="어떤 점이 아쉬웠는지 적어주세요. 입력한 내용을 반영해 AI가 다시 추천해요. (예: 알레르기 재료 포함, 메뉴가 너무 비슷함)"
            placeholderTextColor={color.placeholder}
            style={styles.reasonInput}
          />
        </View>
      ) : null}
    </>
  );
}

function VoteCard({
  menu,
  selected,
  onPress,
}: {
  menu: VoteMenu;
  selected: boolean;
  onPress: () => void;
}) {
  const isEco = menu.type === '저탄소';
  const typeBg = isEco ? color.ecoBgSoft : color.greyChipBg;
  const typeFg = isEco ? color.ecoText : color.textMute;
  const purchaseColor = menu.purchase ? color.gold : color.ecoText;
  const purchaseText = menu.purchase
    ? `${menu.purchase.item} · 담당 ${menu.purchase.buyer}(자동) · ${menu.purchase.cost}`
    : '추가구매 없이 완성돼요';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.voteCard,
        { borderWidth: selected ? 2 : 1, borderColor: selected ? color.brand : color.border },
      ]}
    >
      <View style={styles.flex1}>
        <View style={styles.voteNameRow}>
          <Text style={styles.voteName}>{menu.name}</Text>
          <View style={[styles.typeChip, { backgroundColor: typeBg }]}>
            <Text style={[styles.typeChipText, { color: typeFg }]}>{menu.type}</Text>
          </View>
        </View>
        <Text style={styles.voteDesc}>{menu.desc}</Text>
        <Text style={styles.voteCo2}>{`🌱 음식물 ${menu.co2} 절감`}</Text>
        <View style={styles.votePurchaseRow}>
          <Icon
            name={menu.purchase ? 'shopping-cart' : 'check-circle'}
            size={14}
            color={purchaseColor}
          />
          <Text style={[styles.votePurchaseText, { color: purchaseColor }]}>{purchaseText}</Text>
        </View>
      </View>
      <View
        style={[
          styles.radio,
          {
            borderColor: selected ? color.brand : color.border,
            backgroundColor: selected ? color.brand : color.border,
          },
        ]}
      >
        {selected ? <Icon name="check" size={18} color={color.white} /> : null}
      </View>
    </Pressable>
  );
}

/* ------------------------------ result ------------------------------ */

function ResultStage({ decided }: { decided: ReturnType<typeof useDecidedMenu>['data'] }) {
  if (decided === null) return null;
  return (
    <>
      <View style={styles.resultHeader}>
        <Icon name="how-to-vote" size={20} color={color.eco} />
        <Text style={styles.resultHeaderText}>투표로 결정된 메뉴</Text>
      </View>
      <LinearGradient
        colors={gradient.cream}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.4 }}
        style={styles.decidedCard}
      >
        <View style={styles.decidedEmoji}>
          <Text style={styles.decidedEmojiText}>{decided.emoji}</Text>
        </View>
        <View style={styles.flex1}>
          <Text style={styles.decidedName}>{decided.name}</Text>
          <Text style={styles.decidedMeta}>
            {`${decided.votes} · 조리 ${decided.time} · ${decided.servings}`}
          </Text>
        </View>
        <Icon name="check-circle" size={28} color={color.eco} />
      </LinearGradient>

      <Text style={styles.resultSectionTitle}>레시피</Text>
      <View style={styles.recipeCard}>
        {decided.recipe.map((step, i) => (
          <View
            key={i}
            style={[styles.recipeRow, i < decided.recipe.length - 1 && styles.recipeRowDivider]}
          >
            <View style={styles.recipeNum}>
              <Text style={styles.recipeNumText}>{i + 1}</Text>
            </View>
            <Text style={styles.recipeText}>{step}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.resultSectionTitle, styles.tightTitle]}>역할 분배 & 준비물</Text>
      <Text style={styles.resultSectionSub}>각자 맡은 역할과 단계별 조리 방법을 확인하세요</Text>
      <View style={styles.roleList}>
        {decided.roles.map((role) => (
          <RoleCard key={role.who} role={role} />
        ))}
      </View>

      {decided.purchase ? (
        <>
          <Text style={[styles.resultSectionTitle, styles.tightTitle]}>공동 구매 품목</Text>
          <Text style={styles.resultSectionSub}>추가구매 가능자 중 담당자가 자동 배정됐어요</Text>
          <View style={styles.purchaseCard}>
            <View style={styles.purchaseTop}>
              <View style={styles.purchaseIconBox}>
                <Icon name="shopping-cart" size={23} color={color.gold} />
              </View>
              <View style={styles.flex1}>
                <Text style={styles.purchaseItem}>{decided.purchase.item}</Text>
                <Text style={styles.purchaseCost}>{`예상 구매비 약 ${decided.purchase.cost}`}</Text>
              </View>
              <View style={styles.purchaseBuyerBox}>
                <Text style={styles.purchaseBuyerLabel}>구매 담당</Text>
                <View style={styles.purchaseBuyerRow}>
                  <Text style={styles.purchaseBuyer}>{decided.purchase.buyer}</Text>
                  <View style={styles.autoBadge}>
                    <Text style={styles.autoBadgeText}>자동</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.purchaseNote}>
              <Icon name="payments" size={17} color={color.textFaint} />
              <Text style={styles.purchaseNoteText}>
                구매비는 앱 밖에서 참여자끼리 자율 정산해요.
              </Text>
            </View>
          </View>
        </>
      ) : null}

      <View style={styles.ecoFooter}>
        <Icon name="eco" size={22} color={color.ecoDeep} />
        <Text style={styles.ecoFooterText}>
          {`이 메뉴로 음식물 약 ${decided.co2}을 아낄 수 있어요. 모임 당일 잊지 말고 준비물을 챙겨오세요!`}
        </Text>
      </View>
    </>
  );
}

function RoleCard({ role }: { role: MenuRole }) {
  return (
    <View style={styles.roleCard}>
      <View style={styles.roleTop}>
        <View
          style={[
            styles.roleDot,
            { backgroundColor: role.isMe ? color.purple : applicationStage.roleDotIdle },
          ]}
        >
          <Icon name="person" size={22} color={color.white} />
        </View>
        <View style={styles.flex1}>
          <View style={styles.roleNameRow}>
            <Text style={styles.roleName}>{role.who}</Text>
            {role.isMe ? (
              <View style={styles.roleMeTag}>
                <Text style={styles.roleMeTagText}>나</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.roleRole}>{role.role}</Text>
        </View>
        <View style={styles.roleBringBox}>
          <Text style={styles.roleBringLabel}>추가구매필요</Text>
          <Text
            style={[
              styles.roleBring,
              { color: role.bring === '없음' ? color.textFaint : color.ink },
            ]}
          >
            {role.bring}
          </Text>
        </View>
      </View>
      <View style={styles.roleSteps}>
        {role.steps.map((step, i) => (
          <View key={i} style={styles.roleStepRow}>
            <View style={styles.roleStepNum}>
              <Text style={styles.roleStepNumText}>{i + 1}</Text>
            </View>
            <Text style={styles.roleStepText}>{step}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.appBg },
  // ---- 헤더 ----
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
  // ---- 스크롤 ----
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: space.screenX,
    paddingTop: space.xs,
    paddingBottom: space.x11,
  },
  scrollWithSticky: { paddingBottom: 116 },
  appTitle: {
    fontSize: font.size.h3,
    fontFamily: font.family.bold,
    color: color.ink,
    lineHeight: 28.6,
    letterSpacing: font.tracking.tightH,
    marginHorizontal: 2,
    marginTop: space.xs,
    marginBottom: space.x4,
  },
  // ---- 정보 카드 ----
  infoCard: {
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.card2,
    paddingHorizontal: space.x6,
    paddingVertical: space.sm,
    marginBottom: space.sm,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: space.xl, paddingVertical: space.x2 },
  infoRowDivider: { borderBottomWidth: 1, borderBottomColor: color.hair },
  infoText: {
    fontSize: font.size.md,
    fontFamily: font.family.semibold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  // ---- canceled ----
  canceledHero: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: space.sm,
    paddingHorizontal: space.x7,
  },
  canceledIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: color.greyChipBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.x6,
  },
  canceledTitle: {
    fontSize: font.size.title,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
    textAlign: 'center',
  },
  canceledSub: {
    fontSize: font.size.smx,
    fontFamily: font.family.medium,
    color: color.textMute,
    lineHeight: 21,
    letterSpacing: font.tracking.snug,
    textAlign: 'center',
    marginTop: space.md,
    maxWidth: 285,
  },
  refundBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xl,
    backgroundColor: color.ecoBgSoft2,
    borderWidth: 1,
    borderColor: color.ecoBorder,
    borderRadius: radius.card,
    paddingVertical: space.x4,
    paddingHorizontal: space.x6,
    marginTop: space.x4,
  },
  refundText: {
    flex: 1,
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.ecoDeep,
    lineHeight: 18.85,
    letterSpacing: font.tracking.snug,
  },
  canceledHint: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.textFaint,
    textAlign: 'center',
    lineHeight: 19.5,
    letterSpacing: font.tracking.snug,
    marginTop: space.x7,
  },
  // ---- recruiting ----
  recruitBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.lg,
    backgroundColor: color.ecoBgSoft,
    borderRadius: radius.x2,
    paddingVertical: space.x3,
    paddingHorizontal: space.x5,
    marginTop: space.x6,
    marginBottom: space.xs,
  },
  recruitBannerText: {
    flex: 1,
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.ecoDeep,
    lineHeight: 18.85,
    letterSpacing: font.tracking.snug,
  },
  partsHeader: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
    marginTop: space.x10,
    marginBottom: space.sm,
    marginHorizontal: 2,
  },
  partsHeaderCount: { color: color.textFaint },
  partsSub: {
    fontSize: font.size.micro,
    fontFamily: font.family.medium,
    color: color.textFaint,
    letterSpacing: font.tracking.snug,
    marginHorizontal: 2,
    marginBottom: space.x4,
  },
  partList: { gap: space.x4 },
  partCard: {
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.card2,
    padding: space.x6,
    ...shadow.card,
  },
  partCardMe: { borderWidth: 2, borderColor: color.purple },
  partTop: { flexDirection: 'row', alignItems: 'center', gap: space.lg, marginBottom: space.x4 },
  partAvatar: {
    width: 46,
    height: 46,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partName: {
    fontSize: font.size.body,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  hostTag: {
    backgroundColor: color.redBgSoft,
    paddingVertical: space.xs,
    paddingHorizontal: 9,
    borderRadius: radius.chip2,
  },
  hostTagText: { fontSize: font.size.tiny, fontFamily: font.family.bold, color: color.brandStrong },
  meTag: {
    backgroundColor: color.purple,
    paddingVertical: space.xs,
    paddingHorizontal: 9,
    borderRadius: radius.chip2,
  },
  meTagText: { fontSize: font.size.tiny, fontFamily: font.family.bold, color: color.white },
  flex1: { flex: 1 },
  skillTag: { paddingVertical: 5, paddingHorizontal: space.xl, borderRadius: radius.sm },
  skillTagText: {
    fontSize: font.size.micro,
    fontFamily: font.family.bold,
    letterSpacing: font.tracking.snug,
  },
  partBody: { gap: space.xl },
  partAttrRow: { flexDirection: 'row', alignItems: 'flex-start', gap: space.lg },
  partAttrLabel: {
    width: 62,
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.textFaint,
    letterSpacing: font.tracking.snug,
    paddingTop: 3,
  },
  partAttrValue: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    alignItems: 'center',
  },
  allergyChip: {
    backgroundColor: color.redBgSoft2,
    paddingVertical: 5,
    paddingHorizontal: space.xl,
    borderRadius: radius.sm,
  },
  allergyChipText: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.brandStrong,
    letterSpacing: font.tracking.snug,
  },
  noneText: {
    fontSize: font.size.sm,
    fontFamily: font.family.medium,
    color: color.ink2,
    letterSpacing: font.tracking.snug,
    paddingTop: 2,
  },
  bringChip: {
    backgroundColor: color.hair,
    paddingVertical: 5,
    paddingHorizontal: space.xl,
    borderRadius: radius.sm,
  },
  bringChipText: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.ink2,
    letterSpacing: font.tracking.snug,
  },
  partExtra: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingTop: space.xl,
    borderTopWidth: 1,
    borderTopColor: color.hair,
  },
  partExtraText: {
    fontSize: font.size.smx,
    fontFamily: font.family.semibold,
    letterSpacing: font.tracking.snug,
  },
  // ---- voting ----
  voteBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.lg,
    backgroundColor: color.redBgSoft,
    borderRadius: radius.x2,
    paddingVertical: space.x3,
    paddingHorizontal: space.x5,
    marginTop: space.x6,
    marginBottom: space.x9,
  },
  voteBannerText: {
    flex: 1,
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: applicationStage.votingBannerText,
    lineHeight: 18.85,
    letterSpacing: font.tracking.snug,
  },
  voteGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginHorizontal: 2,
    marginBottom: space.x2,
  },
  voteGroupTitleEco: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.ecoText,
    letterSpacing: font.tracking.snug,
  },
  voteGroupTitle: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  voteGroupHint: {
    fontSize: font.size.micro,
    fontFamily: font.family.medium,
    color: color.textFaint,
    letterSpacing: font.tracking.snug,
  },
  voteList: { gap: space.xl, marginBottom: space.x9 },
  voteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
    backgroundColor: color.white,
    borderRadius: radius.card2,
    padding: space.x5,
  },
  voteNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginBottom: space.xs,
  },
  voteName: {
    fontSize: font.size.lg,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  typeChip: { paddingVertical: 3, paddingHorizontal: 7, borderRadius: radius.chip },
  typeChipText: {
    fontSize: font.size.tiny2,
    fontFamily: font.family.bold,
    letterSpacing: font.tracking.snug,
  },
  voteDesc: {
    fontSize: font.size.capSm,
    fontFamily: font.family.medium,
    color: color.textMute,
    lineHeight: 17.5,
    letterSpacing: font.tracking.snug,
  },
  voteCo2: {
    fontSize: font.size.micro2,
    fontFamily: font.family.semibold,
    color: color.ecoText,
    letterSpacing: font.tracking.snug,
    marginTop: space.sm,
  },
  votePurchaseRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs, marginTop: 5 },
  votePurchaseText: {
    fontSize: font.size.micro2,
    fontFamily: font.family.semibold,
    letterSpacing: font.tracking.snug,
  },
  radio: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xl,
    borderRadius: radius.card,
    padding: space.x5,
  },
  eOptionTitle: {
    fontSize: font.size.md,
    fontFamily: font.family.bold,
    color: color.ink2,
    letterSpacing: font.tracking.snug,
  },
  eOptionSub: {
    fontSize: font.size.micro,
    fontFamily: font.family.medium,
    color: color.textMute,
    letterSpacing: font.tracking.snug,
    marginTop: 2,
  },
  reasonBox: {
    marginTop: space.x2,
    backgroundColor: color.white,
    borderWidth: 1.5,
    borderColor: applicationStage.reasonBorder,
    borderRadius: radius.card,
    paddingVertical: space.x4,
    paddingHorizontal: space.x5,
  },
  reasonLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    marginBottom: space.sm,
  },
  reasonLabel: {
    fontSize: font.size.cap,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  reasonStar: { fontSize: font.size.cap, fontFamily: font.family.bold, color: color.brand },
  reasonInput: {
    minHeight: 66,
    fontSize: font.size.smx,
    fontFamily: font.family.semibold,
    color: color.ink,
    lineHeight: 20.25,
    letterSpacing: font.tracking.snug,
    textAlignVertical: 'top',
    padding: 0,
  },
  // ---- result ----
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginTop: space.x10,
    marginBottom: space.x2,
    marginHorizontal: 2,
  },
  resultHeaderText: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  decidedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x5,
    borderWidth: 1,
    borderColor: gradient.creamBd,
    borderRadius: radius.x4,
    padding: space.x7,
  },
  decidedEmoji: {
    width: 58,
    height: 58,
    borderRadius: radius.card,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decidedEmojiText: { fontSize: 32 },
  decidedName: {
    fontSize: font.size.title,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  decidedMeta: {
    fontSize: font.size.capSm,
    fontFamily: font.family.semibold,
    color: applicationStage.decidedVotes,
    letterSpacing: font.tracking.snug,
    marginTop: space.xs,
  },
  resultSectionTitle: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
    marginTop: space.x11,
    marginBottom: space.x2,
    marginHorizontal: 2,
  },
  tightTitle: { marginBottom: space.sm },
  resultSectionSub: {
    fontSize: font.size.micro,
    fontFamily: font.family.medium,
    color: color.textFaint,
    letterSpacing: font.tracking.snug,
    marginHorizontal: 2,
    marginBottom: space.x2,
  },
  recipeCard: {
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.card2,
    paddingHorizontal: space.x6,
    paddingVertical: space.sm,
  },
  recipeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.x3,
    paddingVertical: space.x3,
  },
  recipeRowDivider: { borderBottomWidth: 1, borderBottomColor: color.hair },
  recipeNum: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: color.redBgSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeNumText: {
    fontSize: font.size.cap,
    fontFamily: font.family.bold,
    color: color.brandStrong,
  },
  recipeText: {
    flex: 1,
    fontSize: font.size.sm,
    fontFamily: font.family.medium,
    color: color.ink2,
    lineHeight: 21,
    letterSpacing: font.tracking.snug,
    paddingTop: 2,
  },
  roleList: { gap: space.lg },
  roleCard: {
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.card,
    paddingVertical: space.x4,
    paddingHorizontal: space.x5,
  },
  roleTop: { flexDirection: 'row', alignItems: 'center', gap: space.x2 },
  roleDot: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleNameRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  roleName: {
    fontSize: font.size.md,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  roleMeTag: {
    backgroundColor: color.purple,
    paddingVertical: 2,
    paddingHorizontal: space.sm,
    borderRadius: radius.chip,
  },
  roleMeTagText: { fontSize: font.size.tiny2, fontFamily: font.family.bold, color: color.white },
  roleRole: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.ink4,
    letterSpacing: font.tracking.snug,
    marginTop: 3,
  },
  roleBringBox: { alignItems: 'flex-end' },
  roleBringLabel: {
    fontSize: font.size.tiny2,
    fontFamily: font.family.semibold,
    color: color.textFaint,
    letterSpacing: font.tracking.snug,
  },
  roleBring: {
    fontSize: font.size.cap,
    fontFamily: font.family.bold,
    letterSpacing: font.tracking.snug,
    marginTop: 2,
  },
  roleSteps: {
    marginTop: space.x2,
    paddingTop: space.x2,
    borderTopWidth: 1,
    borderTopColor: color.hair2,
    gap: space.sm,
  },
  roleStepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm },
  roleStepNum: {
    width: 19,
    height: 19,
    borderRadius: radius.pill,
    backgroundColor: color.hair2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  roleStepNumText: {
    fontSize: font.size.tiny2,
    fontFamily: font.family.bold,
    color: color.textMute,
  },
  roleStepText: {
    flex: 1,
    fontSize: font.size.capSm,
    fontFamily: font.family.medium,
    color: color.ink3,
    lineHeight: 18.75,
    letterSpacing: font.tracking.snug,
  },
  purchaseCard: {
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.card2,
    padding: space.x6,
  },
  purchaseTop: { flexDirection: 'row', alignItems: 'center', gap: space.x3 },
  purchaseIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.xl,
    backgroundColor: color.amberBgSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseItem: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  purchaseCost: {
    fontSize: font.size.micro,
    fontFamily: font.family.semibold,
    color: color.textFaint,
    letterSpacing: font.tracking.snug,
    marginTop: 3,
  },
  purchaseBuyerBox: { alignItems: 'flex-end' },
  purchaseBuyerLabel: {
    fontSize: font.size.tiny2,
    fontFamily: font.family.semibold,
    color: color.textFaint,
    letterSpacing: font.tracking.snug,
  },
  purchaseBuyerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    marginTop: space.xs,
  },
  purchaseBuyer: {
    fontSize: font.size.sm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  autoBadge: {
    backgroundColor: color.gold,
    paddingVertical: 2,
    paddingHorizontal: space.sm,
    borderRadius: 5,
  },
  autoBadgeText: { fontSize: font.size.tiny2, fontFamily: font.family.bold, color: color.white },
  purchaseNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginTop: space.x3,
    paddingTop: space.x3,
    borderTopWidth: 1,
    borderTopColor: color.hair2,
  },
  purchaseNoteText: {
    flex: 1,
    fontSize: font.size.micro,
    fontFamily: font.family.medium,
    color: color.textMute,
    lineHeight: 16.8,
    letterSpacing: font.tracking.snug,
  },
  ecoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xl,
    backgroundColor: color.ecoBgSoft2,
    borderWidth: 1,
    borderColor: color.ecoBorder,
    borderRadius: radius.card,
    padding: space.x5,
    marginTop: space.x7,
  },
  ecoFooterText: {
    flex: 1,
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.ecoDeep,
    lineHeight: 18.85,
    letterSpacing: font.tracking.snug,
  },
  // ---- sticky ----
  sticky: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: space.screenX,
    paddingTop: space.x4,
    paddingBottom: space.x6,
  },
  cancelBtn: {
    borderWidth: 1.5,
    borderColor: color.borderInput,
    backgroundColor: color.white,
    borderRadius: radius.card,
    paddingVertical: space.x6,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: font.size.lg,
    fontFamily: font.family.bold,
    color: color.textMute,
    letterSpacing: font.tracking.snug,
  },
  voteBtn: { borderRadius: radius.card, paddingVertical: space.x7, alignItems: 'center' },
  voteBtnText: {
    fontSize: font.size.lg,
    fontFamily: font.family.bold,
    color: color.white,
    letterSpacing: font.tracking.snug,
  },
  generateWrap: {
    alignItems: 'center',
    paddingHorizontal: space.screenX,
    paddingTop: 60,
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
    backgroundColor: color.brand,
    paddingVertical: space.x4,
    paddingHorizontal: space.x8,
    borderRadius: radius.pill,
  },
  generateBtnDisabled: {
    backgroundColor: applicationStage.voteBtnDisabled,
  },
  generateBtnText: {
    fontSize: font.size.lg,
    fontFamily: font.family.bold,
    color: color.white,
    letterSpacing: font.tracking.snug,
  },
});
