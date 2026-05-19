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
            <View style={[styles.progressTrack, { backgroundColor: theme.colors.surfaceVariant }]}> 
                <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: theme.colors.primary }]} />
            </View>
            <Text style={[styles.date, { color: theme.colors.textMuted }]}>{date}</Text>
        </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: spacing[4],
        marginHorizontal: spacing[4],
        marginVertical: spacing[2],
        borderWidth: 1,
        borderRadius: radius.xl,
        shadowColor: color.neutral[900],
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 8,
        overflow: "hidden",
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: spacing[1],
    },
    counter: {
        fontSize: typography.fontSize.sm,
        marginBottom: spacing[2],
    },
    progressTrack: {
        height: 6,
        borderRadius: radius.full,
        marginBottom: spacing[2],
        overflow: "hidden",
    },
    progressFill: {
        height: 6,
        borderRadius: radius.full,
    },
    date: {
        fontSize: typography.fontSize.xs,
        color: color.neutral[400],
    },
})