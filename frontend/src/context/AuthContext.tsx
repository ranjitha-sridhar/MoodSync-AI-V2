import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from "react";
import API from "../services/api";

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    avatar_url?: string;
    preferred_genres?: string;
    theme?: string;
    save_history_enabled: boolean;
    notifications_enabled: boolean;
    created_at: string;
}

interface AuthContextType {
    user: UserProfile | null;
    token: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUserProfile: (updated: Partial<UserProfile>) => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("moodsync_token"));
    const [user, setUser] = useState<UserProfile | null>(() => {
        const stored = localStorage.getItem("moodsync_user");
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                return null;
            }
        }
        return null;
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refreshUser = async () => {
        const storedToken = localStorage.getItem("moodsync_token");
        if (!storedToken) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const res = await API.get<UserProfile>("/api/auth/me");
            setUser(res.data);
            localStorage.setItem("moodsync_user", JSON.stringify(res.data));
            localStorage.setItem("userName", res.data.name);
            localStorage.setItem("userEmail", res.data.email);
        } catch {
            localStorage.removeItem("moodsync_token");
            localStorage.removeItem("moodsync_user");
            setToken(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = async (email: string, password: string, rememberMe: boolean = false) => {
        setIsLoading(true);
        try {
            const res = await API.post("/api/auth/login", {
                email,
                password,
                remember_me: rememberMe
            });
            const { access_token, user: loggedUser } = res.data;
            setToken(access_token);
            setUser(loggedUser);
            localStorage.setItem("moodsync_token", access_token);
            localStorage.setItem("moodsync_user", JSON.stringify(loggedUser));
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userName", loggedUser.name);
            localStorage.setItem("userEmail", loggedUser.email);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        setIsLoading(true);
        try {
            const res = await API.post("/api/auth/register", {
                name,
                email,
                password
            });
            const { access_token, user: newUser } = res.data;
            setToken(access_token);
            setUser(newUser);
            localStorage.setItem("moodsync_token", access_token);
            localStorage.setItem("moodsync_user", JSON.stringify(newUser));
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userName", newUser.name);
            localStorage.setItem("userEmail", newUser.email);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("moodsync_token");
        localStorage.removeItem("moodsync_user");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
    };

    const updateUserProfile = (updated: Partial<UserProfile>) => {
        if (user) {
            const merged = { ...user, ...updated };
            setUser(merged);
            localStorage.setItem("moodsync_user", JSON.stringify(merged));
            if (updated.name) localStorage.setItem("userName", updated.name);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoggedIn: !!token && !!user,
                isLoading,
                login,
                register,
                logout,
                updateUserProfile,
                refreshUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}
