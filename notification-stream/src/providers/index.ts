import { INotification } from "../types";
import { notificationToFormattedString } from "../utils/utils";
import { createOneSignalNotification } from "./onesignal";
import { createPushlyNotification } from "./pushly";


export const createNotification = ((notification: INotification) => {
    const formattedNotification = notificationToFormattedString(notification);
    let recipientUserId;
    if(notification.recipients.length > 0 && notification.recipients[0].viafoura_id){
        recipientUserId = String(notification.recipients[0].viafoura_id.id);
    }

    createOneSignalNotification(formattedNotification, recipientUserId);
    createPushlyNotification(formattedNotification, recipientUserId);
});