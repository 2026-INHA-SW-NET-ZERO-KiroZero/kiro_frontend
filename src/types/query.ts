/**
 * 데이터 훅 공통 반환 shape. 백엔드 연동 시 훅 내부만 실제 fetch로 교체하면
 * 화면 코드는 동일한 loading/error/empty 분기를 그대로 쓸 수 있다.
 */
export interface DataResult<T> {
  data: T;
  loading: boolean;
  error: Error | null;
  /** 리스트는 비었을 때, 단건은 찾지 못했을 때 true. */
  isEmpty: boolean;
}
