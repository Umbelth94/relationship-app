import Scrapbook from "@/app/models/scrapbook/scrapbook";
import ScrapbookCollectionResponseData from "@/app/models/scrapbook/scrapbooksCollectionResponseData";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";

export function useScrapbooks():Scrapbook[] {
  const { user } = useUser();
  const [scrapbooks, setScrapbooks]= useState<Scrapbook[]>([]);
  let request = fetch(`${process.env.API_BASE_URL}api/protected/scrapbooks`);
  useEffect(() => {
    if (user) {
      request.then((res) => {
        res.json().then((data: ScrapbookCollectionResponseData) => {
          setScrapbooks(data.scrapbooks);
        });
      });
    }
  }, [user]);
  return scrapbooks;
}
