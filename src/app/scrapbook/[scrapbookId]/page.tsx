'use client'
import Navbar from '@/app/components/navbar'
import { chevronLeftSVG, emojiSVG, hyperlinkSVG } from '@/svg'
import { useSearchParams, useParams } from 'next/navigation'
import { ReactElement, useState } from 'react'
import { colors } from '../../../../tailwind.config'

interface Scrapbook {
    id: string
    pages: number
}

export default function ScrapBookById() {

    const searchParams = useSearchParams()
    const params = useParams()
    const editMode: boolean = searchParams.get('editMode') == 'true'
    const scrapbookId = params['scrapbookId'] as string

    const [scrapbook, setScrapbook] = useState<Scrapbook>(getScrapbookById(scrapbookId))

    return (
        <main className='flex flex-col h-screen'>
            <Navbar></Navbar>
            <div id='scrapbook-content' className='w-screen min-h-1 grow bg-tertiary'>

            </div>
            {
                editMode &&
                <div id='editting-tools' className='flex flex-row bottom-0 bg-primary h-[9rem] p-3'>
                    <div className='flex flex-row flex-wrap w-[13rem]'>
                        {/* {toolIcon('/svg/T.svg')} */}
                        {toolIcon(hyperlinkSVG(colors.tertiary))}
                        {toolIcon(emojiSVG())}
                        {/* {toolIcon('/svg/sticker-icon.svg')}
                        {toolIcon('/svg/image-icon.svg')}
                        {toolIcon('/svg/video-icon.svg')} */}
                    </div>
                    <div className='flex flex-row items-baseline w-fit gap-3'>
                        <img src="/svg/pencil.png" alt="" className='h-[8rem] transition ease-in-out hover:translate-y-[-.5rem] hover:cursor-pointer' />
                        <img src="/svg/eraser.png" alt="" className='h-[4rem] transition ease-in-out hover:translate-y-[-.5rem] hover:cursor-pointer' />
                    </div>
                    <div className='w-[3rem]'>
                        {chevronLeftSVG(colors.tertiary)}
                    </div>
                </div>
            }

        </main>
    )
}

function toolIcon(svg: ReactElement): ReactElement {
    return (
        <div className='h-[4rem] transition ease-in-out hover:scale-110 hover:cursor-pointer'>
            {svg}
        </div>
    )
}

function getScrapbookById(id: string): Scrapbook {
    return {
        id: id,
        pages: 2
    }
}