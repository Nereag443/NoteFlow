import { View, Text, StyleSheet, Pressable } from 'react-native';
import { color, typography, spacing, radius } from '@/constants/theme';
import { NoteType } from '@/types/index';

interface TypeSelectorProps {
    type: NoteType;
    onSelectType: (type: NoteType) => void;
}

export default function TypeSelector({ type, onSelectType }: TypeSelectorProps) {
    const types: NoteType[] = ["note", "checklist", "idea"];
    return (
        <View style={styles.container}>
            {types.map((t) => (
                <Pressable
                    key={t}
                    style={[styles.typeOption, type === t && styles.selectedType]}
                    onPress={() => onSelectType(t)}
                >
                    <Text style={styles.typeText}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: spacing[4],
    },
    typeOption: {
        paddingVertical: spacing[2],
        paddingHorizontal: spacing[4],
        borderWidth: 1,
        borderColor: color.neutral[400],
        borderRadius: radius.sm,
    },
    selectedType: {
        backgroundColor: color.primary[100],
        borderColor: color.primary[500],
    },
    typeText: {
        fontSize: typography.fontSize.sm,
        color: color.neutral[600],
    },
});