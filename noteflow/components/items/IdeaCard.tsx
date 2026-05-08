import { View, Text, StyleSheet, Pressable } from "react-native";
import { IdeaNote } from "@/types";
import { color, radius, spacing, typography } from "@/constants/theme";
import { useRef } from "react";
import Svg, { Polygon } from "react-native-svg";

const CARD_WIDTH = 160;

interface IdeaCardProps {
    idea: IdeaNote;
    onPress: () => void;
}

export default function IdeaCard({ idea, onPress }: IdeaCardProps) {
    const date = new Date(idea.updatedAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
    const rotation = useRef(`${(Math.random() * 6 - 3).toFixed(1)}deg`).current;
    return (
        <Pressable style={[styles.card, { backgroundColor: idea.color, transform: [{ rotate:rotation }] }]} onPress={onPress}>
            <Svg 
                width={28}
                height={28}
                style={{ position: "absolute", top:0, right:0}}>
                <Polygon
                    points= "0,0 28,0 28,28"
                    fill="rgba(0,0,0,0.15)"
                />
                <Polygon
                    points="0,0 28,0 28,28"
                    fill="white"
                    opacity={0.6}
                />
            </Svg>
            <Text style={styles.title} numberOfLines={1}>{idea.title}</Text>
            <View style={styles.tags}>
                {idea.tags.map((tag) => (
                    <View key={tag} style={styles.chip}>
                        <Text style={styles.chipText}>#{tag}</Text>
                    </View>
                ))}
            </View>
            <Text style={styles.date}>{date}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create ({
    card: {
        width: CARD_WIDTH,
        minHeight: 140,
        borderRadius: radius.md,
        padding: spacing[4],
        margin: spacing[2],
        shadowColor: color.neutral[900],
        shadowOffset: { width: 2, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
        overflow: "hidden",
        borderTopRightRadius: 0,
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: spacing[2],
    },
    tags: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing[1],
        marginBottom: spacing[2],
    },
    chip: {
        backgroundColor: color.neutral[200],
        borderRadius: radius.sm,
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
    },
    chipText: {
        fontSize: typography.fontSize.sm,
        color: color.neutral[900],
    },
    date: {
        fontSize: typography.fontSize.xs,
        color: color.neutral[600],
    },
})