import { tokenStorage } from '@/lib/tokenStorage';

const BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
const PREFIX = '/api/v1';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown };

function extractMessage(body: unknown): string | null {
  if (body !== null && typeof body === 'object' && 'message' in body) {
    const message = (body as { message: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return null;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const finalHeaders = new Headers(headers);
  const token = await tokenStorage.get();
  if (token !== null) finalHeaders.set('Authorization', `Bearer ${token}`);

  let finalBody: string | undefined;
  if (body !== undefined) {
    finalBody = JSON.stringify(body);
    finalHeaders.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${BASE}${PREFIX}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: finalBody,
  });

  const text = await res.text();
  const parsed: unknown = text === '' ? null : JSON.parse(text);

  if (!res.ok) {
    throw new ApiError(res.status, extractMessage(parsed) ?? 'API Error');
  }

  return parsed as T;
}
