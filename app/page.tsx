export default function Home() {
  return (
    <main className="bg-gray-200 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-purple-100 h-screen flex items-center justify-center p-5 dark:bg-gray-700">
      <div className="bg-white shadow-lg p-5 w-full rounded-3xl max-w-screen  flex flex-col gap-4">
        <div className="group flex flex-col">
          <input
            className="bg-gray-200 w-full"
            type="text"
            placeholder="Write your email"
          />
          <span className="group-focus-within:block hidden">
            Make sure it is a valid email...{" "}
          </span>
          <button>Submit</button>
        </div>
      </div>
    </main>
  );
}
