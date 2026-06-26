import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Avatar,
  AvatarStack,
  Button,
  Card,
  Chip,
  FAB,
  Input,
  ProgressRing,
  SectionSlab,
  Segmented,
  SheetBase,
  SkillChip,
  StatusBadge,
  ToggleChip,
} from '@/components';
import { avatarPalette, color, font, space } from '@/theme/theme';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

export default function ComponentsDemoScreen() {
  const [skill, setSkill] = useState('상');
  const [filterActive, setFilterActive] = useState(false);
  const [milk, setMilk] = useState(false);
  const [egg, setEgg] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);

  const participants = [
    { name: '김민수', color: avatarPalette[0] },
    { name: '이서연', color: avatarPalette[1] },
    { name: '박지훈', color: avatarPalette[2] },
    { name: '최유진', color: avatarPalette[4] },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.back}>
          <Text style={styles.backText}>← 뒤로가기</Text>
        </Pressable>
        <Text style={styles.headerTitle}>컴포넌트 데모</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Section title="Button">
          <Button label="로그인" onPress={() => {}} variant="primary" />
          <Button label="회원가입" onPress={() => {}} variant="outline" />
          <Button label="신청 취소" onPress={() => {}} variant="cancel" />
          <Button label="비활성" onPress={() => {}} disabled />
        </Section>

        <Section title="Chip / ToggleChip">
          <View style={styles.row}>
            <Chip label="인하대" active />
            <Chip
              label="마감 가리기"
              active={filterActive}
              onPress={() => setFilterActive((v) => !v)}
            />
            <Chip label="저녁 모임" />
          </View>
          <View style={styles.row}>
            <ToggleChip label="우유" selected={milk} onPress={() => setMilk((v) => !v)} />
            <ToggleChip label="밀/글루텐" />
            <ToggleChip label="계란" selected={egg} onPress={() => setEgg((v) => !v)} />
            <ToggleChip label="땅콩" />
          </View>
        </Section>

        <Section title="StatusBadge">
          <View style={styles.row}>
            <StatusBadge status="open" />
            <StatusBadge status="seatsLeft" label="2자리 남음" />
            <StatusBadge status="almostFull" />
            <StatusBadge status="full" />
          </View>
          <View style={styles.row}>
            <StatusBadge status="confirmed" />
            <StatusBadge status="cooked" />
            <StatusBadge status="canceled" />
          </View>
        </Section>

        <Section title="SkillChip">
          <View style={styles.row}>
            <SkillChip level="상" />
            <SkillChip level="중" />
            <SkillChip level="하" />
            <SkillChip level="상" size="md" />
            <SkillChip level="중" size="md" />
            <SkillChip level="하" size="md" />
          </View>
        </Section>

        <Section title="Avatar / AvatarStack">
          <View style={styles.row}>
            <Avatar name="김민수" color={avatarPalette[0]} size="sm" />
            <Avatar name="이서연" color={avatarPalette[1]} size="md" />
            <Avatar name="박지훈" color={avatarPalette[2]} size="lg" />
          </View>
          <AvatarStack participants={participants} />
        </Section>

        <Section title="Segmented">
          <Segmented options={['상', '중', '하']} value={skill} onChange={setSkill} />
        </Section>

        <Section title="Card">
          <Card style={styles.cardInner}>
            <Text style={styles.cardTitle}>오늘의 모임</Text>
            <Text style={styles.cardBody}>4인 방 · 잉여 식재료로 함께 요리해요</Text>
          </Card>
        </Section>

        <Section title="Input">
          <Input
            label="이메일"
            value={email}
            onChangeText={setEmail}
            placeholder="example@inha.edu"
          />
          <Input
            label="비밀번호"
            value={password}
            onChangeText={setPassword}
            placeholder="비밀번호를 입력하세요"
            secureTextEntry
          />
        </Section>

        <Section title="ProgressRing">
          <ProgressRing progress={0.74} color={color.brand}>
            <Text style={styles.ringText}>74%</Text>
          </ProgressRing>
        </Section>

        <Section title="SectionSlab">
          <SectionSlab />
        </Section>

        <Section title="SheetBase">
          <Button label="시트 열기" onPress={() => setSheetOpen(true)} variant="outline" />
        </Section>
      </ScrollView>

      <View style={styles.fabSlot}>
        <FAB onPress={() => {}} />
      </View>

      <SheetBase visible={sheetOpen} onClose={() => setSheetOpen(false)} title="바텀시트 예시">
        <Text style={styles.sheetBody}>SheetBase 컴포넌트 미리보기입니다.</Text>
        <Button label="닫기" onPress={() => setSheetOpen(false)} variant="primary" />
      </SheetBase>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.appBg },
  header: {
    paddingHorizontal: space.screenX,
    paddingVertical: space.x2,
    gap: space.xs,
  },
  back: { alignSelf: 'flex-start' },
  backText: {
    fontSize: font.size.body,
    fontFamily: font.family.semibold,
    color: color.brand,
  },
  headerTitle: {
    fontSize: font.size.h2,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  scroll: {
    paddingHorizontal: space.screenX,
    paddingBottom: 120,
    gap: space.x8,
  },
  section: { gap: space.x2 },
  sectionTitle: {
    fontSize: font.size.title,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  sectionBody: { gap: space.x2 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md, alignItems: 'center' },
  cardInner: { padding: space.x6, gap: space.sm },
  cardTitle: {
    fontSize: font.size.body,
    fontFamily: font.family.bold,
    color: color.ink,
  },
  cardBody: { fontSize: font.size.sm, color: color.textMute },
  ringText: {
    fontSize: font.size.h4,
    fontFamily: font.family.bold,
    color: color.ink,
  },
  sheetBody: {
    fontSize: font.size.bodySm,
    color: color.ink3,
    marginBottom: space.x6,
  },
  fabSlot: {
    position: 'absolute',
    right: space.screenX,
    bottom: space.x8,
  },
});
