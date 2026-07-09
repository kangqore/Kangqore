// Notification Runtime
// Generation III Runtime

export interface PlatformNotification {
    id: string;
    type: 'ALERT' | 'APPROVAL' | 'WAANDA_MESSAGE' | 'MISSION_UPDATE';
    title: string;
    message: string;
    actionUri?: string; // Graph URI
    isRead: boolean;
}

/**
 * Manages platform alerts, WAANDA messages, approvals, and collaboration notifications.
 */
export class NotificationRuntime {
    private notifications: PlatformNotification[] = [];
    private listeners: Set<(notifications: PlatformNotification[]) => void> = new Set();

    public receiveNotification(notification: Omit<PlatformNotification, 'id' | 'isRead'>) {
        const newNotification: PlatformNotification = {
            ...notification,
            id: crypto.randomUUID(),
            isRead: false
        };
        this.notifications.unshift(newNotification);
        this.notifyListeners();
    }

    public markAsRead(id: string) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.isRead = true;
            this.notifyListeners();
        }
    }

    public subscribe(callback: (notifications: PlatformNotification[]) => void) {
        this.listeners.add(callback);
        callback(this.notifications);
        return () => this.listeners.delete(callback);
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener([...this.notifications]));
    }
}
