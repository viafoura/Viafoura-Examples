import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://api.onesignal.com/',
    timeout: 30000
});

export const createOneSignalNotification = ((message: string, vfUserId ? : string) => {
    const notificationObject: any = {
        app_id: process.env.ONE_SIGNAL_APP_ID,
        contents: {
            "en": message,
        },
    };

    if (false) {
        notificationObject.include_aliases = {
            "external_id": [vfUserId]
        };
    } else {
        notificationObject.included_segments = ["All"];
    }

    instance.post('/notifications', notificationObject, {
            headers: {
                'Authorization': 'Basic ' + process.env.ONE_SIGNAL_API_KEY
            }
        })
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });
});