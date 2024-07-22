import Scrapbook from '@/app/models/scrapbook/scrapbook';
import ScrapbookCollectionResponseData from '@/app/models/scrapbook/scrapbooksCollectionResponseData';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';

export function useScrapbooks() {
    const {user} = useUser()
    let scrapbooks: Scrapbook[] = []
    let request = fetch(`${process.env.API_BASE_URL}api/protected/scrapbooks`)
    useEffect(() => {
        if(user) {
            request.then(res => {
                res.json().then((data: ScrapbookCollectionResponseData) => {
                    scrapbooks = data.scrapbooks
                })
            })
        }
    }, [user])
}