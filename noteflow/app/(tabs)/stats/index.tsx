import { View, Text, StyleSheet, ScrollView, Dimensions, Modal, TextInput, Pressable, Alert } from "react-native";
import { useNoteStore } from "@/store/notesStore";
import { useAppTheme, color, spacing, radius, typography } from "@/constants/theme";
import { PieChart } from "react-native-chart-kit";
import { useState } from "react";
import { Challenge } from "@/types";
import Ionicons from "@expo/vector-icons/build/Ionicons";


const SCREEN_WIDTH = Dimensions.get("window").width;

export default function StatsScreen(){
    const theme = useAppTheme();
    const notes = useNoteStore((state) => state.notes).filter((n) => !n.archived);
    const checklists = useNoteStore((state) => state.checklists).filter((c) => !c.archived);
    const ideas = useNoteStore((state) => state.ideas).filter((i) => !i.archived);
    const totalItems = checklists.reduce((acc, c) => acc + c.items.length, 0);
    const totalCompleted = checklists.reduce((acc, c) => acc + c.items.filter((i) => i.isCompleted).length, 0);
    const totalPending = totalItems - totalCompleted;
    const challenges = useNoteStore((state) => state.challenges);
    const addChallenge = useNoteStore((state) => state.addChallenge);
    const deleteChallenge = useNoteStore((state) => state.deleteChallenge);
    const completeChallenge = useNoteStore((state) => state.completeChallenge);
    const [showModal, setShowModal] = useState(false);
    const [challengeTitle, setChallengeTitle] = useState("");
    const [challengeGoal, setChallengeGoal] = useState("");
    const [challengeDeadline, setChallengeDeadline] = useState("");
    const totalCompletedTasks = checklists.reduce(
        (acc, c) => acc + c.items.filter((i) => i.isCompleted).length, 0
    );
    const handleAddChallenge = () => {
        if(!challengeTitle.trim() || !challengeGoal || !challengeDeadline){
            Alert.alert("Error", "Rellena todos los campos");
            return;
        }
        const goal = parseInt(challengeGoal);
        if(isNaN(goal) || goal <= 0){
            Alert.alert("Error", "El objetivo debe ser un número mayor que 0");
            return;
        }
        const deadline = new Date(challengeDeadline);
        if(isNaN(deadline.getTime())){
            Alert.alert("Error", "Formato de fecha inválido (usa DD/MM/AAAA)");
            return;
        }
        addChallenge({
            id: Math.random().toString(36).slice(2),
            title: challengeTitle.trim(),
            goal,
            deadline,
            completed: false,
            createdAt: new Date(),
        });
        setChallengeTitle("");
        setChallengeGoal("");
        setChallengeDeadline("");
        setShowModal(false);
    };

    const pieData = [
        {
            name: "Completadas",
            count: totalCompleted,
            color: color.semantic.success,
            legendFontColor: theme.colors.text,
            legendFontSize: 13,
        },
        {
            name: "Pendientes",
            count: totalPending,
            color: theme.colors.border,
            legendFontColor: theme.colors.text,
            legendFontSize: 13,
        },
    ]

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Estadísticas</Text>
            <View style={styles.totalsRow}>
                <View style={[styles.totalCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.totalNumber, { color: theme.colors.primary }]}>{notes.length}</Text>
                    <Text style={[styles.totalLabel, { color: theme.colors.textMuted }]}>Notas</Text>
                </View>
                <View style={[styles.totalCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.totalNumber, { color: theme.colors.primary }]}>{checklists.length}</Text>
                    <Text style={[styles.totalLabel, { color: theme.colors.textMuted }]}>Listas</Text>
                </View>
                <View style={[styles.totalCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.totalNumber, { color: theme.colors.primary }]}>{ideas.length}</Text>
                    <Text style={[styles.totalLabel, { color: theme.colors.textMuted }]}>Ideas</Text>
                </View>
            </View>
            <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Progreso de tareas</Text>
                {totalItems > 0 ? (
                    <>
                        <PieChart
                            data={pieData}
                            width={SCREEN_WIDTH - spacing[8] * 2}
                            height={180}
                            chartConfig={{
                                color: (opacity = 1) => `rgba(77, 123, 223, ${opacity})`,
                                backgroundColor: theme.colors.surface
                            }}
                            accessor="count"
                            backgroundColor="transparent"
                            paddingLeft="16"
                        />
                        <Text style={[styles.progressText, { color: theme.colors.textMuted }]}>
                            {totalCompleted} de {totalItems} tareas completadas
                        </Text>
                    </>
                ) : (
                    <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
                        No hay tareas todavía
                    </Text>
                )}
            </View>
            {checklists.length > 0 && (
                <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Por lista</Text>
                    {checklists.map((C) => {
                        const total = C.items.length;
                        const completed = C.items.filter((i) => i.isCompleted).length;
                        const progress = total > 0 ? completed / total : 0;
                        return (
                            <View key={C.id} style={styles.checklistRow}>
                                <Text style={[styles.checklistTitle, { color: theme.colors.text }]}>{C.title}</Text>
                                <View style={[styles.progressTrack, { backgroundColor: theme.colors.surfaceVariant }]}>
                                    <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: theme.colors.primary }]}></View>
                                </View>
                                <Text style={[styles.progressLabel, { color: theme.colors.textMuted }]}>{completed}/{total}</Text>
                            </View>
                        )
                    })}
                </View>
            )}
            <View style={[styles.card]}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle]}>Desafíos</Text>
                    <Pressable 
                        style={[styles.addChallengeBtn, { backgroundColor: theme.colors.primary }]}
                        onPress={() => setShowModal(true)}
                    >
                        <Text style={styles.addChallengeBtnText}>+ Nuevo</Text>
                    </Pressable>
                </View>
                {challenges.length === 0 ? (
                    <Text style={[styles.emptyText]}>No hay desafíos todavía</Text>
                ) : (
                    challenges.map((challenge) => {
                        const progress = Math.min(totalCompletedTasks / challenge.goal, 1);
                        const isExpired = new Date() > new Date(challenge.deadline);
                        const isCompleted = challenge.completed || totalCompletedTasks >= challenge.goal;
                        return(
                            <View key={challenge.id} style={[styles.challengeCard]}>
                                <View style={styles.challengeHeader}>
                                    <Text style={[styles.challengeTitle]}>{challenge.title}</Text>
                                    <Pressable onPress={() => deleteChallenge(challenge.id)}>
                                        <Ionicons name="trash-outline" />
                                    </Pressable>
                                </View>
                            </View>
                        )
                    })
                )}
            </View>
            <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
                <Pressable style={styles.modalOverlay} onPress={() => setShowModal(false)}>
                    <Pressable style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Nuevo desafío</Text>
                        <TextInput
                            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                            placeholder="Título del desafío"
                            placeholderTextColor={theme.colors.textMuted}
                            value={challengeTitle}
                            onChangeText={setChallengeTitle}
                        />
                        <TextInput
                            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                            placeholder="Número de tareas objetivo"
                            placeholderTextColor={theme.colors.textMuted}
                            value={challengeGoal}
                            onChangeText={setChallengeGoal}
                            keyboardType="numeric"
                        />
                        <Pressable
                            style={[styles.saveBtn, { backgroundColor: theme.colors.primary }]} onPress={handleAddChallenge}>
                                <Text style={styles.saveBtnText}>Crear desafío</Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    content:{
        padding: spacing[4],
        paddingBottom: spacing[16],
    },
    title:{
        fontSize: typography.fontSize["2xl"],
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing[4],
    },
    totalsRow:{
        flexDirection: "row",
        gap: spacing[3],
        marginBottom: spacing[4],
    },
    totalCard:{
        flex: 1,
        borderRadius: radius.xl,
        borderWidth: 1,
        padding: spacing[4],
        alignItems: "center",
    },
    totalNumber:{
        fontSize: typography.fontSize["3xl"],
        fontWeight: typography.fontWeight.bold,
    },
    totalLabel:{
        fontSize: typography.fontSize.xs,
        marginTop: spacing[1],
    },
    card:{
        borderRadius: radius.xl,
        borderWidth: 1,
        padding: spacing[4],
        marginBottom: spacing[4],
    },
    cardTitle:{
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: spacing[3],
    },
    progressText:{
        fontSize: typography.fontSize.sm,
        textAlign: "center",
        marginTop: spacing[2],  
    },
    emptyText:{
        fontSize: typography.fontSize.sm,
        textAlign: "center",
        paddingVertical: spacing[4]
    },
    checklistRow:{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing[3],
        marginBottom: spacing[3],
    },
    checklistTitle:{
        flex: 1,
        fontSize: typography.fontSize.sm,
    },
    progressTrack:{
        flex: 1,
        height: 6,
        borderRadius: radius.full,
        overflow: "hidden",
    },
    progressFill:{
        height: 6,
        borderRadius: radius.full,
    },
    progressLabel:{
        fontSize: typography.fontSize.xs,
        width: 32,
        textAlign: "right",
    },
    cardHeader: {

    },
    addChallengeBtn:{
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1],
        borderRadius: radius.full,
    },
    addChallengeBtnText:{
        color: color.neutral[0],
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
    },
    challengeCard:{

    },
    challengeHeader:{

    },
    challengeTitle:{

    },
    modalOverlay:{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    modalTitle:{
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        textAlign: "center",
        marginBottom: spacing[2],
    },
    modalContent:{
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        padding: spacing[6],
        gap: spacing[3],
    },
    input:{
        borderWidth: 1,
        borderRadius: radius.md,
        padding: spacing[3],
        fontSize: typography.fontSize.md,
    },
    saveBtn:{
        padding: spacing[4],
        borderRadius: radius.xl,
        alignItems: "center",
        marginTop: spacing[2],
    },
    saveBtnText:{
        color: color.neutral[0],
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semibold,
    }
})