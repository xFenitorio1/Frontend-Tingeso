import { createContext, useContext, type ReactNode } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import api from '../../api/axios';

interface AuthContextType {
  isAuthenticated: boolean;
  token?: string;
  login: () => void;
  logout: () => void;
  register: () => void;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => { },
  logout: () => { },
  register: () => { },
  isInitialized: false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { keycloak, initialized } = useKeycloak();

  const isAuthenticated = !!keycloak.authenticated;
  const token = keycloak.token;

  const login = () => {
    if (!initialized) return;
    keycloak.login();
  };

  const logout = () => {
    if (!initialized) return;
    keycloak.logout({ redirectUri: window.location.origin });
  };

  const register = () => {
    if (!initialized) return;
    keycloak.register();
  };

  if (initialized && isAuthenticated) {
    api.get('/api/sincronizar-jit').catch(() => { });
  }

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading authentication...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        login,
        logout,
        register,
        isInitialized: initialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}