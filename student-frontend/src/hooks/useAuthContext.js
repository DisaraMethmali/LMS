// hooks/useAuthContext.js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }

  return {
    user: context.user,
    isLoading: context.isLoading,
    dispatch: context.dispatch
  };
};