import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { Checklist } from "@/types";
import { color, typography, spacing, radius, useAppTheme } from '@/constants/theme'
import Animated, { FadeInDown, FadeOutLeft, useAnimatedStyle, interpolate, SharedValue } from "react-native-reanimated";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

interface ChecklistCardProps {
    checklist: Checklist;
    onPress: () => void;
    onArchive: () => void;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

function RightAction({ dragX }: { dragX: SharedValue<number> }) { 
    const animatedStyle = useAnimatedStyle(() => ({ 
        width: Math.min(SCREEN_WIDTH, Math.max(0, -dragX.value)),
        opacity: interpolate(-dragX.value, [0, 80], [0.5, 1]), 
}));
    return ( 
        <Animated.View style={[styles.rightAction, animatedStyle]}> 
            <LinearGradient
                colors={['transparent', color.neutral[600]]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={StyleSheet.absoluteFill}
            />
            <Ionicons name="archive" size={28} color={color.neutral[0]} /> 
        </Animated.View> 
    ); 
}

export default function ChecklistCard({ checklist, onPress, onArchive }: ChecklistCardProps) {
    const theme = useAppTheme();
    const total = (checklist.items ?? []).length;
    const completed = (checklist.items ?? []).filter((i) => i.isCompleted).length;
    const progress = total > 0 ? completed /total : 0;
    const date = new Date(checklist.updatedAt).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })
    const renderRightActions = (_prog: SharedValue<number>, dragX: SharedValue<number>) => ( 
        <RightAction dragX={dragX} /> 
    );
    const priority = checklist.priority ?? "low";
    const priorityColor = color.priority[priority];
    const swipeableRef = useRef<any>(null);
    const [isArchiving, setIsArchiving] = useState(false);
    const handleArchive = () => {
        setIsArchiving(true);
            setTimeout(() => {
                onArchive();
            }, 300);
        };
    if(isArchiving) {
        return null;
    }
    return (
        <ReanimatedSwipeable
            ref={swipeableRef}
            renderRightActions={renderRightActions}
            onSwipeableOpen={(direction) => {
                if (direction === "left") { 
                    handleArchive();
                }
            }
        }
        >
        <Animated.View entering={FadeInDown} exiting={FadeOutLeft.duration(250)}>
        <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} onPress={onPress}>
            <View style={[styles.priorityBar, { backgroundColor: priorityColor }]} />
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>{checklist.title}</Text>
            <Text style={[styles.counter, { color: theme.colors.textMuted }]}>{completed}/{total} tareas completadas</Text>
            <View style={[styles.progressTrack, { backgroundColor: theme.colors.surfaceVariant }]}> 
                <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: theme.colors.primary }]} />
            </View>
            <Text style={[styles.date, { color: theme.colors.textMuted }]}>{date}</Text>
            {checklist.deadline && (
                <Text style={[styles.deadline, { color: new Date() > new Date(checklist.deadline) ? color.semantic.error : theme.colors.textMuted }]}>
                    Fecha límite: {new Date(checklist.deadline).toLocaleString("es-ES", { day: "numeric", month: "short" })}
                </Text>
            )}
        </Pressable>
        </Animated.View>
        </ReanimatedSwipeable>
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
    rightAction: {
        justifyContent: "center", 
        alignItems: "center", 
        height: "100%", 
        borderTopRightRadius: radius.xl,
        borderBottomRightRadius: radius.xl,
        marginVertical: spacing[2], 
        minWidth: 80,
    },
    priorityBar: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 6,
        borderTopLeftRadius: radius.xl,
        borderBottomLeftRadius: radius.xl,
    },
    cardPressed: {
        opacity: 0.96,
        transform: [{ scale: 0.985 }],
    },
    deadline:{
        fontSize: typography.fontSize.xs,
        marginTop: spacing[1],
    }
})