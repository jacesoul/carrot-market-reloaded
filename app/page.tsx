export default function Home() {
  return (
    <main className="bg-gray-200 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-purple-100 h-screen flex items-center justify-center p-5 dark:bg-gray-700">
      <div className="bg-white shadow-lg p-5 w-full rounded-3xl max-w-screen  flex flex-col gap-4">
        {["Jace", "Me", "You", "Yourself", ""].map((person, index) => {
          return (
            <div
              key={index}
              className="flex items-center gap-3 odd:bg-gray-100 even:bg-green-100 p-2.5 rounded-xl border-b-2 pb-3 last:border-b-0"
            >
              <div className="size-9 bg-blue-400 rounded-full animate-pulse"></div>
              {/* <div className="w-20 h-3 rounded-full bg-gray-500 animate-pulse"></div> */}
              <span className="text-lg font-medium empty:w-24 empty:h-3 empty:rounded-full empty:animate-pulse empty:bg-gray-300">
                {person}
              </span>
              <div className="size-6 bg-red-400 rounded-full text-white flex items-center justify-center relative">
                <span className="z-10">{index}</span>
                <div className="size-6 bg-red-400 rounded-full absolute animate-ping"></div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
