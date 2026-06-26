/**
 * 단발 GET을 `DataResult<T>` shape로 감싸는 공용 비동기 패치 헬퍼.
 *
 * 시드용 `useSeed`의 비동기 버전 — 마운트 시 `fetcher`를 호출해 로딩/에러/빈 상태를 관리한다.
 * `refetch`로 수동 재요청(예: 프로필 저장 후 갱신). 화면은 동일한 `DataResult` 분기를 그대로 쓴다.
 */
import { useCallback, useEffect, useState } from 'react';

import type { DataResult } from '@/types';

export interface AsyncResult<T> extends DataResult<T> {
  /** 수동 재요청. */
  refetch: () => void;
}

interface Options<T> {
  /** 로딩/에러 시 노출할 초기값(리스트는 `[]`, 단건은 `null`). */
  initial: T;
  /** 비었는지 판정. */
  isEmpty: (data: T) => boolean;
}

export function useApiData<T>(fetcher: () => Promise<T>, options: Options<T>): AsyncResult<T> {
  const { initial, isEmpty } = options;
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // setState는 effect 본문이 아닌 비동기 콜백(then/catch)에서만 호출 → 동기 setState 회피.
  // `fetcher`는 호출 측에서 useCallback으로 고정하므로 deps에 넣어도 reloadKey 변경 시에만 재요청한다.
  useEffect(() => {
    let active = true;
    fetcher()
      .then((res) => {
        if (active) {
          setData(res);
          setError(null);
          setLoading(false);
        }
      })
      .catch((e: unknown) => {
        if (active) {
          setError(e instanceof Error ? e : new Error('데이터를 불러오지 못했어요.'));
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [fetcher, reloadKey]);

  // 이벤트 핸들러에서 호출(저장 후 갱신 등) — effect 밖이라 동기 setState 허용.
  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadKey((k) => k + 1);
  }, []);

  return { data, loading, error, isEmpty: isEmpty(data), refetch };
}
