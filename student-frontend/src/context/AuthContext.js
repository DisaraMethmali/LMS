// context/AuthContext.js
import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

const initialState = {
  user: null,
  isLoading: true
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        isLoading: false
      };
    case "LOGOUT":
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      return {
        ...state,
        user: null,
        isLoading: false
      };
    case "AUTH_IS_READY":
      return {
        ...state,
        user: action.payload,
        isLoading: false
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const storedUser = localStorage.getItem("user");

    if (token && email) {
      const user = storedUser ? JSON.parse(storedUser) : { email, token };
      dispatch({ type: "AUTH_IS_READY", payload: user });
    } else {
      dispatch({ type: "AUTH_IS_READY", payload: null });
    }
  }, []);

  console.log("AuthContext state:", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};