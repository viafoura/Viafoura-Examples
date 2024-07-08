export interface IRequest {
    request_uuid: string;
    time: number;
    version: number;
    notifications: [INotification];
}

export interface INotification {
    notification_type: INotificationType;
    notification_uuid: number;
    time: number;
    section_uuid: number;
    content_container_uuid: number;
    user: IUser;
    recipients: [IUser];
    payload: IPayload;
}

export interface IUser {
    name: string;
    viafoura_id: IUserViafouraId
    external_id: IUserExternalId
}

export interface IUserViafouraId {
    uuid: string;
    id: number;
}

export interface IUserExternalId {
    provider: string;
    id: string;
}

export interface IPayload {
    url: string;
    image_url: string;
    topic_id?: string;
    description?: string;
    title?: string;
    content: IPayloadContent;
    target_content_uuid: string;
}

export interface IPayloadContent {
    uuid: string;
    body?: string;
}

export enum INotificationType {
    broadcast_topic = 'broadcast_topic',
    broadcast_site = 'broadcast_site',
    like = 'like',
    reply = 'reply',
    subscribed_page_content = 'subscribed_page_content',
    subscribed_user_content = 'subscribed_user_content',
    follow = 'follow',
    reply_removed = 'reply_removed',
}