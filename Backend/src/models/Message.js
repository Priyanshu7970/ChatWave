import { Schema, Types, model } from "mongoose";
import { messagePartSchema } from "./Content.js";


const messageSchema = new Schema({
    chatRoom: { type: Schema.Types.ObjectId, ref: 'ChatRoom' }, 
    isPrivate:{type:Boolean,default:true},
    content:   [messagePartSchema],
    receiver: {type:Schema.Types.ObjectId,ref:'User'},
    members:[{type:Schema.Types.ObjectId,ref:'User'}]

});

// Index for faster querying
messageSchema.index({ chatRoom: 1, timestamp: -1 });
messageSchema.index({ sender: 1, receiver: 1, timestamp: -1 });

export default model('Message', messageSchema); 
