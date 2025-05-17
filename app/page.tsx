export default function Home() {
  return (
    <main className="bg-gray-100 h-screen flex items-center justify-center p-5 dark:bg-gray-700">
      <div className="bg-white shadow-lg p-5 w-full rounded-3xl max-w-sm dark:bg-gray-600 flex flex-col gap-2">
        <input
          className="w-full rounded-full py-3 bg-gray-200 dark:bg-gray-300 pl-5 outline-none ring ring-transparent focus:ring-orange-500 focus:ring-offset-2 transition-shadow placeholder:drop-shadow"
          type="text"
          placeholder="Search here..."
        />
        <button className="bg-black dark:bg-gray-500 text-white dark:text-gray-300 py-2 rounded-full active:scale-90 transition-transform font-medium outline-none">
          Search
        </button>
      </div>
    </main>
  );
}
