"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import crypto from "crypto";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Invalid phone number"
  );

const tokenSchema = z.coerce.number().min(100000).max(999999);

interface ActionState {
  token: boolean;
}

async function createToken() {
  const token = crypto.randomInt(100000, 999999).toString();

  const existingToken = await prisma.sMSToken.findFirst({
    where: {
      token,
    },
  });
  if (existingToken) {
    return createToken();
  } else {
    return token;
  }
}

export async function smsLogIn(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");

  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);

    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      // delete previous token
      await prisma.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });

      // create token
      const newToken = await createToken();
      await prisma.sMSToken.create({
        data: {
          token: newToken,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });
      // send the token using twilio
      return {
        token: true,
      };
    }
  } else {
    const result = tokenSchema.safeParse(token);

    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      redirect("/");
    }
  }
}
