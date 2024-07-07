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

  if (!session?.user || session) {
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

    if (updatedUser) {
      return Response.json(
        {
          success: false,
          message: `Failed to update User Error while accepting message`,
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: true,
          message: `Message acceptance status updated successfully`,
        },
        {
          status: 201,
        }
      );
    }
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
    } else {
      return Response.json(
        {
          success: true,
          message: `Accepting the message`,
        },
        {
          status: 201,
        }
      );
    }
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
