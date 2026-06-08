import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTriageStore = create(
  persist(
    (set) => ({
      defaultCountry: "Pakistan",

      /** Active session for split input / results routes */
      session: null,

      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
      setDefaultCountry: (country) => set({ defaultCountry: country || "Pakistan" }),
    }),
    {
      name: "meditriage-store",
      partialize: (state) => ({
        defaultCountry: state.defaultCountry,
      }),
    }
  )
);
