"use client";
import { useScrapbooks } from "../hooks/photos/useScrapbooks";

export default function ScrapbookSelect() {
  const scrapbooks = useScrapbooks();
  return (
    <div id="scrapbook-select" className="">
      {scrapbooks.map((scrapbook, i) => {
        return <div key={i}>{scrapbook.title}</div>;
      })}
    </div>
  );
}
