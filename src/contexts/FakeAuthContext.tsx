import { createContext, ReactNode, useContext, useReducer } from "react";

interface User {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

type AuthAction = { type: "LOGIN"; payload: User } | { type: "LOGOUT" };

// Define the initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      throw new Error("Unknown action");
  }
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "12345",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const login = (email: string, password: string) => {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "LOGIN", payload: FAKE_USER });
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside the AuthProvider");
  return context;
};

export { AuthProvider, useAuth };
