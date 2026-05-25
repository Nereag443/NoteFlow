import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'noteflow_token';

let webToken: string | null = null; //

export async function saveToken(token: string) {
    if(Platform.OS === 'web'){
        webToken = token;
    } else{
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
}

export async function getToken(): Promise<string | null> {
    if(Platform.OS === 'web'){
        return webToken;
    }
    return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken(){
    if(Platform.OS === 'web'){
        webToken = null;
    }else{
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
}