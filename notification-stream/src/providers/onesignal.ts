import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://api.onesignal.com/',
    timeout: 30000
});

export const createOneSignalNotification = (async (message: string, vfUserId ? : string) => {
    const notificationObject: any = {
        app_id: process.env.ONE_SIGNAL_APP_ID,
        contents: {
            "en": message,
        },
    };

    if (vfUserId) {
        notificationObject.include_aliases = {
            "external_id": [vfUserId]
        };
        notificationObject.target_channel = 'push';
    } else {
        notificationObject.included_segments = ["All"];
    }

    const response = await instance.post('/notifications', notificationObject, {
            headers: {
                'Authorization': 'Basic ' + process.env.ONE_SIGNAL_API_KEY
            }
        });

    console.log(response.data);
    console.log(response.status);
});