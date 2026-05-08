import { View, Text, TextInput, StyleSheet } from "react-native";
import { color, typography, spacing, radius } from "@/constants/theme";

interface NoteFormProps {
    title: string;
    content: string;
    onTitleChange: (text: string) => void;
    onContentChange: (text: string) => void;
    errors: Record<string, string>;
    selectedColor?: string;
    onColorChange?: (color: string) => void;
}

export default function NoteForm({ title, content, onTitleChange, onContentChange, errors, selectedColor, onColorChange }: NoteFormProps) {
    return (
        <View>
            <TextInput
                style={[styles.input, errors.title && styles.errorInput]}
                placeholder="Título"
                value={title}
                onChangeText={onTitleChange}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            <TextInput
                style={[styles.input, errors.content && styles.errorInput, styles.textarea]}
                placeholder="Contenido"
                value={content}
                onChangeText={onContentChange}
                multiline
            />
            {errors.content && <Text style={styles.errorText}>{errors.content}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: color.neutral[0],
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: color.neutral[200],
        padding: spacing[3],
        marginBottom: spacing[2],
        fontSize: typography.fontSize.md,
        color: color.neutral[900],
    },
    errorInput: {
        borderColor: color.semantic.error,
        borderWidth: 1,
    },
    errorText: {
        color: color.semantic.error,
        marginBottom: spacing[1],
    },
    textarea: {
        backgroundColor: color.neutral[0],
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: color.neutral[200],
        padding: spacing[3],
        fontSize: typography.fontSize.md,
        color: color.neutral[900],
        minHeight: 120,
        textAlignVertical: "top",
    },
});