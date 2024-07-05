import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

export const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

/* 
    try before use
*/

// export const MessageModel =
//   mongoose.models.Message || mongoose.model<Message>("Message", MessageSchema);
