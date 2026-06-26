import fs from 'fs';
import path from 'path';

// 구조적 테스트(harness-feedback Level 3 예시):
// src/ 코드에 하드코딩 색상값(#RRGGBB)이 없는지 기계적으로 검증한다. (theme.ts는 토큰 정의처라 제외)
const SRC = path.join(__dirname, '..', '..', 'src');
const THEME = path.join('src', 'theme');
const HEX = /#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9a-fA-F])/;

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

describe('구조적: 하드코딩 색상 금지 (theme.ts 제외)', () => {
  it('src/ 코드에 #RRGGBB 리터럴이 없다', () => {
    if (!fs.existsSync(SRC)) return;
    const offenders: string[] = [];
    for (const file of walk(SRC)) {
      if (file.includes(THEME)) continue;
      fs.readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          if (HEX.test(line)) offenders.push(`${path.relative(SRC, file)}:${i + 1}`);
        });
    }
    expect(offenders).toEqual([]);
  });
});
