import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiUsersThree } from "react-icons/pi";
import { GiBookshelf } from "react-icons/gi";
import { SiLevelsdotfyi } from "react-icons/si";
import { BsCalendar3 } from "react-icons/bs";
import DoughnutItem from "@/components/organisms/DoughnutItem";
import LineChartItem from "@/components/organisms/LineChartItem";
import { useRouter } from "next/router";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { AuthContext } from "@/pages/_app";
import PieChartItem from "@/components/organisms/PieChartItem";

const Dashboard = () => {
  const [group, setGroup] = useState(null);
  const router = useRouter();
  const { groupId } = router.query;
  const { currentUser } = useContext(AuthContext);

  let totalLevels = 0;

  if (group && group.members) {
    totalLevels = group.members.reduce((acc, member) => acc + member.level, 0);
  }

  const handleGetGroup = useCallback(async () => {
    try {
      const groupDocRef = doc(db, "groups", groupId);
      const groupDocSnapshot = await getDoc(groupDocRef);

      if (groupDocSnapshot.exists()) {
        let groupData = { id: groupId, ...groupDocSnapshot.data() };

        // Fetch members subcollection and combine with root user data
        const membersSnapshot = await getDocs(
          collection(groupDocRef, "members")
        );
        const membersWithUserData = [];
        for (const memberDoc of membersSnapshot.docs) {
          const userDocSnapshot = await getDoc(doc(db, "users", memberDoc.id));
          if (userDocSnapshot.exists()) {
            membersWithUserData.push({
              id: userDocSnapshot.id,
              ...userDocSnapshot.data(),
              ...memberDoc.data(), // combine member data from subcollection
            });
          }
        }
        groupData.members = membersWithUserData;

        // Fetch books subcollection and combine with root book data
        const booksSubcollectionSnapshot = await getDocs(
          collection(groupDocRef, "books")
        );
        const booksWithBookData = [];
        for (const bookSubDoc of booksSubcollectionSnapshot.docs) {
          const bookDocSnapshot = await getDoc(doc(db, "books", bookSubDoc.id));
          if (bookDocSnapshot.exists()) {
            booksWithBookData.push({
              id: bookDocSnapshot.id,
              ...bookDocSnapshot.data(),
              ...bookSubDoc.data(), // combine book data from subcollection
            });
          }
        }
        groupData.books = booksWithBookData;

        // Fetch chapterNumbers from member subcollection for the current user
        const memberDocRef = doc(
          db,
          "groups",
          groupId,
          "members",
          currentUser.uid
        );
        const memberDocSnapshot = await getDoc(memberDocRef);

        if (
          memberDocSnapshot.exists() &&
          memberDocSnapshot.data().chapterNumbers
        ) {
          groupData.oneselfChapterNumbers =
            memberDocSnapshot.data().chapterNumbers;
        }

        setGroup(groupData);
      }
    } catch (error) {
      console.error("Error fetching group:", error);
    }
  }, [currentUser.uid, groupId]);

  useEffect(() => {
    if (!groupId) return;
    handleGetGroup();
  }, [groupId, handleGetGroup]);

  console.log("group", group);
  if (!group) return;

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
          <Icon w="20px" h="20px" as={LuLayoutDashboard} />
          <Text fontWeight="bold">Dashboard</Text>
        </HStack>
      </Flex>
      <Box
        w="100%"
        margin="0px auto"
        style={{ height: "calc(100vh - 120px)" }}
        overflowY="auto"
      >
        <Box maxW="1084px" p="32px 16px" margin="0px auto">
          <VStack spacing={8}>
            <HStack spacing={8} w="100%">
              <Flex
                direction="column"
                w="25%"
                border="1px solid black"
                borderColor="gray.200"
                borderRadius="md"
                p={6}
                alignItems="center"
                bg="teal.100"
                boxShadow="md"
              >
                <Center
                  w="64px"
                  h="64px"
                  borderRadius="full"
                  mb={4}
                  bg="teal.300"
                  boxShadow="md"
                >
                  <Icon fontSize="32px" as={PiUsersThree} color="teal.800" />
                </Center>
                <VStack spacing={1} color="teal.800">
                  <Text fontSize="28px" fontWeight="bold">
                    {group.members?.length}
                  </Text>
                  <Text fontSize="sm">Total number of people</Text>
                </VStack>
              </Flex>
              <Flex
                direction="column"
                w="25%"
                border="1px solid black"
                borderColor="gray.200"
                borderRadius="md"
                p={6}
                alignItems="center"
                bg="blue.100"
                boxShadow="md"
              >
                <Center
                  w="64px"
                  h="64px"
                  borderRadius="full"
                  mb={4}
                  bg="blue.300"
                  boxShadow="md"
                >
                  <Icon fontSize="32px" as={GiBookshelf} color="teal.800" />
                </Center>
                <VStack spacing={1} color="teal.800">
                  <Text fontSize="28px" fontWeight="bold">
                    {group.books?.length}
                  </Text>
                  <Text fontSize="sm">Total number of books</Text>
                </VStack>
              </Flex>
              <Flex
                direction="column"
                w="25%"
                border="1px solid black"
                borderColor="gray.200"
                borderRadius="md"
                p={6}
                alignItems="center"
                bg="yellow.100"
                boxShadow="md"
              >
                <Center
                  w="64px"
                  h="64px"
                  borderRadius="full"
                  bg="yellow.300"
                  mb={4}
                  boxShadow="md"
                >
                  <Icon fontSize="28px" as={BsCalendar3} color="yellow.800" />
                </Center>
                <VStack spacing={1} color="yellow.800">
                  <Text fontSize="28px" fontWeight="bold">
                    {group.consecutiveWeeks}
                  </Text>
                  <Text fontSize="sm">Consecutive weeks</Text>
                </VStack>
              </Flex>
              <Flex
                direction="column"
                w="25%"
                border="1px solid black"
                borderColor="gray.200"
                borderRadius="md"
                p={6}
                alignItems="center"
                bg="red.100"
                boxShadow="md"
              >
                <Center
                  w="64px"
                  h="64px"
                  borderRadius="full"
                  mb={4}
                  bg="red.300"
                  boxShadow="md"
                >
                  <Icon fontSize="28px" as={SiLevelsdotfyi} color="red.800" />
                </Center>
                <VStack spacing={1} color="red.800">
                  <Text fontSize="28px" fontWeight="bold">
                    {totalLevels}
                  </Text>
                  <Text fontSize="sm">Group overall level</Text>
                </VStack>
              </Flex>
            </HStack>
            <HStack spacing={8} w="100%" alignItems="flex-start">
              <Flex
                w="75%"
                p={6}
                border="1px solid black"
                borderColor="gray.200"
                borderRadius="md"
                direction="column"
                boxShadow="md"
              >
                <Text fontSize="sm" fontWeight="bold">
                  Number of chapters
                </Text>
                <LineChartItem
                  groupChapterNumbers={group.chapterNumbers}
                  oneselfChapterNumbers={group.oneselfChapterNumbers}
                />
              </Flex>
              <Flex
                w="25%"
                p={6}
                border="1px solid black"
                borderColor="gray.200"
                borderRadius="md"
                direction="column"
                alignItems="center"
                boxShadow="md"
              >
                <Text fontSize="sm" fontWeight="bold" alignSelf="flex-start">
                  Group score
                </Text>
                <Center w="200px" h="200px" position="relative" my={4}>
                  <HStack spacing={0.5} position="absolute">
                    <Text fontSize="5xl" fontWeight="bold" color="teal.400">
                      {group.score}
                    </Text>
                  </HStack>
                  <DoughnutItem
                    percentage={group.experiencePoint}
                    type="USER_LEVEL"
                    backgroundColor={["#38B2AC", "#E2E8F0"]}
                    borderColor={["#4FD1C5", "#CBD5E0"]}
                  />
                </Center>
                <VStack alignSelf="flex-start" w="100%" alignItems="flex-start">
                  <HStack alignItems="flex-start">
                    <Box w="20px" h="20px" bg="teal.200" borderRadius="md" />
                    <Text fontSize="sm" fontWeight="bold">
                      あと{100 - group.experiencePoint}ptでDランク
                    </Text>
                  </HStack>
                  <HStack alignItems="flex-start">
                    <Box w="20px" h="20px" bg="yellow.200" borderRadius="md" />
                    <Text fontSize="sm" fontWeight="bold">
                      Top30圏内
                    </Text>
                  </HStack>
                  <HStack alignItems="flex-start">
                    <Box w="20px" h="20px" bg="red.200" borderRadius="md" />
                    <Text fontSize="sm" fontWeight="bold">
                      フロントエンド技術向上
                    </Text>
                  </HStack>
                  <HStack alignItems="flex-start">
                    <Box w="20px" h="20px" bg="red.200" borderRadius="md" />
                    <Text fontSize="sm" fontWeight="bold">
                      コーディング規則習得
                    </Text>
                  </HStack>
                </VStack>
              </Flex>
            </HStack>
            <HStack spacing={8} w="100%" alignItems="flex-start">
              <Flex
                w="75%"
                p={6}
                border="1px solid black"
                borderColor="gray.200"
                borderRadius="md"
                direction="column"
                boxShadow="md"
              >
                <Text fontSize="sm" fontWeight="bold">
                  Member Ranking
                </Text>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th pl={0}>Ranking</Th>
                        <Th>User</Th>
                        <Th>Books</Th>
                        <Th>Level</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td pl={0}>
                          <Text fontSize="xl">🥇</Text>
                        </Td>
                        <Td>
                          <Flex alignItems="center">
                            <Avatar
                              size="sm"
                              mr={4}
                              src="/images/avatar/1.png"
                            />
                            <Flex direction="column">
                              <Text fontSize="sm">ショウゴ</Text>
                              <Text fontSize="10px">@matsushoooo12</Text>
                            </Flex>
                          </Flex>
                        </Td>
                        <Td>12</Td>
                        <Td>
                          <Center w="48px" h="48px" position="relative">
                            <HStack spacing={0.5} position="absolute">
                              <Text fontWeight="bold" mt={2} fontSize="sm">
                                23
                              </Text>
                            </HStack>
                            <DoughnutItem
                              percentage={50}
                              type="QUEST_PROGRESS"
                            />
                          </Center>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td pl={0}>
                          <Text fontSize="xl">🥈</Text>
                        </Td>
                        <Td>
                          <Flex alignItems="center">
                            <Avatar
                              size="sm"
                              mr={4}
                              src="/images/avatar/2.png"
                            />
                            <Flex direction="column">
                              <Text fontSize="sm">ショウゴ</Text>
                              <Text fontSize="10px">@matsushoooo12</Text>
                            </Flex>
                          </Flex>
                        </Td>
                        <Td>12</Td>
                        <Td>
                          <Center w="48px" h="48px" position="relative">
                            <HStack spacing={0.5} position="absolute">
                              <Text fontWeight="bold" mt={2} fontSize="sm">
                                23
                              </Text>
                            </HStack>
                            <DoughnutItem
                              percentage={50}
                              type="QUEST_PROGRESS"
                            />
                          </Center>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td pl={0}>
                          <Text fontSize="xl">🥉</Text>
                        </Td>
                        <Td>
                          <Flex alignItems="center">
                            <Avatar
                              size="sm"
                              mr={4}
                              src="/images/avatar/3.png"
                            />
                            <Flex direction="column">
                              <Text fontSize="sm">ショウゴ</Text>
                              <Text fontSize="10px">@matsushoooo12</Text>
                            </Flex>
                          </Flex>
                        </Td>
                        <Td>12</Td>
                        <Td>
                          <Center w="48px" h="48px" position="relative">
                            <HStack spacing={0.5} position="absolute">
                              <Text fontWeight="bold" mt={2} fontSize="sm">
                                23
                              </Text>
                            </HStack>
                            <DoughnutItem
                              percentage={50}
                              type="QUEST_PROGRESS"
                            />
                          </Center>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Flex>
              <Flex
                w="25%"
                p={6}
                border="1px solid black"
                borderColor="gray.200"
                borderRadius="md"
                direction="column"
                boxShadow="md"
              >
                <Text fontSize="sm" fontWeight="bold" mb={4}>
                  Member Ranking
                </Text>
                <PieChartItem />
                <VStack alignItems="flex-start" spacing={0}>
                  <HStack>
                    <HStack mt={4}>
                      <Box
                        w="16px"
                        h="16px"
                        bg="gray.300"
                        borderRadius="full"
                      />
                      <Text fontSize="xs">TypeScript</Text>
                    </HStack>
                    <HStack mt={4}>
                      <Box
                        w="16px"
                        h="16px"
                        bg="gray.300"
                        borderRadius="full"
                      />
                      <Text fontSize="xs">TypeScript</Text>
                    </HStack>
                  </HStack>
                  <HStack>
                    <HStack mt={4}>
                      <Box
                        w="16px"
                        h="16px"
                        bg="gray.300"
                        borderRadius="full"
                      />
                      <Text fontSize="xs">TypeScript</Text>
                    </HStack>
                    <HStack mt={4}>
                      <Box
                        w="16px"
                        h="16px"
                        bg="gray.300"
                        borderRadius="full"
                      />
                      <Text fontSize="xs">TypeScript</Text>
                    </HStack>
                  </HStack>
                </VStack>
              </Flex>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
