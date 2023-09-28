import Layout from "@/components/layouts/main/Layout";
import TopLayout from "@/components/layouts/top/TopLayout";
import { auth } from "@/config/firebase";
import "@/styles/globals.css";
import { Center, ChakraProvider, Spinner } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";

export const AuthContext = createContext({});

export default function App({ Component, pageProps }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          name: user.displayName,
          email: user.email,
          photoUrl: user.photoURL,
          uid: user.uid,
        });
      } else {
        setCurrentUser(null);
      }
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    });
  }, []);
  if (loading) {
    return (
      <ChakraProvider>
        <Center h="100vh">
          <BounceLoader color="#4FD1C5" />
        </Center>
      </ChakraProvider>
    );
  }
  return (
    <ChakraProvider>
      <AuthContext.Provider
        value={{
          currentUser,
          setCurrentUser,
          loading,
          setLoading,
        }}
      >
        {currentUser ? (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        ) : (
          // <TopLayout>
          <Component {...pageProps} />
          // </TopLayout>
        )}
      </AuthContext.Provider>
    </ChakraProvider>
  );
}
