"use server";

import bcrypt from "bcrypt";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_VALIDATION_MESSAGE,
} from "@/lib/constants";
import prisma from "@/lib/db";
import { z } from "zod";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const checkEmailExists = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
    },
  });
  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .toLowerCase()
    .trim()
    .refine(checkEmailExists, {
      message: "Email does not exist",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE),
});

export async function login(prevState: unknown, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
      },
    });

    const isPasswordValid = await bcrypt.compare(
      password,
      user!.password ?? ""
    );

    if (!isPasswordValid) {
      return {
        fieldErrors: {
          password: ["Invalid password"],
          email: [],
        },
      };
    } else {
      const session = await getSession();
      session.id = user!.id;
      await session.save();

      redirect("/profile");
    }
  }
}
