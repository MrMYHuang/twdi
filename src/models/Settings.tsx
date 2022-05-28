import { Bookmark } from "./Bookmark";

export interface Settings {
    version: number;
    hasAppLog: boolean;
    theme: number;
    fontSize: number;
    uiFontSize: number;
    voiceURI: string | null;
    speechRate: number;
    bookmarks: Bookmark[];
    dictionaryHistory: string[];
}

export const defaultSettings = {
    version: 1,
    hasAppLog: true,
    theme: 0,
    fontSize: 32,
    uiFontSize: 24,
    voiceURI: null,
    speechRate: 0.8,
    bookmarks: [],
    dictionaryHistory: [],
}
