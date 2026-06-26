// KiroZero ESLint flat config (Expo SDK 56)
// 교정 지시(remediation)를 포함한 규칙: "무엇이 틀렸는가"를 넘어 "어떻게 고치는가"까지 에이전트 컨텍스트에 주입한다.
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: [
      'dist/*',
      'node_modules/*',
      '.expo/*',
      'expo-env.d.ts', // expo-router 자동 생성(gitignore)
      'design/*',
      'docs/*',
      'coverage/*',
    ],
  },
  {
    // ---- KiroZero 프로젝트 규칙 (교정 지시 포함) ----
    rules: {
      // any는 no-restricted-syntax(TSAnyKeyword)로 교정 지시와 함께 막는다.
      '@typescript-eslint/no-explicit-any': 'off',

      'no-console': ['warn', { allow: ['warn', 'error'] }],

      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSAnyKeyword',
          message:
            "any 타입 금지. 교정 방법: (1) API 응답이면 docs/generated/api-schema.md의 타입 참조, (2) props면 src/types/에 interface/type 정의, (3) 불확실하면 unknown + 타입 가드 사용 — 예: if (isUser(data)) { data.name }. 'as unknown as X' 강제 캐스팅 금지.",
        },
        {
          selector: 'Literal[value=/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]',
          message:
            '하드코딩 색상값 금지. 교정 방법: src/theme/theme.ts의 color/gradient 토큰을 import해서 사용한다. 디자인에 없는 새 색이 필요하면 theme.ts에 토큰을 먼저 추가하고 그 토큰을 쓴다. (docs/DESIGN.md 참조)',
        },
      ],
    },
  },
  {
    // theme.ts는 색상 토큰의 정의처이므로 하드코딩 색상 규칙에서 제외한다.
    files: ['src/theme/**'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  {
    // 테스트 파일은 console/any 제약을 완화한다.
    files: ['__tests__/**', '**/*.test.ts', '**/*.test.tsx'],
    rules: {
      'no-console': 'off',
    },
  },
]);
