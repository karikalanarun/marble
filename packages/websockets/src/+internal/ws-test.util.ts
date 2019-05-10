import * as http from 'http';
import * as WebSocket from 'ws';

export const TEST_CONFIG = {
  PORT: 1337,
  HOST: '127.0.0.1',
};

const createServer = (host: string, port: number) => (cb: () => void) =>
  http.createServer().listen(port, host, cb);

const createWebSocketClient = (host: string, port: number) => () =>
  new WebSocket(`ws://${host}:${port}`);

export const createWebSocketsTestBed = (clientsCount = 1, host = TEST_CONFIG.HOST, port = TEST_CONFIG.PORT) => {
  let httpServer: http.Server;
  let webSocketClients: WebSocket[] = [];

  const bootstrap = (cb: () => void) => {
    httpServer = createServer(host, port)(() => {
      webSocketClients = Array.from(
        { length: clientsCount },
        createWebSocketClient(host, port)
      );
      cb();
    });
  };

  const teardown = (cb: () => void) => {
    webSocketClients.forEach(client => client.readyState === WebSocket.OPEN && client.close());
    webSocketClients = [];
    httpServer.close(cb);
  };

  const getClient = (index = 0) =>
    webSocketClients[index];

  const getServer = () =>
    httpServer;

  return {
    bootstrap,
    teardown,
    getClient,
    getServer,
  };
};

export type WebSocketsTestBed = typeof createWebSocketsTestBed;
