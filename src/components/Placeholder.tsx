import { Link, router, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { color, font, radius, space } from '@/theme/theme';

type NavLink = { href: Href; label: string; replace?: boolean };

type PlaceholderProps = {
  /** 화면명 (골격 식별용) */
  title: string;
  /** 보조 설명 */
  subtitle?: string;
  /** 네비게이션 검증용 이동 버튼 */
  links?: NavLink[];
  /** 스택 화면용 뒤로가기 버튼 노출 */
  showBack?: boolean;
};

/**
 * 네비게이션 골격용 placeholder 스크린.
 * 후속 화면 이슈에서 features/{도메인}의 실제 화면으로 교체된다.
 */
export function Placeholder({ title, subtitle, links, showBack }: PlaceholderProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {showBack ? (
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.backText}>← 뒤로</Text>
        </Pressable>
      ) : null}
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {links?.length ? (
          <View style={styles.links}>
            {links.map((item) => (
              <Link key={item.label} href={item.href} replace={item.replace} style={styles.link}>
                {item.label}
              </Link>
            ))}
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.appBg },
  back: { paddingHorizontal: space.screenX, paddingVertical: space.x2 },
  backText: {
    fontSize: font.size.body,
    fontWeight: font.weight.semibold,
    color: color.brand,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.screenX,
    gap: space.md,
  },
  title: {
    fontSize: font.size.h2,
    fontWeight: font.weight.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  subtitle: { fontSize: font.size.sm, color: color.textMute },
  links: { marginTop: space.x6, gap: space.lg, alignItems: 'center' },
  link: {
    fontSize: font.size.bodySm,
    fontWeight: font.weight.semibold,
    color: color.white,
    backgroundColor: color.brand,
    paddingVertical: space.lg,
    paddingHorizontal: space.x8,
    borderRadius: radius.pill,
    overflow: 'hidden',
    textAlign: 'center',
  },
});
