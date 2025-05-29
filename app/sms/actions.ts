"use server";

export async function smsVerification(prevState: any, formData: FormData) {
  const data = {
    number: formData.get("number"),
    code: formData.get("code"),
  };
}
