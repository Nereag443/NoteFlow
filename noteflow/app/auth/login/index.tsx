import { color, lightTheme, darkTheme, spacing, useAppTheme, typography, radius } from "@/constants/theme";
import { View, StyleSheet, Pressable, Alert, Text } from 'react-native';
import { router } from "expo-router";
import { TextInput } from "react-native-paper";
import { useState } from "react";
import auth from "@react-native-firebase/auth";

export default function loginScreen() {
    const theme = useAppTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const handleLoging = async () => {
        if(!email.trim() || !password.trim()) {
            Alert.alert("Error", "Rellena todos los campos");
            return;
        }
        setLoading(true);
        try {
            await auth().signInWithEmailAndPassword(email.trim(), password);
            router.replace("/(tabs)/notas");
        }catch(e: any){
            Alert.alert("Error", "Email o contraseña incorrectos");
        }finally{
            setLoading(false);
        }
    }
    return(
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Noteflow</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textMuted}]}>Iniciar sesión</Text>
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
                onPress={handleLoging}
            >
                <Text style={ styles.loginBtnText}>{loading ? "Cargando..." : "Iniciar sesión"}</Text>
            </Pressable>
            </View>
            <Pressable onPress={() => router.push("/auth/register")}>
                <Text style={[styles.link, { color: theme.colors.primary }]}>¿No tienes cuenta? Regístrate</Text>
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