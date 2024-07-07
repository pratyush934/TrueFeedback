import { dbConnection } from "@/lib/dbConnect";
import { UserModel } from "@/models/User.model";
import { userNameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UserNameQuerySchema = z.object({
  username: userNameValidation,
});

export async function GET(req: Request) {

  /* if (req.method !== "GET") {
    return Response.json(
      {
        success: false,
        message: `Method not allowed at this point`,
      },
      {
        status: 405,
      }
    ); not necessary in new Next.js
  } */

  await dbConnection();

  try {
    //localhost:3000/api/cuu?username=pratyush?phone=android
    const { searchParams } = new URL(req.url);

    const queryParam = {
      username: searchParams.get("username"),
    };

    //validate with zod
    const result = UserNameQuerySchema.safeParse(queryParam);
    //check kare
    console.log("********************", result, "**********************");

    if (!result.success) {
      const userNameErrors = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            userNameErrors?.length > 0
              ? userNameErrors.join(", ")
              : `Invalid query parameters`,
        },
        {
          status: 400,
        }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: `Username is already taken`,
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: `Username is unique`,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(`Error in check-user-name schema`, error);
    return Response.json(
      {
        success: false,
        message: `checking username failed`,
      },
      {
        status: 500,
      }
    );
  }
}
