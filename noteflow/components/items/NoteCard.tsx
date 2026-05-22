import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Note } from '@/types';
import { color, typography, spacing, radius, useAppTheme } from '@/constants/theme';
import Animated, { FadeInDown, FadeOutLeft, useAnimatedStyle, interpolate, SharedValue } from "react-native-reanimated";
import { Ionicons } from '@expo/vector-icons';
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

interface NoteCardProps {
  note: Note;
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

export default function NoteCard({ note, onPress, onArchive }: NoteCardProps) {
    const preview = note.content ? (note.content.length > 100 ? note.content.slice(0, 100) + '...' : note.content) : '';
    const date = new Date(note.createdAt).toLocaleDateString("es-ES", {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    const theme = useAppTheme();
    const renderRightActions = (_prog: SharedValue<number>, dragX: SharedValue<number>) => ( 
            <RightAction dragX={dragX} /> 
        );
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
            }}
        >
        <Animated.View entering={FadeInDown} exiting={FadeOutLeft.duration(250)} style={styles.wrapper}>
        <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 }]} onPress={onPress}>
            <View style={[styles.accent, { backgroundColor: theme.colors.primary }]} />
            <View style={styles.content}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>{note.title}</Text>
                <Ionicons name='chevron-forward' size={18} color={theme.colors.textMuted} />
            </View>
            {preview ? (
                <Text style={[styles.preview, { color: theme.colors.textMuted }]} numberOfLines={2}>{preview}</Text>
            ) : null}
            <View style={styles.footer}>
                <View style={styles.footerLeft}>
                    <Ionicons name='time-outline' size={12} color={theme.colors.textMuted} />
                    <Text style={[styles.date, { color: theme.colors.textMuted }]}>{date}</Text>
                </View>
            </View>
            </View>
        </Pressable>
        </Animated.View>
        </ReanimatedSwipeable>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: spacing[3],
        marginVertical: spacing[2],
    },
    card: {
        borderRadius: radius.xl,
        flexDirection: "row",
        shadowColor: color.neutral[900],
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 8,
        overflow: "hidden",
    },
    cardPressed: {
        opacity: 0.96,
        transform: [{ scale: 0.985 }],
    },
    accent: {
        width: 6,
        backgroundColor: color.primary[500],
    },
    content: {
        flex: 1,
        padding: spacing[4],
        gap: spacing[2],
    },
    title: {
        flex: 1,
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: color.neutral[900],
        marginBottom: spacing[1],
    },
    preview: {
        fontSize: typography.fontSize.sm,
        color: color.neutral[400],
        lineHeight: 20,
        marginBottom: spacing[3],
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    footerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing[1],
    },
    date: {
        fontSize: typography.fontSize.sm,
        color: color.neutral[400],
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
});