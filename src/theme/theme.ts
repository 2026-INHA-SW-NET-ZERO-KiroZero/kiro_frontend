/**
 * KiroZero — React Native (Expo) Design Token Sheet
 * ---------------------------------------------------
 * 1:1 extraction from the HTML design prototype (KiroZero.dc.html).
 * Drop this in as `src/theme/theme.ts` and consume via a ThemeProvider or direct import.
 *
 * Web → RN conversion notes are inline. RN has NO box-shadow / gradient / conic-gradient:
 *   - shadows      → use the `shadow.*` objects (iOS shadowColor/Offset/Opacity/Radius + Android elevation)
 *   - gradients    → use `expo-linear-gradient` <LinearGradient colors={gradient.brand} .../>
 *   - conic rings  → use `react-native-svg` <Circle> with strokeDasharray, OR a donut lib
 *   - letterSpacing → RN accepts a NUMBER in px (use the values below as-is)
 */

export const color = {
  // ---- Brand (primary RED) ----
  brand: '#FF443D', // primary actions, active tab, FAB, selected states
  brandPress: '#E12E27', // gradient end / pressed
  brandStrong: '#D6342D', // strong red text on light bg
  brandAlt: '#E5484D', // alert red (deadline text, badges)
  brandHi: '#FF5E49', // report donut inner
  brandWarm: '#FF7A52', // gradient end (MY / report hero)

  // ---- Eco / GREEN (carbon, leaves, low-carbon menu) ----
  eco: '#2F9E8B',
  ecoText: '#1F8676', // eco labels, refund numbers
  ecoDeep: '#1B7A66', // success banners text
  ecoSlab: '#1E8C78', // past-meeting carbon result card bg
  ecoBright: '#36BA9A',
  ecoBgSoft: '#E4F4F0', // green chip bg
  ecoBgSoft2: '#E9F5EF', // green info banner bg
  ecoBorder: '#CDE8DE',
  ecoTint: '#BBE7DD',

  // ---- Accent ----
  blue: '#3B7DE0', // Saturday / calendar
  blueAlt: '#4A7DE0',
  purple: '#7C6FF0', // "나"(me) marker, role dots
  pink: '#E5689E', // participant avatar identity color
  leaf: '#6BA84F', // participant avatar identity color
  gold: '#C0801E', // 중급 skill, purchase, amber text
  goldSoft: '#E59A2E',
  amberBgSoft: '#FFF3E0', // amber/cream chip bg
  amberBg2: '#FBEFD9',

  // ---- Text ----
  ink: '#1E1A17', // primary text / headings
  ink2: '#3D362F',
  ink3: '#5C5048',
  ink4: '#6F665E',
  textMute: '#8C837B', // secondary text
  textFaint: '#A89F95', // tertiary / labels
  textFaint2: '#B0A89E',
  textFaint3: '#B5ADA4',
  placeholder: '#CABFB4', // input placeholder
  iconFaint: '#CFC5BA', // chevrons, delete icons

  // ---- Surfaces ----
  appBg: '#FBF7F3', // screen background
  appBgInput: '#FBF8F4', // input fill on light
  outerBg: '#E7E0D8', // body behind phone
  sectionGap: '#EFE7DE', // 8px divider slabs between sections
  white: '#FFFFFF',
  bezel: '#16110D', // phone frame / home indicator

  // ---- On-brand (빨강 그라데이션 hero 위 텍스트/표면) ----
  onBrand: '#FFD9D0', // hero 라벨·소진율 캡션 (예: '음식물 절감', '소진율')
  onBrandDim: '#FFCFC4', // hero 부가 설명 텍스트
  onBrandTrack: 'rgba(255,255,255,0.28)', // 소진율 링 트랙(미채움)
  onBrandPill: 'rgba(255,255,255,0.18)', // hero 내 '리포트 보기' pill 배경

  // ---- MY / editProfile 보조 ----
  neutralBtnBg: '#F2ECE4', // 중성 버튼 배경('프로필 수정')
  chipReadBg: '#F6F1EB', // 읽기 전용 알레르기 칩 배경(MY)
  listInk: '#2E2823', // 활동 리스트 항목 텍스트
  appBgFade: 'rgba(251,247,243,0)', // sticky 버튼 상단 페이드(appBg 투명)

  // ---- State ----
  disabledBg: '#EFEAE4', // 비활성 버튼 배경
  disabledText: '#B8AFA4', // 비활성 버튼 텍스트
  scrim: 'rgba(20,12,6,0.42)', // bottom-sheet backdrop

  // ---- Borders & hairlines ----
  border: '#F1EAE2', // default card border
  borderInput: '#ECE5DD', // input border
  borderInput2: '#EAE3DB',
  brandOutlineBorder: '#F2D7CC', // outline 버튼 테두리
  grabber: '#E7DFD5', // bottom-sheet grabber
  hair: '#F7F2EC', // list row separators
  hair2: '#F4EEE7',
  hair3: '#F5EFE8',

  // ---- Status chip backgrounds ----
  redBgSoft: '#FDEEE8', // red chip bg ("정원 마감", recruiting)
  redBgSoft2: '#FDEBEC', // allergy chip bg
  redBgSoft3: '#FFE9E7',
  greyChipBg: '#F1EAE2', // "마감", neutral chip bg
} as const;

/** Gradients — feed arrays straight into expo-linear-gradient `colors`. Default start/end = diagonal. */
export const gradient = {
  brand: ['#FF443D', '#E12E27'], // settlement hero (120deg)
  brandWarm: ['#FF443D', '#FF7A52'], // MY card / report hero (120deg)
  cream: ['#FFF3E0', '#FDEEE8'], // chosen-menu / decided-menu cards (105–110deg)
  creamBd: '#F6DFC9', // border that pairs with `cream`
} as const;

/**
 * 참여자 아바타 식별 색 팔레트 — 디자인 원본(KiroZero.dc.html `colors[]`)의 8색.
 * 더미데이터 시드(`src/data/`)가 참여자별 색을 이 팔레트에서 가져온다.
 */
export const avatarPalette = [
  color.brand, // #FF443D
  color.eco, // #2F9E8B
  color.goldSoft, // #E59A2E
  color.blueAlt, // #4A7DE0
  color.pink, // #E5689E
  color.purple, // #7C6FF0
  color.leaf, // #6BA84F
  color.gold, // #C0801E
] as const;

/** Type scale (px). RN: pass fontSize as number. Font = Pretendard. */
export const font = {
  /**
   * Pretendard family names registered with expo-font (see `src/app/_layout.tsx`).
   * RN can't pick a custom-font cut via `fontWeight`, so each weight is a distinct
   * family — consume with `fontFamily: font.family.bold` (NOT `fontWeight`).
   * Keys mirror `weight` below: medium→600, semibold→700, bold→800.
   */
  family: {
    medium: 'Pretendard-SemiBold', // 600
    semibold: 'Pretendard-Bold', // 700
    bold: 'Pretendard-ExtraBold', // 800
  } as const,
  // numeric weights (reference). Prefer `family.*` for actual rendering.
  weight: { medium: '600', semibold: '700', bold: '800' } as const,
  size: {
    display: 33, // login wordmark
    h1: 25, // MY name, room-detail title
    h2: 23, // page titles (내 냉장고/리포트/MY)
    h3: 22, // section hero numerics, app titles
    h4: 20, // room time, big numbers
    h5: 19,
    title: 18, // section headers (모임 정보)
    lg: 17,
    body: 16, // primary buttons, card titles
    bodySm: 15, // inputs, list titles
    md: 14.5,
    sm: 14,
    smx: 13.5,
    cap: 13, // captions
    capSm: 12.5,
    micro: 12,
    micro2: 11.5,
    tiny: 11, // badges
    tiny2: 10.5,
  },
  // letterSpacing is NEGATIVE throughout (tight). RN takes px numbers.
  tracking: { tightest: -1.6, tighter: -1.0, tightH: -0.6, tight: -0.4, snug: -0.3, base: -0.2 },
  lineHeight: { tight: 1.3, snug: 1.4, base: 1.45, relaxed: 1.5 },
} as const;

/** Spacing scale (px) — observed paddings/margins/gaps. */
export const space = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 11,
  x2: 12,
  x3: 13,
  x4: 14,
  x5: 15,
  x6: 16,
  x7: 18,
  x8: 20,
  x9: 22,
  x10: 24,
  x11: 26,
  x12: 28,
  screenX: 20, // standard horizontal screen padding
} as const;

/** Border radius (px). */
export const radius = {
  chip: 7,
  chip2: 8,
  sm: 9,
  md: 11,
  lg: 12,
  xl: 13,
  x2: 14,
  x3: 15,
  card: 16,
  card2: 18,
  x4: 20,
  x5: 22,
  sheet: 28, // bottom-sheet top corners
  pill: 999,
  phone: 54,
} as const;

/**
 * Shadows — RN cross-platform. Spread into a View style.
 * Web reference values are in comments.
 */
export const shadow = {
  // 0 6px 18px -12px rgba(60,40,20,.22)
  card: {
    shadowColor: '#3C2814',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 9,
    elevation: 3,
  },
  // 0 14px 26px -10px rgba(255,68,61,.55-.6) — primary red buttons / FAB
  brandBtn: {
    shadowColor: '#FF443D',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  // 0 16px 30px -16px rgba(...) — hero gradient cards (settlement/report/carbon)
  hero: {
    shadowColor: '#321E0C',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  // 0 9px 18px -7px rgba(255,68,61,.55) — home date strip selected tile
  dateTile: {
    shadowColor: '#FF443D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 9,
    elevation: 5,
  },
  // 0 18px 44px -12px rgba(0,0,0,.34) — notification dropdown popover
  popover: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 14,
  },
} as const;

/** Status → chip color map (badges across home/room cards). */
export const statusChip = {
  open: { fg: '#1F8676', bg: color.ecoBgSoft, label: '모집중' },
  seatsLeft: { fg: '#D6342D', bg: color.redBgSoft }, // "N자리 남음"
  almostFull: { fg: '#E5484D', bg: color.redBgSoft2, label: '마감임박' }, // left<=1
  full: { fg: '#8C837B', bg: color.greyChipBg, label: '마감' }, // left<=0 (disabled CTA)
  confirmed: { fg: '#D6342D', bg: color.redBgSoft, label: '정원 마감 · 통합 완료' },
  cooked: { fg: '#6F665E', bg: color.greyChipBg, label: '조리 완료' },
  canceled: { fg: '#8C837B', bg: color.greyChipBg, label: '인원 미달 · 모집 취소' },
} as const;

/**
 * 홈 날짜 스트립 타일 색 (dc.html 홈 line 156~178).
 * 선택일(금)은 brand 채움 타일, 토=파랑·일=빨강 계열, 평일=ink.
 * 요일 라벨의 연한 틴트 색은 프로토타입 고유 값이라 별도 토큰으로 보관한다.
 */
export const calendarTile = {
  todayBg: color.brand, // #FF443D 선택일 채움
  todayNum: color.white,
  todayWeekday: '#FFDFD2', // 선택일 요일(연빨강)
  satNum: color.blue, // #3B7DE0
  satWeekday: '#9FB6DE', // 토요일 요일(연파랑)
  sunNum: color.brandAlt, // #E5484D
  sunWeekday: '#E7A6A8', // 일요일 요일(연빨강)
  weekdayNum: color.ink2, // #3D362F
  weekdayWeekday: color.textFaint3, // #B5ADA4 평일 요일
} as const;

/**
 * 신청 내역(myApplication) 투표/결과 단계 전용 색 (dc.html `myApplication`).
 * 핸드오프에 등장하나 `color`에 없던 값들 — 하드코딩 대신 여기 모아 토큰화한다.
 */
export const applicationStage = {
  votingBannerText: '#B53A2A', // voting 빨강 배너 본문 텍스트
  eSelBg: '#FBEFE9', // E(재추천) 옵션 선택 시 카드 배경
  eRingIdle: '#D8CFC6', // E 옵션 미선택 라디오 링
  reasonBorder: '#F4D7C9', // 재추천 사유 입력 박스 테두리
  voteBtnDisabled: '#E7C9B6', // 투표 CTA 비활성 배경
  decidedVotes: '#B5764A', // result 결정 메뉴 득표·조리 라인 텍스트
  roleDotIdle: '#C9BFB4', // 역할 분배 카드 '나' 외 참여자 아바타 점
} as const;

/** Skill (요리 실력/숙련도) → chip color. */
export const skillChip = {
  상: { fg: '#1F8676', bg: color.ecoBgSoft },
  중: { fg: '#C0801E', bg: color.amberBgSoft },
  하: { fg: '#8C837B', bg: color.greyChipBg },
} as const;

/**
 * Icons — the design uses "Material Symbols Rounded" (FILL toggled 0/1).
 * In Expo use @expo/vector-icons `MaterialIcons` (closest) or load the
 * Material Symbols variable font. Glyph names referenced by the design:
 *   home, calendar_month, eco, mood (tab bar)
 *   search, notifications, location_on, person, group, schedule, restaurant,
 *   star, wc, checkroom, groups, chevron_right/left, arrow_back_ios_new,
 *   check, check_circle, error, add, add_a_photo, photo_camera, delete,
 *   how_to_vote, replay, restaurant_menu, rate_review, task_alt, savings,
 *   shopping_cart, shopping_basket, payments, directions_car, volunteer_activism,
 *   hourglass_top, event_busy, info, close, visibility, favorite, calendar_today
 * Emoji are used as data (ingredients 🧅🥚🥬, leaves 🍃, low-carbon 🌱) — keep as text.
 */
export const theme = {
  color,
  gradient,
  font,
  space,
  radius,
  shadow,
  statusChip,
  skillChip,
} as const;
export type Theme = typeof theme;
export default theme;
