import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: !!sessionStorage.getItem("checkLogin"),
    userName: "admin@1",
    defaultPassword: "123", // Mật khẩu mặc định
  });

  const login = (userName, password) => {
    if (userName === auth.userName && password === auth.defaultPassword) {
      sessionStorage.setItem("checkLogin", true);
      setAuth({ ...auth, isAuthenticated: true });
      return true; // Đăng nhập thành công
    }
    return false; // Đăng nhập thất bại
  };

  const logout = () => {
    sessionStorage.removeItem("checkLogin");
    setAuth({ ...auth, isAuthenticated: false });
  };

  const updatePassword = (newPassword) => {
    setAuth((prev) => ({ ...prev, defaultPassword: newPassword }));
    console.log("Mật khẩu đã được cập nhật:", newPassword);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
