import * as Location from 'expo-location';

export async function getCurrentLocation(): Promise<{
    latitude: number;
    longitude: number;
    locationName: string;
} | null> {
    try{
        const { status } = await Location.requestForegroundPermissionsAsync();
        if(status !== 'granted') return null;
        const position = await Location.getCurrentPositionAsync({});
        const [adress] = await Location.reverseGeocodeAsync(position.coords);
        const city = adress.city || adress.subregion || adress.district || adress.region || '';
        return {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            locationName: [city, adress.country].filter(Boolean).join(', ')
        };
    } catch{
        return null;
    }
}