import WebSocket from 'ws';
import { URL, URLSearchParams } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { forOwn, each } from 'lodash';
import { envConfig } from '@dg-live/ecommerce-config';

const { wsPort } = envConfig;

const wss = new WebSocket.Server({ port: wsPort });
console.log('socket opened on port: ' + wsPort);

function heartbeat() {
  this.isAlive = true;
}

const channels: WSChannels = {
  joystick: {
    clients: {},
  },
};

export interface JoystickBaseData {
  posX: number;
  posY: number;
  posZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  key: string;
  zoneId: number;
  save: boolean;
}

export interface JoystickSlotData extends JoystickBaseData {
  type: 'slot';
  datasource: number;
}

export interface IDCGWebSocket extends WebSocket {
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
}

wss.on('connection', (ws: IDCGWebSocket, req) => {
  ws.isAlive = true;
  const socketUrl = new URL(req.url);
  const params = new URLSearchParams(socketUrl.search);

  const datasource = params.get('datasource');

  const uuid = uuidv4();
  if (datasource) {
    const id = `${datasource}|${uuid}`;
    channels.joystick.clients[id] = ws;
    ws.datasource = id;
    ws.on('pong', heartbeat);
    ws.on('close', () => {
      console.log('close me!');
      channels.joystick.clients[id] && delete channels.joystick.clients[id];
    });
  } else {
    ws.send(`You must provide a datasource!`);
    ws.terminate();
  }
  return;
});

const interval = setInterval(function ping() {
  if (!wss.clients.size) {
    channels.joystick.clients = {};
  } else {
    wss.clients.forEach(function each(ws: IDCGWebSocket) {
      if (ws.isAlive === false && ws.datasource) {
        console.log(channels.joystick.clients[ws.datasource]);
        delete channels.joystick.clients[ws.datasource];
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }
}, 30000);

wss.on('close', function close() {
  clearInterval(interval);
});

export const notifyToWorldJoystick = (payload: JoystickSlotData) => {
  const { datasource } = payload;
  const joystickUsers: WebSocket[] = [];
  forOwn(channels.joystick.clients, (value, key) => {
    if (key.indexOf(`${datasource}|`) !== -1) {
      joystickUsers.push(value);
    }
  });
  each(joystickUsers, (joystickUser) => {
    if (joystickUser && joystickUser.readyState === WebSocket.OPEN) {
      joystickUser.send(JSON.stringify(payload));
    }
  });
};

export default wss;
