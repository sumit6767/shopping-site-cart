import { createContext, useContext, useEffect, useState } from "react";
import { auth, signInWithPopup, provider, signOut } from "../utils/firebase"; // Adjust the import path as necessary
import { onAuthStateChanged } from "firebase/auth";
import { loginWithGoogle } from "../api/apiconsume"; // Adjust the import path as necessary
import Cookies from "js-cookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isManualLogin, setIsManualLogin] = useState(false);
  useEffect(() => {
    const isManualLoginRaw = Cookies.get("isManualLogin");
    setIsManualLogin(isManualLoginRaw === "true");

    if (!isManualLogin) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setAuthLoading(false);
      });
      return () => unsubscribe();
    }

    if (isManualLogin) {
      const unsubscribe = () => {
        const userinfo = manualLogin();
        setUser(userinfo);
        setAuthLoading(false);
      };
      unsubscribe();
    }
  }, [isManualLogin]);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Notify backend after login
      const backendResponse = await loginWithGoogle(firebaseUser);
      if (backendResponse?.status && backendResponse.status !== 500) {
        setUser(firebaseUser);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  const manualLogin = () => {
    const userInfoRaw = Cookies.get("user_info");

    if (isManualLogin && userInfoRaw) {
      try {
        const userInfo = JSON.parse(userInfoRaw) || {};
        return userInfo;
      } catch (e) {
        console.error("❌ Failed to parse user_info:", e);
      }
    }
    return {};
  };
  const logout = async () => {
    await signOut(auth)
  };

  const manualLogout = () => {
    try {
      if (Cookies.get("isManualLogin")) {
        Cookies.remove("user_info", { path: "/" });
        Cookies.remove("isManualLogin", { path: "/" });

        setUser(null);
        setIsManualLogin(false);
      }

      console.log("✅ Manual logout successful");
    } catch (e) {
      console.error("❌ Manual logout failed:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        authLoading,
        setUser,
        isManualLogin,
        setIsManualLogin,
        manualLogin,
        manualLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
