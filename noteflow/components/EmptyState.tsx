import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, typography, spacing } from "@/constants/theme";
import { IoniconsName } from "@/types";

interface EmptyStateProps {
    icon: IoniconsName;
    title: string;
    subtitle: string;
}

export default function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
    return (
        <View style={styles.container}>
            <Ionicons name={icon} size={64} color={color.neutral[200]} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: spacing[2],
        padding: spacing[8],
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: color.neutral[400],
        textAlign: "center",
    },
    subtitle: {
        fontSize: typography.fontSize.sm,
        color: color.neutral[400],
        textAlign: "center",
    },
});