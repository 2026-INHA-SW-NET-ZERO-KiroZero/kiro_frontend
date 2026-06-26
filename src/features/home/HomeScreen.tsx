/**
 * 홈 화면 (PRD §3.3 · dc.html 홈 line 143~241).
 * 상단 워드마크/필터 → 날짜 스트립 → 필터칩 → 추천 모임(가로) → 오늘 열린 방(세로).
 * 지역 필터칩 탭 시 Location 바텀시트(§3.16)를 연다.
 *
 * 데이터는 전부 훅 경유: useHomeRooms(카드), useMe(추천 헤더), useNotifications(알림 dot).
 */
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AvatarStack } from '@/components/Avatar';
import { Chip } from '@/components/Chip';
import { Icon } from '@/components/Icon';
import { StatusBadge } from '@/components/StatusBadge';
import { useHomeRooms, useMe, useNotifications } from '@/hooks';
import type { HomeRoomCard } from '@/hooks';
import { calendarTile, color, font, radius, shadow, space } from '@/theme/theme';

import { LocationSheet, type LocationName } from './LocationSheet';

/** 날짜 스트립 7타일 (dc.html line 156~178). */
type DayVariant = 'today' | 'sat' | 'sun' | 'weekday';
const DATE_TILES: { day: string; weekday: string; variant: DayVariant }[] = [
  { day: '26', weekday: '금', variant: 'today' },
  { day: '27', weekday: '토', variant: 'sat' },
  { day: '28', weekday: '일', variant: 'sun' },
  { day: '29', weekday: '월', variant: 'weekday' },
  { day: '30', weekday: '화', variant: 'weekday' },
  { day: '1', weekday: '수', variant: 'weekday' },
  { day: '2', weekday: '목', variant: 'weekday' },
];

const DAY_COLOR: Record<DayVariant, { num: string; weekday: string }> = {
  today: { num: calendarTile.todayNum, weekday: calendarTile.todayWeekday },
  sat: { num: calendarTile.satNum, weekday: calendarTile.satWeekday },
  sun: { num: calendarTile.sunNum, weekday: calendarTile.sunWeekday },
  weekday: { num: calendarTile.weekdayNum, weekday: calendarTile.weekdayWeekday },
};

export function HomeScreen() {
  const router = useRouter();
  const { recRooms, openRooms } = useHomeRooms();
  const { data: me } = useMe();
  const { data: notifs } = useNotifications();
  const hasUnread = notifs.some((n) => n.unread);

  const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState<LocationName>('내 지역');

  const goRoom = (id: string) => router.push(`/roomDetail?id=${id}`);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* 탑바 */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <Text style={styles.wordmark}>
            Kiro<Text style={styles.wordmarkZero}>Zero</Text>
          </Text>
          <View style={styles.campusPill}>
            <Text style={styles.campusPillText}>🌱 인하대</Text>
          </View>
        </View>
        <View style={styles.topIcons}>
          <Icon name="search" size={25} color={color.ink} />
          <Pressable
            onPress={() => router.push('/notifications')}
            hitSlop={8}
            style={styles.notifBtn}
          >
            <Icon name="notifications" size={25} color={color.ink} />
            {hasUnread ? <View style={styles.notifDot} /> : null}
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 날짜 스트립 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateStrip}
        >
          {DATE_TILES.map((tile) => {
            const isToday = tile.variant === 'today';
            const c = DAY_COLOR[tile.variant];
            return (
              <View key={tile.weekday} style={[styles.dateTile, isToday && styles.dateTileToday]}>
                <Text style={[styles.dateNum, { color: c.num }]}>{tile.day}</Text>
                <Text style={[styles.dateWeekday, { color: c.weekday }]}>{tile.weekday}</Text>
              </View>
            );
          })}
        </ScrollView>

        {/* 필터칩 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          <Chip label="📍 인하대 ▾" active onPress={() => setLocationOpen(true)} />
          <Chip label="마감 가리기" active />
          <Chip label="🌙 저녁 모임" />
          <Chip label="조리실습실" />
          <Chip label="공유주방" />
        </ScrollView>

        {/* 추천 모임 */}
        <View style={styles.sectionHeader}>
          <Icon name="recommend" size={20} color={color.brand} />
          <Text style={styles.sectionTitle}>{me.name} 님 추천 모임</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recRow}
        >
          {recRooms.map((room) => (
            <RecCard key={room.id} room={room} onPress={() => goRoom(room.id)} />
          ))}
        </ScrollView>

        {/* 오늘 열린 방 */}
        <View style={styles.openHeader}>
          <Text style={styles.sectionTitle}>오늘 열린 방</Text>
        </View>
        <View style={styles.openList}>
          {openRooms.map((room) => (
            <OpenCard key={room.id} room={room} onPress={() => goRoom(room.id)} />
          ))}
        </View>
      </ScrollView>

      <LocationSheet
        visible={locationOpen}
        selected={location}
        onSelect={(loc) => {
          setLocation(loc);
          setLocationOpen(false);
        }}
        onClose={() => setLocationOpen(false)}
      />
    </SafeAreaView>
  );
}

/** 추천 모임 카드 (가로 스크롤, width 176). */
function RecCard({ room, onPress }: { room: HomeRoomCard; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.recCard}>
      <View style={styles.recTopRow}>
        <Text style={styles.recTime}>{room.time}</Text>
        <StatusBadge status={room.badgeKey} label={room.badgeLabel} size="sm" />
      </View>
      <Text style={styles.recTitle} numberOfLines={2}>
        {room.title}
      </Text>
      <View style={styles.placeRow}>
        <Icon name="location-on" size={15} color={color.textMute} />
        <Text style={styles.recPlace} numberOfLines={1}>
          {room.place}
        </Text>
      </View>
    </Pressable>
  );
}

/** 오늘 열린 방 카드 (세로 리스트). */
function OpenCard({ room, onPress }: { room: HomeRoomCard; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.openCard}>
      <View style={styles.openBadgeRow}>
        <StatusBadge status={room.badgeKey} label={room.badgeLabel} />
        <Text style={styles.openTag}>{room.tagText}</Text>
      </View>
      <View style={styles.openTimeRow}>
        <Text style={styles.openTime}>{room.time}</Text>
        <Text style={styles.openDate}>{room.dateShort}</Text>
      </View>
      <Text style={styles.openTitle}>{room.title}</Text>
      <View style={styles.placeRow}>
        <Icon name="location-on" size={18} color={color.textMute} />
        <Text style={styles.openPlace}>{room.place}</Text>
      </View>
      <View style={styles.openFooter}>
        <AvatarStack participants={room.parts.map((p) => ({ name: p.label, color: p.bg }))} />
        <Text style={styles.openCount}>{room.countText}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: color.appBg,
  },
  // ---- 탑바 ----
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.screenX,
    paddingTop: space.sm,
    paddingBottom: space.lg,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  wordmark: {
    fontSize: font.size.h3,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tightH,
  },
  wordmarkZero: {
    color: color.brand,
  },
  campusPill: {
    backgroundColor: color.ecoBgSoft,
    paddingVertical: space.xs,
    paddingHorizontal: space.sm,
    borderRadius: radius.pill,
  },
  campusPillText: {
    fontSize: font.size.tiny,
    fontFamily: font.family.bold,
    color: color.ecoText,
    letterSpacing: font.tracking.base,
  },
  topIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x5,
  },
  notifBtn: {
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 1,
    right: 1,
    width: 7,
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: color.brandAlt,
    borderWidth: 1.5,
    borderColor: color.appBg,
  },
  // ---- 스크롤 본문 ----
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: space.x8,
  },
  // ---- 날짜 스트립 ----
  dateStrip: {
    gap: space.md,
    paddingHorizontal: space.screenX,
    paddingTop: space.xs,
    paddingBottom: space.x4,
  },
  dateTile: {
    width: 48,
    height: 66,
    borderRadius: radius.card2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  dateTileToday: {
    backgroundColor: calendarTile.todayBg,
    ...shadow.dateTile,
  },
  dateNum: {
    fontSize: font.size.h5,
    fontFamily: font.family.bold,
  },
  dateWeekday: {
    fontSize: font.size.tiny,
    fontFamily: font.family.semibold,
  },
  // ---- 필터칩 ----
  filterRow: {
    gap: space.md,
    paddingHorizontal: space.screenX,
    paddingBottom: space.x6,
  },
  // ---- 섹션 헤더 ----
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.screenX,
    paddingBottom: space.xs,
  },
  sectionTitle: {
    fontSize: font.size.lg,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  openHeader: {
    paddingHorizontal: space.screenX,
    paddingTop: space.x4,
    paddingBottom: space.xs,
  },
  // ---- 추천 카드 ----
  recRow: {
    gap: space.xl,
    paddingHorizontal: space.screenX,
    paddingTop: space.x2,
    paddingBottom: space.sm,
  },
  recCard: {
    width: 176,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.card2,
    padding: space.x4,
    gap: space.sm,
    ...shadow.card,
  },
  recTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  recTime: {
    fontSize: font.size.title,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  recTitle: {
    fontSize: font.size.smx,
    fontFamily: font.family.semibold,
    color: color.ink,
    lineHeight: 18.5,
    height: 37,
    letterSpacing: font.tracking.snug,
  },
  recPlace: {
    flex: 1,
    fontSize: font.size.micro,
    fontFamily: font.family.medium,
    color: color.textMute,
    letterSpacing: font.tracking.snug,
  },
  // ---- 열린 방 카드 ----
  openList: {
    paddingHorizontal: space.screenX,
    paddingTop: space.lg,
  },
  openCard: {
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.x4,
    padding: space.x6,
    marginBottom: space.x2,
    gap: space.xl,
    ...shadow.card,
  },
  openBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  openTag: {
    fontSize: font.size.micro,
    fontFamily: font.family.medium,
    color: color.textFaint2,
    letterSpacing: font.tracking.snug,
  },
  openTimeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space.md,
  },
  openTime: {
    fontSize: font.size.h4,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  openDate: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.textMute,
    letterSpacing: font.tracking.snug,
  },
  openTitle: {
    fontSize: font.size.body,
    fontFamily: font.family.semibold,
    color: color.ink,
    lineHeight: 20.8,
    letterSpacing: font.tracking.tight,
  },
  openPlace: {
    fontSize: font.size.smx,
    fontFamily: font.family.medium,
    color: color.textMute,
    letterSpacing: font.tracking.snug,
  },
  openFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: space.xl,
    borderTopWidth: 1,
    borderTopColor: color.hair3,
  },
  openCount: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.ink4,
    letterSpacing: font.tracking.snug,
  },
  // ---- 공용 장소 행 ----
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
});
