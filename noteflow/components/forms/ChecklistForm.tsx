import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import { color, typography, spacing, radius, useAppTheme } from '@/constants/theme';

interface ChecklistFormProps {
    title: string;
    items: string[];
    onTitleChange: (text: string) => void;
    onItemsChange: (items: string[]) => void;
    errors: Record<string, string>;
    selectedColor?: string;
    onColorChange?: (color: string) => void;
}

export default function ChecklistForm({ title, items, onTitleChange, onItemsChange, errors }: ChecklistFormProps) {
    const theme = useAppTheme();
    const [itemInput, setItemInput] = useState("");
    const addItem = () => {
        if (itemInput.trim()) {
            onItemsChange([...items, itemInput.trim()]);
            setItemInput("");
        }
    };
    const removeItem = (index: number) => {
        onItemsChange(items.filter((_, i) => i !== index));
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
                    placeholder="Título de la lista"
                    placeholderTextColor={theme.colors.textMuted}
                    value={title}
                    onChangeText={onTitleChange}
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>
            <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.textMuted }]}>Tareas</Text>
                <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                      },
                    ]}
                    placeholder="Nueva tarea"
                    placeholderTextColor={theme.colors.textMuted}
                    value={itemInput}
                    onChangeText={setItemInput}
                    onSubmitEditing={addItem}
                />
                {items.map((item, index) => (
                    <View key={index} style={[styles.checklistItem, { backgroundColor: theme.colors.background }]}> 
                        <Text style={[styles.itemText, { color: theme.colors.text }]}>{item}</Text>
                        <Pressable style={styles.deleteButton} onPress={() => removeItem(index)}>
                            <Text style={styles.deleteButtonText}>Eliminar</Text>
                        </Pressable>
                    </View>
                ))}
            </View>
            <Pressable style={[styles.addButton, { backgroundColor: theme.colors.primary }]} onPress={addItem}>
                <Text style={styles.addButtonText}>Agregar tarea</Text>
            </Pressable>
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
    checklistItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: color.neutral[50],
        padding: spacing[3],
        borderRadius: radius.md,
        marginTop: spacing[2],
    },
    itemText: {
        color: color.neutral[900],
        flex: 1,
        marginRight: spacing[3],
    },
    deleteButton: {
        paddingVertical: spacing[1],
        paddingHorizontal: spacing[2],
        borderRadius: radius.sm,
        backgroundColor: color.semantic.error,
    },
    deleteButtonText: {
        color: color.neutral[0],
        fontSize: typography.fontSize.xs,
    },
    addButton: {
        backgroundColor: color.primary[500],
        paddingVertical: spacing[3],
        borderRadius: radius.md,
        alignItems: 'center',
    },
    addButtonText: {
        color: color.neutral[0],
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semibold,
    },
});