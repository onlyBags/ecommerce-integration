// import { WebSocketServer } from 'ws';

// const wss = new WebSocketServer({ port: 8081 });

// wss.on('connection', function connection(ws) {
//   ws.on('error', console.error);

//   ws.on('message', function message(data) {
//     console.log('received: %s', data);
//   });

//   ws.send('something');
// });

import WebSocket, { WebSocketServer } from 'ws';
import { URL, URLSearchParams } from 'url';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { envConfig } from '@dg-live/ecommerce-config';

const { forOwn, each } = _;
const { wsPort } = envConfig;

const wss = new WebSocketServer({ port: wsPort });
console.log('socket opened on port: ' + wsPort);

function heartbeat() {
  this.isAlive = true;
}

const channels: WSChannels = {
  joystick: {
    clients: {},
  },
  ecommerce: {
    clients: {},
  },
};

export type WSEventType = 'joystick' | 'ecommerce';

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

export interface EcommerceWsData {
  type: WSEventType;
  datasource: number;
  wallet: string;
  status: 'success' | 'fail' | 'pending';
  orderId: number;
}

export interface JoystickSlotData extends JoystickBaseData {
  type: WSEventType;
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
  ecommerce: {
    clients: WebSocketClient;
  };
}

wss.on('connection', (ws: IDCGWebSocket, req) => {
  ws.isAlive = true;
  const baseUrl = 'http://localhost';

  const socketUrl = new URL(req.url, baseUrl);
  const params = new URLSearchParams(socketUrl.search);

  const datasource = params.get('datasource');
  if (!datasource) {
    ws.send(`You must provide a datasource!`);
    ws.terminate();
  }
  const joystick = params.get('joystick');
  const wallet = params.get('wallet');
  const uuid = uuidv4();
  if (wallet) {
    const id = `${datasource}|${wallet.toLowerCase()}`;
    channels.ecommerce.clients[id] = ws;
    ws.datasource = id;
    ws.on('pong', heartbeat);
    ws.on('close', () => {
      console.log('close me!');
      channels.ecommerce.clients[id] && delete channels.ecommerce.clients[id];
    });
  } else if (joystick) {
    const id = `${datasource}|${uuid}`;
    channels.joystick.clients[id] = ws;
    ws.datasource = id;
    ws.on('pong', heartbeat);
    ws.on('close', () => {
      console.log('close me!');
      channels.joystick.clients[id] && delete channels.joystick.clients[id];
    });
  }
  return;
});

const interval = setInterval(function ping() {
  if (!wss.clients.size) {
    channels.joystick.clients = {};
  } else {
    wss.clients.forEach(function each(ws: IDCGWebSocket) {
      if (ws.isAlive === false && ws.datasource) {
        delete channels.joystick.clients[ws.datasource];
        return ws.close();
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

export const notifyPurschase = (payload: EcommerceWsData) => {
  const { datasource, wallet } = payload;
  const ecommerceUsers: WebSocket[] = [];
  forOwn(channels.ecommerce.clients, (value, key) => {
    if (key.indexOf(`${datasource}|${wallet.toLowerCase()}`) !== -1) {
      ecommerceUsers.push(value);
    }
  });
  each(ecommerceUsers, (ecommerceUser) => {
    if (ecommerceUser && ecommerceUser.readyState === WebSocket.OPEN) {
      ecommerceUser.send(JSON.stringify(payload));
    }
  });
};

export default wss;
