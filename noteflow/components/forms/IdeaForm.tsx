import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { color, typography, spacing, radius } from '@/constants/theme';

const IDEA_COLORS = ["#FFCDD2", "#F8BBD0", "#E1BEE7", "#D1C4E9", "#C5CAE9", "#BBDEFB", "#B3E5FC", "#B2EBF2", "#B2DFDB", "#C8E6C9"];

interface IdeaFormProps {
    title: string;
    tags: string;
    selectedColor: string;
    onTitleChange: (text: string) => void;
    onTagsChange: (text: string) => void;
    onColorChange: (color: string) => void;
    errors: Record<string, string>;
}

export default function IdeaForm({ title, tags, selectedColor, onTitleChange, onTagsChange, onColorChange, errors }: IdeaFormProps) {
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
                style={[styles.input, errors.tags && styles.errorInput]}
                placeholder="Etiquetas (separadas por comas)"
                value={tags}
                onChangeText={onTagsChange}
            />
            {errors.tags && <Text style={styles.errorText}>{errors.tags}</Text>}
            <View style={styles.colorPicker}>
                {IDEA_COLORS.map((c) => (
                    <Pressable
                        key={c}
                        style={[
                            styles.colorOption,
                            { backgroundColor: c },
                            selectedColor === c && styles.selectedColor,
                        ]}
                        onPress={() => onColorChange(c)}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: color.neutral[200],
        borderRadius: radius.sm,
        padding: spacing[3],
        marginBottom: spacing[2],
    },
    errorInput: {
        borderColor: color.semantic.error,
    },
    errorText: {
        color: color.semantic.error,
        marginBottom: spacing[2],
    },
    colorPicker: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: spacing[2],
    },
    colorOption: {
        width: 30,
        height: 30,
        borderRadius: 15,
        margin: spacing[1],
    },
    selectedColor: {
        borderWidth: 2,
        borderColor: color.primary[500],
    },
});