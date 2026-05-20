import { Ionicons } from "@expo/vector-icons";

export type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

export interface TabConfig {
  name: string;
  title: string;
  iconActive: IoniconsName;
  iconInactive: IoniconsName;
}

export interface BaseNote {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  priority?: Priority;
}

export interface Note extends BaseNote {
  content: string;
  archived: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface Checklist extends BaseNote {
  items: ChecklistItem[];
  priority: Priority;
  archived: boolean;
}

export interface IdeaNote extends BaseNote {
  tags: string[];
  color: string;
  archived: boolean;
}

export type AnyNote = Note | Checklist | IdeaNote;

export const isNote = (note: AnyNote): note is Note => 
    "content" in note;

export const isChecklist = (note: AnyNote): note is Checklist =>
    "items" in note;

export const isIdeaNote = (note: AnyNote): note is IdeaNote =>
    "tags" in note;

export type NoteType = "note" | "checklist" | "idea";

export type Priority = "low" | "medium" | "high";

export interface Reminder {
  id: string;
  noteId: string;
  time: Date;
  priority: Priority;
}