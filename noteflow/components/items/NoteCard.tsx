import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Note } from '@/types';
import { color, typography, spacing, radius } from '@/constants/theme';
import Animated, { FadeInDown, FadeOutLeft } from "react-native-reanimated";
import { Ionicons } from '@expo/vector-icons';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
}

export default function NoteCard({ note, onPress }: NoteCardProps) {
    const preview = note.content.length > 100 ? note.content.slice(0, 100) + '...' : note.content;
    const date = new Date(note.createdAt).toLocaleDateString("es-ES", {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    return (
        <Animated.View entering={FadeInDown} exiting={FadeOutLeft} style={styles.wrapper}>
        <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={onPress}>
            <View style={styles.accent} />
            <View style={styles.content}>
            <View style={styles.header}>
                <Text style={styles.title} numberOfLines={1}>{note.title}</Text>
                <Ionicons name='chevron-forward' size={16} color={color.neutral[400]} />
            </View>
            {preview ? (
                <Text style={styles.preview} numberOfLines={2}>{preview}</Text>
            ) : null}
            <View style={styles.footer}>
                <View style={styles.footerLeft}>
                    <Ionicons name='time-outline' size={12} color={color.neutral[400]} />
                    <Text style={styles.date}>{date}</Text>
                </View>
            </View>
            </View>
        </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: spacing[4],
        marginVertical: spacing[2],
    },
    card: {
        backgroundColor: color.neutral[0],
        borderRadius: radius.lg,
        flexDirection: "row",
        shadowColor: color.primary[900] ?? "#1a237e",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        overflow: "hidden",
    },
    cardPressed: {
        opacity: 0.92,
        transform: [{ scale: 0.98 }],
    },
    accent: {
        width: 4,
        backgroundColor: color.primary[500],
    },
    content: {
        flex: 1,
        padding: spacing[4],
    },
    title: {
        flex: 1,
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: color.neutral[900],
        marginBottom: spacing[2],
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
        marginBottom: spacing[1],
    },
});