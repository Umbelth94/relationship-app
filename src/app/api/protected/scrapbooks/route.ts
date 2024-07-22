import ScrapbookCollectionResponseData from '@/app/models/scrapbook/scrapbooksCollectionResponseData';
import { NextRequest, NextResponse } from 'next/server';

export function GET(req: NextRequest, res: NextResponse<ScrapbookCollectionResponseData>){
    const responseData: ScrapbookCollectionResponseData = {
        scrapbooks: [
            {title: "My First Scrapbook"},
            {title: "My Second Scrapbook"},
            {title: "My Third Scrapbook"},
            {title: "My Fourth Scrapbook"}
        ]
    }
}