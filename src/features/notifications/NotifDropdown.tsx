/**
 * 알림 드롭다운 오버레이 (PRD §3.15 · dc.html line 1293~1313).
 * 홈 벨 버튼에서 토글. top-right 기준 scale+opacity 진입 애니메이션.
 *
 * 데이터는 useNotifications() 경유. 행 탭 시 markRead 후 타입별 라우팅.
 */
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/Icon';
import { useNotifications } from '@/hooks';
import { color, font, radius, shadow, space } from '@/theme/theme';
import type { Notif, NotifTone } from '@/types';

type NotifDropdownProps = {
  visible: boolean;
  onClose: () => void;
  onOpenPage: () => void;
};

/** 톤별 아이콘 타일 색 (dc.html `_ntone`). 토큰으로 근사. */
const TONE: Record<NotifTone, { bg: string; fg: string }> = {
  red: { bg: color.redBgSoft3, fg: color.brandAlt },
  amber: { bg: color.amberBg2, fg: color.gold },
  green: { bg: color.ecoBgSoft, fg: color.eco },
};

/** 더미데이터 아이콘명(underscore) → MaterialIcons glyph(kebab). */
const toGlyph = (icon: string): IconName => icon.replace(/_/g, '-') as IconName;

const POPUP_HALF = 145;

export function NotifDropdown({ visible, onClose, onOpenPage }: NotifDropdownProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data, unreadCount, markRead } = useNotifications();
  const [anim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      anim.setValue(0);
      Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    }
  }, [visible, anim]);

  const tapNotif = (n: Notif) => {
    markRead(n.id);
    onClose();
    router.push(n.type === 'eval' ? '/pastEval' : '/myApplication');
  };

  const rows = data.slice(0, 5);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.dim} onPress={onClose} />
      <Animated.View
        style={[
          styles.popup,
          { top: insets.top + 46 },
          {
            opacity: anim,
            transform: [
              { translateX: POPUP_HALF },
              { scaleX: anim },
              { translateX: -POPUP_HALF },
              { scaleY: anim },
            ],
          },
        ]}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>알림</Text>
          {unreadCount > 0 ? (
            <View style={styles.pill}>
              <Text style={styles.pillText}>새 알림 {unreadCount}</Text>
            </View>
          ) : null}
        </View>

        {/* 알림 행 (최대 5) */}
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {rows.map((n) => {
            const tone = TONE[n.tone];
            return (
              <Pressable
                key={n.id}
                onPress={() => tapNotif(n)}
                style={[styles.row, { backgroundColor: n.unread ? color.appBg : color.white }]}
              >
                <View style={[styles.tile, { backgroundColor: tone.bg }]}>
                  <Icon name={toGlyph(n.icon)} size={20} color={tone.fg} />
                </View>
                <View style={styles.rowBody}>
                  <View style={styles.titleRow}>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                      {n.title}
                    </Text>
                    {n.unread ? <View style={styles.dot} /> : null}
                  </View>
                  <Text style={styles.rowText} numberOfLines={2}>
                    {n.body}
                  </Text>
                  <Text style={styles.rowTime}>{n.time}</Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* 푸터 */}
        <Pressable
          style={styles.footer}
          onPress={() => {
            onClose();
            onOpenPage();
          }}
        >
          <Text style={styles.footerText}>알림 페이지로 이동</Text>
          <Icon name="chevron-right" size={17} color={color.brand} />
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: color.scrimSoft,
  },
  popup: {
    position: 'absolute',
    right: space.x2,
    width: 290,
    backgroundColor: color.white,
    borderRadius: radius.x4,
    ...shadow.popover,
  },
  // ---- 헤더 ----
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: space.x4,
    paddingHorizontal: space.x6,
    paddingBottom: space.lg,
  },
  headerTitle: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  pill: {
    backgroundColor: color.redBgSoft3,
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: radius.pill,
  },
  pillText: {
    fontSize: font.size.tiny,
    fontFamily: font.family.bold,
    color: color.brandAlt,
  },
  // ---- 리스트 ----
  list: {
    maxHeight: 328,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.xl,
    paddingVertical: space.x2,
    paddingHorizontal: space.x6,
    borderTopWidth: 1,
    borderTopColor: color.hair2,
  },
  tile: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  rowTitle: {
    flexShrink: 1,
    fontSize: font.size.cap,
    fontFamily: font.family.bold,
    color: color.ink,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color.brandAlt,
  },
  rowText: {
    fontSize: font.size.micro2,
    fontFamily: font.family.semibold,
    color: color.ink4,
  },
  rowTime: {
    fontSize: font.size.tiny2,
    fontFamily: font.family.semibold,
    color: color.textFaint2,
  },
  // ---- 푸터 ----
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    paddingVertical: space.x3,
    borderTopWidth: 1,
    borderTopColor: color.border,
  },
  footerText: {
    fontSize: font.size.smx,
    fontFamily: font.family.bold,
    color: color.brand,
  },
});
