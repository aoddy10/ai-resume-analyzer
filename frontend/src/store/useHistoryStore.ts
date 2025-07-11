import { useCallback } from "react";

/**
 * This hook provides a localStorage-based store for managing
 * resume history items in the AI Resume Analyzer application.
 */
export interface ResumeHistoryItem {
    id: string; // Unique identifier for the resume entry
    filename: string; // Original filename of the uploaded resume
    resumeText: string; // Extracted text from the resume
    gapFeedback: object; // JD gap feedback used for matching
    matchScore: number; // Matching score between resume and JD
    gptFeedback: object; // Feedback generated by GPT
    timestamp: number; // Timestamp when the entry was saved
}

const STORAGE_KEY = "resume_history"; // Key used for localStorage

export const getHistory = (): ResumeHistoryItem[] => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw) as ResumeHistoryItem[];
    } catch {
        return [];
    }
};

export const addHistoryEntry = (item: ResumeHistoryItem) => {
    const history = getHistory();
    const updated = [item, ...history].slice(0, 10); // Keep max 10
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export function useHistoryStore() {
    const saveToHistory = useCallback((item: ResumeHistoryItem) => {
        const history = getHistory();
        const updated = [
            item,
            ...history.filter((h) => h.id !== item.id),
        ].slice(0, 10); // Keep max 10 entries
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }, []);

    const clearHistory = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return {
        getHistory,
        addHistoryEntry,
        saveToHistory,
        clearHistory,
    };
}
