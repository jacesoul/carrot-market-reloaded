"use server";

import prisma from "@/lib/db";

export async function getMoreProducts(page: number) {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photo: true,
    },
    skip: 1,
    take: 1,
    orderBy: {
      created_at: "desc",
    },
  });

  return products;
}
