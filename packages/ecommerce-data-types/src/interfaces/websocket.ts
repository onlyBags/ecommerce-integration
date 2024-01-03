import WebSocket from 'ws';

export interface WSNotifyDashboard {
  status: 'success' | 'error';
  type: 'joystickOpened';
  payload?: any;
}

export type WSEventType = 'joystick' | 'ecommerce';

export interface JoystickBaseData {
  posX: number;
  posY: number;
  posZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  key: string;
  save: boolean;
  // type: 'slot' | 'banner'
}

export interface JoystickSlotData extends JoystickBaseData {
  type: WSEventType;
  datasource: number;
}

export interface EcommerceWsData {
  type: WSEventType;
  datasource: number;
  wallet: string;
  status: 'success' | 'fail' | 'pending';
  orderId: number;
}

export interface DCGWebSocket extends WebSocket {
  isAlive: boolean;
  datasource: string;
}

export interface WebSocketClient {
  [key: string]: WebSocket;
}

export interface WSChannels {
  joystick: {
    clients: WebSocketClient;
  };
  ecommerce: {
    clients: WebSocketClient;
  };
}
