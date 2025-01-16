import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://joinsubtext.com/',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + process.env.SUBTEXT_API_KEY
    }
});


export const createSubTextNotification = (async (message: string, vfUserId ? : string) => {
    const data = new URLSearchParams();
    data.append('body', message);
    data.append('recipient_uuid', '8e6f20a8-c6b7-418c-b59e-ee83ebd1a096');
    
    instance.post('/v3/messages', data)
        .then(response => console.log(response.data))
        .catch(error => console.error(error));
});