import { useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Text, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { z } from "zod";
import { useNoteStore } from "@/store/notesStore";
import { color, spacing, radius, typography } from "@/constants/theme";
import { NoteType } from "@/types";
import TypeSelector from "@/components/forms/TypeSelector";
import NoteForm from "@/components/forms/NoteForm";
import ChecklistForm from "@/components/forms/ChecklistForm";
import IdeaForm from "@/components/forms/IdeaForm";

const noteSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  content: z.string().optional(),
});

const checklistSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
});

const ideaSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  tags: z.string().min(1, "Debe tener al menos una etiqueta").transform((str) => str.split(",").map((tag) => tag.trim())),
});

export default function NewNote() {
    const { type: initialType } = useLocalSearchParams<{type: NoteType}>();
    const [type, setType] = useState<NoteType>(initialType || "note");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [checklistItems, setChecklistItems] = useState<string[]>([""]);
    const [selectedColor, setSelectedColor] = useState<string>(color.primary[500]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const addNote = useNoteStore((state) => state.addNote);
    const addChecklist = useNoteStore((state) => state.addChecklist);
    const addIdea = useNoteStore((state) => state.addIdea);

    const generateId = () => Math.random().toString(36).slice(2);
    const handleSave = () => {
      setErrors({});
      const now = new Date();

      if (type === "note") {
        const result = noteSchema.safeParse({ title, content });
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.issues.forEach((e) => {
            fieldErrors[String(e.path[0])] = e.message;
          });
          setErrors(fieldErrors);
          return;
        }
        addNote({
          id: generateId(),
          title,
          content: content || "",
          createdAt: now,
          updatedAt: now,
        });
      }

      if (type === "checklist") {
        const result = checklistSchema.safeParse({ title });
        if (!result.success) {
          setErrors({ title: result.error.issues[0].message });
          return;
        }
        addChecklist({
          id: generateId(),
          title,
          items: checklistItems.map((text) => ({
          id: generateId(),
          text,
          isCompleted: false,
        })),
          createdAt: now,
          updatedAt: now,
    });
  }

      if (type === "idea") {
        const result = ideaSchema.safeParse({ title, tags });
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.issues.forEach((e) => {
            fieldErrors[String(e.path[0])] = e.message;
          });
          setErrors(fieldErrors);
          return;
        }
        addIdea({
          id: generateId(),
          title,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          color: selectedColor,
          createdAt: now,
          updatedAt: now,
        });
      }
      router.back();
  };

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TypeSelector type={type} onSelectType={setType} />
          {type === "note" && (
            <NoteForm
              title={title}
              content={content}
              onTitleChange={setTitle}
              onContentChange={setContent}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
              errors={errors}
            />
          )}
          {type === "checklist" && (
            <ChecklistForm
              title={title}
              items={checklistItems}
              onTitleChange={setTitle}
              onItemsChange={setChecklistItems}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
              errors={errors}
            />
          )}
          {type === "idea" && (
            <IdeaForm
              title={title}
              tags={tags}
              onTitleChange={setTitle}
              onTagsChange={setTags}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
              errors={errors}
            />
          )}
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.neutral[50],
  },
  scrollContainer: {
    padding: spacing[4],
  },
  saveButton: {
    flex: 1,
    backgroundColor: color.primary[500],
    padding: spacing[3],
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: spacing[4],
  },
  saveButtonText: {
    color: color.neutral[0],
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
});
