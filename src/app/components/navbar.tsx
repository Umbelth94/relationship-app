"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import TopNavbar from "component-nest/components/client/navbars/TopNavbar";
import TextLink from "component-nest/components/client/links/TextLink";

export default function Navbar() {
  let { user, error, isLoading } = useUser();

  const router = useRouter();

  return (
    <TopNavbar
      logoPathLightMode="/ourkive_logo_transparent.png"
      logoPathDarkMode="/ourkive_logo_transparent.png"
    >
      {}
      {user && (
        <TextLink onClick={() => router.push(`/scrapbook`)}>Scrapbook</TextLink>
      )}
      {user && (
        <TextLink onClick={() => router.push("/myaccount")}>
          My Account
        </TextLink>
      )}

      {/* login/logout */}
      <TextLink
        onClick={() => router.push(`/api/auth/${user ? "logout" : "login"}`)}
      >
        {user ? "Log Out" : "Login"}
      </TextLink>
    </TopNavbar>
  );
}
