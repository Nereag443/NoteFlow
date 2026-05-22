import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { color, ideaColors, IdeaColorKey, typography, spacing, radius, useAppTheme } from '@/constants/theme';

interface IdeaFormProps {
    title: string;
    tags: string;
    selectedColor: IdeaColorKey;
    onTitleChange: (text: string) => void;
    onTagsChange: (text: string) => void;
    onColorChange: (color: IdeaColorKey) => void;
    errors: Record<string, string>;
}

export default function IdeaForm({ title, tags, selectedColor, onTitleChange, onTagsChange, onColorChange, errors }: IdeaFormProps) {
    const theme = useAppTheme();
    const isDark = theme.dark;
    const getColorValue = (colorKey: IdeaColorKey) => {
        return ideaColors[colorKey][isDark ? 'dark' : 'light'];
    };
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
                <Text style={[styles.label, { color: theme.colors.textMuted }]}>Etiquetas</Text>
                <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                      },
                      errors.tags && styles.errorInput,
                    ]}
                    placeholder="idea, personal, trabajo"
                    placeholderTextColor={theme.colors.textMuted}
                    value={tags}
                    onChangeText={onTagsChange}
                />
                {errors.tags && <Text style={styles.errorText}>{errors.tags}</Text>}
            </View>
            <View style={styles.labelWithPreview}>
                <Text style={[styles.label, { color: theme.colors.textMuted }]}>Color</Text>
                <View style={[styles.selectedPreview, { backgroundColor: getColorValue(selectedColor), borderColor: theme.colors.border }]} />
            </View>
            <View style={styles.colorPicker}>
                {Object.entries(ideaColors).map(([key, shades]) => (
                    <Pressable
                        key={key}
                        style={[
                            styles.colorOption,
                            { backgroundColor: shades[isDark ? 'dark' : 'light']},
                            selectedColor === key && { borderColor: theme.colors.primary },
                        ]}
                        onPress={() => onColorChange(key as IdeaColorKey)}
                    />
                ))}
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
        borderWidth: 1,
        borderColor: color.neutral[200],
        borderRadius: radius.md,
        padding: spacing[3],
        fontSize: typography.fontSize.md,
        backgroundColor: color.neutral[0],
        color: color.neutral[900],
    },
    errorInput: {
        borderColor: color.semantic.error,
    },
    errorText: {
        color: color.semantic.error,
        marginTop: spacing[1],
    },
    labelWithPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing[3],
    },
    selectedPreview: {
        width: 30,
        height: 30,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: color.neutral[200],
    },
    colorPicker: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing[2],
    },
    colorOption: {
        width: 34,
        height: 34,
        borderRadius: radius.full,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedColor: {
        borderColor: color.primary[500],
    },
});