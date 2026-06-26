# DESIGN.md — 디자인 시스템 가이드

> 이 문서의 역할: KiroZero의 디자인 토큰과 스타일 규칙. 단일 출처는 `src/theme/theme.ts`이며, 이 문서는 그 사용 규칙을 설명한다.
> 토큰은 HTML 프로토타입(`KiroZero.dc.html`)에서 1:1 추출됐다. **라이트 모드 전용.**

## 1. 색상 토큰 (`color`)

- **브랜드(빨강):** `brand #FF443D`(주요 액션·활성 탭·FAB·선택), `brandPress #E12E27`, `brandAlt #E5484D`(경고/마감).
- **에코(초록):** `eco #2F9E8B`, `ecoText #1F8676`(라벨·환급 숫자), `ecoSlab #1E8C78`(탄소 결과 카드), `ecoBright #36BA9A`(유효 이메일).
- **액센트:** `purple #7C6FF0`("나" 마커), `indigo #5B5BD6`(관리자 테마), `gold #C0801E`(중급·구매·앰버), `blue #3B7DE0`(토요일/캘린더).
- **텍스트:** `ink #1E1A17`(주), `textMute #8C837B`(보조), `textFaint #A89F95`(라벨), `placeholder #CABFB4`.
- **표면:** `appBg #FBF7F3`(화면 배경), `white`(카드), `sectionGap #EFE7DE`(8px 구분 슬랩).
- **테두리:** `border #F1EAE2`(카드), `borderInput #ECE5DD`(입력).
- **비활성:** 배경 `#EFEAE4` / 텍스트 `#B8AFA4`(`greyChipBg`/`textFaint2` 계열).

## 2. 그라데이션 (`gradient`) — `expo-linear-gradient`로만

- `brand`(정산 hero), `brandWarm`(MY/리포트 hero), `admin`(관리자 KPI), `cream`(확정 메뉴 카드), `warmChip`(냉장고 임박 배너).
- **장식용 배경 그라데이션 금지.** hero/stat 카드에만 사용(PRD §1 "No AI-slop").

## 3. 타이포 (`font`) — Pretendard

- weight: `medium 600` / `semibold 700` / `bold 800`. **600 미만 사용 안 함.**
- size: `display 33`(로그인 워드마크), `h1 25`(이름·방 제목), `h2 23`(페이지 제목), `title 18`(섹션), `body 16`(버튼·카드), `sm 14`, `cap 13`, `tiny 11`(배지).
- **letterSpacing(tracking)은 전부 음수**(타이트). 제목/버튼은 weight 800.
- 폰트는 `expo-font`로 로드(Pretendard 400–800). 아이콘은 Material Symbols Rounded / `@expo/vector-icons` MaterialIcons.

## 4. 간격·라운딩·그림자

- **간격(`space`):** 화면 좌우 패딩 `screenX 20`. 4~28px 스케일. 매직넘버 대신 토큰.
- **라운딩(`radius`):** 카드 16–20, 바텀시트 28(상단만), pill 999, chip 7–8.
- **그림자(`shadow`):** RN 크로스플랫폼 객체. `card`(기본), `brandBtn`(빨강 버튼/FAB), `hero`(그라데이션 카드), `popover`(알림 드롭다운). `box-shadow` 금지.

## 5. 컴포넌트 스타일 규칙

- **상태 배지:** `statusChip` 맵 사용(open/seatsLeft/almostFull/full/confirmed/cooked/canceled).
- **숙련도 칩:** `skillChip` 맵(상=초록 / 중=앰버 / 하=회색).
- **입력:** 흰 배경, 1.5px `borderInput`, radius 14, 포커스 시 테두리 `brand`. placeholder 색 `placeholder`.
- **카드:** 흰 배경, 1px `border`, `shadow.card`, radius 16–20.
- **링/도넛 진행률:** `react-native-svg`(conic-gradient 대체).

## 6. 이모지·아이콘

- 이모지는 **데이터일 때만**(재료 🧅🥚, 나뭇잎 🍃, 저탄소 🌱). 장식 이모지 금지.
- 아이콘 글리프 목록은 `theme.ts` 하단 주석 참조.

## 7. 모션 (PRD §6)

- 화면 전환: native-stack 기본 push(또는 0.26s slide). 바텀시트: slide-up 0.32s + dim fade. 알림 드롭다운: scale/opacity pop 0.2s.
- 비활성 버튼은 회색으로 보이고 no-op(숨기지 않음).

## 8. 금지 (드리프트 방지)

- 하드코딩 색/간격/라운딩 → 토큰. 장식 그라데이션·랜덤 이모지 → 금지. 폰 베젤/상태바 재현 → 금지(SafeAreaView).
