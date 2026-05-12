import { View, Text, StyleSheet, Pressable } from "react-native";
import { Checklist } from "@/types";
import { color, typography, spacing, radius, useAppTheme } from '@/constants/theme'
import Animated, { FadeInDown, FadeOutLeft } from "react-native-reanimated";

interface ChecklistCardProps {
    checklist: Checklist;
    onPress: () => void;
}

export default function ChecklistCard({ checklist, onPress }: ChecklistCardProps) {
    const theme = useAppTheme();
    const total = checklist.items.length;
    const completed = checklist.items.filter((i) => i.isCompleted).length;
    const progress = total > 0 ? completed /total : 0;
    const date = new Date(checklist.updatedAt).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })
    return (
        <Animated.View entering={FadeInDown} exiting={FadeOutLeft}>
        <Pressable style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} onPress={onPress}>
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>{checklist.title}</Text>
            <Text style={[styles.counter, { color: theme.colors.textMuted }]}>{completed}/{total} tareas completadas</Text>
            <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={[styles.date, { color: theme.colors.textMuted }]}>{date}</Text>
        </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: color.neutral[0],
        padding: spacing[4],
        marginHorizontal: spacing[4],
        marginVertical: spacing[2],
        borderWidth: 1,
        borderColor: color.neutral[100],
        borderRadius: radius.xl,
        shadowColor: color.neutral[900],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
        elevation: 6,
        overflow: "hidden",
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: color.neutral[900],
        marginBottom: spacing[1],
    },
    counter: {
        fontSize: typography.fontSize.sm,
        color: color.neutral[600],
        marginBottom: spacing[2],
    },
    progressTrack: {
        height: 6,
        backgroundColor: color.neutral[100],
        borderRadius: radius.full,
        marginBottom: spacing[2],
        overflow: "hidden",
    },
    progressFill: {
        height: 6,
        backgroundColor: color.primary[500],
        borderRadius: radius.full,
    },
    date: {
        fontSize: typography.fontSize.xs,
        color: color.neutral[400],
    },
})