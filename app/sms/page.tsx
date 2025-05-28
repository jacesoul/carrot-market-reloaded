import Button from "@/components/button";
import Input from "@/components/input";

export default function SMSLogIn() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form className="flex flex-col gap-3">
        <Input
          name="number"
          type="number"
          placeholder="Phone number"
          required
          errors={[]}
        ></Input>
        <Input
          name="number"
          type="number"
          placeholder="Verification code"
          required
          errors={[]}
        ></Input>
        <Button loading={false} text="Verify"></Button>
      </form>
    </div>
  );
}
