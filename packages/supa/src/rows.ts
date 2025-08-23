export type UUID = string;
export type TS = string; // ISO

export interface Profile { id: UUID; display_name: string | null; avatar_url: string | null; soul_id: string | null; }
export interface Circle { id: UUID; name: string; description: string | null; }
export interface CircleMessage { id: UUID; circle_id: UUID; user_id: UUID; content: string; message_type?: string; created_at: TS; }
export interface CodexEntry { id: UUID; title: string; body: string; tags: string[] | null; created_at: TS; }
export interface JournalEntry { id: UUID; user_id: UUID; content: string; mood?: string | null; created_at: TS; }
export interface DreamEntry { id: UUID; user_id: UUID; raw_text: string; symbols?: string[] | null; created_at: TS; }
