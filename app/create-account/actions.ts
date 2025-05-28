"use server";

import { z } from "zod";

const validateUsername = (username: string) => {
  if (username.includes("@")) {
    return true;
  }
  return false;
};

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
      .min(3, "Way too short")
      .max(10, "Way too long")
      .refine(validateUsername, "Username must contain @"),
    email: z.string().email("Invalid email"),
    password: z.string().min(10, "Way too short"),
    confirm_password: z.string().min(10, "Way too short"),
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
    console.log(result.error.flatten());
    return result.error.flatten();
  }
}
