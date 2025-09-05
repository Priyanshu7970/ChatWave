import { Schema,model } from "mongoose";
export  const messagePartSchema = new Schema({
    text: { type: String }, // For text content
    type: { type: String },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
     timestamp: { type: Date, default: Date.now }
});  

export default model ('Content',messagePartSchema);