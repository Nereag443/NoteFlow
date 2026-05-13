import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, spacing, radius, typography, useAppTheme } from "@/constants/theme";

interface SearchBarProps {
    value: string;
    onChange: (text: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
    const theme = useAppTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}> 
            <Ionicons name="search-outline" size={18} color={theme.colors.textMuted} />
            <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                value={value}
                onChangeText={onChange}
                placeholder={placeholder ?? "Buscar..."}
                placeholderTextColor={theme.colors.textMuted}
                underlineColorAndroid="transparent"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: color.neutral[0],
        borderRadius: radius.xl,
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
        marginHorizontal: spacing[4],
        marginTop: spacing[4],
        marginBottom: spacing[2],
        shadowColor: color.neutral[900],
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
    },
    input: {
        flex: 1,
        fontSize: typography.fontSize.md,
        color: color.neutral[900],
    },
})