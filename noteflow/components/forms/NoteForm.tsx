import { View, Text, TextInput, StyleSheet } from "react-native";
import { color, typography, spacing, radius, useAppTheme } from "@/constants/theme";

interface NoteFormProps {
    title: string;
    content: string;
    onTitleChange: (text: string) => void;
    onContentChange: (text: string) => void;
    errors: Record<string, string>;
    selectedColor?: string;
    onColorChange?: (color: string) => void;
}

export default function NoteForm({ title, content, onTitleChange, onContentChange, errors }: NoteFormProps) {
    const theme = useAppTheme();

    return (
        <View>
            <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.textMuted }]}>Título</Text>
                <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                      },
                      errors.title && styles.errorInput,
                    ]}
                    placeholder="Escribe un título"
                    placeholderTextColor={theme.colors.textMuted}
                    value={title}
                    onChangeText={onTitleChange}
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>
            <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.textMuted }]}>Contenido</Text>
                <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                      },
                      errors.content && styles.errorInput,
                      styles.textarea,
                    ]}
                    placeholder="Escribe el contenido de tu nota"
                    placeholderTextColor={theme.colors.textMuted}
                    value={content}
                    onChangeText={onContentChange}
                    multiline
                />
                {errors.content && <Text style={styles.errorText}>{errors.content}</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    field: {
        marginBottom: spacing[4],
    },
    label: {
        color: color.neutral[600],
        fontSize: typography.fontSize.sm,
        marginBottom: spacing[2],
        fontWeight: typography.fontWeight.medium,
    },
    input: {
        backgroundColor: color.neutral[0],
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: color.neutral[200],
        padding: spacing[3],
        fontSize: typography.fontSize.md,
        color: color.neutral[900],
    },
    errorInput: {
        borderColor: color.semantic.error,
    },
    errorText: {
        color: color.semantic.error,
        marginTop: spacing[1],
    },
    textarea: {
        minHeight: 140,
        textAlignVertical: "top",
    },
});