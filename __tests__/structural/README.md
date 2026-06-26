# 구조적 테스트

> 이 폴더의 역할: 코드 전체를 스캔해 컨벤션을 **기계적으로** 강제하는 테스트.
> `harness-feedback` Level 3 및 `/gc`에서 자동 생성된다. 실행: `npm test`.

## 검증 예시 (화면 구현 진행 시 추가)

- 모든 Screen이 `SafeAreaView`를 사용하는지
- 소스에 하드코딩 색상값(`#RRGGBB`)이 없는지 (theme.ts 제외)
- UI가 `src/data/`를 직접 import하지 않고 커스텀 훅을 경유하는지
- 모든 공용 컴포넌트가 props만 받는지(데이터 페칭 없음)

> 단위 테스트(`src/lib`·`src/hooks`·`src/stores`)는 대상 파일 옆 또는 `__tests__/`에 둔다. 기준은 `docs/TESTING.md`.
