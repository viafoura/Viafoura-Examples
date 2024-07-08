export interface IRequest {
    request_uuid: string;
    time: number;
    version: number;
    notifications: [INotification];
}

export interface INotification {
    notification_type: string;
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
    content: IPayloadContent;
    target_content_uuid: string;
}

export interface IPayloadContent {
    uuid: string;
    body: string;
}