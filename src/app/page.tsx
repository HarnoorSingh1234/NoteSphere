import LandingPage from "@/components/landingpage/landingpage";
import Navbar from "@/components/Navbar";
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />
      <LandingPage/>
    </>
  );
}
