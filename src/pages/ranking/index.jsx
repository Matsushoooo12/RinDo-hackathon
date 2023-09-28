import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Grid,
  Flex,
  Text,
  HStack,
  VStack,
  Avatar,
  Center,
  Icon,
  Box,
  Image,
  Button,
} from "@chakra-ui/react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import DoughnutItem from "@/components/organisms/DoughnutItem";
import { db } from "@/config/firebase";
import { GiRank3 } from "react-icons/gi";
import { useRouter } from "next/router";
import { AuthContext } from "../_app";

const Ranking = () => {
  const router = useRouter();
  const { groupId, projectId } = router.query;
  const [users, setUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [loginUserData, setLoginUserData] = useState(null);

  const handleGetLoginUser = useCallback(async () => {
    if (currentUser?.uid) {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setLoginUserData(userSnap.data());
      } else {
        console.error("No such user!");
      }
    }
  }, [currentUser.uid]);

  useEffect(() => {
    handleGetLoginUser();
  }, [handleGetLoginUser]);

  const handleGetUsers = useCallback(async () => {
    // usersコレクションを取得し、levelフィールドで降順に並べるクエリを作成
    const q = query(collection(db, "users"), orderBy("level", "desc"));

    try {
      const querySnapshot = await getDocs(q);
      const fetchedUsers = querySnapshot.docs.map((doc) => doc.data());
      setUsers(fetchedUsers); // 取得したユーザーのリストをステートにセット
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  }, [setUsers]);

  useEffect(() => {
    handleGetUsers();
  }, [handleGetUsers]);

  console.log(users?.slice(0, 3));

  console.log("users", users);
  return (
    <>
      <Flex
        w="100%"
        h="40px"
        borderBottom="1px solid black"
        borderColor="gray.200"
        alignItems="center"
        px={4}
        boxShadow="md"
      >
        <HStack spacing={4}>
          <Icon w="20px" h="20px" as={GiRank3} />
          <Text fontWeight="bold">Ranking</Text>
        </HStack>
      </Flex>
      <Box
        w="100%"
        style={{ height: "calc(100vh - 120px)" }}
        overflowY="auto"
        margin="0px auto"
      >
        <Flex maxW="1080px" justifyContent="center" margin="auto">
          <Box margin="0px auto" p="32px 16px" w="100%" flex={1}>
            {users?.slice(0, 3).map((user, index) => (
              <>
                {index === 0 && (
                  <Flex
                    key={user.id}
                    w="100%"
                    bg="yellow.100"
                    borderRadius="lg"
                    p={2}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <HStack>
                      <Text fontSize="2xl">🥇</Text>
                      <Avatar src={user.photoUrl} />
                      <Flex direction="column">
                        <Text fontSize="xl" fontWeight="bold">
                          {user.displayName}
                        </Text>
                        <Text fontSize="xs" fontWeight="bold" color="gray.500">
                          @{user.userId}
                        </Text>
                      </Flex>
                    </HStack>
                    <Center w="64px" h="64px" position="relative">
                      <Text position="absolute" fontWeight="bold" fontSize="lg">
                        {user.level}
                      </Text>
                      <DoughnutItem
                        percentage={user.level}
                        type="USER_LEVEL"
                        backgroundColor={["#38B2AC", "#E2E8F0"]}
                        borderColor={["#4FD1C5", "#CBD5E0"]}
                      />
                    </Center>
                  </Flex>
                )}
                {index === 1 && (
                  <Flex
                    key={user.id}
                    w="100%"
                    bg="gray.100"
                    borderRadius="lg"
                    p={2}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <HStack>
                      <Text fontSize="2xl">🥈</Text>
                      <Avatar src={user.photoUrl} />
                      <Flex direction="column">
                        <Text fontSize="xl" fontWeight="bold">
                          {user.displayName}
                        </Text>
                        <Text fontSize="xs" fontWeight="bold" color="gray.500">
                          @{user.userId}
                        </Text>
                      </Flex>
                    </HStack>
                    <Center w="64px" h="64px" position="relative">
                      <Text position="absolute" fontWeight="bold" fontSize="lg">
                        {user.level}
                      </Text>
                      <DoughnutItem
                        percentage={user.level}
                        type="USER_LEVEL"
                        backgroundColor={["#38B2AC", "#E2E8F0"]}
                        borderColor={["#4FD1C5", "#CBD5E0"]}
                      />
                    </Center>
                  </Flex>
                )}
                {index === 2 && (
                  <Flex
                    key={user.id}
                    w="100%"
                    bg="orange.100"
                    borderRadius="lg"
                    p={2}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <HStack>
                      <Text fontSize="2xl">🥉</Text>
                      <Avatar src={user.photoUrl} />
                      <Flex direction="column">
                        <Text fontSize="xl" fontWeight="bold">
                          {user.displayName}
                        </Text>
                        <Text fontSize="xs" fontWeight="bold" color="gray.500">
                          @{user.userId}
                        </Text>
                      </Flex>
                    </HStack>
                    <Center w="64px" h="64px" position="relative">
                      <Text position="absolute" fontWeight="bold" fontSize="lg">
                        {user.level}
                      </Text>
                      <DoughnutItem
                        percentage={user.level}
                        type="USER_LEVEL"
                        backgroundColor={["#38B2AC", "#E2E8F0"]}
                        borderColor={["#4FD1C5", "#CBD5E0"]}
                      />
                    </Center>
                  </Flex>
                )}
              </>
            ))}
            {users?.slice(3).map((user, index) => (
              <Flex
                w="100%"
                bg="white"
                borderRadius="lg"
                p={2}
                justifyContent="space-between"
                alignItems="center"
                key={user.id}
              >
                <HStack>
                  <Center
                    mr={1}
                    ml={1}
                    w="16px"
                    h="16px"
                    borderRadius="full"
                    bg="teal.300"
                    p={2}
                  >
                    <Text fontSize="xs" fontWeight="bold" color="white">
                      {index + 4}
                    </Text>
                  </Center>
                  <Avatar w="40px" h="40px" src={user.photoUrl} />
                  <Flex direction="column">
                    <Text fontSize="lg" fontWeight="bold">
                      {user.displayName}
                    </Text>
                    <Text fontSize="xs" fontWeight="bold" color="gray.500">
                      @{user.userId}
                    </Text>
                  </Flex>
                </HStack>
                <Center w="48px" h="48px" position="relative">
                  <Text position="absolute" fontWeight="bold" fontSize="sm">
                    {user.level}
                  </Text>
                  <DoughnutItem
                    percentage={user.level}
                    type="USER_LEVEL"
                    backgroundColor={["#38B2AC", "#E2E8F0"]}
                    borderColor={["#4FD1C5", "#CBD5E0"]}
                  />
                </Center>
              </Flex>
            ))}
          </Box>
          <Box mt="32px" mr="16px">
            <>
              <Flex
                p={4}
                bg="white"
                mb={4}
                borderRadius="lg"
                direction="column"
                w="100%"
                alignItems="center"
                position="relative"
                border="1px solid black"
                borderColor="gray.200"
                boxShadow="md"
              >
                <Center
                  position="absolute"
                  top="10px"
                  right="10px"
                  py={2}
                  px={4}
                  borderRadius="full"
                  bg="teal.100"
                  fontWeight="bold"
                  color="teal.700"
                >
                  28
                </Center>
                <Center w="160px" h="160px" mb={4} position="relative">
                  <HStack spacing={0.5} position="absolute">
                    <Text fontSize="4xl" fontWeight="bold">
                      0
                    </Text>
                  </HStack>
                  <DoughnutItem
                    percentage={loginUserData?.level}
                    type="QUEST_PROGRESS"
                  />
                </Center>
                <HStack alignItems="flex-start">
                  <Avatar
                    src={loginUserData?.photoUrl}
                    width="40px"
                    height="40px"
                  />
                  <Box color="black">
                    <Text fontWeight="bold" fontSize="lg">
                      {loginUserData?.displayName}
                    </Text>
                    <Text fontSize="sm">@{loginUserData?.userId}</Text>
                  </Box>
                </HStack>
              </Flex>
              <Box
                border="1px solid black"
                borderColor="gray.200"
                boxShadow="md"
                p="4"
                borderRadius="lg"
                color="black"
                mb={8}
              >
                <Flex mb={4} justifyContent="space-between" alignItems="center">
                  <Text fontWeight="bold" fontSize="lg">
                    Ranking
                  </Text>
                  <Button
                    borderRadius="full"
                    fontSize="sm"
                    bg="gray.300"
                    py={2}
                    onClick={() => router.push("/ranking")}
                  >
                    See all
                  </Button>
                </Flex>
                <VStack alignItems="flex-start">
                  {users?.map((user, index) => (
                    <HStack
                      key={user.id}
                      p={2}
                      _hover={{ bg: "gray.300" }}
                      w="100%"
                      borderRadius="lg"
                      cursor="pointer"
                    >
                      <HStack>
                        {index === 0 && <Text fontSize="xl">🥇</Text>}
                        {index === 1 && <Text fontSize="xl">🥈</Text>}
                        {index === 2 && <Text fontSize="xl">🥉</Text>}
                        {index > 2 && (
                          <Center
                            mr={1}
                            ml={1}
                            w="8px"
                            h="8px"
                            borderRadius="full"
                            bg="teal.300"
                            p={2}
                          >
                            <Text
                              fontSize="10px"
                              fontWeight="bold"
                              color="white"
                            >
                              {index + 1}
                            </Text>
                          </Center>
                        )}
                        <Image
                          width="40px"
                          height="40px"
                          alt=""
                          src={user?.photoUrl}
                          style={{ borderRadius: "100px" }}
                        />
                        <Box>
                          <Text fontWeight="bold">{user?.displayName}</Text>
                          <Text fontSize="xs">@{user?.userId}</Text>
                        </Box>
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Ranking;
