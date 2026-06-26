/**
 * 더미데이터를 `DataResult<T>` shape로 감싸는 공용 헬퍼.
 *
 * 시드는 동기 값이라 항상 `loading:false, error:null`이다. 백엔드 연동 시 각 데이터 훅 내부에서
 * 이 헬퍼 대신 실제 fetch(로딩/에러 상태 포함)로 교체하면 화면 코드는 그대로 동작한다.
 */
import type { DataResult } from '@/types';

/** 리스트 시드 → `isEmpty`는 길이 0 여부. */
export function useSeedList<T>(items: T[]): DataResult<T[]> {
  return { data: items, loading: false, error: null, isEmpty: items.length === 0 };
}

/** 단건(항상 존재) 시드. */
export function useSeedValue<T>(value: T): DataResult<T> {
  return { data: value, loading: false, error: null, isEmpty: false };
}

/** 단건(조회 실패 가능) 시드 → 찾지 못하면 `data:null, isEmpty:true`. */
export function useSeedFind<T>(value: T | undefined): DataResult<T | null> {
  const found = value ?? null;
  return { data: found, loading: false, error: null, isEmpty: found === null };
}
