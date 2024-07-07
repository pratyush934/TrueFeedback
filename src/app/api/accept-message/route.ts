import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnection } from "@/lib/dbConnect";
import { UserModel } from "@/models/User.model";
import { User } from "next-auth";

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

  const userId = user._id
}
