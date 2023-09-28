import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AiOutlineSearch, AiOutlineShop } from "react-icons/ai";
import { BiCoinStack } from "react-icons/bi";
import { AuthContext } from "../_app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { useRouter } from "next/router";

const avatars = [
  {
    id: 1,
    name: "Sarah Martinez",
    imageUrl: "/images/avatar/avatar_1.jpg",
    coin: 50,
  },
  {
    id: 2,
    name: "Emily Thompson",
    imageUrl: "/images/avatar/avatar_2.jpg",
    coin: 75,
  },
  {
    id: 3,
    name: "Jake Harrison",
    imageUrl: "/images/avatar/avatar_3.jpg",
    coin: 100,
  },
  {
    id: 4,
    name: "Lucas Fitzgerald",
    imageUrl: "/images/avatar/avatar_4.jpg",
    coin: 125,
  },
  {
    id: 5,
    name: "Michael Caldwell",
    imageUrl: "/images/avatar/avatar_5.jpg",
    coin: 150,
  },
  {
    id: 6,
    name: "Olivia Preston",
    imageUrl: "/images/avatar/avatar_6.jpg",
    coin: 175,
  },
  {
    id: 7,
    name: "Benjamin Wallace",
    imageUrl: "/images/avatar/avatar_7.jpg",
    coin: 200,
  },
  {
    id: 8,
    name: "Grace Mitchell",
    imageUrl: "/images/avatar/avatar_8.jpg",
    coin: 225,
  },
  {
    id: 9,
    name: "Nathan Brooks",
    imageUrl: "/images/avatar/avatar_9.jpg",
    coin: 250,
  },
];

const icebreaks = [
  {
    id: 1,
    name: "即興エンジニアソング",
    imageUrl: "/images/icebreak/undraw_compose_music_re_wpiw.svg",
    coin: 50,
  },
  {
    id: 2,
    name: "Reactについて語ろう",
    imageUrl: "/images/icebreak/undraw_react_re_g3ui.svg",
    coin: 75,
  },
  {
    id: 3,
    name: "Googleアースで画像の場所",
    imageUrl: "/images/icebreak/undraw_world_re_768g.svg",
    coin: 100,
  },
  {
    id: 4,
    name: "私の名前は？",
    imageUrl: "/images/icebreak/undraw_about_me_re_82bv.svg",
    coin: 125,
  },
  {
    id: 5,
    name: "無人島の告知",
    imageUrl: "/images/icebreak/undraw_among_nature_p1xb.svg",
    coin: 150,
  },
  {
    id: 6,
    name: "今日の朝ごはん",
    imageUrl: "/images/icebreak/undraw_breakfast_psiw.svg",
    coin: 175,
  },
];

const Shop = () => {
  const [avatar, setAvatar] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();
  const { currentUser } = useContext(AuthContext);
  const [loginUserData, setLoginUserData] = useState(null);
  const [users, setUsers] = useState(null);
  const [pointData, setPointData] = useState(300);

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
  return (
    <>
      <Flex
        w="100%"
        h="40px"
        borderBottom="0.3px solid black"
        borderColor="gray.200"
        alignItems="center"
        px={4}
        boxShadow="md"
      >
        <HStack spacing={4}>
          <Icon w="20px" h="20px" as={AiOutlineShop} />
          <Text fontWeight="bold">Shop</Text>
        </HStack>
      </Flex>
      <Box
        w="100%"
        style={{ height: "calc(100vh - 120px)" }}
        overflowY="auto"
        margin="0px auto"
      >
        <Box maxW="1200px" margin="0px auto" p="64px 16px">
          <Flex>
            <Tabs variant="soft-rounded" colorScheme="teal" flex={1}>
              <TabList>
                <Tab>Avatar</Tab>
                <Tab>Ice Break</Tab>
                <Tab>Markdown Editor</Tab>
                <Tab>Discussion</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Grid gap={6} templateColumns="repeat(4, 1fr)">
                    {avatars?.map((avatar) => (
                      <GridItem
                        key={avatar.id}
                        onClick={() => {
                          setAvatar(avatar);
                          onOpen();
                        }}
                        w="100%"
                        border="0.3px solid black"
                        borderColor="gray.200"
                        borderRadius="md"
                        cursor="pointer"
                        _hover={{ bg: "gray.100" }}
                        transition="ease-in-out 0.2s"
                        boxShadow="md"
                      >
                        <Image
                          w="100%"
                          h="160px"
                          src={avatar.imageUrl}
                          alt=""
                          objectFit="cover"
                          borderTopRadius="md"
                        />
                        <VStack alignItems="flex-start" p={2}>
                          <Text fontSize="sm" fontWeight="bold">
                            {avatar.name}
                          </Text>
                          <HStack>
                            <Icon color="yellow.500" as={BiCoinStack} />
                            <Text fontSize="sm" fontWeight="bold">
                              {avatar.coin}
                            </Text>
                          </HStack>
                        </VStack>
                      </GridItem>
                    ))}
                  </Grid>
                </TabPanel>
                <TabPanel>
                  <Grid gap={6} templateColumns="repeat(4, 1fr)">
                    {icebreaks?.map((icebreak) => (
                      <GridItem
                        key={icebreak.id}
                        // onClick={onClick}
                        w="100%"
                        border="0.3px solid black"
                        borderColor="gray.200"
                        borderRadius="md"
                        cursor="pointer"
                        _hover={{ bg: "gray.100" }}
                        transition="ease-in-out 0.2s"
                        boxShadow="md"
                      >
                        <Image
                          w="100%"
                          h="160px"
                          src={icebreak.imageUrl}
                          alt=""
                          objectFit="cover"
                          borderTopRadius="md"
                        />
                        <VStack alignItems="flex-start" p={2}>
                          <Text fontSize="sm" fontWeight="bold">
                            {icebreak.name}
                          </Text>
                          <HStack>
                            <Icon color="yellow.500" as={BiCoinStack} />
                            <Text fontSize="sm" fontWeight="bold">
                              {icebreak.coin}
                            </Text>
                          </HStack>
                        </VStack>
                      </GridItem>
                    ))}
                  </Grid>
                </TabPanel>
                <TabPanel>
                  <Grid gap={6} templateColumns="repeat(3, 1fr)">
                    <Box w="100%" bg="gray.100" p={4} borderRadius="lg">
                      <Image
                        w="100%"
                        h="160px"
                        alt=""
                        src="/images/markdown/1.png"
                        mb={2}
                        objectPosition="-5px 10"
                        objectFit="cover"
                        borderRadius="lg"
                        bg="gray.800"
                      />
                      <Text fontWeight="bold">Basic</Text>
                      <HStack>
                        <Icon color="yellow.500" as={BiCoinStack} />
                        <Text fontSize="sm" fontWeight="bold">
                          350
                        </Text>
                      </HStack>
                    </Box>
                  </Grid>
                </TabPanel>
                <TabPanel>
                  <Grid gap={4} templateColumns="repeat(4, 1fr)">
                    <Box w="100%" bg="gray.100" p={4} borderRadius="lg">
                      <Box
                        w="100%"
                        h="160px"
                        bg="white"
                        borderRadius="lg"
                        mb={2}
                      />
                      <Text fontWeight="bold">面白いアイスブレイク</Text>
                      <HStack>
                        <Icon color="yellow.500" as={BiCoinStack} />
                        <Text fontSize="sm" fontWeight="bold">
                          350
                        </Text>
                      </HStack>
                    </Box>
                    <Box w="100%" bg="gray.100" p={4} borderRadius="lg">
                      <Box
                        w="100%"
                        h="160px"
                        bg="white"
                        borderRadius="lg"
                        mb={2}
                      />
                      <Text fontWeight="bold">面白いアイスブレイク</Text>
                      <HStack>
                        <Icon color="yellow.500" as={BiCoinStack} />
                        <Text fontSize="sm" fontWeight="bold">
                          350
                        </Text>
                      </HStack>
                    </Box>
                    <Box w="100%" bg="gray.100" p={4} borderRadius="lg">
                      <Box
                        w="100%"
                        h="160px"
                        bg="white"
                        borderRadius="lg"
                        mb={2}
                      />
                      <Text fontWeight="bold">面白いアイスブレイク</Text>
                      <HStack>
                        <Icon color="yellow.500" as={BiCoinStack} />
                        <Text fontSize="sm" fontWeight="bold">
                          350
                        </Text>
                      </HStack>
                    </Box>
                    <Box w="100%" bg="gray.100" p={4} borderRadius="lg">
                      <Box
                        w="100%"
                        h="160px"
                        bg="white"
                        borderRadius="lg"
                        mb={2}
                      />
                      <Text fontWeight="bold">面白いアイスブレイク</Text>
                      <HStack>
                        <Icon color="yellow.500" as={BiCoinStack} />
                        <Text fontSize="sm" fontWeight="bold">
                          350
                        </Text>
                      </HStack>
                    </Box>
                    <Box w="100%" bg="gray.100" p={4} borderRadius="lg">
                      <Box
                        w="100%"
                        h="160px"
                        bg="white"
                        borderRadius="lg"
                        mb={2}
                      />
                      <Text fontWeight="bold">面白いアイスブレイク</Text>
                      <HStack>
                        <Icon color="yellow.500" as={BiCoinStack} />
                        <Text fontSize="sm" fontWeight="bold">
                          350
                        </Text>
                      </HStack>
                    </Box>
                  </Grid>
                </TabPanel>
              </TabPanels>
            </Tabs>
            <Box ml={4}>
              <>
                <Flex
                  p={4}
                  bg="gray.100"
                  borderRadius="lg"
                  direction="column"
                  w="100%"
                  mb={4}
                >
                  <HStack w="100%" borderRadius="lg">
                    {/* <Icon as={BiCoinStack} fontSize="5xl" mb={2.5} /> */}
                    <Image
                      width="64px"
                      height="64px"
                      alt=""
                      src="/images/present/3.png"
                    />
                    <HStack color="teal.700">
                      <Text fontSize="5xl" fontWeight="bold">
                        {pointData}
                      </Text>
                      <Text fontWeight="bold" mt={3}>
                        Pts
                      </Text>
                    </HStack>
                    <Button
                      fontSize="xs"
                      bg="teal.100"
                      color="teal.700"
                      borderRadius="full"
                      alignSelf="flex-start"
                    >
                      Charge
                    </Button>
                  </HStack>
                </Flex>
                <Box bg="gray.100" p="4" borderRadius="lg" color="black" mb={8}>
                  <Flex
                    mb={4}
                    justifyContent="space-between"
                    alignItems="center"
                  >
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
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={4}>
            <HStack spacing={4} alignItems="flex-start">
              <Flex w="170px" h="170px" position="relative">
                <HStack position="absolute" left="8px" top="8px">
                  <Icon color="yellow.500" as={BiCoinStack} />
                  <Text fontSize="sm" fontWeight="bold">
                    {avatar?.coin}
                  </Text>
                </HStack>
                <Image
                  width="170px"
                  height="170px"
                  alt=""
                  src={avatar?.imageUrl}
                  style={{ borderRadius: "8px" }}
                />
              </Flex>
              <VStack alignItems="flex-start" flex={1}>
                <Text fontSize="xl" fontWeight="bold">
                  {avatar?.name}
                </Text>
                <Text fontSize="sm">
                  若年の女性、Sarahはオリーブ色の肌に中程度のカールの黒髪とヘーゼルの目を持ち、音楽とアクティブなライフスタイルを愛している。
                </Text>
                <Button
                  w="100%"
                  bg="teal.100"
                  color="teal.700"
                  onClick={() => {
                    toast({
                      title: "アイテムを購入しました。",
                      status: "success",
                      duration: 9000,
                      isClosable: true,
                      position: "top",
                    });
                    setPointData(250);
                    onClose();
                  }}
                >
                  購入する
                </Button>
              </VStack>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Shop;
