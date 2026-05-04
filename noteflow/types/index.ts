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
}

export interface Note extends BaseNote {
  content: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface Checklist extends BaseNote {
  items: ChecklistItem[];
}

export interface IdeaNote extends BaseNote {
  tags: string[];
  color: string;
}

export type AnyNote = Note | Checklist | IdeaNote;

export const isNote = (note: AnyNote): note is Note => 
    "content" in note;

export const isChecklist = (note: AnyNote): note is Checklist =>
    "items" in note;

export const isIdeaNote = (note: AnyNote): note is IdeaNote =>
    "tags" in note;