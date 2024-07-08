import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { dbConnection } from "@/lib/dbConnect";
import { UserModel } from "@/models/User.model";
import bycrypt from "bcryptjs";

export async function POST(req: Request) {
  // dbconnect

  const dbConnectStatus = await dbConnection();

  try {
    const { username, password, email } = await req.json();

    const isUserExistByUserName = await UserModel.findOne({
      username: username,
      isVerified: true,
    });

    if (isUserExistByUserName) {
      return Response.json(
        {
          status: false,
          message: `user already exist in db from route.ts`,
        },
        {
          status: 400,
        }
      );
    }
    //getting userWith email
    const isUserExistByEmail = await UserModel.findOne({
      email: email,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (isUserExistByEmail) {
      if (isUserExistByEmail.isVerified) {
        return Response.json(
          {
            status: false,
            message: `Already exist and verified`,
          },
          {
            status: 400,
          }
        );
      } else {
        
        const hashedPassword = await bycrypt.hash(password, 10);
        const expiryDate = new Date();
        // console.log(`EzpiryDate ko print kara ke dekho jara`, expiryDate);
        expiryDate.setHours(expiryDate.getHours() + 10);

        isUserExistByEmail.password = hashedPassword;
        isUserExistByEmail.verifiedCode = verifyCode;
        isUserExistByEmail.verifyCodeExpiry = expiryDate;

        const savingUser = await isUserExistByEmail.save();

      }
    } else {

      const hashedPassword = await bycrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username: username,
        email: email,
        password: hashedPassword,
        isVerified: false,
        verifiedCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        messages: [],
      });

      const savingUser = await newUser.save();
      
    }

    const verifythroughEmail = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!verifythroughEmail.success) {
      return Response.json(
        {
          status: false,
          message: `Sorry there is an error in route.ts verifythrough email ${verifythroughEmail.message}`,
        },
        {
          status: 500,
        }
      );
    } else {
      return Response.json(
        {
          status: true,
          message: `Bing Bing hogaya verify from in route.ts verifythrough email ${verifythroughEmail.message}`,
        },
        {
          status: 201,
        }
      );
    }
  } catch (error) {
    console.log(`Error exist in sign-up route.ts `, error);
    return Response.json(
      {
        status: false,
        message: `Error in POST`,
      },
      {
        status: 500,
      }
    );
  }
}
