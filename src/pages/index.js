import Image from "next/image";
import { Inter } from "next/font/google";
import { Button } from "@chakra-ui/react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/config/firebase";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const googleLogin = async () => {
    await signInWithPopup(auth, googleProvider);
  };
  return <Button onClick={googleLogin}>Googleログイン</Button>;
}
