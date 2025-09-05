import {Kafka} from 'kafkajs' 
import fs from 'fs'
import path from 'path'
import Message from '../models/Message.js';
import { config } from 'dotenv';
import { Partitioners } from 'kafkajs';
import Content from '../models/Content.js';
config(); 

export const kafka = new Kafka({
    brokers:[process.env.KAFKA_SERVICE_URI],
    ssl:{
        ca:[fs.readFileSync(path.resolve("./ca.pem"),"utf-8")]
    },
    sasl:{
        username:process.env.KAFKA_USER,
        password:process.env.KAFKA_PASSWORD,
        mechanism:process.env.KAFKA_SASL_MECHANISM
    },
}) ;
let producer = null ;
export async function createProducer(){
    if (producer) return producer;

    const _producer = kafka.producer({createPartitioner: Partitioners.LegacyPartitioner}); 
    await _producer.connect();
    producer = _producer;
    return producer;
}
export async function produceMessage(data){
    const producer = await createProducer(); 
    console.log("This is my produceMessage data..."); 
    console.log(data); 
    producer.send({
        messages:[{key:`message-${Date.now()}`,value:data}],
        topic:"MESSAGES",
    })
    return true ;
}

export async function startMessageConsumer(){
    const consumer = kafka.consumer({groupId:"default"});
    await consumer.connect();
    await consumer.subscribe({topic:"MESSAGES",fromBeginning:true}); 
    await consumer.run({
        autoCommit:true,
        eachMessage:async ({message,pause})=>{ 
            if(!message.value) return ;
            console.log(`New Message Recv...`);  
            const chat = JSON.parse(message.value.toString('utf-8'));
            console.log("This is my payload....");  
            console.log(chat); 
            console.log(chat.id);

            
            try{ 
                const newContent = await Content.create(chat.content); 
                const data = await Message.findById(chat.id);
                 data.content.push(newContent) ;
                 data.save();

        } catch (error){
          console.log('Something is wrong'); 
          console.log(error); 
          pause()
          setTimeout(()=>{ consumer.resume([{topic:'MESSAGES'}])},60*1000);
        }
        },
    })
}
