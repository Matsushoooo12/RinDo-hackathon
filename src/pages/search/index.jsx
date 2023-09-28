/* eslint-disable react/display-name */
import { Badges } from "@/components/atoms/Badges";
import { Rating } from "@/components/atoms/Rating";
import { useLayout } from "@/components/layouts/main/Layout";
import DoughnutItem from "@/components/organisms/DoughnutItem";
import BookCard from "@/components/organisms/books/BookCard";
import GroupCard from "@/components/organisms/groups/GroupCard";
import UserCard from "@/components/organisms/users/UserCard";
import { db } from "@/config/firebase";
import { booksData, groupBooksData } from "@/lib/data";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  Wrap,
  WrapItem,
  useDisclosure,
  useMultiStyleConfig,
  useTab,
  useToast,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { forwardRef, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";

const Search = () => {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState(null);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const { searchTerm, setSearchTerm } = useLayout();
  const toast = useToast();
  const handleToastClick = () => {
    toast({
      title: `You invited ${user.displayName}!`,
      position: "top",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const [filteredBooks, setFilteredBooks] = useState(booksData);

  useEffect(() => {
    const results = booksData.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.tags.some((tag) =>
          tag.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    setFilteredBooks(results);
  }, [searchTerm]);

  const {
    isOpen: isAddBookOpen,
    onOpen: onAddBookOpen,
    onClose: onAddBookClose,
  } = useDisclosure();

  const {
    isOpen: isBookDetailOpen,
    onOpen: onBookDetailOpen,
    onClose: onBookDetailClose,
  } = useDisclosure();

  const {
    isOpen: isUserDetailOpen,
    onOpen: onUserDetailOpen,
    onClose: onUserDetailClose,
  } = useDisclosure();

  const handleBookStockToast = () => {
    toast({
      title: `リーダブルコードをストックしました。`,
      position: "top",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleGetGroups = async () => {
    const groupsCollection = collection(db, "groups");
    const groupsSnapshot = await getDocs(groupsCollection);

    // 各groupに関連するbooksとmembersを非同期で取得
    const enrichedGroups = await Promise.all(
      groupsSnapshot.docs.map(async (groupDoc) => {
        const groupData = groupDoc.data();
        const groupId = groupDoc.id;

        // groupのサブコレクションであるbooksのドキュメントIDを取得
        const booksSubCollection = collection(groupDoc.ref, "books");
        const booksSnapshot = await getDocs(booksSubCollection);
        const bookIds = booksSnapshot.docs.map((bookDoc) => bookDoc.id);

        // groupのサブコレクションであるmembersのドキュメントIDを取得
        const membersSubCollection = collection(groupDoc.ref, "members");
        const membersSnapshot = await getDocs(membersSubCollection);
        const memberIds = membersSnapshot.docs.map((memberDoc) => memberDoc.id);

        // 各bookIdに関連するルートのbooksコレクションのドキュメントを取得
        const booksData = await Promise.all(
          bookIds.map(async (bookId) => {
            const bookSnapshot = await getDoc(doc(db, "books", bookId));
            return bookSnapshot.exists() ? bookSnapshot.data() : null;
          })
        );

        // 各memberIdに関連するルートのusersコレクションのドキュメントを取得
        const membersData = await Promise.all(
          memberIds.map(async (memberId) => {
            const userSnapshot = await getDoc(doc(db, "users", memberId));
            return userSnapshot.exists() ? userSnapshot.data() : null;
          })
        );

        return {
          ...groupData,
          id: groupId,
          books: booksData, // booksキーとしてデータを挿入
          members: membersData, // membersキーとしてデータを挿入
        };
      })
    );

    setGroups(enrichedGroups);
  };

  console.log("books", books);

  const handleGetBooks = async () => {
    const booksCollection = collection(db, "books");
    const booksSnapshot = await getDocs(booksCollection);

    const booksList = await Promise.all(
      booksSnapshot.docs.map(async (doc) => {
        const bookData = doc.data();
        const tags = bookData.tags; // tagsフィールドの値を取得

        // tagsの各値と一致するbookTagsコレクションのデータを取得
        const tagsData = await Promise.all(
          tags.map(async (tag) => {
            const tagCollection = collection(db, "bookTags");
            const tagSnapshot = await getDocs(tagCollection, {
              where: ["name", "==", tag],
            });
            const tagDoc = tagSnapshot.docs[0];
            return tagDoc ? tagDoc.data() : null;
          })
        );

        return {
          ...bookData,
          id: doc.id,
          tags: tagsData, // tagsキーとしてデータを挿入
        };
      })
    );

    setBooks(booksList);
  };

  const handleGetUsers = async () => {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
    const usersList = usersSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setUsers(usersList);
  };

  useEffect(() => {
    handleGetBooks();
    handleGetGroups();
    handleGetUsers();
  }, []);

  const CustomTab = forwardRef((props, ref) => {
    const tabProps = useTab({ ...props, ref });
    const isSelected = !!tabProps["aria-selected"];
    const styles = useMultiStyleConfig("Tabs", tabProps);

    const getTabLabel = (label) => {
      switch (label) {
        case "Books":
          return { number: filteredBooks?.length, color: "gray" };
        case "Groups":
          return { number: groups?.length, color: "red" };
        case "Users":
          return { number: users?.length, color: "teal" };
        default:
          return;
      }
    };

    const label = getTabLabel(props.children);

    console.log("user", user);

    return (
      <Button __css={styles.tab} {...tabProps} border="none">
        <HStack fontSize="sm" fontWeight="bold">
          <Text color="teal.700">{tabProps.children}</Text>
          <Box
            as="span"
            fontSize="sm"
            py={1}
            px={2}
            // bg={`${label.color}.100`}
            bg={isSelected ? `${label.color}.500` : `${label.color}.100`}
            lineHeight="14px"
            borderRadius="md"
            color={isSelected ? `white` : `${label.color}.800`}
          >
            {label.number}
          </Box>
        </HStack>
      </Button>
    );
  });

  const CustomModalTab = forwardRef((props, ref) => {
    const tabProps = useTab({ ...props, ref });
    const isSelected = !!tabProps["aria-selected"];
    const styles = useMultiStyleConfig("Tabs", tabProps);

    const getTabLabel = (label) => {
      switch (label) {
        case "Books":
          return { number: books?.length, color: "gray" };
        case "Groups":
          return { number: groups?.length, color: "red" };
        case "Follower":
          return { number: users?.length, color: "teal" };
        case "Skills":
          return { number: books?.length, color: "gray" };
        default:
          return;
      }
    };

    const label = getTabLabel(props.children);

    console.log("user", user);

    return (
      <Button __css={styles.tab} {...tabProps} border="none">
        <HStack fontSize="sm" fontWeight="bold">
          <Text color="teal.700">{tabProps.children}</Text>
          <Box
            as="span"
            fontSize="sm"
            py={1}
            px={2}
            // bg={`${label.color}.100`}
            bg={isSelected ? `${label.color}.500` : `${label.color}.100`}
            lineHeight="14px"
            borderRadius="md"
            color={isSelected ? `white` : `${label.color}.800`}
          >
            {label.number}
          </Box>
        </HStack>
      </Button>
    );
  });

  const handleTabChange = (index) => {
    switch (index) {
      case 0:
        router.push("/search?tab=books");
        break;
      case 1:
        router.push("/search?tab=groups");
        break;
      case 2:
        router.push("/search?tab=users");
        break;
      default:
        break;
    }
  };

  const CustomBookModalTab = forwardRef((props, ref) => {
    const tabProps = useTab({ ...props, ref });
    const isSelected = !!tabProps["aria-selected"];
    const styles = useMultiStyleConfig("Tabs", tabProps);

    const getTabLabel = (label) => {
      switch (label) {
        case "概要":
          return { number: null, color: null };
        case "章":
          return { number: book?.chapters?.length, color: "red" };
        case "レビュー":
          return { number: 2, color: "teal" };
        default:
          return;
      }
    };

    const label = getTabLabel(props.children);

    return (
      <Button __css={styles.tab} {...tabProps} border="none">
        <HStack fontSize="sm" fontWeight="bold">
          <Text color="teal.700">{tabProps.children}</Text>
          {label.number && (
            <Box
              as="span"
              fontSize="sm"
              py={1}
              px={2}
              // bg={`${label.color}.100`}
              bg={isSelected ? `${label.color}.500` : `${label.color}.100`}
              lineHeight="14px"
              borderRadius="md"
              color={isSelected ? `white` : `${label.color}.800`}
            >
              {label.number}
            </Box>
          )}
        </HStack>
      </Button>
    );
  });

  return (
    <>
      <Box maxW="1084px" margin="0px auto" p="32px 16px">
        <Tabs colorScheme="teal" variant="unstyled" onChange={handleTabChange}>
          <TabList>
            <Flex justifyContent="space-between" w="100%">
              <Flex>
                <CustomTab>Books</CustomTab>
                <CustomTab>Groups</CustomTab>
                <CustomTab>Users</CustomTab>
              </Flex>
              <HStack>
                <Button
                  bg="teal.100"
                  fontSize="sm"
                  h="32px"
                  onClick={onAddBookOpen}
                >
                  <Icon as={AiOutlinePlus} mr={2} />
                  Add
                </Button>
              </HStack>
            </Flex>
          </TabList>
          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg="teal.500"
            borderRadius="1px"
          />
          <TabPanels>
            <TabPanel>
              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                {filteredBooks?.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onClick={() => {
                      setBook(book);
                      onBookDetailOpen();
                    }}
                  />
                ))}
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                {groups?.map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                {users?.map((user) => (
                  <UserCard
                    onClick={() => {
                      setUser(user);
                      onUserDetailOpen();
                    }}
                    key={user.id}
                    user={user}
                  />
                ))}
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <Modal
        isOpen={isAddBookOpen}
        onClose={onAddBookClose}
        isCentered
        size="xl"
      >
        <ModalOverlay backdropFilter="blur(4px) hue-rotate(10deg)" />
        <ModalContent>
          <ModalBody>
            <Text>Hello World</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isUserDetailOpen}
        onClose={onUserDetailClose}
        isCentered
        size="3xl"
      >
        <ModalOverlay backdropFilter="blur(4px) hue-rotate(10deg)" />
        <ModalContent borderRadius="xl">
          <ModalBody p={0} borderRadius="xl">
            <Flex direction="column" w="100%" position="relative">
              <HStack
                position="absolute"
                left="56px"
                top="48px"
                zIndex={10}
                spacing={6}
              >
                <Avatar size="2xl" src={user?.photoUrl} />
                <Flex direction="column" mb={8}>
                  <Text fontWeight="bold" fontSize="xl">
                    {user?.displayName}
                  </Text>
                  <Text fontSize="sm" color="gray.600" fontWeight="bold">
                    @{user?.userId}
                  </Text>
                </Flex>
              </HStack>
              <Box w="100%" h="140px" position="relative">
                {/* popover */}
                {/* <Popover>
                  <PopoverTrigger>
                    <HStack
                      py={1}
                      px={3}
                      borderRadius="lg"
                      cursor="pointer"
                      position="absolute"
                      top="20px"
                      right="20px"
                      zIndex={12}
                    >
                      <Box
                        w="100%"
                        h="100%"
                        position="absolute"
                        top="0"
                        left="0"
                        bg="teal.800"
                        opacity={0.5}
                        borderRadius="lg"
                      />
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color="gray.100"
                        zIndex={0}
                      >
                        Invite
                      </Text>
                    </HStack>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                      Are you sure you want to have that milkshake?
                    </PopoverBody>
                  </PopoverContent>
                </Popover> */}
                <HStack
                  py={1}
                  px={3}
                  borderRadius="lg"
                  cursor="pointer"
                  position="absolute"
                  top="20px"
                  right="20px"
                  zIndex={12}
                  onClick={handleToastClick}
                >
                  <Box
                    w="100%"
                    h="100%"
                    position="absolute"
                    top="0"
                    left="0"
                    bg="teal.800"
                    opacity={0.5}
                    borderRadius="lg"
                  />
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="gray.100"
                    zIndex={0}
                  >
                    Invite
                  </Text>
                </HStack>
                <Box
                  position="absolute"
                  w="100%"
                  h="100%"
                  left="0"
                  top="0"
                  bg="white"
                  opacity={0.3}
                  borderTopRadius="xl"
                />
                <Image
                  w="100%"
                  h="100%"
                  src={user?.backgroundImageUrl}
                  alt=""
                  objectFit="cover"
                  borderTopRadius="xl"
                  zIndex={10}
                />
              </Box>
              <Box px={8} pb={8} pt={1} boxShadow="md" zIndex={20}>
                <Tabs colorScheme="teal" variant="unstyled" align="end">
                  <TabList>
                    <CustomModalTab>Books</CustomModalTab>
                    <CustomModalTab>Groups</CustomModalTab>
                    <CustomModalTab>Follower</CustomModalTab>
                    <CustomModalTab>Skills</CustomModalTab>
                  </TabList>
                  <TabIndicator
                    mt="-1.5px"
                    height="2px"
                    bg="teal.500"
                    borderRadius="1px"
                    right="0"
                  />
                  <TabPanels w="100%" h="300px" overflowY="auto">
                    <TabPanel>
                      <Grid templateColumns="repeat(1, 1fr)" gap={6}>
                        {books?.map((book) => (
                          <BookCard
                            key={book.id}
                            book={book}
                            onClick={onBookDetailOpen}
                          />
                        ))}
                      </Grid>
                    </TabPanel>
                    <TabPanel>
                      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                        {groups?.map((group) => (
                          <GroupCard key={group.id} group={group} />
                        ))}
                      </Grid>
                    </TabPanel>
                    <TabPanel>
                      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                        {users?.map((user) => (
                          <UserCard
                            onClick={() => {
                              setUser(user);
                              onUserDetailOpen();
                            }}
                            key={user.id}
                            user={user}
                          />
                        ))}
                      </Grid>
                    </TabPanel>
                    <TabPanel>
                      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                        <GridItem
                          w="100%"
                          border="1px solid black"
                          borderColor="gray.200"
                          borderRadius="md"
                          cursor="pointer"
                          _hover={{ bg: "gray.100" }}
                          transition="ease-in-out 0.2s"
                          position="relative"
                          boxShadow="md"
                        >
                          <Flex
                            direction="column"
                            alignItems="center"
                            w="100%"
                            p={4}
                          >
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              alignSelf="flex-start"
                            >
                              Group score
                            </Text>
                            <Center
                              w="160px"
                              h="160px"
                              position="relative"
                              my={4}
                            >
                              <HStack spacing={0.5} position="absolute">
                                <Text
                                  fontSize="5xl"
                                  fontWeight="bold"
                                  color="teal.400"
                                >
                                  32
                                </Text>
                              </HStack>
                              <DoughnutItem
                                percentage={40}
                                type="QUEST_PROGRESS"
                              />
                            </Center>
                          </Flex>
                        </GridItem>
                        <GridItem
                          w="100%"
                          border="1px solid black"
                          borderColor="gray.200"
                          borderRadius="md"
                          cursor="pointer"
                          _hover={{ bg: "gray.100" }}
                          transition="ease-in-out 0.2s"
                          position="relative"
                          boxShadow="md"
                        >
                          <Flex
                            direction="column"
                            alignItems="center"
                            w="100%"
                            p={4}
                          >
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              alignSelf="flex-start"
                            >
                              Group score
                            </Text>
                            <Center
                              w="160px"
                              h="160px"
                              position="relative"
                              my={4}
                            >
                              <HStack spacing={0.5} position="absolute">
                                <Text
                                  fontSize="5xl"
                                  fontWeight="bold"
                                  color="teal.400"
                                >
                                  32
                                </Text>
                              </HStack>
                              <DoughnutItem
                                percentage={40}
                                type="QUEST_PROGRESS"
                              />
                            </Center>
                          </Flex>
                        </GridItem>
                      </Grid>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isBookDetailOpen}
        onClose={onBookDetailClose}
        isCentered
        size="lg"
      >
        <ModalOverlay backdropFilter="blur(4px) hue-rotate(10deg)" />
        <ModalContent>
          <ModalBody py={6} overflowY="scroll">
            <HStack alignItems="flex-start" mb={4} spacing={4} w="100%">
              <Image
                width="120px"
                height="170px"
                alt=""
                borderRadius="md"
                src={book?.imageUrl}
              />
              <VStack alignItems="flex-start" spacing={2} flex={1}>
                {/* <Text fontSize="sm">輪読数 5</Text> */}
                <Text fontWeight="bold">{book?.title}</Text>
                <Rating size={14} rating={4.5} />
                <Wrap align="flex-start" alignSelf="flex-start">
                  {book?.authors?.map((author, index) => (
                    <WrapItem key={index}>
                      <HStack
                        bg="white"
                        color="black"
                        border="0.3px solid #000"
                        borderColor="gray.300"
                        borderRadius="full"
                        px={2}
                        py={0.5}
                        alignItems="center"
                      >
                        <Text fontSize="xs">{author}</Text>
                      </HStack>
                    </WrapItem>
                  ))}
                </Wrap>
                <Badges isBook tags={[{ name: "コーディング規則" }]} />
                <Text
                  fontSize="sm"
                  bg="gray.100"
                  py={1}
                  px={3}
                  borderRadius="lg"
                >
                  出版日：
                  {/* {dayjs(book?.publishedAt?.toDate()).format("YYYY-MM-DD")} */}
                  {book?.publishedAt}
                </Text>
              </VStack>
            </HStack>
            <Tabs colorScheme="teal" variant="unstyled">
              <TabList>
                <CustomBookModalTab>概要</CustomBookModalTab>
                <CustomBookModalTab>章</CustomBookModalTab>
                <CustomBookModalTab>レビュー</CustomBookModalTab>
              </TabList>
              <TabIndicator
                mt="-1.5px"
                height="2px"
                bg="teal.500"
                borderRadius="1px"
              />
              <TabPanels>
                <TabPanel
                  h="280px"
                  overflowY="scroll"
                  borderRadius="lg"
                  fontSize="sm"
                  color="black"
                  // border="0.3px solid black"
                  // borderColor="gray.200"
                >
                  <Text>{book?.description}</Text>
                </TabPanel>
                <TabPanel h="280px" overflowY="scroll" borderRadius="lg">
                  <HStack mb={4} fontWeight="bold" fontSize="sm">
                    <Text>全 {book?.chapters?.length}章</Text>
                    <Text>230ページ</Text>
                  </HStack>
                  <VStack spacing={2} alignItems="flex-start" mb={4} w="100%">
                    {book?.chapters?.map((chapter, index) => (
                      <HStack
                        key={index}
                        border="0.3px solid black"
                        borderColor="gray.200"
                        w="100%"
                        p={4}
                        borderRadius="md"
                      >
                        <Center
                          width="48px"
                          height="48px"
                          p={1}
                          borderRadius="md"
                          bg="gray.200"
                        >
                          {/* <Image
                          width="40px"
                          height="40px"
                          alt=""
                          borderRadius="md"
                        /> */}
                        </Center>
                        <Box>
                          <Text fontSize="sm" mb={1}>
                            {chapter.index}
                          </Text>
                          <Text fontWeight="bold">{chapter.title}</Text>
                        </Box>
                      </HStack>
                    ))}
                  </VStack>
                </TabPanel>
                <TabPanel h="280px" overflowY="scroll" borderRadius="lg">
                  {/* {reviews?.map((review) => ( */}
                  <VStack spacing={2} w="100%">
                    {book?.reviews?.map((review) => (
                      <VStack
                        alignItems="flex-start"
                        border="0.3px solid black"
                        borderColor="gray.200"
                        p={4}
                        borderRadius="md"
                        w="100%"
                        key={review.id}
                      >
                        <HStack mb={1}>
                          <Avatar
                            width="56px"
                            height="56px"
                            src={review.user.photoUrl}
                          />
                          <Box color="black">
                            <Text fontWeight="bold">
                              {review.user.displayName}
                            </Text>
                            <Text fontSize="xs">@{review.user.userId}</Text>
                            <Rating size={12} rating={review.rating} />
                          </Box>
                        </HStack>
                        <Text fontSize="sm" color="black">
                          {review.content}
                        </Text>
                      </VStack>
                    ))}
                  </VStack>
                  {/* ))} */}
                </TabPanel>
              </TabPanels>
            </Tabs>
            <HStack justifyContent="flex-end">
              <Button onClick={onBookDetailClose}>キャンセル</Button>
              <Button
                onClick={() => {
                  // onBookDetailClose();
                  // onCreateProjectOpen();
                  handleBookStockToast();
                }}
                bg="teal.100"
              >
                ストックする
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Search;
