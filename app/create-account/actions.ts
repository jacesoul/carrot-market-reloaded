"use server";

import { getIronSession } from "iron-session";
import bcrypt from "bcrypt";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_VALIDATION_MESSAGE,
} from "@/lib/constants";
import prisma from "@/lib/db";
import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const validatePassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const checkUniqueUsername = async (username: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  return !Boolean(user);
};

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string",
        required_error: "Username is required",
      })
      .transform((username) => username.toLowerCase().trim())
      .refine(checkUniqueUsername, {
        message: "Username already in use",
      }),
    email: z
      .string()
      .email("Invalid email")
      .toLowerCase()
      .trim()
      .refine(checkUniqueEmail, {
        message: "Email already in use",
      }),
    password: z.string().regex(PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .refine(validatePassword, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  console.log(cookies());

  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const { username, email, password } = result.data;

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    const session = await getSession();

    session.id = user.id;
    await session.save();

    redirect("/profile");
  }
}
