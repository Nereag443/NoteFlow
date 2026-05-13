import { View, Text, StyleSheet, Pressable } from 'react-native';
import { color, typography, spacing, radius, useAppTheme } from '@/constants/theme';
import { NoteType } from '@/types/index';

interface TypeSelectorProps {
    type: NoteType;
    onSelectType: (type: NoteType) => void;
}

export default function TypeSelector({ type, onSelectType }: TypeSelectorProps) {
    const theme = useAppTheme();
    const types: NoteType[] = ["note", "checklist", "idea"];
    return (
        <View style={styles.container}>
            {types.map((t) => (
                <Pressable
                    key={t}
                    style={[
                      styles.typeOption,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                      },
                      type === t && {
                        backgroundColor: theme.colors.primary,
                        borderColor: theme.colors.primary,
                      },
                    ]}
                    onPress={() => onSelectType(t)}
                >
                    <Text style={[
                      styles.typeText,
                      { color: type === t ? theme.colors.onPrimary ?? '#ffffff' : theme.colors.text },
                    ]}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing[2],
        gap: spacing[2],
    },
    typeOption: {
        flex: 1,
        backgroundColor: color.neutral[0],
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[4],
        borderWidth: 1,
        borderColor: color.neutral[200],
        borderRadius: radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: color.neutral[900],
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
        elevation: 2,
    },
    selectedType: {
        backgroundColor: color.primary[500],
        borderColor: color.primary[500],
    },
    typeText: {
        fontSize: typography.fontSize.sm,
        color: color.neutral[600],
        fontWeight: typography.fontWeight.medium,
    },
    selectedTypeText: {
        color: color.neutral[0],
    },
});