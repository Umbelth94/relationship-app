import Image from "next/image";

export default function Home() {
  return (
    <main className="flex w-screen min-h-screen">
      <div className="flex w-screen h-[2rem] bg-slate-50">
        <button className="bg-blue-500 hover:bg-blue-700 rounded p-[.5rem] text-white ">Sign In</button>
      </div>
    </main>
  );
}
