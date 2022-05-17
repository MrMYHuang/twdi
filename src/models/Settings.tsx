import { Bookmark } from "./Bookmark";

export class Settings {
    version: number = 1;
    hasAppLog: boolean = true;
    theme: number = 0;
    fontSize: number = 32;
    uiFontSize: number = 24;
    voiceURI: string | null = null;
    speechRate: number = 0.8;
    bookmarks: Bookmark[] = [];
    dictionaryHistory: string[] = [];
}
