import Scrapbook from "@/app/models/scrapbook/scrapbook";
import ScrapbookCollectionResponseData from "@/app/models/scrapbook/scrapbooksCollectionResponseData";
import { useUser } from "@auth0/nextjs-auth0/client";
import { use, useEffect, useState } from "react";

export function useScrapbooks(): Scrapbook[] {
  const { user } = useUser();
  const [scrapbooks, setScrapbooks] = useState<Scrapbook[]>([]);
  const [ didFetch, setDidFetch ] = useState<boolean>(false)
  useEffect(() => {
    if (user && didFetch == false) {
      setDidFetch(true)
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/protected/scrapbooks`).then((res) => {
        res.json().then((data: ScrapbookCollectionResponseData) => {
          setScrapbooks(data.scrapbooks);
        });
      });
    }
  }, [user]);
  return scrapbooks;
}
