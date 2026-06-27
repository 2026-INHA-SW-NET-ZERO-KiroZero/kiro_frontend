import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { type ComponentProps, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, Button, Icon, SectionSlab, SkillChip } from '@/components';
import { JoinSheet } from '@/features/roomDetail/JoinSheet';
import { useAggIngredients } from '@/hooks/useAggIngredients';
import { usePartyPool } from '@/hooks/usePartyPool';
import { useRoomDetail } from '@/hooks/useRooms';
import { joinSlot, leaveSlot } from '@/lib/slotApi';
import { roomDisplay, type RoomState } from '@/lib/roomDisplay';
import type { JoinSlotRequest, SkillLevel } from '@/types';
import { color, font, gradient, radius, shadow, space } from '@/theme/theme';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

const ACCORDIONS = [
  { title: '요리 진행 방식', body: '식재료를 모아 4인이 함께 요리합니다.' },
  { title: '여름철 요리 유의사항', body: '고온 환경에서 식재료 보관에 유의해 주세요.' },
  { title: '안전 유의사항', body: '칼·불 사용 시 주의하고 항상 안전을 확인하세요.' },
  { title: '환불 정책', body: '모임 전날 자정 이전 취소 시 전액 환불됩니다.' },
] as const;

export default function RoomDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [heroStatus] = useState<RoomState>('OPEN');
  const [hasMenu] = useState(false);
  // null = API 값 사용, true/false = 로컬 낙관적 업데이트
  const [joinedOverride, setJoinedOverride] = useState<boolean | null>(null);
  const [showJoinSheet, setShowJoinSheet] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<number | null>(null);

  const slotId = Number(id);

  const { data: room, refetch: refetchRoom } = useRoomDetail(id ?? '');
  const { data: partyPool, refetch: refetchPartyPool } = usePartyPool(slotId);
  const { data: aggList, refetch: refetchAggList } = useAggIngredients(slotId);
  // 로컬 override가 없으면 API 응답 joined 값을 사용
  const joined = joinedOverride ?? room?.joined ?? false;

  // API participantCount는 현재 사용자를 포함한 수를 반환한다.
  // joinedOverride는 API가 아직 최신 값을 반영하기 전일 때만 ±1 보정한다.
  const baseCount = room?.baseCount ?? 0;
  const apiJoined = room?.joined ?? false;
  const capacity = room?.capacity ?? 4;
  const liveCount = Math.min(
    capacity,
    joinedOverride === true && !apiJoined
      ? baseCount + 1
      : joinedOverride === false && apiJoined
        ? Math.max(0, baseCount - 1)
        : baseCount,
  );

  const display = roomDisplay({
    state: heroStatus,
    capacity: room?.capacity ?? 4,
    count: liveCount,
    joined,
    hasMenu,
  });

  if (!room) {
    return <SafeAreaView style={styles.screen} edges={['top']} />;
  }

  const visibleParticipantCount = Math.min(liveCount, room.capacity);
  const participantProfiles = Array.from(
    { length: visibleParticipantCount },
    (_, idx) =>
      partyPool?.[idx] ?? {
        skill: '하',
        allergies: [],
        bring: [],
        extra: false,
      },
  );

  const infoItems: { icon: IconName; label: string }[] = [
    { icon: 'wc', label: '요리실력 무관' },
    { icon: 'group', label: '남녀 모두' },
    { icon: 'schedule', label: '약 2시간' },
    { icon: 'groups', label: '4인 1팀' },
    { icon: 'person', label: display.seatsCount },
    { icon: 'checkroom', label: '앞치마·장갑' },
  ];

  function handleCtaPress() {
    switch (display.cta.action) {
      case 'join':
        setShowJoinSheet(true);
        break;
      case 'cancel':
        leaveSlot(slotId)
          .then(() => setJoinedOverride(false))
          .catch(() => {});
        break;
      case 'recommend':
        router.push(`/recommend?slotId=${slotId}`);
        break;
      case 'usage':
        router.push(`/usage?slotId=${slotId}`);
        break;
      case 'settlement':
        router.push(`/settlement?id=${slotId}`);
        break;
      default:
        break;
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* 개발용 상태 토글 — 상단 고정 */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. Hero */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={gradient.brandWarm}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroImage}
          >
            <Text style={styles.heroEmoji}>🍳</Text>
          </LinearGradient>
          <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={8}>
            <Icon name="arrow-back-ios" size={20} color={color.white} />
          </Pressable>
          <View style={styles.counterChip}>
            <Text style={styles.counterText}>1 | 1</Text>
          </View>
        </View>

        {/* 2. 헤더 블록 */}
        <View style={styles.headerBlock}>
          <Text style={styles.dateTime}>
            {room.date} · {room.time}
          </Text>
          <Text style={styles.title}>{room.title}</Text>
          <View style={styles.placeRow}>
            <Icon name="location-on" size={14} color={color.textFaint} />
            <Text style={styles.placeText}>{room.place}</Text>
            <Text style={styles.placeAction}>주소 복사</Text>
            <Text style={styles.placeAction}>지도 보기</Text>
          </View>
          <Text style={styles.statsText}>♥ 2 · 👁 124</Text>
          <View style={styles.callout}>
            <Text style={styles.calloutText}>
              🍳 남는 식재료를 모아 함께 요리하고 비용을 아껴요
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceAmt}>2,000원</Text>
            <Text style={styles.priceUnit}> / 1인</Text>
          </View>
          <Text style={styles.deadlineNote}>모임 전날 자정에 신청이 마감돼요</Text>
        </View>

        {/* 3. SectionSlab */}
        <SectionSlab />

        {/* 4. 모임 정보 2열 그리드 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>모임 정보</Text>
          <View style={styles.infoGrid}>
            {infoItems.map((item, i) => (
              <View key={i} style={styles.infoItem}>
                <Icon name={item.icon} size={16} color={color.textFaint} />
                <Text style={styles.infoLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 5. SectionSlab */}
        <SectionSlab />

        {/* 6. 참여자 카드 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>참여자</Text>
          {participantProfiles.map((profile, idx) => {
            const isHost = idx === 0;
            const isMe = idx === 1;
            const avatarColor = room.parts[idx % room.parts.length]?.c ?? color.brand;
            return (
              <View
                key={idx}
                style={[
                  styles.participantCard,
                  idx < visibleParticipantCount - 1 && styles.participantDivider,
                ]}
              >
                <View style={styles.participantHeader}>
                  <Avatar name={isMe ? '나' : `참${idx + 1}`} color={avatarColor} size="md" />
                  <Text style={styles.participantName}>참여자 {idx + 1}</Text>
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
                  <View style={styles.skillSlot}>
                    <SkillChip level={profile.skill as SkillLevel} />
                  </View>
                </View>

                <View style={styles.participantRow}>
                  <Text style={styles.participantLabel}>알레르기</Text>
                  <View style={styles.chipRow}>
                    {profile.allergies.length > 0 ? (
                      profile.allergies.map((a, ai) => (
                        <View key={ai} style={styles.allergyChip}>
                          <Text style={styles.allergyChipText}>{a}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.noneText}>없음</Text>
                    )}
                  </View>
                </View>

                <View style={styles.participantRow}>
                  <Text style={styles.participantLabel}>가져올 음식</Text>
                  <View style={styles.chipRow}>
                    {profile.bring.map((b, bi) => (
                      <View key={bi} style={styles.bringChip}>
                        <Text style={styles.bringChipText}>{b.n}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.extraRow}>
                  <Icon
                    name={profile.extra ? 'check-circle' : 'cancel'}
                    size={15}
                    color={profile.extra ? color.eco : color.textFaint}
                  />
                  <Text
                    style={[
                      styles.extraText,
                      { color: profile.extra ? color.ecoText : color.textFaint },
                    ]}
                  >
                    {profile.extra ? '추가 재료 구매 가능' : '추가 구매 불가'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* 7. 통합 식재료 (OPEN 아닐 때) */}
        {heroStatus !== 'OPEN' ? (
          <>
            <SectionSlab />
            <View style={styles.section}>
              <View style={styles.aggHeader}>
                <Icon name="eco" size={20} color={color.eco} />
                <Text style={styles.aggTitle}>
                  4명의 재료 · 총 {aggList?.length ?? 0}종 통합 완료
                </Text>
              </View>
              <View style={styles.aggCard}>
                {(aggList ?? []).map((item, i) => (
                  <View key={i} style={[styles.aggRow, i > 0 && styles.aggDivider]}>
                    <Text style={styles.aggEmoji}>{item.emoji}</Text>
                    <Text style={styles.aggName}>{item.name}</Text>
                    <Text style={styles.aggQty}>{item.qty}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : null}

        {/* 8. SectionSlab + 정보 아코디언 */}
        <SectionSlab />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>안내사항</Text>
          {ACCORDIONS.map((item, i) => {
            const open = expandedAccordion === i;
            return (
              <View key={i} style={styles.accordion}>
                <Pressable
                  style={styles.accordionHead}
                  onPress={() => setExpandedAccordion(open ? null : i)}
                >
                  <Text style={styles.accordionTitle}>{item.title}</Text>
                  <Icon
                    name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={22}
                    color={color.textFaint}
                  />
                </Pressable>
                {open ? <Text style={styles.accordionBody}>{item.body}</Text> : null}
              </View>
            );
          })}
        </View>

        {/* 9. 조건부 블록 */}
        {heroStatus === 'CONFIRMED' && !hasMenu ? (
          <View style={styles.recommendHint}>
            <Text style={styles.recommendHintText}>💡 AI가 최적 메뉴를 추천해 드려요</Text>
          </View>
        ) : null}
        {heroStatus !== 'OPEN' && hasMenu ? (
          <View style={styles.menuCard}>
            <Text style={styles.menuEmoji}>🍲</Text>
            <Text style={styles.menuName}>소시지 김치 부대찌개</Text>
            <Text style={styles.menuSelected}>선택된 메뉴</Text>
          </View>
        ) : null}
        {heroStatus === 'COOKED' ? (
          <View style={styles.cookedCard}>
            <Text style={styles.cookedText}>✅ 조리 완료</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* 10. Sticky footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Text style={styles.footerNote}>마감까지 {display.seatsText}</Text>
        <Button
          label={display.cta.label}
          onPress={handleCtaPress}
          disabled={display.cta.disabled}
          variant={display.cta.variant === 'grey' ? 'cancel' : 'primary'}
          style={styles.ctaBtn}
        />
      </View>

      <JoinSheet
        visible={showJoinSheet}
        onClose={() => setShowJoinSheet(false)}
        onSubmit={(payload: JoinSlotRequest) => {
          joinSlot(slotId, payload)
            .then(() => {
              setJoinedOverride(true);
              setShowJoinSheet(false);
              refetchRoom();
              refetchPartyPool();
              refetchAggList();
              const willBeFull = baseCount + 1 >= (room.capacity ?? 4);
              if (willBeFull) {
                router.push(`/myApplication?id=${slotId}`);
              }
            })
            .catch(() => {});
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.appBg,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // 1. Hero
  heroContainer: {
    position: 'relative',
    height: 236,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 72,
  },
  backBtn: {
    position: 'absolute',
    top: space.x6,
    left: space.x6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterChip: {
    position: 'absolute',
    top: space.x6,
    right: space.x6,
    backgroundColor: color.white,
    borderRadius: radius.pill,
    paddingVertical: 5,
    paddingHorizontal: space.lg,
    borderWidth: 1,
    borderColor: color.border,
  },
  counterText: {
    fontSize: font.size.cap,
    fontFamily: font.family.bold,
    color: color.ink,
  },

  // 2. 헤더 블록
  headerBlock: {
    paddingHorizontal: space.screenX,
    paddingVertical: space.x6,
    gap: space.lg,
  },
  dateTime: {
    fontSize: font.size.sm,
    fontFamily: font.family.semibold,
    color: color.brandStrong,
    letterSpacing: font.tracking.base,
  },
  title: {
    fontSize: font.size.h1,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  placeText: {
    fontSize: font.size.sm,
    fontFamily: font.family.medium,
    color: color.textMute,
    letterSpacing: font.tracking.base,
  },
  placeAction: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.brandStrong,
    marginLeft: space.sm,
    letterSpacing: font.tracking.base,
  },
  statsText: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.textFaint,
  },
  callout: {
    backgroundColor: color.redBgSoft,
    borderRadius: radius.lg,
    padding: space.x2,
  },
  calloutText: {
    fontSize: font.size.sm,
    fontFamily: font.family.semibold,
    color: color.brandStrong,
    letterSpacing: font.tracking.base,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceAmt: {
    fontSize: font.size.h4,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  priceUnit: {
    fontSize: font.size.sm,
    fontFamily: font.family.medium,
    color: color.textMute,
  },
  deadlineNote: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.brandAlt,
  },

  // 섹션 공통
  section: {
    paddingHorizontal: space.screenX,
    paddingVertical: space.x6,
  },
  sectionTitle: {
    fontSize: font.size.title,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
    marginBottom: space.x2,
  },

  // 4. 모임 정보
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.sm,
  },
  infoLabel: {
    fontSize: font.size.sm,
    fontFamily: font.family.medium,
    color: color.ink3,
    letterSpacing: font.tracking.base,
  },

  // 6. 참여자
  participantCard: {
    paddingVertical: space.x4,
    gap: space.lg,
  },
  participantDivider: {
    borderBottomWidth: 1,
    borderBottomColor: color.hair,
  },
  participantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  participantName: {
    fontSize: font.size.body,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.base,
  },
  hostTag: {
    backgroundColor: color.redBgSoft,
    borderRadius: radius.chip,
    paddingHorizontal: space.sm,
    paddingVertical: 2,
  },
  hostTagText: {
    fontSize: font.size.tiny,
    fontFamily: font.family.bold,
    color: color.brandStrong,
  },
  meTag: {
    backgroundColor: color.ecoBgSoft,
    borderRadius: radius.chip,
    paddingHorizontal: space.sm,
    paddingVertical: 2,
  },
  meTagText: {
    fontSize: font.size.tiny,
    fontFamily: font.family.bold,
    color: color.ecoText,
  },
  skillSlot: {
    marginLeft: 'auto',
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.md,
  },
  participantLabel: {
    width: 72,
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.textMute,
    paddingTop: 3,
  },
  chipRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  allergyChip: {
    backgroundColor: color.redBgSoft2,
    borderRadius: radius.chip,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
  },
  allergyChipText: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.brandStrong,
  },
  bringChip: {
    backgroundColor: color.appBgInput,
    borderWidth: 1,
    borderColor: color.borderInput,
    borderRadius: radius.chip,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
  },
  bringChipText: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.ink3,
  },
  noneText: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.textFaint,
    paddingTop: 3,
  },
  extraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  extraText: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
  },

  // 7. 통합 식재료
  aggHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginBottom: space.x2,
  },
  aggTitle: {
    fontSize: font.size.body,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.base,
  },
  aggCard: {
    backgroundColor: color.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.border,
    paddingHorizontal: space.x4,
    ...shadow.card,
  },
  aggRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x2,
    paddingVertical: space.x2,
  },
  aggDivider: {
    borderTopWidth: 1,
    borderTopColor: color.hair,
  },
  aggEmoji: {
    fontSize: font.size.h4,
  },
  aggName: {
    flex: 1,
    fontSize: font.size.sm,
    fontFamily: font.family.semibold,
    color: color.ink2,
  },
  aggQty: {
    fontSize: font.size.sm,
    fontFamily: font.family.bold,
    color: color.ink,
  },

  // 8. 아코디언
  accordion: {
    borderBottomWidth: 1,
    borderBottomColor: color.hair,
  },
  accordionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.x4,
  },
  accordionTitle: {
    fontSize: font.size.sm,
    fontFamily: font.family.semibold,
    color: color.ink2,
    letterSpacing: font.tracking.base,
  },
  accordionBody: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.textMute,
    lineHeight: font.size.cap * font.lineHeight.relaxed,
    paddingBottom: space.x4,
  },

  // 9. 조건부 블록
  recommendHint: {
    marginHorizontal: space.screenX,
    marginTop: space.x6,
    backgroundColor: color.amberBgSoft,
    borderRadius: radius.lg,
    padding: space.x4,
  },
  recommendHintText: {
    fontSize: font.size.sm,
    fontFamily: font.family.semibold,
    color: color.gold,
    letterSpacing: font.tracking.base,
  },
  menuCard: {
    marginHorizontal: space.screenX,
    marginTop: space.x6,
    backgroundColor: color.amberBgSoft,
    borderWidth: 1,
    borderColor: gradient.creamBd,
    borderRadius: radius.card,
    padding: space.x6,
    alignItems: 'center',
    gap: space.xs,
  },
  menuEmoji: {
    fontSize: 40,
  },
  menuName: {
    fontSize: font.size.title,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  menuSelected: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.gold,
  },
  cookedCard: {
    marginHorizontal: space.screenX,
    marginTop: space.x6,
    backgroundColor: color.ecoBgSoft,
    borderRadius: radius.lg,
    padding: space.x4,
    alignItems: 'center',
  },
  cookedText: {
    fontSize: font.size.sm,
    fontFamily: font.family.bold,
    color: color.ecoDeep,
  },

  // 10. Sticky footer
  footer: {
    backgroundColor: color.white,
    borderTopWidth: 1,
    borderTopColor: color.border,
    paddingHorizontal: space.screenX,
    paddingTop: space.x2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x2,
  },
  footerNote: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.textMute,
  },
  ctaBtn: {
    flex: 1,
  },
});
