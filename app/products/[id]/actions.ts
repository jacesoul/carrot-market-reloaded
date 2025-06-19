"use server";

import prisma from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

export async function deleteProduct(formData: FormData) {
  const id = Number(formData.get("id"));
  const session = await getSession();
  if (!session.id) {
    throw new Error("Not authenticated");
  }
  // 상품 소유자만 삭제 가능
  const product = await prisma.product.findUnique({
    where: { id },
  });
  if (!product || product.userId !== session.id) {
    throw new Error("Not authorized");
  }
  await prisma.product.delete({
    where: { id },
  });
  redirect("/products");
}
