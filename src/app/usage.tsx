/**
 * 사용량 기록 화면 (PRD §3.6).
 * 통합 식재료 목록 → 조리 사진·잔반 사진 업로드 → 완식률·소진율 입력 → 제출.
 * 식재료 표시: useAggIngredients(sharedIngredientPool).
 * 제출 payload: checklist myIngredients(sessionIngredientId 포함) + 사진 URL.
 * 업로드: POST /api/v1/uploads, 제출: POST /api/v1/sessions/{slotId}/consumption-records.
 */
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { useAggIngredients } from '@/hooks/useAggIngredients';
import { usePastEval } from '@/hooks/usePastEval';
import { useSettlement } from '@/hooks/useSettlement';
import { tokenStorage } from '@/lib';
import { color, font, radius, shadow, space } from '@/theme/theme';
import type { ImageUploadResponse } from '@/types';

type UploadPurpose = 'COOKED_PHOTO' | 'AFTER_PHOTO';

async function pickAndUploadPhoto(purpose: UploadPurpose): Promise<string | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.8,
  });
  if (result.canceled) return null;

  const asset = result.assets[0];
  const fileResp = await fetch(asset.uri);
  const blob = await fileResp.blob();

  const formData = new FormData();
  formData.append('file', blob, 'photo.jpg');

  const token = await tokenStorage.get();
  const base = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
  const res = await fetch(`${base}/api/v1/uploads?purpose=${purpose}`, {
    method: 'POST',
    headers: token !== null ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });
  if (!res.ok) throw new Error('사진 업로드에 실패했어요.');

  const data: ImageUploadResponse = await res.json();
  return data.fileUrl;
}

const RATE_OPTS = [0, 25, 50, 75, 100] as const;

export default function UsageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { slotId: slotParam } = useLocalSearchParams<{ slotId?: string }>();
  const slotId = Number(slotParam ?? '0');

  const { data: aggList } = useAggIngredients(slotId);
  const { data: checklist } = useSettlement(slotId);
  const myIngredients = checklist?.myIngredients ?? [];
  const { markEvaluated, submitting, submitError } = usePastEval();

  const [cookedPhotoUrl, setCookedPhotoUrl] = useState<string | null>(null);
  const [afterPhotoUrl, setAfterPhotoUrl] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [food, setFood] = useState<number | null>(null);
  const [ing, setIng] = useState<Record<number, number>>({});

  async function handleUpload(purpose: UploadPurpose) {
    setPhotoUploading(true);
    try {
      const url = await pickAndUploadPhoto(purpose);
      if (purpose === 'COOKED_PHOTO') setCookedPhotoUrl(url);
      else setAfterPhotoUrl(url);
    } finally {
      setPhotoUploading(false);
    }
  }

  const canSubmit =
    cookedPhotoUrl !== null &&
    afterPhotoUrl !== null &&
    food !== null &&
    (myIngredients.length === 0 ||
      myIngredients.every((item) => ing[item.sessionIngredientId] != null));

  async function handleSubmit() {
    if (!canSubmit || food === null) return;
    await markEvaluated(slotId, {
      finishedFoodRate: food,
      cookedPhotoUrl: cookedPhotoUrl!,
      afterPhotoUrl: afterPhotoUrl!,
      items: myIngredients.map((item) => ({
        sessionIngredientId: item.sessionIngredientId,
        useRate: ing[item.sessionIngredientId] ?? 0,
      })),
    });
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
          <Icon name="arrow-back-ios" size={20} color={color.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>사용량 기록</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 통합 식재료 현황 */}
        <View style={styles.infoBanner}>
          <Icon name="eco" size={18} color={color.ecoText} />
          <Text style={styles.infoBannerText}>
            {(aggList ?? []).length}종 통합 재료 · 실제 사용량을 기록해요
          </Text>
        </View>

        {(aggList ?? []).map((item, i) => (
          <View key={item.name + i} style={styles.ingredientRow}>
            <Text style={styles.ingredientName}>{item.name}</Text>
            <Text style={styles.ingredientQty}>{item.qty}</Text>
          </View>
        ))}

        {/* 사진 업로드 */}
        <Text style={[styles.fieldLabel, styles.fieldGap]}>조리 사진</Text>
        <PhotoSlot
          url={cookedPhotoUrl}
          uploading={photoUploading}
          onPress={() => handleUpload('COOKED_PHOTO')}
          hint="요리 완성 후 찍어주세요"
        />

        <Text style={styles.fieldLabel}>잔반 사진</Text>
        <PhotoSlot
          url={afterPhotoUrl}
          uploading={photoUploading}
          onPress={() => handleUpload('AFTER_PHOTO')}
          hint="식사 후 남은 음식을 찍어주세요"
        />

        {/* 완식률 */}
        <Text style={[styles.fieldLabel, styles.fieldGap]}>완식률</Text>
        <Text style={styles.fieldSub}>음식을 얼마나 먹었나요?</Text>
        <View style={styles.segRow}>
          {RATE_OPTS.map((opt) => {
            const sel = food === opt;
            return (
              <Pressable
                key={opt}
                style={[styles.segBtn, sel ? styles.segBtnSel : styles.segBtnIdle]}
                onPress={() => setFood(opt)}
              >
                <Text style={[styles.segLabel, sel ? styles.segLabelSel : styles.segLabelIdle]}>
                  {opt}%
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 재료별 소진율 */}
        {myIngredients.length > 0 && (
          <>
            <Text style={[styles.fieldLabel, styles.fieldGap]}>재료별 소진율</Text>
            <Text style={styles.fieldSub}>내가 가져온 재료가 얼마나 사용됐나요?</Text>
            {myIngredients.map((item) => (
              <View key={item.sessionIngredientId} style={styles.ingBlock}>
                <Text style={styles.ingName}>{item.nameKo}</Text>
                <View style={styles.segRow}>
                  {RATE_OPTS.map((opt) => {
                    const sel = ing[item.sessionIngredientId] === opt;
                    return (
                      <Pressable
                        key={opt}
                        style={[styles.segBtn, sel ? styles.segBtnSel : styles.segBtnIdle]}
                        onPress={() =>
                          setIng((prev) => ({ ...prev, [item.sessionIngredientId]: opt }))
                        }
                      >
                        <Text
                          style={[styles.segLabel, sel ? styles.segLabelSel : styles.segLabelIdle]}
                        >
                          {opt}%
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </>
        )}

        {!!submitError && <Text style={styles.submitError}>{submitError}</Text>}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + space.x2 }]}>
        <Pressable
          style={[styles.submitBtn, canSubmit ? styles.submitActive : styles.submitIdle]}
          onPress={handleSubmit}
          disabled={!canSubmit || submitting}
        >
          <Text
            style={[styles.submitText, canSubmit ? styles.submitTextActive : styles.submitTextIdle]}
          >
            {submitting ? '제출 중…' : '조리 완료 처리하기'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

interface PhotoSlotProps {
  url: string | null;
  uploading: boolean;
  onPress: () => void;
  hint: string;
}

function PhotoSlot({ url, uploading, onPress, hint }: PhotoSlotProps) {
  return (
    <Pressable style={styles.photoDashed} onPress={onPress} disabled={uploading}>
      {url !== null ? (
        <Image source={{ uri: url }} style={styles.photoImg} resizeMode="cover" />
      ) : (
        <>
          <View style={styles.photoDashedIcon}>
            <Icon name="camera-alt" size={26} color={color.uploadIcon} />
          </View>
          <Text style={styles.photoDashedText}>{uploading ? '업로드 중…' : '사진 선택'}</Text>
          <Text style={styles.photoDashedHint}>{hint}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.appBg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.screenX,
    paddingTop: space.sm,
    paddingBottom: space.x2,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    fontSize: font.size.title,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.tight,
  },
  headerSpacer: { width: 36 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: space.screenX },

  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: color.ecoBgSoft2,
    borderWidth: 1,
    borderColor: color.ecoBorder,
    borderRadius: radius.lg,
    padding: space.x2,
    marginTop: space.x4,
    marginBottom: space.x4,
  },
  infoBannerText: {
    flex: 1,
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.ecoDeep,
    letterSpacing: font.tracking.snug,
  },

  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.x2,
    borderBottomWidth: 1,
    borderBottomColor: color.hair,
  },
  ingredientName: {
    flex: 1,
    fontSize: font.size.bodySm,
    fontFamily: font.family.semibold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
  },
  ingredientQty: {
    fontSize: font.size.sm,
    fontFamily: font.family.bold,
    color: color.ink3,
  },

  fieldLabel: {
    fontSize: font.size.bodySm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
    marginBottom: space.xs,
  },
  fieldGap: { marginTop: space.x8 },
  fieldSub: {
    fontSize: font.size.micro,
    fontFamily: font.family.semibold,
    color: color.textFaint,
    letterSpacing: font.tracking.snug,
    marginBottom: space.x2,
  },

  photoDashed: {
    height: 160,
    backgroundColor: color.uploadTileBg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: color.uploadTileBorder,
    borderRadius: radius.card2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    marginBottom: space.x6,
    overflow: 'hidden',
  },
  photoDashedIcon: {
    width: 50,
    height: 50,
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
  photoImg: { width: '100%', height: '100%' },

  segRow: { flexDirection: 'row', gap: space.sm, marginBottom: space.x4 },
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

  ingBlock: { marginBottom: space.x6 },
  ingName: {
    fontSize: font.size.sm,
    fontFamily: font.family.bold,
    color: color.ink,
    letterSpacing: font.tracking.snug,
    marginBottom: space.x2,
  },

  submitError: {
    fontSize: font.size.cap,
    fontFamily: font.family.semibold,
    color: color.brand,
    letterSpacing: font.tracking.snug,
    marginBottom: space.x3,
    textAlign: 'center',
  },

  footer: {
    paddingHorizontal: space.screenX,
    paddingTop: space.x2,
    borderTopWidth: 1,
    borderTopColor: color.hair,
    backgroundColor: color.appBg,
  },
  submitBtn: {
    borderRadius: radius.x3,
    paddingVertical: space.x5,
    alignItems: 'center',
  },
  submitActive: { backgroundColor: color.eco, ...shadow.brandBtn },
  submitIdle: { backgroundColor: color.disabledBg },
  submitText: {
    fontSize: font.size.lg,
    fontFamily: font.family.bold,
    letterSpacing: font.tracking.snug,
  },
  submitTextActive: { color: color.white },
  submitTextIdle: { color: color.disabledText },
});
