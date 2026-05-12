import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, spacing, radius, typography } from "@/constants/theme";

interface SearchBarProps {
    value: string;
    onChange: (text: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
    return (
        <View style={styles.container}>
            <Ionicons name="search-outline" size={16} color={color.neutral[400]} />
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder={placeholder ?? "Buscar..."}
                placeholderTextColor={color.neutral[400]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: color.neutral[100],
        borderRadius: radius.md,
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[2],
        marginHorizontal: spacing[4],
        marginVertical: spacing[2],
        gap: spacing[2],
    },
    input: {
        flex: 1,
        fontSize: typography.fontSize.md,
        color: color.neutral[900],
    },
})