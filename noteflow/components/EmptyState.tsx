import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, typography, spacing, radius, useAppTheme } from "@/constants/theme";
import { IoniconsName } from "@/types";

interface EmptyStateProps {
    icon: IoniconsName;
    title: string;
    subtitle: string;
}

export default function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
    const theme = useAppTheme();
    return (
        <View style={styles.container}> 
            <View style={[styles.iconBadge, { backgroundColor: theme.colors.surfaceVariant }]}> 
                <Ionicons name={icon} size={28} color={theme.colors.primary} />
            </View>
            <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: spacing[2],
        maxWidth: 340,
        alignSelf: "center",
    },
    iconBadge: {
        width: 56,
        height: 56,
        borderRadius: radius.full,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: color.neutral[900],
        textAlign: "center",
    },
    subtitle: {
        fontSize: typography.fontSize.sm,
        color: color.neutral[600],
        textAlign: "center",
    },
});