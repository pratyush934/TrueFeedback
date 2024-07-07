import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Truthtable : Verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return {
      success: true,
      message: "Got Success to send verification email",
    };
  } catch (error) {
    console.log(`Email fail hua in sendVerificationEmail.ts`, error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
