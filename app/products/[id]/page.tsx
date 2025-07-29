import prisma from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProduct } from "./actions";
import { revalidateTag, unstable_cache } from "next/cache";

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getProduct(id: number) {
  console.log("product");
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return product;
}

const getCashedProduct = unstable_cache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});

async function getProductTitle(id: number) {
  console.log("title");
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });

  return product;
}

const getCashedProductTitle = unstable_cache(
  getProductTitle,
  ["product-title"],
  {
    tags: ["product-title"],
  }
);

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCashedProductTitle(Number(params.id));

  return {
    title: product?.title,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const numId = Number(id);

  if (isNaN(numId)) {
    return notFound();
  }

  const product = await getCashedProduct(numId);
  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);

  const revalidate = async () => {
    "use server";
    revalidateTag("product-title");
  };

  return (
    <div>
      <div className="relative aspect-square">
        <Image
          fill
          src={`${product.photo}/width=500,height=500`}
          alt={product.title}
          className="object-cover"
        />
      </div>
      <div className=" flex items-center gap-3 border-b border-neutral-700 p-5">
        <div className="size-10 rounded-full overflow-hidden">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
        <div className="p-80"></div>
      </div>
      <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}원
        </span>
        {isOwner ? (
          <form action={revalidate}>
            {/* <input type="hidden" name="id" value={product.id} /> */}
            <button
              type="submit"
              className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold"
            >
              Revalidate title chache
            </button>
          </form>
        ) : null}
        <Link
          className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
          href={``}
        >
          Go to Chat
        </Link>
      </div>
    </div>
  );
}
