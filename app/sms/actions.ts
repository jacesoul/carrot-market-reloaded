"use server";

import { z } from "zod";
import validator from "validator";

const phoneSchema = z
  .string()
  .trim()
  .refine(validator.isMobilePhone, "Invalid phone number");

const tokenSchema = z.coerce.number().min(100000).max(999999);

export async function smsLogIn(prevState: any, formData: FormData) {
  console.log(formData.get("token"));
  console.log(typeof formData.get("token"));

  const phone = phoneSchema.safeParse(formData.get("phone"));
  const token = tokenSchema.safeParse(formData.get("token"));

  console.log(phone);
  console.log(token);

  if (!phone.success || !token.success) {
    return {
      fieldErrors: {},
    };
  }
}
