/**
 * 지역 선택 바텀시트 (PRD §3.16 · dc.html line 1351~1371).
 * 프레젠테이션 컴포넌트 — 표시/선택 상태는 호출 화면(home)이 소유한다.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { SheetBase } from '@/components/SheetBase';
import { color, font, space } from '@/theme/theme';

/** 선택 가능한 지역 목록 (dc.html:1888 `locationList` 원문 그대로). */
export const LOCATIONS = [
  '내 지역',
  '서울',
  '경기',
  '인천',
  '강원',
  '대전/세종',
  '충남',
  '충북',
] as const;

export type LocationName = (typeof LOCATIONS)[number];

type LocationSheetProps = {
  visible: boolean;
  selected: LocationName;
  onSelect: (location: LocationName) => void;
  onClose: () => void;
};

export function LocationSheet({ visible, selected, onSelect, onClose }: LocationSheetProps) {
  return (
    <SheetBase visible={visible} onClose={onClose}>
      <View style={styles.bleed}>
        <View style={styles.header}>
          <Text style={styles.title}>지역</Text>
          <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
            <Icon name="close" size={24} color={color.ink} />
          </Pressable>
        </View>
        <View style={styles.list}>
          {LOCATIONS.map((loc) => (
            <Pressable key={loc} onPress={() => onSelect(loc)} style={styles.row}>
              <Text style={styles.rowLabel}>{loc}</Text>
              {loc === selected ? <Icon name="check" size={22} color={color.brand} /> : null}
            </Pressable>
          ))}
        </View>
      </View>
    </SheetBase>
  );
}

const styles = StyleSheet.create({
  // SheetBase의 좌우 패딩(screenX)을 상쇄해 구분선을 전체폭으로 확장한다.
  bleed: {
    marginHorizontal: -space.screenX,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.x4,
    paddingHorizontal: space.screenX,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  title: {
    fontSize: font.size.title,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingBottom: space.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.x7,
    paddingHorizontal: space.screenX,
    borderBottomWidth: 1,
    borderBottomColor: color.hair,
  },
  rowLabel: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.semibold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
});
