import { useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Text, Pressable, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { z } from "zod";
import { useNoteStore } from "@/store/notesStore";
import { color, spacing, radius, typography, useAppTheme } from "@/constants/theme";
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
    const pageTitle =
      type === "note"
        ? "Nueva nota"
        : type === "checklist"
        ? "Nueva lista"
        : "Nueva idea";

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
          items: checklistItems
            .filter((text) => text.trim().length > 0)
            .map((text) => ({
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

    const theme = useAppTheme();
    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.pageTitle, { color: theme.colors.text }]}>{pageTitle}</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}> 
            <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>Tipo</Text>
            <TypeSelector type={type} onSelectType={setType} />
          </View>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}> 
            {type === "note" && (
              <NoteForm
                title={title}
                content={content}
                onTitleChange={setTitle}
                onContentChange={setContent}
                errors={errors}
              />
            )}
            {type === "checklist" && (
              <ChecklistForm
                title={title}
                items={checklistItems}
                onTitleChange={setTitle}
                onItemsChange={setChecklistItems}
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
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.saveButtonPressed,
            ]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Guardar</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: spacing[4],
    paddingBottom: spacing[10],
  },
  pageTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: color.neutral[900],
    marginBottom: spacing[4],
  },
  card: {
    backgroundColor: color.neutral[0],
    borderRadius: radius.xl,
    padding: spacing[4],
    marginBottom: spacing[4],
    shadowColor: color.neutral[900],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    color: color.neutral[600],
    marginBottom: spacing[4],
    fontWeight: typography.fontWeight.medium,
  },
  saveButton: {
    backgroundColor: color.primary[500],
    padding: spacing[4],
    borderRadius: radius.xl,
    alignItems: "center",
    marginTop: spacing[2],
    shadowColor: color.neutral[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
  },
  saveButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  saveButtonText: {
    color: color.neutral[0],
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
});