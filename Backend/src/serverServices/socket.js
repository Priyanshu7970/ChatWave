import { Server } from "socket.io";
import Redis from "ioredis"; // Use ioredis for all Redis operations
import { produceMessage } from "./kafka.js";
import { config } from 'dotenv';
import Message from "../models/Message.js"; // Assuming this is for DB storage
import { startMessageConsumer} from '../serverServices/kafka.js'

config();


const pub = new Redis({
   host:process.env.REDIS_HOST,
   port:process.env.REDIS_PORT,
   password:process.env.REDIS_PASSWORD
});
const sub = new Redis({
  host:process.env.REDIS_HOST,
   port:process.env.REDIS_PORT,
   password:process.env.REDIS_PASSWORD
});




class SocketService {
    constructor() {
        console.log("Init socket servers....");
        this._io = new Server({
            cors: {
                allowedHeaders: ['*'],
                origin: '*'
            }
        });

        sub.subscribe('MESSAGES', (err, count) => {
            if (err) {
                console.error("Failed to subscribe to MESSAGES channel:", err);
            } else {
                console.log(`Subscribed to ${count} channel(s).`);
            }
        });

        
    }

    async initListners() {
        const io = this.io;
       
        io.on("connect", (socket) => {
            console.log("This is the socket id....   ", socket.id);

            socket.on('event:message', async (data) => {
                console.log('New message Rec.   ', data.content);
                await pub.publish('MESSAGES', JSON.stringify(data)); 
            });


           

            // Handle socket disconnection
            socket.on('disconnect', () => {
                console.log('Socket disconnected:', socket.id);
            });
        });
         sub.on("message", async (channel, message) => {
                if (channel === 'MESSAGES') {
                    console.log("new message from redis", message);
                    let parsedMessage;
                    try {
                        parsedMessage = JSON.parse(message);
                        console.log("This is my parsed message....");
                        console.log(parsedMessage);
                        io.emit('message', parsedMessage); 
                        await produceMessage(message); 
                        console.log("Message Produced to Kafka Broker");
                    } catch (e) {
                        console.error("Error parsing message from Redis:", e, "Original message:", message);
                        io.emit('message', message);
                    }

                    
                }
            });
    }

    get io() {
        return this._io;
    }
}

export default SocketService;