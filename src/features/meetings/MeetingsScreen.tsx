/**
 * 내 모임 / 캘린더 화면 (PRD §3.8 · dc.html `isMeetings`).
 * 월별 캘린더 카드 → 다가오는 모임(myApplications) → 지난 모임(pastMeetings).
 *
 * 데이터는 전부 훅 경유: useMyApplications, usePastMeetings, useNotifications(알림 dot).
 */
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AvatarStack } from '@/components/Avatar';
import { Icon } from '@/components/Icon';
import { StatusBadge } from '@/components/StatusBadge';
import { useMyApplications, useNotifications, usePastMeetings } from '@/hooks';
import type { MyApplication, PastMeeting } from '@/types';
import { color, font, radius, shadow, space } from '@/theme/theme';

import { WEEKDAYS, buildCalendarWeeks } from './calendar';

/** 카드 아바타 식별색 (dc.html `appPalette`). */
const APP_PALETTE = [color.purple, color.brand, color.eco, color.goldSoft];
/** 다가오는 모임 아바타 머리글자 (dc.html ['나','준','서','도']). */
const PART_LABELS = ['나', '준', '서', '도'];

/** "06.26 (금)" 또는 "06.26 (금) 18:00" → 6월이면 day 숫자, 아니면 null. */
function juneDay(date: string): number | null {
  if (!date.startsWith('06.')) return null;
  const d = parseInt(date.slice(3, 5), 10);
  return isNaN(d) ? null : d;
}

export function MeetingsScreen() {
  const router = useRouter();
  const { data: applications, refetch: refetchApplications } = useMyApplications();
  const { data: pastMeetings, refetch: refetchPastMeetings } = usePastMeetings();

  useFocusEffect(
    useCallback(() => {
      refetchApplications();
      refetchPastMeetings();
    }, [refetchApplications, refetchPastMeetings]),
  );
  const { data: notifs } = useNotifications();
  const hasUnread = notifs.some((n) => n.unread);

  const meetingDays = new Set(
    [...applications, ...pastMeetings]
      .map((m) => juneDay(m.date))
      .filter((d): d is number => d !== null),
  );
  const calendarWeeks = buildCalendarWeeks(meetingDays);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>내 모임</Text>
        <View style={styles.topActions}>
          <Icon name="search" size={25} color={color.ink} />
          <View>
            <Icon name="notifications" size={25} color={color.ink} />
            {hasUnread ? <View style={styles.notifDot} /> : null}
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 캘린더 카드 */}
        <View style={styles.calendarCard}>
          <View style={styles.calendarNav}>
            <Icon name="chevron-left" size={22} color={color.iconFaint} />
            <Text style={styles.calendarMonth}>2026년 6월</Text>
            <Icon name="chevron-right" size={22} color={color.iconFaint} />
          </View>
          <View style={styles.weekdayRow}>
            {WEEKDAYS.map((w) => (
              <Text key={w.label} style={[styles.weekday, { color: w.color }]}>
                {w.label}
              </Text>
            ))}
          </View>
          {calendarWeeks.map((week, wi) => (
            <View key={wi} style={styles.week}>
              {week.map((cell, ci) => (
                <View key={ci} style={styles.cell}>
                  <View style={[styles.cellCircle, cell.isToday && styles.cellToday]}>
                    <Text style={[styles.cellNum, { color: cell.numColor }]}>{cell.label}</Text>
                  </View>
                  <Text style={styles.cellMarker}>{cell.marker}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* 다가오는 모임 */}
        <Text style={styles.sectionTitle}>다가오는 모임</Text>
        {applications.map((app) => (
          <UpcomingCard
            key={app.id}
            app={app}
            onPress={() => router.push(`/myApplication?id=${app.id}`)}
          />
        ))}

        {/* 지난 모임 */}
        <Text style={[styles.sectionTitle, styles.sectionGapTop]}>지난 모임</Text>
        {pastMeetings.map((meeting) => (
          <PastCard
            key={meeting.id}
            meeting={meeting}
            onPress={() => router.push(`/pastApplication?id=${meeting.id}`)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/** 다가오는 모임 카드 (myApplications 파생). */
function UpcomingCard({ app, onPress }: { app: MyApplication; onPress: () => void }) {
  const full = app.count >= app.capacity;
  const left = app.capacity - app.count;

  let badge: { text: string; fg: string; bg: string };
  let tag: { text: string; color: string };
  if (app.canceled) {
    badge = { text: '인원 미달 · 모집 취소', fg: color.textMute, bg: color.greyChipBg };
    tag = { text: '취소됨', color: color.textFaint };
  } else if (full) {
    badge = { text: '정원 마감 · 메뉴 투표 중', fg: color.brandStrong, bg: color.redBgSoft };
    tag = { text: '투표 필요', color: color.brandStrong };
  } else {
    badge = { text: `${left}자리 남음`, fg: color.ecoText, bg: color.ecoBgSoft };
    tag = { text: app.dday, color: color.textMute };
  }

  const parts = Array.from({ length: app.count }, (_, j) => ({
    name: PART_LABELS[j] ?? '?',
    color: APP_PALETTE[j % APP_PALETTE.length],
  }));

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeText, { color: badge.fg }]}>{badge.text}</Text>
        </View>
        <Text style={[styles.cardTag, { color: tag.color }]}>{tag.text}</Text>
      </View>
      <View style={styles.timeRow}>
        <Text style={styles.time}>{app.time}</Text>
        <Text style={styles.dateShort}>{app.date}</Text>
      </View>
      <Text style={styles.cardTitle}>{app.title}</Text>
      <View style={styles.placeRow}>
        <Icon name="location-on" size={18} color={color.textMute} />
        <Text style={styles.place}>{app.place}</Text>
        {app.stationCode != null && <Text style={styles.station}>{app.stationCode}</Text>}
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.footerLeft}>
          <AvatarStack participants={parts} />
          <Text style={styles.count}>{`${app.count}/${app.capacity}명`}</Text>
        </View>
        <Icon name="chevron-right" size={22} color={color.iconFaint} />
      </View>
    </Pressable>
  );
}

/** 지난 모임 카드 (pastMeetings 파생). */
function PastCard({ meeting, onPress }: { meeting: PastMeeting; onPress: () => void }) {
  const sp = meeting.date.lastIndexOf(' ');
  const dateShort = meeting.date.slice(0, sp);
  const time = meeting.date.slice(sp + 1);
  const parts = [color.brand, color.eco, color.goldSoft, color.purple].map((c) => ({
    name: '',
    color: c,
  }));

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.cardHeader}>
        <StatusBadge status="cooked" />
        <Text style={[styles.cardTag, { color: color.ecoText }]}>{`🌱 ${meeting.saved} 절감`}</Text>
      </View>
      <View style={styles.timeRow}>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.dateShort}>{dateShort}</Text>
      </View>
      <Text style={styles.cardTitle}>{meeting.title}</Text>
      <View style={styles.placeRow}>
        <Icon name="location-on" size={18} color={color.textMute} />
        <Text style={styles.place}>{meeting.place}</Text>
        {meeting.stationCode != null && <Text style={styles.station}>{meeting.stationCode}</Text>}
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.footerLeft}>
          <AvatarStack participants={parts} />
          <Text style={styles.count}>{meeting.members}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.appBg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.screenX,
    paddingTop: space.sm,
    paddingBottom: space.x2,
  },
  pageTitle: {
    fontSize: font.size.h2,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tightH,
  },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: space.x5 },
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
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: space.screenX,
    paddingTop: space.xs,
    paddingBottom: space.x10,
  },
  // ---- 캘린더 ----
  calendarCard: {
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.x4,
    paddingVertical: space.x6,
    paddingHorizontal: space.x4,
    marginBottom: space.x9,
    ...shadow.card,
  },
  calendarNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.x6,
    marginBottom: space.x4,
  },
  calendarMonth: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  weekdayRow: { flexDirection: 'row', marginBottom: space.xs },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: font.size.micro2,
    fontFamily: font.family.semibold,
  },
  week: { flexDirection: 'row' },
  cell: { flex: 1, height: 46, alignItems: 'center', justifyContent: 'center', gap: 1 },
  cellCircle: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellToday: { backgroundColor: color.brand },
  cellNum: { fontSize: font.size.sm, fontFamily: font.family.semibold },
  cellMarker: { fontSize: font.size.tiny, lineHeight: 12, height: 12 },
  // ---- 섹션 ----
  sectionTitle: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
    marginHorizontal: 2,
    marginBottom: space.x2,
  },
  sectionGapTop: { marginTop: space.lg },
  // ---- 카드 (다가오는/지난 공용) ----
  card: {
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.x4,
    padding: space.x6,
    marginBottom: space.x2,
    gap: space.xl,
    ...shadow.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: space.lg,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: font.size.tiny,
    fontFamily: font.family.bold,
    letterSpacing: font.tracking.snug,
  },
  cardTag: {
    fontSize: font.size.micro,
    fontFamily: font.family.bold,
    letterSpacing: font.tracking.snug,
  },
  timeRow: { flexDirection: 'row', alignItems: 'baseline', gap: space.md },
  time: {
    fontSize: font.size.h4,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  dateShort: {
    fontSize: font.size.cap,
    fontFamily: font.family.medium,
    color: color.textMute,
    letterSpacing: font.tracking.snug,
  },
  cardTitle: {
    fontSize: font.size.body,
    fontFamily: font.family.semibold,
    color: color.ink,
    lineHeight: 20.8,
    letterSpacing: font.tracking.tight,
  },
  placeRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  place: {
    fontSize: font.size.smx,
    fontFamily: font.family.medium,
    color: color.textMute,
    letterSpacing: font.tracking.snug,
  },
  station: {
    fontSize: font.size.smx,
    fontFamily: font.family.medium,
    color: color.textFaint,
    letterSpacing: font.tracking.snug,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: space.xl,
    borderTopWidth: 1,
    borderTopColor: color.hair3,
  },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  count: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.ink4,
    letterSpacing: font.tracking.snug,
  },
});
