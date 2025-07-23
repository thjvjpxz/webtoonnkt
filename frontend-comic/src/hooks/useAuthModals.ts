import { useState } from "react";

export function useAuthModals() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);


  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsForgotPasswordOpen(false);
    setIsLoginOpen(true);
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsForgotPasswordOpen(false);
    setIsRegisterOpen(true);
  };

  const openForgotPassword = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setIsForgotPasswordOpen(true);
  };

  const closeAll = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setIsForgotPasswordOpen(false);
  };

  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsForgotPasswordOpen(false);
    setTimeout(() => {
      setIsRegisterOpen(true);
    }, 150);
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setIsForgotPasswordOpen(false);
    setTimeout(() => {
      setIsLoginOpen(true);
    }, 150);
  };

  const switchToForgotPassword = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setTimeout(() => {
      setIsForgotPasswordOpen(true);
    }, 150);
  };

  const switchBackToLogin = () => {
    setIsForgotPasswordOpen(false);
    setIsRegisterOpen(false);
    setTimeout(() => {
      setIsLoginOpen(true);
    }, 150);
  };

  return {
    isLoginOpen,
    isRegisterOpen,
    isForgotPasswordOpen,
    openLogin,
    openRegister,
    openForgotPassword,
    closeAll,
    switchToRegister,
    switchToLogin,
    switchToForgotPassword,
    switchBackToLogin,
  };
}