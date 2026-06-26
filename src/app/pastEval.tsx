import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { usePastEval, usePastMeeting } from '@/hooks';
import { myBroughtNames } from '@/lib';
import { color, font, gradient, radius, shadow, space } from '@/theme/theme';

const COOK_HERO = require('../../assets/cook-hero.png');
const EVAL_OPTS = [0, 25, 50, 75, 100] as const;

/** 모임 평가 (PRD §3.11). 인증 사진 2장 + 음식 소비율 + 재료별 소진율 → 평가 완료. */
export default function PastEvalScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const pastId = id ?? 'past1';
  const { data: past } = usePastMeeting(pastId);
  const { markEvaluated } = usePastEval();

  const [photoDone, setPhotoDone] = useState(false);
  const [photoLeft, setPhotoLeft] = useState(false);
  const [food, setFood] = useState<number | null>(null);
  const [ing, setIng] = useState<Record<string, number>>({});

  if (!past) {
    return <SafeAreaView style={styles.safe} edges={['top']} />;
  }

  const broughtNames = myBroughtNames(past);
  const canSubmit =
    photoDone && photoLeft && food !== null && broughtNames.every((n) => ing[n] != null);

  const submit = () => {
    if (!canSubmit) return;
    markEvaluated(past.id);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={6} style={styles.backBtn}>
          <Icon name="arrow-back-ios-new" size={24} color={color.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>모임 평가</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>먹고 남은 양을{'\n'}기록해 주세요</Text>
        <Text style={styles.subtitle}>
          함께 먹고 남은 음식과 재료 사용량을 남기면{'\n'}이번 모임의 탄소 절감량으로 계산돼요.
        </Text>

        {/* 인증 사진 */}
        <View style={styles.fieldHeader}>
          <Icon name="photo-camera" size={20} color={color.brand} />
          <Text style={styles.fieldLabel}>인증 사진</Text>
          <View style={styles.countPill}>
            <Text style={styles.countPillText}>2장</Text>
          </View>
        </View>
        <Text style={styles.fieldSub}>완성 사진과 다 먹은 뒤 사진을 함께 올려주세요</Text>

        <Text style={styles.photoLabel}>① 완성한 음식</Text>
        <PhotoTile
          filled={photoDone}
          onPress={() => setPhotoDone(true)}
          placeholder="완성한 음식 사진을 올려주세요"
        />

        <Text style={styles.photoLabel}>② 다 먹은 뒤 · 남은 음식</Text>
        <PhotoTile
          filled={photoLeft}
          onPress={() => setPhotoLeft(true)}
          placeholder="남은 음식 사진을 올려주세요"
          hint="증명용으로 사용돼요"
          dim
        />

        {/* 음식 소비율 */}
        <View style={[styles.fieldHeader, styles.fieldHeaderGap]}>
          <Icon name="restaurant" size={20} color={color.brand} />
          <Text style={styles.fieldLabel}>만든 음식을 얼마나 먹었나요?</Text>
        </View>
        <Text style={styles.fieldSubTight}>완성한 음식 전체 기준이에요</Text>
        <PctSegment value={food} onChange={setFood} style={styles.foodSeg} />

        {/* 재료별 소진율 */}
        <View style={[styles.fieldHeader, styles.fieldHeaderGap]}>
          <Icon name="shopping-basket" size={20} color={color.brand} />
          <Text style={styles.fieldLabel}>내가 가져온 재료, 얼마나 썼나요?</Text>
        </View>
        <Text style={styles.fieldSub}>재료별로 실제 사용한 비율을 골라주세요</Text>
        <View style={styles.ingRows}>
          {broughtNames.map((name) => (
            <View key={name}>
              <Text style={styles.ingName}>{name}</Text>
              <PctSegment
                value={ing[name] ?? null}
                onChange={(v) => setIng((prev) => ({ ...prev, [name]: v }))}
              />
            </View>
          ))}
        </View>

        <Pressable
          onPress={submit}
          disabled={!canSubmit}
          style={[styles.submit, canSubmit ? styles.submitActive : styles.submitIdle]}
        >
          <Text
            style={[styles.submitText, canSubmit ? styles.submitTextActive : styles.submitTextIdle]}
          >
            평가 완료
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

type PhotoTileProps = {
  filled: boolean;
  onPress: () => void;
  placeholder: string;
  hint?: string;
  dim?: boolean;
};

function PhotoTile({ filled, onPress, placeholder, hint, dim }: PhotoTileProps) {
  if (filled) {
    return (
      <Pressable onPress={onPress} style={styles.photoFilled}>
        <Image
          source={COOK_HERO}
          style={[styles.photoImg, dim && styles.photoImgDim]}
          resizeMode="cover"
        />
        <LinearGradient
          colors={gradient.photoScrim}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.photoOverlay}
        >
          <Icon name="check-circle" size={18} color={color.white} />
          <Text style={styles.photoOverlayText}>첨부됨 · 탭하면 다시 선택</Text>
        </LinearGradient>
      </Pressable>
    );
  }
  return (
    <Pressable onPress={onPress} style={styles.photoDashed}>
      <View style={styles.photoDashedIcon}>
        <Icon name="add-a-photo" size={28} color={color.uploadIcon} />
      </View>
      <Text style={styles.photoDashedText}>{placeholder}</Text>
      {hint ? <Text style={styles.photoDashedHint}>{hint}</Text> : null}
    </Pressable>
  );
}

type PctSegmentProps = {
  value: number | null;
  onChange: (value: number) => void;
  style?: StyleProp<ViewStyle>;
};

function PctSegment({ value, onChange, style }: PctSegmentProps) {
  return (
    <View style={[styles.segRow, style]}>
      {EVAL_OPTS.map((opt) => {
        const selected = value === opt;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={[styles.segBtn, selected ? styles.segBtnSel : styles.segBtnIdle]}
          >
            <Text style={[styles.segLabel, selected ? styles.segLabelSel : styles.segLabelIdle]}>
              {opt}%
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.appBg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.x2,
    paddingTop: space.xs,
    paddingBottom: space.lg,
  },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    fontSize: font.size.body,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  headerSpacer: { width: 38 },
  scroll: { paddingHorizontal: space.x8, paddingBottom: space.x12 },

  title: {
    fontSize: 21,
    fontFamily: font.family.bold,
    color: color.ink,
    lineHeight: 21 * 1.32,
    letterSpacing: font.tracking.tightH,
    marginTop: space.sm,
    marginBottom: space.sm,
  },
  subtitle: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.textMute,
    letterSpacing: font.tracking.snug,
    lineHeight: font.size.cap * font.lineHeight.relaxed,
    marginBottom: space.x8,
  },

  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm + 1,
    marginBottom: space.xs,
  },
  fieldHeaderGap: { marginTop: space.x12 },
  fieldLabel: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  countPill: {
    backgroundColor: color.redBgSoft3,
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: radius.chip,
  },
  countPillText: {
    fontSize: font.size.micro2,
    fontFamily: font.family.bold,
    color: color.brand,
    letterSpacing: font.tracking.snug,
  },
  fieldSub: {
    fontSize: font.size.micro,
    fontFamily: font.family.semibold,
    color: color.textFaint,
    letterSpacing: font.tracking.snug,
    marginBottom: space.x2,
  },
  fieldSubTight: {
    fontSize: font.size.micro,
    fontFamily: font.family.semibold,
    color: color.textFaint,
    letterSpacing: font.tracking.snug,
    marginBottom: space.x2,
  },

  photoLabel: {
    fontSize: font.size.cap,
    fontFamily: font.family.bold,
    color: color.ink2,
    letterSpacing: font.tracking.snug,
    marginBottom: space.md,
  },
  photoDashed: {
    height: 178,
    backgroundColor: color.uploadTileBg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: color.uploadTileBorder,
    borderRadius: radius.card2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm + 3,
    marginBottom: space.x9,
  },
  photoDashedIcon: {
    width: 54,
    height: 54,
    borderRadius: radius.pill,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoDashedText: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.textMute,
    letterSpacing: font.tracking.snug,
  },
  photoDashedHint: {
    fontSize: font.size.micro2,
    fontFamily: font.family.medium,
    color: color.uploadIcon,
    letterSpacing: font.tracking.snug,
  },
  photoFilled: {
    height: 178,
    borderRadius: radius.card2,
    overflow: 'hidden',
    marginBottom: space.x9,
  },
  photoImg: { width: '100%', height: '100%' },
  photoImgDim: { opacity: 0.94 },
  photoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.x2,
    paddingHorizontal: space.x4,
  },
  photoOverlayText: {
    fontSize: font.size.micro,
    fontFamily: font.family.semibold,
    color: color.white,
    letterSpacing: font.tracking.snug,
  },

  segRow: { flexDirection: 'row', gap: 7 },
  foodSeg: { marginBottom: space.x12 },
  segBtn: {
    flex: 1,
    borderRadius: radius.lg,
    paddingVertical: space.x3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  segBtnSel: { backgroundColor: color.brand, borderColor: color.brand },
  segBtnIdle: { backgroundColor: color.white, borderColor: color.segIdleBorder },
  segLabel: {
    fontSize: font.size.smx,
    fontFamily: font.family.bold,
    letterSpacing: font.tracking.snug,
  },
  segLabelSel: { color: color.white },
  segLabelIdle: { color: color.textMute },

  ingRows: { gap: space.x7, marginBottom: 30 },
  ingName: {
    fontSize: font.size.sm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
    marginBottom: space.sm + 3,
  },

  submit: { borderRadius: radius.x3, paddingVertical: space.x6, alignItems: 'center' },
  submitActive: { backgroundColor: color.brand, ...shadow.brandBtn },
  submitIdle: { backgroundColor: color.disabledBg },
  submitText: {
    fontSize: font.size.lg,
    fontFamily: font.family.bold,
    letterSpacing: font.tracking.snug,
  },
  submitTextActive: { color: color.white },
  submitTextIdle: { color: color.disabledText },
});
