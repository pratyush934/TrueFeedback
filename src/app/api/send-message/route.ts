import { dbConnection } from "@/lib/dbConnect";
import { UserModel } from "@/models/User.model";
import { Message } from "@/models/Message.model";

export async function POST(req: Request) {
  await dbConnection();

  const { username, content } = await req.json();

  try {
    const user = await UserModel.findOne({
      username: username,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: `User not found`,
        },
        {
          status: 404,
        }
      );
    }

    //isUser accepting message or not
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: `User not accepting forbid me`,
        },
        {
          status: 403,
        }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: `Message send Successfully`,
      },
      {
        status: 201,
      }
    );
  } catch (error) {

    console.log(`Error exist in send-message`, error);

    return Response.json(
      {
        success: false,
        message: `Error existed didn't find the guy with username`,
      },
      {
        status: 500,
      }
    );
    
  }
}
