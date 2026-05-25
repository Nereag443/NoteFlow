import { color, spacing, useAppTheme, radius, typography } from "@/constants/theme";
import { View, StyleSheet, Pressable, Alert, Text } from 'react-native';
import { router } from "expo-router";
import { TextInput } from "react-native-paper";
import { useState } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export default function loginScreen() {
    const theme = useAppTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const handleRegister = async () => {
        if(!email.trim() || !password.trim()) {
            Alert.alert("Error", "Rellena todos los campos");
            return;
        }
        if (password.length < 6) {
            Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
            return;
        }
        setLoading(true);
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email.trim(), password);
            const userId = userCredential.user.uid;
            await firestore().collection("users").doc(userId).set({
                email: email.trim(),
                createdAt: firestore.FieldValue.serverTimestamp(),
                avatarUrl: null,
            });
            router.replace("/(tabs)/notas");
        }catch(e: any){
            Alert.alert("Error", "No se ha podido crear la cuenta");
        }finally{
            setLoading(false);
        }
    }
    return(
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Noteflow</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textMuted}]}>Crear Cuenta</Text>
            <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
            <TextInput
                placeholder="Email"
                onChangeText={setEmail}
                keyboardType="email-address"
                style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            />
            <TextInput 
                placeholder="Contraseña"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
                style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            />
            <Pressable 
                style={[styles.loginBtn, { backgroundColor: theme.colors.primary }]}
                onPress={handleRegister}
            >
                <Text style={ styles.loginBtnText}>{loading ? "Cargando..." : "Crear cuenta"}</Text>
            </Pressable>
            </View>
            <Pressable onPress={() => router.push("/auth/login")}>
                <Text style={[styles.link, { color: theme.colors.primary }]}>¿Ya tienes cuenta? Inicia sesión</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create ({
    input:{
            padding: spacing[3],
            borderWidth: 1,
            borderRadius: radius.md,
            fontSize: typography.fontSize.md,
        },
        loginBtn:{
            padding: spacing[4],
            borderRadius: radius.xl,
            alignItems: "center",
        },
        loginBtnText:{
            color: color.neutral[0],
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.semibold,
        },
        container:{
            flex: 1,
            justifyContent: "center",
            padding: spacing[6],
        },
        title:{
            fontSize: typography.fontSize["3xl"],
            fontWeight: typography.fontWeight.bold,
            textAlign: "center",
            marginBottom: spacing[2],
        },
        subtitle:{
            fontSize: typography.fontSize["3xl"],
            fontWeight: typography.fontWeight.bold,
            textAlign: "center",
            marginBottom: spacing[8],
        },
        card:{
            borderRadius: radius.xl,
            padding: spacing[6],
            borderWidth: 1,
            gap: spacing[4],
            marginBottom: spacing[4],
        },
        link:{
            textAlign: "center",
            fontSize: typography.fontSize.sm,
        }
})