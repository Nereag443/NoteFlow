import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import { color, typography, spacing, radius } from '@/constants/theme';

interface ChecklistFormProps {
    title: string;
    items: string[];
    onTitleChange: (text: string) => void;
    onItemsChange: (items: string[]) => void;
    errors: Record<string, string>;
    selectedColor?: string;
    onColorChange?: (color: string) => void;
}

export default function ChecklistForm({ title, items, onTitleChange, onItemsChange, errors, selectedColor, onColorChange }: ChecklistFormProps) {
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
            <TextInput
                style={[styles.input, errors.title && styles.errorInput]}
                placeholder="Título"
                value={title}
                onChangeText={onTitleChange}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            <View style={styles.checklistContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nueva tarea"
                    value={itemInput}
                    onChangeText={setItemInput}
                    onSubmitEditing={addItem}
                />
            {items.map((item, index) => (
                <View key={index} style={styles.checklistItem}>
                    <Text>{item}</Text>
                    <Pressable onPress={() => removeItem(index)}>
                        <Text>Eliminar</Text>
                    </Pressable>
                </View>
            ))}
            </View>
            <Button title="Agregar tarea" onPress={addItem} />
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
        fontSize: typography.fontSize.md,
    },
    errorInput: {
        borderColor: color.semantic.error,
    },
    errorText: {
        color: color.semantic.error,
        marginBottom: spacing[1],
    },
    checklistContainer: {
        marginBottom: spacing[2],
    },
    checklistItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing[1],
    },
});