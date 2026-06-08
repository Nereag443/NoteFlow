import { View, Text, StyleSheet, Pressable } from "react-native";
import { IdeaNote } from "@/types";
import { color, radius, spacing, typography, useAppTheme, getIdeaColor } from "@/constants/theme";
import Svg, { Polygon } from "react-native-svg";
import Animated, { FadeInDown, FadeOutLeft } from "react-native-reanimated";

const CARD_WIDTH = 160;

interface IdeaCardProps {
    idea: IdeaNote;
    onPress: () => void;
}

export default function IdeaCard({ idea, onPress }: IdeaCardProps) {
    const date = new Date(idea.updatedAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
    const theme = useAppTheme();
    return (
        <Animated.View entering={FadeInDown} exiting={FadeOutLeft}>
        <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed, { backgroundColor: getIdeaColor(idea.color, theme.dark), borderColor: theme.colors.border }]} onPress={onPress}>
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
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>{idea.title}</Text>
            <View style={styles.tags}>
                {idea.tags.map((tag) => (
                    <View key={tag} style={styles.chip}>
                        <Text style={styles.chipText}>#{tag}</Text>
                    </View>
                ))}
            </View>
            <Text style={[styles.date, { color: theme.colors.text }]}>{date}</Text>
        </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create ({
    card: {
        width: CARD_WIDTH,
        minHeight: 160,
        borderRadius: radius.xl,
        borderWidth: 1,
        padding: spacing[4],
        margin: spacing[2],
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
        marginBottom: spacing[2],
        color: color.neutral[900],
    },
    tags: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing[1],
        marginBottom: spacing[2],
    },
    chip: {
        backgroundColor: color.neutral[0],
        borderRadius: radius.sm,
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
        borderWidth: 1,
        borderColor: color.neutral[100],
    },
    chipText: {
        fontSize: typography.fontSize.sm,
        color: color.neutral[900],
    },
    date: {
        fontSize: typography.fontSize.xs,
        color: color.neutral[600],
    },
    cardPressed: {
        opacity: 0.96,
        transform: [{ scale: 0.985 }],
    },
})