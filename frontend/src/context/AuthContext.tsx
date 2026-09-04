import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from "react";

interface AuthContextType {
    isLoggedIn: boolean;
    login: (name: string, email: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

    const [isLoggedIn, setIsLoggedIn] = useState(
        () => localStorage.getItem("isLoggedIn") === "true"
    );

    useEffect(() => {

        if (isLoggedIn) {
            localStorage.setItem("isLoggedIn", "true");
        } else {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");
        }

    }, [isLoggedIn]);


    const login = (name: string, email: string) => {

        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);

        setIsLoggedIn(true);
    };


    const logout = () => {
        setIsLoggedIn(false);
    };


    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}