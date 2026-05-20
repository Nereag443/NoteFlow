import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Note } from '@/types';
import { color, typography, spacing, radius, useAppTheme } from '@/constants/theme';
import Animated, { FadeInDown, FadeOutLeft, useAnimatedStyle, interpolate, SharedValue } from "react-native-reanimated";
import { Ionicons } from '@expo/vector-icons';
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onArchive: () => void;
}

function LeftAction({ dragX }: { dragX: SharedValue<number> }) { 
    const animatedStyle = useAnimatedStyle(() => ({ 
        width: Math.max(0, -dragX.value), 
        opacity: interpolate(-dragX.value, [0, 80], [0, 1]), 
}));
    return ( 
        <Animated.View style={[styles.leftAction, animatedStyle]}> 
            <Ionicons name="archive" size={28} color={color.neutral[0]} /> 
        </Animated.View> 
    ); 
}

export default function NoteCard({ note, onPress, onArchive }: NoteCardProps) {
    const preview = note.content.length > 100 ? note.content.slice(0, 100) + '...' : note.content;
    const date = new Date(note.createdAt).toLocaleDateString("es-ES", {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    const theme = useAppTheme();
    const renderLeftActions = (_prog: SharedValue<number>, dragX: SharedValue<number>) => ( 
            <LeftAction dragX={dragX} /> 
        );
    return (
        <ReanimatedSwipeable
            renderLeftActions={renderLeftActions}
            onSwipeableOpen={(direction) => {
                if (direction === "left") onArchive();
            }}
        >
        <Animated.View entering={FadeInDown} exiting={FadeOutLeft} style={styles.wrapper}>
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
    leftAction: {
        width: 80,
        backgroundColor: color.neutral[600], 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100%", 
        borderRadius: radius.xl, 
        marginVertical: spacing[2], 
    },
});