/**
 * 알림 전체 페이지 (PRD §3.15 · dc.html line 1268~1292).
 * 헤더(뒤로/모두 읽음) → 알림 카드 리스트. 행 탭 시 markRead 후 타입별 라우팅.
 *
 * 데이터는 useNotifications() 경유.
 */
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/Icon';
import { useNotifications } from '@/hooks';
import { color, font, radius, space } from '@/theme/theme';
import type { Notif, NotifTone } from '@/types';

/** 톤별 아이콘 타일 색 (dc.html `_ntone`). 토큰으로 근사. */
const TONE: Record<NotifTone, { bg: string; fg: string }> = {
  red: { bg: color.redBgSoft3, fg: color.brandAlt },
  amber: { bg: color.amberBg2, fg: color.gold },
  green: { bg: color.ecoBgSoft, fg: color.eco },
};

/** 더미데이터 아이콘명(underscore) → MaterialIcons glyph(kebab). */
const toGlyph = (icon: string): IconName => icon.replace(/_/g, '-') as IconName;

export function NotificationsScreen() {
  const router = useRouter();
  const { data, markRead, markAllRead } = useNotifications();

  const tapNotif = (n: Notif) => {
    markRead(n.id);
    router.push(n.type === 'eval' ? '/pastEval' : '/myApplication');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
          <Icon name="arrow-back-ios-new" size={24} color={color.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>알림</Text>
        <Pressable onPress={markAllRead} hitSlop={8} style={styles.allReadBtn}>
          <Text style={styles.allReadText}>모두 읽음</Text>
        </Pressable>
      </View>

      {/* 목록 */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {data.map((n) => {
          const tone = TONE[n.tone];
          return (
            <Pressable
              key={n.id}
              onPress={() => tapNotif(n)}
              style={[styles.row, { backgroundColor: n.unread ? color.appBg : color.white }]}
            >
              <View style={[styles.tile, { backgroundColor: tone.bg }]}>
                <Icon name={toGlyph(n.icon)} size={24} color={tone.fg} />
              </View>
              <View style={styles.rowBody}>
                <View style={styles.titleRow}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {n.title}
                  </Text>
                  {n.unread ? <View style={styles.dot} /> : null}
                </View>
                <Text style={styles.rowText}>{n.body}</Text>
                <Text style={styles.rowTime}>{n.time}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: color.appBg,
  },
  // ---- 헤더 ----
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: space.xs,
    paddingHorizontal: space.x2,
    paddingBottom: space.lg,
  },
  backBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: font.size.body,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  allReadBtn: {
    paddingHorizontal: space.md,
  },
  allReadText: {
    fontSize: font.size.capSm,
    fontFamily: font.family.bold,
    color: color.textFaint,
  },
  // ---- 목록 ----
  list: {
    paddingTop: space.xs,
    paddingHorizontal: space.x6,
    paddingBottom: space.x10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.xl,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.card2,
    padding: space.x5,
    marginBottom: space.lg,
  },
  tile: {
    width: 44,
    height: 44,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: {
    flex: 1,
    gap: space.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  rowTitle: {
    flexShrink: 1,
    fontSize: font.size.md,
    fontFamily: font.family.bold,
    color: color.ink,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: color.brandAlt,
  },
  rowText: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.ink4,
    lineHeight: font.size.cap * font.lineHeight.base,
  },
  rowTime: {
    fontSize: font.size.micro2,
    fontFamily: font.family.bold,
    color: color.textFaint2,
  },
});
