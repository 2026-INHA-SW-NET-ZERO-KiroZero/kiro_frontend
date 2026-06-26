import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { tokenStorage } from '@/lib/tokenStorage';

interface AuthState {
  authed: boolean;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthState>({
  authed: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export function useAuthProvider(): AuthState {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tokenStorage.get().then((token) => {
      setAuthed(token !== null);
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (token: string) => {
    await tokenStorage.set(token);
    setAuthed(true);
  }, []);

  const logout = useCallback(async () => {
    await tokenStorage.clear();
    setAuthed(false);
  }, []);

  return { authed, loading, login, logout };
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
