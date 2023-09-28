import { auth, db, googleProvider } from "@/config/firebase";
import { Box, Flex, Image, Text, VStack } from "@chakra-ui/react";
import { signInWithPopup } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React from "react";

const SignUp = () => {
  const router = useRouter();
  const googleLogin = async () => {
    await signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        // ユーザーデータ取得
        const user = result.user;
        // 保存用にデータを加工
        const userData = {
          displayName: "Chris Hemsworth",
          email: user.email,
          userId: "ChrisHemsworth5678",
          photoUrl: "/images/avatar/avatar_5.jpg",
          provider: "google",
          providerId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          backgroundImageUrl: "/images/projects/2.jpeg",
          level: 0,
          experiencePoint: 0,
          skillImageUrl: "/images/logo/1.PNG",
        };
        // ユーザーデータを保存
        await setDoc(doc(db, "users", user.uid), {
          ...userData,
        });

        // groupsコレクションに新しいドキュメントを作成
        const groupData = {
          name: "Chris Hemsworthの部屋",
          imageUrl: "/images/avatar/avatar_5.jpg",
          score: "E",
          experiencePoint: 0,
          consecutiveWeeks: 0,
        };
        const groupRef = await addDoc(collection(db, "groups"), groupData);

        // groupsのサブコレクションであるmembersにドキュメントを作成
        const memberData = {
          status: "manager",
        };
        await setDoc(
          doc(db, "groups", groupRef.id, "members", user.uid),
          memberData
        );

        // 新しく作成されたgroupのドキュメントIDを取得して、そのIDを使用してルートを変更
        if (typeof window !== "undefined") {
          window.location.href = `/groups/${groupRef.id}/dashboard`;
        }
      })
      .catch((error) => {
        // Handle Errors here.
        alert(error.message);
        // ...
      });
  };
  return (
    <>
      <Image
        h="40px"
        src="/images/logo/1.png"
        alt=""
        position="fixed"
        top="40px"
        left="40px"
      />
      <Flex w="100%" h="100vh">
        <Flex
          alignItems="center"
          justifyContent="center"
          direction="column"
          w="65%"
        >
          <Flex mb={8}>
            <Text fontSize="3xl" fontWeight="bold" mr={4}>
              Welcome to
            </Text>
            <Image h="40px" src="/images/logo/2.png" alt="" />
          </Flex>
          <Image src="/images/lp/lp.svg" w="50%" alt="" />
        </Flex>
        <Flex
          alignItems="center"
          justifyContent="center"
          direction="column"
          w="35%"
          bg="teal.100"
          borderLeft="1px solid black"
          borderColor="gray.200"
        >
          <Flex mb={4}>
            <Text fontSize="3xl" fontWeight="bold" mr={4}>
              Login To RinDo
            </Text>
          </Flex>
          <VStack spacing={4}>
            <Flex
              w="280px"
              p={2}
              justifyContent="center"
              alignItems="center"
              borderRadius="xl"
              cursor="pointer"
              bg="white"
              border="1px solid black"
              borderColor="gray.200"
              _hover={{ bg: "gray.100" }}
              transition="ease-in-out 0.2s"
              onClick={googleLogin}
            >
              <Image src="/images/auth/google.svg" alt="" mr={2} w="30px" />
              <Text fontWeight="bold">Continue with Google</Text>
            </Flex>
            <Flex
              cursor="pointer"
              border="1px solid black"
              borderColor="gray.200"
              w="280px"
              p={2}
              justifyContent="center"
              alignItems="center"
              borderRadius="xl"
              _hover={{ bg: "gray.100" }}
              transition="ease-in-out 0.2s"
              bg="white"
            >
              <Image src="/images/auth/github.svg" alt="" mr={2} />
              <Text fontWeight="bold">Continue with GitHub</Text>
            </Flex>
            <Flex
              cursor="pointer"
              border="1px solid black"
              borderColor="gray.200"
              w="280px"
              p={2}
              justifyContent="center"
              alignItems="center"
              borderRadius="xl"
              _hover={{ bg: "gray.100" }}
              transition="ease-in-out 0.2s"
              bg="white"
            >
              <Image src="/images/auth/github.svg" alt="" mr={2} />
              <Text fontWeight="bold">Continue with GitHub</Text>
            </Flex>
          </VStack>
        </Flex>
      </Flex>
    </>
  );
};

export default SignUp;
