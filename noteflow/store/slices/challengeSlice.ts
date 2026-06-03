import { StateCreator } from "zustand";
import { Challenge } from "@/types";

export interface ChallengeSlice {
    challenges: Challenge[];
    addChallenge: (challenge: Challenge) => void;
    deleteChallenge: (id: string) => void;
    completeChallenge: (id: string) => void;
}

export const createChallengeSlice: StateCreator<ChallengeSlice> = (set) => ({
    challenges: [],
    addChallenge: (challenge) =>
        set((state) => ({ challenges: [...state.challenges, challenge] })),
    deleteChallenge: (id) =>
        set((state) => ({ challenges: state.challenges.filter((c) => c.id !== id) })),
    completeChallenge: (id) =>
        set((state) => ({ challenges: state.challenges.map((c) => c.id === id ? { ...c, completed: true } : c)})),
})