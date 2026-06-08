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
        <View style={[styles.container, {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            shadowColor: theme.colors.elevation,
        }]}> 
            <View style={[styles.iconWrap, { backgroundColor: theme.colors.surfaceVariant }]}> 
                <Ionicons name="search-outline" size={18} color={theme.colors.primary} />
            </View>
            <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                value={value}
                onChangeText={onChange}
                placeholder={placeholder ?? "Buscar..."}
                placeholderTextColor={theme.colors.textMuted}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                autoCorrect={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: radius.xl,
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[2],
        marginHorizontal: spacing[4],
        marginTop: spacing[4],
        marginBottom: spacing[2],
        borderWidth: 1,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 14,
        elevation: 4,
    },
    iconWrap: {
        width: 34,
        height: 34,
        borderRadius: radius.full,
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacing[2],
    },
    input: {
        flex: 1,
        fontSize: typography.fontSize.md,
        color: color.neutral[900],
        paddingVertical: spacing[1],
    },
})