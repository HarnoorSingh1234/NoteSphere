import LandingPage from "@/components/landingpage/landingpage";
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <>
      
  <LandingPage/>
    </>
  );
}
