import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync(): Promise<boolean> {
    if(Platform.OS === 'android'){
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
    const { status: existingStatus } = await Notifications.requestPermissionsAsync();
    let finalStatus = existingStatus;
    if(existingStatus !== 'granted'){
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    return finalStatus === 'granted';
}

export async function scheduleDeadlineReminder(checklistId: string, title: string, deadline: Date): Promise<string | null> {
    const hasPermission = await registerForPushNotificationsAsync();
    if (!hasPermission) return null;
    
    const reminderDate = new Date();
    reminderDate.setMinutes(reminderDate.getMinutes() + 1);
    console.log('reminderDate:', reminderDate);
    
    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title: "Recordatorio de NoteFlow",
            body: `La lista "${title}" vence mañana`,
            data: { checklistId },
        },
        trigger: { 
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: reminderDate,
        },
    });
    console.log('notificationId:', id);
    return id;
}
export async function cancelReminder(notificationId: string){
    await Notifications.cancelScheduledNotificationAsync(notificationId);
}