"use client";

import { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { Dashboard } from "@/components/dashboard/dashboard";
import { authService } from "@/lib/auth";
import LandingPage from "./landing/page";
import { useSearchParams } from "next/navigation";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const searchParams = useSearchParams();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showApp, setShowApp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const appParam = searchParams.get("app");
      setIsAuthenticated(authService.isAuthenticated());

      if (appParam === "true") {
        setShowApp(true);
      } else {
        setShowApp(false);
      }

      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsLoading(false);
    }
  }, [searchParams]); // rerun when ?app=true changes

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowApp(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setShowApp(false);
    window.history.replaceState({}, "", "/");
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Application Error
          </h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!showApp && !isAuthenticated) {
    return <LandingPage />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {isLoginMode ? (
            <LoginForm
              onSuccess={handleAuthSuccess}
              onToggleMode={() => setIsLoginMode(false)}
            />
          ) : (
            <RegisterForm
              onSuccess={handleAuthSuccess}
              onToggleMode={() => setIsLoginMode(true)}
            />
          )}
        </div>
      </div>
    );
  }

  return <Dashboard onLogout={handleLogout} />;
}
