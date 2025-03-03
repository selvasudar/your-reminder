export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const scheduleNotification = (title: string, description: string, datetime: string): void => {
  const now = new Date().getTime();
  const reminderTime = new Date(datetime).getTime();
  const timeUntilReminder = reminderTime - now;

  if (timeUntilReminder <= 0) {
    return;
  }

  setTimeout(() => {
    if (Notification.permission === 'granted') {
      try {
        // Play sound
        const audio = new Audio('/notification-sound.mp3');
        audio.play().catch(e => console.error('Error playing sound:', e));
        
        // Show notification
        const notification = new Notification(`Reminder: ${title}`, {
          body: description,
          icon: '/pwa-192x192.png',
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    }
  }, timeUntilReminder);
};