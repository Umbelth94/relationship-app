//app/scrapbook
import { NextPage } from "next";
import {withPageAuthRequired} from '@auth0/nextjs-auth0';
import ScrapbookSelect from "../components/scrapbookSelect";


const Scrapbook: NextPage = withPageAuthRequired(
  async () => {
  return (
    <main className="h-screen w-screen">
      <ScrapbookSelect></ScrapbookSelect>
    </main>
  );
}, {returnTo: '/scrapbook'});

export default Scrapbook;
