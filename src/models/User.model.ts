import mongoose, { Document, Mongoose, Schema } from "mongoose";
import { Message, MessageSchema } from "./Message.model";

/* 
    creating interfact that will act as custom data types
*/

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  verifiedCode: string;
  verifyCodeExpiry: string;
  isAcceptingMessage: boolean;
  messages: Message[];
}

export const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "UserName is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is requird"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedCode: {
    type: String,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  verifyCodeExpiry: {
    type: String,
    required: [true, "Verify code expiry is requried"],
  },
  messages: [MessageSchema],
});

/* 
    pehle check karenge ki kahi wo pehle se to bana hua nahi hai uske baad hi banayenge

// */

// export const UserModel =
//   (mongoose.models.User as mongoose.Model<User>) ||
//   mongoose.model<User>("User", UserSchema);
