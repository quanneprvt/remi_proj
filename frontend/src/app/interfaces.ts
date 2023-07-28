import { Socket } from "socket.io-client";

export interface Response {
  data?: unknown;
  message?: string;
}

export interface Session {
  id: string;
  name: string;
  access_token: string;
  refresh_token: string;
  myVideos?: Video[];
  eventHandlers?: { component: string; handler: () => void }[];
}

export interface SessionType extends Session {
  setSession: React.Dispatch<React.SetStateAction<Session>>;
  socket?: Socket;
  fetchNewAccessToken: () => void;
}

export enum ItemStatus {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export interface User {
  _id: string;
  id: string;
  name: string;
  money: number;
}

export interface Video {
  _id: string;
  id: string;
  name: string;
  link: string;
  subscriber: string[];
  createdBy: User;
}

export interface SocketMessage {
  video?: Video;
}
