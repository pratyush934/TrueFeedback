import { dbConnection } from "@/lib/dbConnect";
import { UserModel } from "@/models/User.model";

export async function POST(req: Request) {
  await dbConnection();

  try {
    const { username, code } = await req.json();

    //verify kare
    //%20 jaisi chizo ko remove karta hai
    console.log(username);
    const decodedUserName = decodeURIComponent(username);
    console.log(decodedUserName);
    const user = await UserModel.findOne({
      username: decodedUserName,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: `Sorry user do not exist`,
        },
        {
          status: 500,
        }
      );
    }

    const isCodeValid = user.verifiedCode == code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: `Account verified`,
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: `code is expired please sign up again`,
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: `code is wrong please check the code`,
        },
        {
          status: 500,
        }
      );
    }
    
  } catch (error) {
    console.log(`Eroor exist is verify-code.`, error);

    return Response.json(
      {
        success: false,
        message: `Error while verifying`,
      },
      {
        status: 500,
      }
    );
  }
}
