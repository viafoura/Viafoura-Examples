import { INotification } from "../types";
import { notificationToFormattedString } from "../utils/utils";
import { createOneSignalNotification } from "./onesignal";
import { createPushlyNotification } from "./pushly";


export const createNotification = ((notification: INotification) => {
    const formattedNotification = notificationToFormattedString(notification);

    createOneSignalNotification(formattedNotification);
    createPushlyNotification(formattedNotification);
});