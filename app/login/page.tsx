"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { handleForm } from "./actions";
import { useActionState } from "react";

export default function LogIn() {
  const [state, dispatch] = useActionState(handleForm, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Hello!</h1>
        <h2 className="text-xl">Log in with email and password</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input name="email" type="email" placeholder="Email" required></Input>
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
        ></Input>
        <Button text="Log In"></Button>
      </form>
      <SocialLogin></SocialLogin>
    </div>
  );
}
