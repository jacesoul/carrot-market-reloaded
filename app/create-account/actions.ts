"use server";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_VALIDATION_MESSAGE,
} from "@/lib/constants";
import { z } from "zod";

const validatePassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string",
        required_error: "Username is required",
      })
      .transform((username) => username.toLowerCase().trim()),
    email: z.string().email("Invalid email").toLowerCase().trim(),
    password: z.string().regex(PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .refine(validatePassword, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  const result = formSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
