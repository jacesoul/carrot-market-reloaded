"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useActionState, useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [imageId, setImageId] = useState("");

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;

    if (!files) {
      return;
    }

    const file = files[0];
    const url = URL.createObjectURL(file);

    setPreview(url);

    const { success, result } = await getUploadUrl();

    if (success) {
      const { id, uploadURL } = result;

      setUploadUrl(uploadURL);
      setImageId(id);
    }
  };

  const interceptAction = async (_any, formData: FormData) => {
    // upload image to cloudflare
    const cloudflareForm = new FormData();
    cloudflareForm.append("file", formData.get("photo") as File);

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: cloudflareForm,
    });

    if (response.status !== 200) {
      return;
    }

    const imageUrl = `https://imagedelivery.net/4RYcXHURsnuRcKMAkWaNMA/${imageId}`;

    // replace photo in formData
    formData.set("photo", imageUrl);

    // call uploadProduct
    return uploadProduct(null, formData);
  };

  const [state, action] = useActionState(interceptAction, null);

  return (
    <div>
      <form action={action} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {state?.fieldErrors.photo}
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />
        <Input
          type="text"
          name="title"
          required
          placeholder="제목"
          errors={state?.fieldErrors.title}
        />
        <Input
          type="number"
          name="price"
          required
          placeholder="가격"
          errors={state?.fieldErrors.price}
        />
        <Input
          type="text"
          name="description"
          required
          placeholder="자세한 설명"
          errors={state?.fieldErrors.description}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
