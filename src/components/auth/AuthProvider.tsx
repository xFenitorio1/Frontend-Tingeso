import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import keycloak from '../../config/keycloak';
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
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256',
        });

        setIsAuthenticated(authenticated);
        setToken(keycloak.token);

        // Dispara la sincronización JIT en Spring Boot silenciosamente
        if (authenticated) {
          api.get('/api/sincronizar-jit').catch(() => {
          });
        }

      } catch (error) {
        console.error('Failed to initialize Keycloak', error);
      } finally {
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initKeycloak();
    }

    // Keycloak events to handle token refresh
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30).then((refreshed) => {
        if (refreshed) {
          setToken(keycloak.token);
        }
      }).catch(() => {
        console.error('Failed to refresh token');
        keycloak.logout();
      });
    };

  }, [isInitialized]);

  const login = () => {
    keycloak.login();
  };

  const logout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
  };

  const register = () => {
    keycloak.register();
  };

  // Wait until keycloak is ready to render children to avoid unauthenticated blinks
  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center">Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout, register, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
}
