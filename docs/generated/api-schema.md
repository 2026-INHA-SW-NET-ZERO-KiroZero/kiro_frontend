# API 스키마 (백엔드 Swagger 기준)

> 이 파일은 **백엔드 Swagger(OpenAPI) 스냅샷에서 추출**한 뒤 **백엔드 소스(`com.kirozero.netzero`)와 직접 대조**한 명세다. 연동 시 대조 기준(`docs/API-INTEGRATION.md` 2단계).
> 추측으로 수정 금지 — Swagger가 바뀌면 스냅샷(`docs/references/backend-swagger.json`)을 다시 받아 이 파일을 재생성한다.

**백엔드 Swagger**: https://umc-lxd.shop/swagger-ui/index.html (OpenAPI JSON: https://umc-lxd.shop/v3/api-docs)
**서버 주소**: https://umc-lxd.shop/ (앱은 `.env.local`의 `EXPO_PUBLIC_API_BASE_URL`로 주입)
**스냅샷**: `docs/references/backend-swagger.json` — `KiroZero Backend API` v1.0.0 ("냉장고 반상회 MVP 백엔드 API 문서")
**스냅샷 확인일**: 2026-06-27 — 엔드포인트 **24개** 정의됨(이전 22개에서 `my-session-controller`의 `GET /me/sessions`·`GET /me/sessions/{slotId}` 2개 추가).
**소스 대조일**: 2026-06-27 — 백엔드 컨트롤러·DTO 전수(`com.kirozero.netzero.domain.*`)와 1:1 대조해 24개 엔드포인트·모든 DTO 필드 일치 확인. 코드에서만 드러나는 enum 고정값·검증 제약·기본값을 아래에 보강.
**최근 갱신(2026-06-27, 백엔드 `f4e4fce` 기준)**: 엔드포인트 수·경로는 동일(24개). DTO 필드만 확장됨 — ① `CurrentUserResponse`·`AuthResponse`에 `cash`(int, 누적 환불 적립금) 추가, ② `MyResultTotalResponse`가 월별 추이·참여/재료 stat·전월 대비·인사이트 문구·`monthlyResults`까지 포함하도록 대폭 확장, ③ 신규 `MonthlyResultSummaryResponse`(월별 요약) 추가. 스냅샷(`backend-swagger.json`)·라이브와 일치 확인.
**경로 접두사**: 모든 엔드포인트 `/api/v1`.

## 인증

- 스킴: `bearerAuth` — HTTP Bearer, `bearerFormat: opaque-token`.
- `POST /api/v1/auth/login`(또는 `/signup`) 응답의 `token` 값을 이후 요청 `Authorization: Bearer <token>` 헤더로 전달.
- Swagger상 다수 엔드포인트의 `Authorization` 파라미터는 `required: false`로 노출되나, 보호 자원(`/me/*`, 참여·투표·기록·결과 등)은 실제로 토큰이 필요하다. 토큰 저장은 `src/lib/tokenStorage.ts` + `src/hooks/useAuth.ts` 참조.

## 엔드포인트 (24)

### auth-controller

| Method | Path                  | 설명         | 요청                 | 응답                  |
| ------ | --------------------- | ------------ | -------------------- | --------------------- |
| POST   | `/api/v1/auth/signup` | 회원가입     | `SignupRequest`      | `AuthResponse`        |
| POST   | `/api/v1/auth/login`  | 로그인       | `LoginRequest`       | `AuthResponse`        |
| GET    | `/api/v1/auth/me`     | 내 정보 조회 | `Authorization` 헤더 | `CurrentUserResponse` |

### profile-controller

| Method | Path                 | 설명                                  | 요청                   | 응답                  |
| ------ | -------------------- | ------------------------------------- | ---------------------- | --------------------- |
| PUT    | `/api/v1/me/profile` | 프로필(닉네임·요리실력·알레르기) 수정 | `UpdateProfileRequest` | `CurrentUserResponse` |

### allergy-tag-controller

| Method | Path                   | 설명               | 요청 | 응답                     |
| ------ | ---------------------- | ------------------ | ---- | ------------------------ |
| GET    | `/api/v1/allergy-tags` | 알레르기 태그 목록 | –    | `AllergyTagListResponse` |

### ingredient-controller

| Method | Path                  | 설명      | 요청            | 응답                       |
| ------ | --------------------- | --------- | --------------- | -------------------------- |
| GET    | `/api/v1/ingredients` | 재료 검색 | query `keyword` | `IngredientSearchResponse` |

### slot-controller (4인 방)

| Method | Path                          | 설명               | 요청                                                         | 응답                 |
| ------ | ----------------------------- | ------------------ | ------------------------------------------------------------ | -------------------- |
| GET    | `/api/v1/slots`               | 슬롯(방) 목록      | query `date`(date), `status`(OPEN\|MENU_PROPOSED\|COMPLETED) | `SlotListResponse`   |
| GET    | `/api/v1/slots/{slotId}`      | 슬롯 상세          | path `slotId`                                                | `SlotDetailResponse` |
| POST   | `/api/v1/slots/{slotId}/join` | 방 참여(재료 등록) | `JoinSlotRequest`                                            | `JoinSlotResponse`   |
| DELETE | `/api/v1/slots/{slotId}/join` | 방 나가기          | `Authorization` 헤더                                         | `LeaveSlotResponse`  |

### session-controller (조리 세션)

| Method | Path                                      | 설명                           | 요청                                    | 응답                               |
| ------ | ----------------------------------------- | ------------------------------ | --------------------------------------- | ---------------------------------- |
| GET    | `/api/v1/sessions/{slotId}`               | 세션 현황(참여자·공유 재료 풀) | path `slotId`                           | `SessionStatusResponse`            |
| PUT    | `/api/v1/sessions/{slotId}/ingredients`   | 내 등록 재료 수정              | `UpdateSessionIngredientsRequest`       | `UpdateSessionIngredientsResponse` |
| GET    | `/api/v1/sessions/{slotId}/cooking-guide` | 조리 가이드(단계별)            | path `slotId`, query `view`(기본 `all`) | `CookingGuideResponse`             |
| GET    | `/api/v1/sessions/{slotId}/checklist`     | 준비물 체크리스트              | path `slotId` + `Authorization`         | `SessionChecklistResponse`         |

### my-session-controller (내 모임 / 신청 내역)

| Method | Path                            | 설명                  | 요청                            | 응답                      |
| ------ | ------------------------------- | --------------------- | ------------------------------- | ------------------------- |
| GET    | `/api/v1/me/sessions`           | 내 모임/신청 세션 목록 | `Authorization` 헤더            | `MySessionListResponse`   |
| GET    | `/api/v1/me/sessions/{slotId}`  | 내 모임 세션 상세      | path `slotId` + `Authorization` | `MySessionDetailResponse` |

### recommendation-controller (AI 메뉴 추천)

| Method | Path                                               | 설명                  | 요청                            | 응답                           |
| ------ | -------------------------------------------------- | --------------------- | ------------------------------- | ------------------------------ |
| POST   | `/api/v1/sessions/{slotId}/recommendations`        | 메뉴 추천 요청        | `RecommendationRequest`         | `RecommendationResponse`       |
| GET    | `/api/v1/sessions/{slotId}/recommendations/latest` | 최신 추천 + 선택 메뉴 | path `slotId` + `Authorization` | `LatestRecommendationResponse` |

### menu-vote-controller (투표)

| Method | Path                              | 설명      | 요청              | 응답               |
| ------ | --------------------------------- | --------- | ----------------- | ------------------ |
| POST   | `/api/v1/sessions/{slotId}/votes` | 메뉴 투표 | `MenuVoteRequest` | `MenuVoteResponse` |

### consumption-result-controller (사용량·리포트)

| Method | Path                                            | 설명                      | 요청                             | 응답                              |
| ------ | ----------------------------------------------- | ------------------------- | -------------------------------- | --------------------------------- |
| POST   | `/api/v1/sessions/{slotId}/consumption-records` | 사용량 기록 생성(조리 후) = **모임 평가 제출**(완식률·사진·재료별 사용률) | `CreateConsumptionRecordRequest` | `CreateConsumptionRecordResponse` |
| GET    | `/api/v1/sessions/{slotId}/result`              | 세션 탄소 절감 리포트     | path `slotId` + `Authorization`  | `SessionResultResponse`           |
| GET    | `/api/v1/me/results/total`                      | 내 누적 리포트            | `Authorization` 헤더             | `MyResultTotalResponse`           |

### upload-controller

| Method | Path              | 설명          | 요청                                                                                       | 응답                  |
| ------ | ----------------- | ------------- | ------------------------------------------------------------------------------------------ | --------------------- |
| POST   | `/api/v1/uploads` | 이미지 업로드 | body `multipart`(`file` binary, 필수), query `purpose`(UploadPurpose, 선택·기본 `GENERAL`) | `ImageUploadResponse` |

### demo-seed-controller

| Method | Path                | 설명           | 요청 | 응답               |
| ------ | ------------------- | -------------- | ---- | ------------------ |
| POST   | `/api/v1/demo/seed` | 데모 시드 생성 | –    | `DemoSeedResponse` |

## 주요 스키마 (`*` = required)

> enum `Status`(=`SlotStatus`) = `OPEN` \| `MENU_PROPOSED` \| `COMPLETED`. enum `CookingSkill` = `HIGH` \| `MEDIUM` \| `LOW`. enum `VoteType` = `A`~`E`. enum `UploadPurpose` = `COOKED_PHOTO` \| `AFTER_PHOTO` \| `GENERAL`(기본).
> `allergyTags` 값은 다음 10종 `tag` 문자열만 허용(`AllergyTag` enum): `crustacean_shellfish`(갑각류) · `mollusk_shellfish`(패류/연체류) · `fish`(생선) · `egg`(계란) · `milk`(우유) · `soy`(대두) · `wheat`(밀) · `peanut`(땅콩) · `tree_nut`(견과류) · `sesame`(참깨). 라벨·설명은 `GET /api/v1/allergy-tags`로 조회.

### 인증·프로필

```
SignupRequest        { email*: string<email>, password*: string(min 8), nickname*: string, cookingSkill*: CookingSkill, allergyTags: string[] }
LoginRequest         { email*: string<email>, password*: string }
AuthResponse         { userId: long, email, nickname, cookingSkill: CookingSkill, cash: int, allergyTags: string[], token: string }
CurrentUserResponse  { userId: long, email, nickname, cookingSkill: CookingSkill, cash: int, allergyTags: string[] }
# cash = 누적 환불 적립금(원). 가입 시 0, 사용량 기록(모임 평가) 제출 시 refundAmountPerUser만큼 증가. ⚠️ 프론트 `me.leaves`(나뭇잎)·월별 추이와는 다른 개념 — 백엔드에 "나뭇잎" 필드는 없음.
UpdateProfileRequest { nickname*: string, cookingSkill*: CookingSkill, allergyTags: string[] }
AllergyTagListResponse { allergyTags: AllergyTagItemResponse[] }
AllergyTagItemResponse { tag, labelKo, description }
```

### 재료

```
IngredientSearchResponse { ingredients: IngredientItemResponse[] }
IngredientItemResponse   { ingredientId: long, nameKo, gramsPerCount: number }
JoinIngredientRequest    { ingredientId*: long, count*: number(≥0.01), knownGrams: number(≥0.01) }
```

### 슬롯·참여

```
SlotListResponse     { slots: SlotListItemResponse[] }
SlotListItemResponse { slotId: long, date, placeName, stationCode, startTime, endTime, capacity: int, participantCount: int, status: string, commonKitSummary: string[] }
SlotDetailResponse   { slotId: long, date<date>, placeName, stationCode, startTime, endTime, capacity: int, participantCount: long, status: Status, commonKit: string[], joined: boolean, myParticipantId: long, participants: SlotDetailParticipantResponse[] }
SlotDetailParticipantResponse { participantId: long, nickname, cookingSkill: CookingSkill, allergyTags: string[], canPurchase: boolean, ingredientCount: int }
JoinSlotRequest      { canPurchase: boolean, ingredients*: JoinIngredientRequest[] }
JoinSlotResponse     { slotId: long, participantId: long, status: Status, canPurchase: boolean, ingredients: SessionIngredientResponse[] }
LeaveSlotResponse    { slotId: long, status: Status, left: boolean }
```

### 세션·재료 현황

```
SessionStatusResponse { slotId: long, status: Status, participants: SessionParticipantStatusResponse[], sharedIngredientPool: SharedIngredientPoolItemResponse[], canRequestRecommendation: boolean }
SessionParticipantStatusResponse { participantId: long, nickname, cookingSkill: CookingSkill, allergyTags: string[], canPurchase: boolean, ingredients: SessionIngredientStatusResponse[] }
SessionIngredientStatusResponse  { sessionIngredientId: long, ingredientId: long, nameKo, count, knownGrams, estimatedGrams: number }
SharedIngredientPoolItemResponse { ingredientId: long, nameKo, estimatedTotalGrams: number }
UpdateSessionIngredientsRequest  { items*: JoinIngredientRequest[] }
UpdateSessionIngredientsResponse { slotId: long, items: SessionIngredientResponse[] }
SessionIngredientResponse        { sessionIngredientId: long, ingredientId: long, nameKo, count, knownGrams, estimatedGrams: number }
```

### 내 모임(세션) 조회

```
MySessionListResponse   { sessions: MySessionItemResponse[] }
MySessionItemResponse   { slotId: long, participantId: long, date, placeName, stationCode, startTime, endTime, timeLabel, capacity: int, participantCount: long, status: Status, canPurchase: boolean, myIngredientCount: long, hasRecommendation: boolean, hasSelectedMenu: boolean, completed: boolean, selectedMenu: SelectedMenuSummaryResponse }
MySessionDetailResponse { slotId: long, myParticipantId: long, joined: boolean, canPurchase: boolean, status: Status, myIngredients: SessionIngredientResponse[], session: SessionStatusResponse, hasRecommendation: boolean, hasSelectedMenu: boolean, completed: boolean, selectedMenu: SelectedMenuSummaryResponse }
```

### 추천·투표

```
RecommendationRequest  { reason: string }   # body 생략 가능 — null이면 서버가 reason="INITIAL"로 처리
RecommendationResponse { slotId: long, recommendationCount: int, status: Status, candidates: MenuCandidateResponse[] }
LatestRecommendationResponse { slotId: long, recommendationCount: int, status: Status, candidates: MenuCandidateResponse[], selectedMenu: MenuCandidateResponse }
MenuCandidateResponse  { candidateLabel, menuName, menuType, usedLeftoverIngredients: CandidateUsedIngredientResponse[], commonKitItems: string[], purchaseItems: PurchaseItemResponse[], cookingTimeMinutes: int, difficulty, recommendationReason, cookingOutlineSteps: string[], rolePlanSummary: string[] }
CandidateUsedIngredientResponse { ingredientId: long, nameKo, availableGrams, plannedUseGrams, estimatedUseRatio: number }
PurchaseItemResponse   { name, category, quantityGrams: number, allergenTags: string[], assignedToNickname, estimatedCost: int }
MenuVoteRequest        { voteType*: VoteType, candidateLabel: string, reasonText: string }
MenuVoteResponse       { slotId: long, recommendationCount: int, voteSummary: { [candidateLabel: string]: long }, confirmed: boolean, confirmedCandidateLabel: string, selectedMenu: SelectedMenuSummaryResponse, nextStatus: Status }
SelectedMenuSummaryResponse { candidateLabel, menuName, menuType }
```

### 조리 가이드·체크리스트

```
CookingGuideResponse   { slotId: long, menuName, steps: CookingGuideStepResponse[] }
CookingGuideStepResponse { stepOrder: int, phase, title, estimatedMinutes: int, instruction, usedIngredients: CookingUsedIngredientResponse[], tools: string[], kitItems: string[], participantTasks: ParticipantTaskResponse[], safetyNote, completionCriteria }
CookingUsedIngredientResponse { ingredientId: long, nameKo, plannedUseGrams: number }
ParticipantTaskResponse { participantId: long, nickname, taskName, taskPurpose, taskDetail, attentionPoints: string[], displayInstruction, skillRequired }
SessionChecklistResponse { slotId: long, menuName, menuType, myIngredients: SessionIngredientResponse[], commonKitItems: string[], purchaseItems: PurchaseItemResponse[], reservationCredit: int, refundHint: string }
```

### 사용량·리포트

```
CreateConsumptionRecordRequest  { finishedFoodRate*: int, cookedPhotoUrl*: string, afterPhotoUrl*: string, items*: ConsumptionRecordItemRequest[] }
ConsumptionRecordItemRequest    { sessionIngredientId*: long, useRate*: int }
CreateConsumptionRecordResponse { recordId: long, slotId: long, refundScore: int, refundAmountPerUser: int, totalUsedGrams: number, estimatedCarbonSavedKgco2e: number, campusReportLogged: boolean, nextStatus: Status }
SessionResultResponse  { slotId: long, menuName, menuType, totalUsedGrams, avgIngredientUseRate: int, finishedFoodRate: int, estimatedFoodWasteReducedGrams: number, estimatedCarbonSavedKgco2e: number, lowCarbonSelected: boolean, refundScore: int, refundAmountPerUser: int, totalRefundAmount: int, summaryText, photoUrls: PhotoUrlsResponse }
PhotoUrlsResponse      { cookedPhotoUrl, afterPhotoUrl }
MyResultTotalResponse  { completedSessionCount: int, totalUsedGrams: number, totalEstimatedCarbonSavedKgco2e: number, totalRefundAmount: int, togetherPeopleCount: int, providedIngredientCount: int, usedIngredientCount: int, averageIngredientUseRate: int, currentMonthEstimatedCarbonSavedKgco2e: number, previousMonthEstimatedCarbonSavedKgco2e: number, monthOverMonthCarbonDeltaKgco2e: number, insightMessage: string, monthlyResults: MonthlyResultSummaryResponse[] }
MonthlyResultSummaryResponse { yearMonth: string("yyyy-MM"), monthLabel: string("M월"), completedSessionCount: int, totalUsedGrams: number, totalEstimatedCarbonSavedKgco2e: number, totalRefundAmount: int, togetherPeopleCount: int, providedIngredientCount: int, usedIngredientCount: int, averageIngredientUseRate: int }
# MyResultTotalResponse 필드 의미(ConsumptionResultService): completedSessionCount=완료(기록 제출) 세션 수, totalRefundAmount=누적 환불액(원) 합, togetherPeopleCount=참여 세션들의 참가자 수 합, providedIngredientCount=제출된 기록 아이템 총 수, usedIngredientCount=useRate>0인 아이템 수, averageIngredientUseRate=세션 avgIngredientUseRate들의 평균(%), monthlyResults=월별 내림차순(현재월이 [0]), currentMonth/previousMonth=monthlyResults[0]·그 전월의 탄소 합, monthOverMonthCarbonDelta=현재월−전월, insightMessage="약 {탄소}kg의 탄소 배출을 줄인 셈이에요. 작은 한 끼가 모여 캠퍼스를 바꿔요."(리포트 eco 카피와 동일). 기록 없으면 전부 0/빈배열.
```

### 업로드·데모

```
ImageUploadResponse  { fileUrl, objectKey, contentType, size: long }   # POST body: multipart/form-data, field "file"*(binary), query "purpose"(UploadPurpose, 기본 GENERAL)
DemoSeedResponse     { createdIngredients: int, createdSlots: int, createdUsers: int, message: string }
```
