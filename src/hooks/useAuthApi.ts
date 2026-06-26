import { useCallback } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/apiClient';
import type {
  AllergyTagListResponse,
  AuthResponse,
  CurrentUserResponse,
  LoginRequest,
  SignupRequest,
} from '@/types/auth';

export interface UseAuthApiReturn {
  signup: (req: SignupRequest) => Promise<AuthResponse>;
  login: (req: LoginRequest) => Promise<AuthResponse>;
  me: () => Promise<CurrentUserResponse>;
  getAllergyTags: () => Promise<AllergyTagListResponse>;
}

export function useAuthApi(): UseAuthApiReturn {
  const { login: persistToken } = useAuth();

  const signup = useCallback(
    async (req: SignupRequest): Promise<AuthResponse> => {
      const res = await apiRequest<AuthResponse>('/auth/signup', { method: 'POST', body: req });
      await persistToken(res.token);
      return res;
    },
    [persistToken],
  );

  const login = useCallback(
    async (req: LoginRequest): Promise<AuthResponse> => {
      const res = await apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: req });
      await persistToken(res.token);
      return res;
    },
    [persistToken],
  );

  const me = useCallback(
    (): Promise<CurrentUserResponse> => apiRequest<CurrentUserResponse>('/auth/me'),
    [],
  );

  const getAllergyTags = useCallback(
    (): Promise<AllergyTagListResponse> => apiRequest<AllergyTagListResponse>('/allergy-tags'),
    [],
  );

  return { signup, login, me, getAllergyTags };
}
