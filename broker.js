const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
const httpServer = require('http').createServer();
const ws = require('websocket-stream');

const PORT_MQTT = 1883; //puerto hardware TCP
const PORT_WS = 8080;   //puerto web WebSocket

//listener para el ESP32
server.listen(PORT_MQTT, function () {
  console.log(`[Broker] Servidor TCP MQTT listo en puerto ${PORT_MQTT}`);
});

//listener para digital twin
ws.createServer({ server: httpServer }, aedes.handle);
httpServer.listen(PORT_WS, function () {
  console.log(`[Broker] Servidor WebSocket listo en puerto ${PORT_WS}`);
});