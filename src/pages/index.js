/* eslint-disable react/no-unescaped-entities */
import { Inter } from "next/font/google";
import {
  Box,
  Button,
  Flex,
  Text,
  Image,
  Center,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/config/firebase";
import { useContext } from "react";
import { AuthContext } from "./_app";
import { useRouter } from "next/router";
import { HiOutlineUserGroup } from "react-icons/hi";

export default function Home() {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const googleLogin = async () => {
    await signInWithPopup(auth, googleProvider);
  };
  return (
    <>
      {currentUser?.uid && (
        <Flex
          w="100%"
          h="40px"
          borderBottom="1px solid black"
          borderColor="gray.200"
          alignItems="center"
          px={4}
        >
          <HStack spacing={4}>
            <Icon w="20px" h="20px" as={HiOutlineUserGroup} />
            <Text fontWeight="bold">Dashboard</Text>
          </HStack>
        </Flex>
      )}
      <Box w="100%" style={{ height: "calc(100vh - 120px)" }} overflowY="auto">
        {currentUser ? (
          <Flex
            maxW="1080px"
            margin="auto"
            alignItems="center"
            h="100%"
            justifyContent="center"
            direction="column"
          >
            <Image w="55%" src="/images/groups/create-group.svg" alt="" />
          </Flex>
        ) : (
          <Flex maxW="1080px" margin="auto" alignItems="center" h="100%">
            <Flex w="100%" alignItems="center">
              <Box w="50%">
                <Text fontSize="4xl" fontWeight="bold" mb={4}>
                  Start a new game with circle reading of tech books.
                </Text>
                <Text fontSize="xl" mb={4}>
                  Learn together, deepening engineers' knowledge with a playful
                  twist.
                </Text>
                <Center
                  justifyContent="flex-start"
                  onClick={() => router.push("/signup")}
                >
                  <Text
                    py={2}
                    px={5}
                    border="1px solid black"
                    borderColor="gray.200"
                    borderRadius="xl"
                    _hover={{ bg: "teal.100" }}
                    transition="ease-in-out 0.2s"
                    cursor="pointer"
                    bg="teal.200"
                    fontWeight="bold"
                  >
                    Get Started
                  </Text>
                </Center>
              </Box>
              <Box w="50%">
                <Image src="/images/lp/lp.svg" alt="" w="100%" />
              </Box>
            </Flex>
          </Flex>
        )}
      </Box>
    </>
  );
}
