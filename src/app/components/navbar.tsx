"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import TopNavbar from "component-nest/components/client/navbars/TopNavbar";
import TextLink from "component-nest/components/client/links/TextLink";
import ColorModeToggle from "component-nest/components/client/buttons/ColorModeToggle";

export default function Navbar() {
  let { user, error, isLoading } = useUser();

  const router = useRouter();

  return (
    <TopNavbar
      className="bg-primary"
      logoPathLightMode="/ourkive_logo_transparent.png"
      logoPathDarkMode="/ourkive_logo_transparent.png"
    >
      {/*Our Place Link*/}
      {user && (
        <TextLink
          className="link-text-color"
          onClick={() => router.push(`/ourplace`)}
        >
          OurPlace
        </TextLink>
      )}
      {/*Date Picker Link*/}
      {user && (
        <TextLink
          className="link-text-color"
          onClick={() => router.push(`/dategenerator`)}
        >
          Date Generator
        </TextLink>
      )}
      {/*Scrapbook Link*/}
      {user && (
        <TextLink
          className="link-text-color"
          onClick={() => router.push(`/scrapbook`)}
        >
          Scrapbook
        </TextLink>
      )}

      {/*My Account Link*/}
      {user && (
        <TextLink
          className="link-text-color"
          onClick={() => router.push("/myaccount")}
        >
          My Account
        </TextLink>
      )}

      {/* login/logout */}
      <TextLink
        className="link-text-color"
        onClick={() => router.push(`/api/auth/${user ? "logout" : "login"}`)}
      >
        {user ? "Log Out" : "Login"}
      </TextLink>
      <ColorModeToggle></ColorModeToggle>
    </TopNavbar>
  );
}
