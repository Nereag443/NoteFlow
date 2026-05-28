import { getAuth, getIdToken } from "@react-native-firebase/auth";

export async function getToken(): Promise<string | null> {
    try {
        const user = getAuth().currentUser;
        if(!user) return null;
        return await getIdToken(user);
    } catch {
        return null;
    }
}