import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { useAuthApi } from '@/hooks/useAuthApi';
import { isLoginValid } from '@/lib/validators';
import { ApiError } from '@/lib/apiClient';
import { color, font, radius, space } from '@/theme/theme';

function LogoMark() {
  return (
    <Svg width={40} height={40} viewBox="0 0 48 48">
      <Circle cx={15} cy={17} r={4} fill={color.white} />
      <Circle cx={24} cy={14.5} r={4.3} fill={color.white} />
      <Circle cx={33} cy={17} r={4} fill={color.white} />
      <Rect x={3.4} y={26.6} width={5.4} height={3.5} rx={1.75} fill={color.white} />
      <Rect x={39.2} y={26.6} width={5.4} height={3.5} rx={1.75} fill={color.white} />
      <Rect x={6.6} y={22.4} width={34.8} height={4.3} rx={2.15} fill={color.white} />
      <Path d="M9 25.8 H39 V31 C39 37 34.6 41 28 41 H20 C13.4 41 9 37 9 31 Z" fill={color.white} />
    </Svg>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthApi();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canSubmit = isLoginValid(email);

  const onLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await login({ email, password });
      router.replace('/(tabs)/home');
    } catch (err) {
      setLoading(false);
      setErrorMsg(
        err instanceof ApiError ? err.message : '로그인에 실패했어요. 다시 시도해주세요.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoTile}>
            <LogoMark />
          </View>
          <View>
            <Text style={styles.wordmark}>
              Kiro<Text style={styles.wordmarkAccent}>Zero</Text>
            </Text>
            <Text style={styles.subtitle}>
              잉여 식재료 기반{'\n'}캠퍼스 공동 요리 매칭 SW 서비스
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.label}>이메일</Text>
            <TextField
              value={email}
              onChangeText={setEmail}
              placeholder="학교 이메일을 입력하세요"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View>
            <Text style={styles.label}>비밀번호</Text>
            <TextField
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호를 입력하세요"
              secureTextEntry
            />
          </View>
        </View>

        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

        <View style={styles.loginBtn}>
          <PrimaryButton label="로그인" onPress={onLogin} disabled={!canSubmit} loading={loading} />
        </View>

        <View style={styles.divider}>
          <View style={styles.hairline} />
          <Text style={styles.dividerLabel}>또는</Text>
          <View style={styles.hairline} />
        </View>

        <Pressable style={styles.signupBtn} onPress={() => router.push('/(auth)/signup')}>
          <Text style={styles.signupLabel}>인하대 이메일로 회원가입</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.appBg },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: space.x12,
    paddingVertical: space.x12,
  },
  header: {
    alignItems: 'flex-start',
    gap: space.x6,
    marginBottom: 42,
  },
  logoTile: {
    width: 62,
    height: 62,
    borderRadius: radius.x4,
    backgroundColor: color.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    fontSize: font.size.display,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tighter,
  },
  wordmarkAccent: { color: color.brand },
  subtitle: {
    fontSize: font.size.md,
    fontFamily: font.family.medium,
    color: color.textMute,
    marginTop: space.md,
    lineHeight: font.size.md * font.lineHeight.relaxed,
    letterSpacing: font.tracking.snug,
  },
  form: { gap: space.x3 },
  label: {
    fontSize: font.size.capSm,
    fontFamily: font.family.semibold,
    color: color.textMute,
    marginBottom: space.sm,
    marginLeft: space.xs,
    letterSpacing: font.tracking.snug,
  },
  error: {
    marginTop: space.x4,
    fontSize: font.size.capSm,
    fontFamily: font.family.semibold,
    color: color.brandAlt,
    letterSpacing: font.tracking.snug,
  },
  loginBtn: { marginTop: space.x10 },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x2,
    marginVertical: space.x9,
  },
  hairline: { flex: 1, height: 1, backgroundColor: color.borderInput2 },
  dividerLabel: {
    fontSize: font.size.micro,
    fontFamily: font.family.medium,
    color: color.textFaint3,
  },
  signupBtn: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: color.border,
    backgroundColor: color.white,
    borderRadius: radius.x3,
    paddingVertical: space.x5,
    alignItems: 'center',
  },
  signupLabel: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.brand,
    letterSpacing: font.tracking.snug,
  },
});
