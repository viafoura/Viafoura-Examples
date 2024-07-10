import {
    INotification,
    INotificationType
} from "../types";

export const notificationToFormattedString = ((notification: INotification) => {
    var description = "";

    switch (notification.notification_type) {
        case INotificationType.like:
            description = `${notification.user.name} liked your comment`;
            break;
        case INotificationType.follow:
            description = `${notification.user.name} started following you`;
            break;
        case INotificationType.reply:
            description = `${notification.user.name} replied to your comment`;
            break;
        case INotificationType.subscribed_user_content:
            description = `${notification.user.name} you follow posted a new comment`;
            break;
        case INotificationType.subscribed_page_content:
            description = "There is new comments in a page you follow";
            break
        case INotificationType.broadcast_site:
            if(notification.payload.description){
                description = notification.payload.description;
            }
            break;
    }
    
    return description;
});