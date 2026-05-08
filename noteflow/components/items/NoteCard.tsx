import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Note } from '@/types';
import { color, typography, spacing, radius } from '@/constants/theme';

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
        <Pressable style={styles.card} onPress={onPress}>
            <View style={styles.header}>
                <Text style={styles.title}>{note.title}</Text>
                <Text style={styles.date}>{date}</Text>
            </View>
            <Text style={styles.preview}>{preview}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: color.neutral[0],
        borderRadius: radius.md,
        padding: spacing[4],
        marginHorizontal: spacing[4],
        marginVertical: spacing[2],
        shadowColor: color.neutral[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: color.neutral[900],
        marginBottom: spacing[1],
    },
    date: {
        fontSize: typography.fontSize.sm,
        color: color.neutral[400],
    },
    preview: {
        fontSize: typography.fontSize.sm,
        color: color.neutral[400],
        marginBottom: spacing[2],
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing[2],
    },
});