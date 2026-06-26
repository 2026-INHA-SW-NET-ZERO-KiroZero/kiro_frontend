import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { color, font } from '@/theme/theme';

/**
 * 메인 탭바: 4탭(홈/내 모임/리포트/MY) — PRD §2.1.
 * 활성 = color.brand + filled 아이콘 / 비활성 = color.textFaint2 + outline.
 * 탭바는 main 라우트(이 그룹)에서만 노출되고, 스택 화면은 위에 push되며 가려진다.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.brand,
        tabBarInactiveTintColor: color.textFaint2,
        tabBarLabelStyle: { fontSize: font.size.tiny, fontFamily: font.family.semibold },
        tabBarStyle: { backgroundColor: color.white, borderTopColor: color.border },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: '홈',
          tabBarIcon: ({ color: tint, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={tint} />
          ),
        }}
      />
      <Tabs.Screen
        name="meetings"
        options={{
          title: '내 모임',
          tabBarIcon: ({ color: tint, size, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={tint} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: '리포트',
          tabBarIcon: ({ color: tint, size, focused }) => (
            <Ionicons name={focused ? 'leaf' : 'leaf-outline'} size={size} color={tint} />
          ),
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          title: 'MY',
          tabBarIcon: ({ color: tint, size, focused }) => (
            <Ionicons name={focused ? 'happy' : 'happy-outline'} size={size} color={tint} />
          ),
        }}
      />
    </Tabs>
  );
}
