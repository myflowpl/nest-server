
export interface WsUser {
    username: string;
}
  
export interface WsAuthPayload {
    token: string;
    user: WsUser;
}