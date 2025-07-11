import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
  id: number;
  title: string;
  price: number;
  created_at: Date;
  photo: string;
}

export default function ListProduct({
  id,
  title,
  price,
  created_at,
  photo,
}: ListProductProps) {
  return (
    <Link href={`/products/${id}`} className="gap-5 flex">
      <div className="relative size-28 rounded-md overflow-hidden">
        <Image fill src={`${photo}`} alt={title} className="object-cover" />
      </div>
      <div className="flex flex-col gap-1 *:text-white">
        <span className="text-lg">{title}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className="text-lg font-semibold">{formatToWon(price)}원</span>
      </div>
    </Link>
  );
}
