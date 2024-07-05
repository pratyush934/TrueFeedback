import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

export const isConnectedObject: connectionObject = {};

export const dbConnection = async (): Promise<void> => {

  if (isConnectedObject.isConnected) {
    console.log(`Data base is already connected`);
    return;
  }

  try {

    const dbConnect = await mongoose.connect(process.env.MONGODB_URI || "", {});

    console.log(dbConnect);
    console.log(dbConnect.connections);
    //very imp
    isConnectedObject.isConnected = dbConnect.connections[0].readyState;

    console.log(`Successfully connected to database, dbConnect.ts`);

    } catch (error) {
    console.log(`Error exist during db connection dbConnect.ts`, error);
    process.exit(1);
  }


};
