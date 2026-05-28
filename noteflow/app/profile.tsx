import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Text, Pressable, Image, Alert, Modal } from "react-native";
import { color, radius, spacing, typography, useAppTheme, useIsDarkMode } from "@/constants/theme";
import { getAuth, signOut } from "@react-native-firebase/auth";
import { useNoteStore } from "@/store/notesStore";
import { router } from "expo-router";
import { getFirestore, doc, getDoc, updateDoc } from "@react-native-firebase/firestore";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { getPresignedUrl, uploadToS3, deleteAvatar } from "@/lib/api";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";


export default function ProfileScreen(){
    const theme = useAppTheme();
    const user = getAuth().currentUser;
    const toggleTheme = useNoteStore((state) => state.toggleTheme);
    const isDarkMode = useIsDarkMode();
    const themeMode = useNoteStore((state) => state.themeMode);
    const [avatarUrl, setLocalAvatarUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const setStoreAvatarUrl = useNoteStore((state) => state.setAvatarUrl);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    useFocusEffect(
        useCallback(() => {
        const loadProfile = async () => {
            if (!user) return;
            const db = getFirestore();
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setLocalAvatarUrl(docSnap.data().avatarUrl ?? null);
            }
        };
        loadProfile();
    }, [])
);

    const handlePickImage = async () => {
        Alert.alert(
            "Cambiar foto",
            "¿Cómo quieres subir la foto?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Galería", onPress: () => pickFromLibrary() },
                { text: "Cámara", onPress: () => pickFromCamera()},
            ]
        );
    };

    const pickFromLibrary = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(status !== 'granted'){
            Alert.alert("Permiso denegado", "Necesitamos permisos para acceder a su galería");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if(!result.canceled){
            await uploadImage(result.assets[0].uri);
        }
    };

    const pickFromCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permiso denegado", "Necesitamos permisos para acceder a la cámara");
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled){ 
            await uploadImage(result.assets[0].uri);
        }
    }

    const uploadImage = async (uri: string) => {
        try {
            const fileName = uri.split('/').pop() ?? 'avatar.jpg';
            const { signedUrl, publicUrl } = await getPresignedUrl(fileName, 'image/jpeg');
            await uploadToS3(signedUrl, uri);
            setLocalAvatarUrl(publicUrl);
            setStoreAvatarUrl(publicUrl);
            const db = getFirestore();
            await updateDoc(doc(db, "users", user!.uid), { avatarUrl: publicUrl });
        } catch (e) {
            Alert.alert("Error", "No se pudo subir la imagen");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteAvatar = async () => {
        if (!avatarUrl) return;
        try {
            const key = avatarUrl.split('.amazonaws.com/')[1];
            await deleteAvatar(key);
            const db = getFirestore();
            await updateDoc(doc(db, "users", user!.uid), { avatarUrl: null });
            setLocalAvatarUrl(null);
            setStoreAvatarUrl(undefined);
        } catch (e) {
            Alert.alert("Error", "No se pudo eliminar la foto");
        }
    }

    const handleLogout = async () => {
        await signOut(getAuth());
        router.replace("/auth/login");
    }

    return(
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Pressable 
                onPress={() => setShowImageModal(true)} 
                onLongPress={() => avatarUrl && setShowPreviewModal(true)} 
                style={styles.avatarWrapper}
            >
                {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                ) : (
                    <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primary }]}>
                        <Ionicons name="person" size={48} color={color.neutral[0]} />
                    </View>
                )}
                <View style={[styles.editBadge, { backgroundColor: theme.colors.primary }]}>
                    <Ionicons name="camera" size={14} color={color.neutral[0]} />
                </View>
            </Pressable>
            <Text style={[styles.email, { color: theme.colors.text }]}>
                {user?.email}
            </Text>
            {uploading && <Text style={[styles.uploading, { color: theme.colors.textMuted }]}>Subiendo imagen...</Text>}
            <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Text style={[styles.sectionTitle, { borderColor: theme.colors.border}]}>
                    Apariencia
                </Text>
                <Pressable style={[styles.row, { borderColor: theme.colors.border }]} onPress={toggleTheme}>
                    <Ionicons name={isDarkMode ? "moon" : "sunny"} size={20} color={theme.colors.text} />
                    <Text style={[styles.rowText, { color: theme.colors.text }]}>
                        Tema: {themeMode === "dark" ? "Oscuro" : themeMode === "light" ? "Claro" : "Auto"}
                    </Text>
                    <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
                </Pressable>
            </View>
            <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>Cuenta</Text>
                <Pressable style={[styles.row, { borderColor: theme.colors.border }]} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color={color.semantic.error} />
                    <Text style={[styles.rowText, { color: color.semantic.error }]}>Cerrar sesión</Text>
                </Pressable>
            </View>
            <Modal
                visible={showImageModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowImageModal(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowImageModal(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Cambiar foto de perfil</Text>
                        <Pressable 
                            style={[styles.modalOption, { borderColor: theme.colors.border }]}
                            onPress={() => { setShowImageModal(false); pickFromCamera(); }}
                        >
                            <Ionicons name="camera-outline" size={24} color={theme.colors.primary} />
                            <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>Hacer foto</Text>
                        </Pressable>
                        <Pressable 
                            style={[styles.modalOption, { borderColor: theme.colors.border }]}
                            onPress={() => { setShowImageModal(false); pickFromLibrary(); }}
                        >
                            <Ionicons name="images-outline" size={24} color={theme.colors.primary} />
                            <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>Elegir de la galería</Text>
                        </Pressable>
                        <Pressable 
                            style={[styles.modalCancel, { backgroundColor: theme.colors.background }]}
                            onPress={() => setShowImageModal(false)}
                        >
                            <Text style={[styles.modalCancelText, { color: theme.colors.textMuted }]}>Cancelar</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
            <Modal
                visible={showPreviewModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowPreviewModal(false)}
            >
                <Pressable 
                    style={styles.previewOverlay}
                    onPress={() => setShowPreviewModal(false)}
                >
                    <Pressable onPress={(e) => e.stopPropagation()}>
                        <View style={styles.previewAvatarWrapper}>
                            <Image source={{ uri: avatarUrl ?? undefined }} style={styles.previewImage} />
                            <Pressable
                                style={[styles.deleteAvatarBtn, { backgroundColor: color.semantic.error }]}
                                onPress={() => { setShowPreviewModal(false); handleDeleteAvatar(); }}
                            >
                                <Ionicons name="trash-outline" size={20} color={color.neutral[0]} />
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: spacing[4],
        alignItems: "center",
    },
    avatarContainer:{
        width: 96,
        height: 96,
        borderRadius: 999,
        justifyContent: "center",
        alignItems: "center",
        marginTop: spacing[6],
        marginBottom: spacing[3],
    },
    email:{
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.medium,
        marginBottom: spacing[6],
    },
    card:{
        width: "100%",
        borderRadius: radius.xl,
        padding: spacing[4],
        borderWidth: 1,
        marginBottom: spacing[4],
    },
    row:{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing[3],
        paddingVertical: spacing[2],
    },
    rowText:{
        flex:1,
        fontSize: typography.fontSize.md,
    },
    sectionTitle:{
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: spacing[3],
        textTransform: "uppercase",
    },
    avatarWrapper: {
        marginTop: spacing[6],
        marginBottom: spacing[3],
        position: "relative",
    },
    avatarImage:{
        width: 96,
        height: 96,
        borderRadius: 999,
    },
    editBadge:{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 999,
        justifyContent: "center",
        alignItems: "center",
    },
    uploading: {
        fontSize: typography.fontSize.sm,
        marginBottom: spacing[4],
    },
    modalOverlay:{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: "flex-end",
    },
    modalContent:{
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        padding: spacing[6],
        gap: spacing[3],
    },
    modalTitle:{
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        textAlign: 'center',
        marginBottom: spacing[2],
    },
    modalOption:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[4],
        padding: spacing[4],
        borderRadius: radius.xl,
        borderWidth: 1,
    },
    modalOptionText:{
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.medium,
    },
    modalCancel:{
        padding: spacing[4],
        borderRadius: radius.xl,
        alignItems: 'center',
        marginTop: spacing[2],
    },
    modalCancelText:{
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.medium,
    },
    previewOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing[4],
    },
    previewImage: {
        width: 280,
        height: 280,
        borderRadius: 999,
    },
    deleteAvatarBtn:{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteAvatarText:{
        color: color.neutral[0],
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semibold,
    },
    previewAvatarWrapper:{
        position: 'relative',
    },
})