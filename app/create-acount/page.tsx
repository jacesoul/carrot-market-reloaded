import FormButton from "@/components/form-button";
import FormInput from "@/components/form-input";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function CreateAccount() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Hello!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form className="flex flex-col gap-3">
        <FormInput
          type="text"
          placeholder="Username"
          required
          errors={[]}
        ></FormInput>
        <FormInput
          type="email"
          placeholder="Email"
          required
          errors={[]}
        ></FormInput>
        <FormInput
          type="password"
          placeholder="Password"
          required
          errors={[]}
        ></FormInput>
        <FormInput
          type="password"
          placeholder="Confirm Password"
          required
          errors={[]}
        ></FormInput>
        <FormButton loading={false} text="Create Account"></FormButton>
      </form>
      <div className="w-full bg-neutral-500 h-px" />
      <div>
        <Link
          className="primary-btn flex h-10 items-center justify-center gap-3"
          href={"/sms"}
        >
          <span>
            <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
          </span>
          <span>Sign up with SMS</span>
        </Link>
      </div>
    </div>
  );
}
