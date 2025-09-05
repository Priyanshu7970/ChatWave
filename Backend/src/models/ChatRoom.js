import { Schema, model } from 'mongoose';

const chatRoomSchema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    avatar:{type:String},
    createdAt: { type: Date, default: Date.now }
});

export default model('ChatRoom', chatRoomSchema);