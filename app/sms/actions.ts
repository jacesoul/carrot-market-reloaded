"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import crypto from "crypto";
import twilio from "twilio";
import prisma from "@/lib/db";
import getSession from "@/lib/session";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Invalid phone number"
  );

const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine((token) => checkToken(token.toString()), "Invalid token");

interface ActionState {
  token: boolean;
}

async function checkToken(token: string) {
  const existingToken = await prisma.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });

  return Boolean(existingToken);
}

async function createToken() {
  const token = crypto.randomInt(100000, 999999).toString();

  const existingToken = await prisma.sMSToken.findUnique({
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
      const client = twilio(
        process.env.TWILIO_ACOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      await client.messages.create({
        body: `Your Karrot verification code is : ${newToken}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.MY_PHONE_NUMBER!,
      });

      return {
        token: true,
      };
    }
  } else {
    const result = await tokenSchema.safeParseAsync(token);

    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      const token = await prisma.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      });

      const session = await getSession();
      session.id = token!.userId;
      await session.save();
      await prisma.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });

      redirect("/");
    }
  }
}
