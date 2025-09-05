import http from 'http' 
import app from './app.js';
import SocketService from './serverServices/socket.js';
import { startMessageConsumer } from './serverServices/kafka.js';
async function init(){
    const socketService = new SocketService();
    const httpserver = http.createServer(app); 
    const port = process.env.PORT ? process.env.PORT : 8000; 
    socketService.io.attach(httpserver);
    await startMessageConsumer();
    httpserver.listen(port,()=>
        console.log(`http server is running at ${port}`)
    ) ;
    socketService.initListners();
}
init();