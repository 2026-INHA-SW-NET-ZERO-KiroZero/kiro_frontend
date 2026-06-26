import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Segment } from '@/components/Segment';
import { TextField } from '@/components/TextField';
import { ToggleChip } from '@/components/ToggleChip';
import { useAuthApi } from '@/hooks/useAuthApi';
import { ApiError } from '@/lib/apiClient';
import { checkInhaEmail, isSignupFormValid } from '@/lib/validators';
import { color, font, space } from '@/theme/theme';
import { SKILL_TO_LABEL, SKILL_TO_SERVER } from '@/types';
import type { AllergyTagItemResponse, CookingSkill } from '@/types';

type BorderState = 'default' | 'valid' | 'error';

const SKILL_OPTIONS = [
  { label: '상', value: 'HIGH' },
  { label: '중', value: 'MEDIUM' },
  { label: '하', value: 'LOW' },
] as const;

const SKILL_DESC: Record<CookingSkill, string> = {
  HIGH: '웬만한 요리는 자신 있어요',
  MEDIUM: '레시피를 보면 만들 수 있어요',
  LOW: '요리는 거의 처음이에요',
};

export default function SignupScreen() {
  const router = useRouter();
  const { signup, getAllergyTags } = useAuthApi();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [cookingSkill, setCookingSkill] = useState<CookingSkill>('MEDIUM');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allergyChips, setAllergyChips] = useState<AllergyTagItemResponse[]>([]);
  const [chipsLoading, setChipsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getAllergyTags()
      .then((res) => {
        if (active) setAllergyChips(res.allergyTags);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setChipsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [getAllergyTags]);

  const emailFeedback = checkInhaEmail(email);
  let emailBorder: BorderState = 'default';
  if (emailFeedback.validity === 'valid') emailBorder = 'valid';
  else if (emailFeedback.validity === 'invalidDomain') emailBorder = 'error';

  const currentSkillLabel = SKILL_TO_LABEL[cookingSkill];
  const canSubmit = isSignupFormValid(email, password, nickname, currentSkillLabel);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const onSignup = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await signup({
        email,
        password,
        nickname,
        cookingSkill: SKILL_TO_SERVER[currentSkillLabel],
        allergyTags: selectedTags,
      });
      router.replace('/(tabs)/home');
    } catch (err) {
      setLoading(false);
      setErrorMsg(err instanceof ApiError ? err.message : '가입에 실패했어요. 다시 시도해주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.headerBar}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>회원가입</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>반가워요!{'\n'}몇 가지만 알려주세요</Text>
        <Text style={styles.lead}>인하대 구성원이라면 누구나 가입할 수 있어요.</Text>

        <View style={styles.field}>
          <Text style={styles.label}>
            이메일 <Text style={styles.labelMuted}>· 아이디로 사용해요</Text>
          </Text>
          <TextField
            value={email}
            onChangeText={setEmail}
            placeholder="@inha.ac.kr 또는 @inha.edu"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            borderState={emailBorder}
            feedbackMessage={emailFeedback.message}
            feedbackType={emailFeedback.validity === 'valid' ? 'valid' : 'error'}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>비밀번호</Text>
          <TextField
            value={password}
            onChangeText={setPassword}
            placeholder="비밀번호를 입력하세요"
            secureTextEntry
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>닉네임</Text>
          <TextField
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력하세요"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            알레르기 <Text style={styles.labelMuted}>· 선택</Text>
          </Text>
          <Text style={styles.caption}>메뉴 추천에서 자동으로 제외돼요.</Text>
          {chipsLoading ? (
            <ActivityIndicator color={color.brand} style={styles.chipsLoading} />
          ) : (
            <View style={styles.chips}>
              {allergyChips.map((chip) => (
                <ToggleChip
                  key={chip.tag}
                  label={chip.labelKo}
                  selected={selectedTags.includes(chip.tag)}
                  onToggle={() => toggleTag(chip.tag)}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>요리 실력</Text>
          <Segment
            options={SKILL_OPTIONS.map((o) => ({ label: o.label, value: o.value }))}
            value={cookingSkill}
            onChange={(v) => setCookingSkill(v as CookingSkill)}
            caption={SKILL_DESC[cookingSkill]}
          />
        </View>

        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="가입 완료하고 시작하기"
          onPress={onSignup}
          disabled={!canSubmit}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.appBg },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingHorizontal: space.x4,
    paddingTop: space.sm,
    paddingBottom: space.lg,
  },
  back: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: font.size.h4, fontFamily: font.family.medium, color: color.ink },
  headerTitle: {
    fontSize: font.size.title,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  scroll: { paddingHorizontal: space.x10, paddingTop: space.md, paddingBottom: space.x7 },
  title: {
    fontSize: font.size.h2,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tightH,
    lineHeight: font.size.h2 * font.lineHeight.tight,
    marginBottom: space.sm,
  },
  lead: {
    fontSize: font.size.smx,
    fontFamily: font.family.medium,
    color: color.textMute,
    letterSpacing: font.tracking.snug,
    marginBottom: space.x11,
  },
  field: { marginTop: space.x10 },
  label: {
    fontSize: font.size.cap,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
    marginBottom: space.md,
    marginLeft: space.xs,
  },
  labelMuted: { color: color.textFaint, fontFamily: font.family.medium },
  caption: {
    fontSize: font.size.micro,
    fontFamily: font.family.medium,
    color: color.textFaint,
    letterSpacing: font.tracking.snug,
    marginBottom: space.xl,
    marginLeft: space.xs,
    marginTop: -space.xs,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  chipsLoading: { alignSelf: 'flex-start', marginTop: space.md },
  error: {
    marginTop: space.x6,
    fontSize: font.size.capSm,
    fontFamily: font.family.semibold,
    color: color.brandAlt,
    letterSpacing: font.tracking.snug,
  },
  footer: {
    paddingHorizontal: space.x10,
    paddingTop: space.x2,
    paddingBottom: space.x9,
    borderTopWidth: 1,
    borderTopColor: color.border,
    backgroundColor: color.appBg,
  },
});
