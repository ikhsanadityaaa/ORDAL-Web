"use client";

import { create } from "zustand";

// User data interface — activation code lives here (same place as login data).
// It is issued when the user pays INSIDE the app, unique per user.
export interface UserData {
  id: string;
  email: string;
  name: string;
  uniqueUserCode: string;
  activationCode: string | null;
  authProvider: string;
  createdAt: string;
}

export interface TrialData {
  status: "active" | "expired";
  expiresAt: string;
  timeRemaining: number; // milliseconds
}

interface AuthState {
  // User state
  user: UserData | null;
  trial: TrialData | null;
  access: "granted" | "required";
  isAuthenticated: boolean;

  // UI state
  isAuthModalOpen: boolean;
  authModalMode: "login" | "register";
  isAccountModalOpen: boolean;
  isDownloadModalOpen: boolean;
  isLoading: boolean;

  // Actions
  setUser: (
    user: UserData | null,
    trial?: TrialData | null,
    access?: "granted" | "required"
  ) => void;
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
  openAccountModal: () => void;
  closeAccountModal: () => void;
  openDownloadModal: () => void;
  closeDownloadModal: () => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  trial: null,
  access: "required",
  isAuthenticated: false,

  isAuthModalOpen: false,
  authModalMode: "register",
  isAccountModalOpen: false,
  isDownloadModalOpen: false,
  isLoading: false,

  setUser: (user, trial, access) =>
    set({
      user,
      trial: trial || null,
      access: access || (user ? "granted" : "required"),
      isAuthenticated: !!user,
    }),

  openAuthModal: (mode = "register") =>
    set({ isAuthModalOpen: true, authModalMode: mode }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  openAccountModal: () => set({ isAccountModalOpen: true }),
  closeAccountModal: () => set({ isAccountModalOpen: false }),
  openDownloadModal: () => set({ isDownloadModalOpen: true }),
  closeDownloadModal: () => set({ isDownloadModalOpen: false }),
  setLoading: (loading) => set({ isLoading: loading }),

  logout: () => {
    // Call logout API
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    set({
      user: null,
      trial: null,
      access: "required",
      isAuthenticated: false,
    });
  },

  refreshUser: async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      if (data.authenticated) {
        set({
          user: data.user,
          trial: data.trial,
          access: data.access,
          isAuthenticated: true,
        });
      } else {
        set({
          user: null,
          trial: null,
          access: "required",
          isAuthenticated: false,
        });
      }
    } catch {
      // Silently fail
    }
  },
}));
