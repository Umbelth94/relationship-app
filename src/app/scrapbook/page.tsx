"use client";
import { useScrapbooks } from "../hooks/photos/useScrapbooks";

export default function Scrapbook() {
  const scrapbooks = useScrapbooks();
  return (
    <main className="h-screen w-screen">
      <div id="scrapbook-select" className="">
        {scrapbooks.map((scrapbook) => {
          return <div>{scrapbook.title}</div>;
        })}
      </div>
    </main>
  );
}
