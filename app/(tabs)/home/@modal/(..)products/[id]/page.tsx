"use client";

import { PhotoIcon } from "@heroicons/react/16/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function Modal({ params }: { params: { id: string } }) {
  const router = useRouter();
  const onCloseClick = () => {
    router.back();
  };

  return (
    <div className="absolute w-full h-full bg-black/50 left-0 top-0 z-50 flex justify-center items-center">
      <button
        onClick={onCloseClick}
        className="absolute right-5 top-5 text-neutral-200"
      >
        <XMarkIcon className="size-8" />
      </button>
      <div className="max-w-screen-sm w-full flex justify-center h-1/2">
        <div className="aspect-square bg-neutral-700 rounded-md flex justify-center items-center text-neutral-200">
          <PhotoIcon className="h-28" />
        </div>
      </div>
    </div>
  );
}
