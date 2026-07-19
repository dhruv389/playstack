import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { authApi, getToken, setToken, clearToken, type AuthUser } from '../lib/api'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // On mount — if a token exists, re-validate it with /api/auth/me
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    authApi
      .me()
      .then(({ user: me }) => setUser(me))
      .catch(() => clearToken()) // token expired or invalid
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await authApi.login(email, password)
      setToken(res.token)
      setUser(res.user)
      return { success: true }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      return { success: false, error: message }
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // Swallow — just clear client state regardless
    }
    clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
