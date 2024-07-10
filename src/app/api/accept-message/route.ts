import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnection } from "@/lib/dbConnect";
import { UserModel } from "@/models/User.model";
import { User } from "next-auth";
import { get } from "http";

export async function POST(req: Request) {
  await dbConnection();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  // console.log("11", user);

  // console.log("22", session?.user);
  // console.log("33", session);

  // console.log(!session?.user || !session);

  if (!session?.user || !session) {
    return Response.json(
      {
        success: false,
        message: "Not authenticate",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await req.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages,
      },
      { new: true }
    );
    // console.log(updatedUser);
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: `Failed to update User Error while accepting message`,
        },
        {
          status: 400,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: `Message acceptance status updated successfully`,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(`Error in accept-message route`, error);

    return Response.json(
      {
        success: false,
        message: `Error while accepting message`,
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: Request) {
  
  await dbConnection();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticate",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const userId = user._id;

    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: `Failed to get the User`,
        },
        {
          status: 400,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: foundUser.isAcceptingMessage,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(`Error in getting message in GET method`, error);
    return Response.json(
      {
        success: false,
        message: `Failed Failed Failed`,
      },
      {
        status: 400,
      }
    );
  }
}
