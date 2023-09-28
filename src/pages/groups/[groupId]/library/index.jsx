/* eslint-disable react/display-name */
import { Badges } from "@/components/atoms/Badges";
import { Rating } from "@/components/atoms/Rating";
import { TagSelect } from "@/components/atoms/TagSelect";
import Assign from "@/components/organisms/Assign";
import BookCard from "@/components/organisms/books/BookCard";
import MemberCard from "@/components/organisms/members/MemberCard";
import { db } from "@/config/firebase";
import { chaptersData, membersData, playersData } from "@/lib/data";
import {
  Avatar,
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Grid,
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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  VStack,
  Wrap,
  WrapItem,
  useDisclosure,
  useMultiStyleConfig,
  useSteps,
  useTab,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineCheck, AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import {
  PiBooksLight,
  PiNumberCircleFiveFill,
  PiNumberCircleFourFill,
  PiNumberCircleOneFill,
  PiNumberCircleSixFill,
  PiNumberCircleThreeFill,
  PiNumberCircleTwoFill,
} from "react-icons/pi";

const Library = () => {
  const router = useRouter();
  const { groupId } = router.query;
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState(null);
  const {
    isOpen: isBookDetailOpen,
    onOpen: onBookDetailOpen,
    onClose: onBookDetailClose,
  } = useDisclosure();
  const {
    isOpen: isCreateProjectOpen,
    onOpen: onCreateProjectOpen,
    onClose: onCreateProjectClose,
  } = useDisclosure();
  const {
    isOpen: isAddBookOpen,
    onOpen: onAddBookOpen,
    onClose: onAddBookClose,
  } = useDisclosure();
  // タグ
  const [tags, setTags] = useState(null);
  const useTags = useCallback(async () => {
    if (!tags) {
      const querySnapshot = await getDocs(collection(db, "bookTags"));
      const tagData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTags(tagData);
    }
    return tags;
  }, [tags]);
  // stepper
  const steps = [{ title: "Overview" }, { title: "Assign" }, { title: "Rule" }];
  const newSteps = [{ title: "Overview" }, { title: "Chapters" }];

  const {
    activeStep: activeStepForSteps,
    setActiveStep: setActiveStepForSteps,
  } = useSteps({
    index: 0,
    count: steps.length,
  });

  const {
    activeStep: activeStepForNewSteps,
    setActiveStep: setActiveStepForNewSteps,
  } = useSteps({
    index: 0,
    count: newSteps.length,
  });
  const { handleSubmit, control } = useForm();

  const stockBooks = books.filter((book) => book.status === "stock");
  const completedBooks = books.filter((book) => book.status === "completed");
  const participatingBooks = books.filter(
    (book) => book.status === "participating"
  );

  const handleGetBooks = useCallback(async () => {
    let allBooks = [];

    const groupDocRef = doc(db, "groups", groupId);
    const groupDocSnapshot = await getDoc(groupDocRef);

    if (!groupDocSnapshot.exists) {
      console.error("Specified groupId does not exist.");
      return;
    }

    const bookSubcollectionSnapshot = await getDocs(
      collection(groupDocSnapshot.ref, "books")
    );

    for (const subBookDoc of bookSubcollectionSnapshot.docs) {
      const bookQuery = query(
        collection(db, "books"),
        where("__name__", "==", subBookDoc.id)
      );
      const matchingBookSnapshot = await getDocs(bookQuery);

      for (const mainBookDoc of matchingBookSnapshot.docs) {
        // 1. サブコレクションのbooksのフィールドをルートのbooksにマージ
        const combinedBookData = {
          id: mainBookDoc.id,
          ...mainBookDoc.data(),
          ...subBookDoc.data(),
        };

        // 2. tagsフィールドの文字列配列に合致するbookTagsコレクションのドキュメントを取得
        if (combinedBookData.tags) {
          const tags = [];
          for (const tag of combinedBookData.tags) {
            const tagQuery = query(
              collection(db, "bookTags"),
              where("__name__", "==", tag)
            );
            const tagSnapshot = await getDocs(tagQuery);
            for (const tagDoc of tagSnapshot.docs) {
              tags.push(tagDoc.data());
            }
          }
          combinedBookData.tags = tags;
        }

        // 3. 各bookのidに対応するreviewsサブコレクションのドキュメントを取得
        const reviewsSnapshot = await getDocs(
          collection(mainBookDoc.ref, "reviews")
        );
        const reviews = [];
        for (const reviewDoc of reviewsSnapshot.docs) {
          const userDoc = await getDoc(doc(db, "users", reviewDoc.id));
          const reviewData = {
            ...reviewDoc.data(),
            user: userDoc.data(),
          };
          reviews.push(reviewData);
        }
        combinedBookData.reviews = reviews;

        allBooks.push(combinedBookData);
      }
    }

    setBooks(allBooks);
  }, [groupId]);

  useEffect(() => {
    if (!groupId) return;
    handleGetBooks();
  }, [groupId, handleGetBooks]);

  console.log(books);

  const CustomTab = forwardRef((props, ref) => {
    const tabProps = useTab({ ...props, ref });
    const isSelected = !!tabProps["aria-selected"];
    const styles = useMultiStyleConfig("Tabs", tabProps);

    const getTabLabel = (label) => {
      switch (label) {
        case "All":
          return { number: books?.length, color: "gray" };
        case "Participating":
          return { number: participatingBooks?.length, color: "teal" };
        case "Completed":
          return { number: completedBooks?.length, color: "red" };
        case "Stock":
          return { number: stockBooks?.length, color: "blue" };
        default:
          return;
      }
    };

    const label = getTabLabel(props.children);

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

  // checkbox
  const [isIcebreakChecked, setIsIcebreakChecked] = useState(false);
  const [isNoteChecked, setIsNoteChecked] = useState(false);
  const [isDiscussionChecked, setIsDiscussionChecked] = useState(true);
  const [isTestChecked, setIsTestChecked] = useState(false);
  const [isLookbackChecked, setIsLookbackChecked] = useState(false);
  const [isAssignChecked, setIsAssignChecked] = useState(true);
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
          <Icon w="20px" h="20px" as={PiBooksLight} />
          <Text fontWeight="bold">Library</Text>
        </HStack>
      </Flex>
      <Box maxW="1084px" margin="0px auto" p="32px 16px">
        <Tabs colorScheme="teal" variant="unstyled">
          <TabList>
            <Flex justifyContent="space-between" w="100%">
              <Flex>
                <CustomTab>All</CustomTab>
                <CustomTab>Participating</CustomTab>
                <CustomTab>Completed</CustomTab>
                <CustomTab>Stock</CustomTab>
              </Flex>
              <HStack>
                <InputGroup w="280px">
                  <InputLeftElement>
                    <Icon fontSize="16px" as={AiOutlineSearch} mb={1.5} />
                  </InputLeftElement>
                  <Input
                    h="32px"
                    bg="gray.100"
                    placeholder="Search projects..."
                  />
                </InputGroup>
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
                {books?.map((book) => (
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
              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                {participatingBooks?.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    // onClick={onBookDetailOpen}
                  />
                ))}
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                {completedBooks?.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    // onClick={onBookDetailOpen}
                  />
                ))}
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                {stockBooks?.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    // onClick={onBookDetailOpen}
                  />
                ))}
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
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
                <Badges isBook tags={book?.tags} />
                <Text fontSize="sm">
                  出版日：
                  {dayjs(book?.publishedAt.toDate()).format("YYYY-MM-DD")}
                </Text>
              </VStack>
            </HStack>
            <Tabs colorScheme="teal" variant="unstyled">
              <TabList>
                <CustomModalTab>概要</CustomModalTab>
                <CustomModalTab>章</CustomModalTab>
                <CustomModalTab>レビュー</CustomModalTab>
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
                  onBookDetailClose();
                  onCreateProjectOpen();
                }}
                bg="teal.100"
              >
                輪読会を作る
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isCreateProjectOpen}
        onClose={onCreateProjectClose}
        isCentered
        size="5xl"
      >
        <ModalOverlay backdropFilter="blur(4px) hue-rotate(10deg)" />
        <ModalContent>
          <ModalBody>
            <Flex direction="column">
              <>
                <Flex
                  w="100%"
                  h="40px"
                  borderBottom="0.3px solid black"
                  borderColor="gray.200"
                  alignItems="center"
                  justifyContent="space-between"
                  px={4}
                >
                  <HStack spacing={2}>
                    <Image
                      w="20px"
                      h="28px"
                      bg="gray.200"
                      borderRadius="sm"
                      alt=""
                      src={book?.imageUrl}
                    />
                    <Text fontWeight="bold">
                      <span style={{ color: "#319795" }}>{book?.title}</span>
                      で輪読会を開く
                    </Text>
                  </HStack>
                  <Text
                    fontSize="sm"
                    bg="white"
                    border="1px solid black"
                    borderColor="teal.800"
                    py={1}
                    px={3}
                    borderRadius="md"
                    color="teal.800"
                    fontWeight="bold"
                    cursor="pointer"
                    _hover={{ bg: "teal.100", color: "teal.700" }}
                    transition="ease-in-out 0.2s"
                  >
                    招待リンクをコピー
                  </Text>
                </Flex>
                <Box w="100%" margin="0px auto">
                  <Box maxW="100%" margin="0px auto" p="32px 16px">
                    <Stepper
                      size="lg"
                      index={activeStepForSteps}
                      colorScheme="teal"
                      mb={8}
                    >
                      {steps.map((step, index) => (
                        <Step key={index}>
                          <StepIndicator>
                            <StepStatus
                              complete={<StepIcon />}
                              incomplete={<StepNumber />}
                              active={<StepNumber />}
                            />
                          </StepIndicator>

                          <Box flexShrink="0">
                            <StepTitle>{step.title}</StepTitle>
                            <StepDescription>
                              {step.description}
                            </StepDescription>
                          </Box>

                          <StepSeparator />
                        </Step>
                      ))}
                    </Stepper>
                    {activeStepForSteps === 0 && (
                      <>
                        <Box
                          w="100%"
                          border="0.3px solid black"
                          borderColor="gray.200"
                          borderRadius="md"
                          overflowY="auto"
                        >
                          <Box margin="auto">
                            <HStack p={8} spacing={8}>
                              <Image
                                w="280px"
                                h="380px"
                                bg="gray.200"
                                borderRadius="lg"
                                boxShadow="md"
                                alt=""
                                src={book?.imageUrl}
                                objectFit="cover"
                              />
                              <VStack
                                spacing={6}
                                // mb={8}
                                // h="440px"
                                w="100%"
                                flex={1}
                              >
                                <Box alignSelf="flex-start" w="100%">
                                  <Text mb={1}>書籍名</Text>
                                  {/* <Text fontWeight="bold" fontSize="lg">
                                  リーダブルコード
                                </Text> */}
                                  <Box>
                                    <Select
                                      placeholder={book?.title}
                                      fontWeight="bold"
                                      fontSize="lg"
                                      w="100%"
                                      bg="gray.100"
                                    >
                                      <option value="option1">
                                        リーダブルコード
                                      </option>
                                      <option value="option2">Option 2</option>
                                      <option value="option3">Option 3</option>
                                    </Select>
                                  </Box>
                                </Box>
                                <FormControl>
                                  <FormLabel>輪読会について</FormLabel>
                                  <Controller
                                    name="description"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <Textarea
                                        placeholder="概要"
                                        {...field}
                                        bg="gray.100"
                                      />
                                    )}
                                  />
                                </FormControl>
                                <FormControl>
                                  <FormLabel>達成したいこと</FormLabel>
                                  <Controller
                                    name="goal"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <Input
                                        {...field}
                                        placeholder="達成目標を入力"
                                        bg="gray.100"
                                      />
                                    )}
                                  />
                                </FormControl>
                                <FormControl>
                                  <FormLabel>初回開催日時</FormLabel>
                                  <Controller
                                    name="nextEventDate"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <Input
                                        {...field}
                                        type="datetime-local"
                                        placeholder="日付と時間を入力"
                                        bg="gray.100"
                                      />
                                    )}
                                  />
                                </FormControl>
                                {/* <FormControl pb={8}>
                                <FormLabel>初回ミーティングURL</FormLabel>
                                <Controller
                                  name="goal"
                                  control={control}
                                  defaultValue=""
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      placeholder="https://..."
                                      bg="gray.100"
                                    />
                                  )}
                                />
                              </FormControl> */}
                              </VStack>
                            </HStack>
                          </Box>
                        </Box>
                        {/* <Button
                          onClick={() => setActiveStepForSteps(1)}
                          bg="teal.100"
                          mt={8}
                        >
                          次へ
                        </Button> */}
                        <HStack spacing={4} mt={8}>
                          <Button onClick={onCreateProjectClose} bg="gray.100">
                            キャンセル
                          </Button>
                          <Button
                            onClick={() => setActiveStepForSteps(1)}
                            bg="teal.100"
                          >
                            次へ
                          </Button>
                        </HStack>
                      </>
                    )}
                    {activeStepForSteps === 1 && (
                      <>
                        <Box
                          w="100%"
                          border="0.3px solid black"
                          borderColor="gray.200"
                          borderRadius="md"
                          overflowY="auto"
                        >
                          <Box>
                            <Box spacing={6} mb={8} h="440px" w="100%" p={8}>
                              <Assign
                                chapters={book?.chapters}
                                players={membersData}
                              />
                              <Box h="32px" w="100%" />
                            </Box>
                          </Box>
                        </Box>
                        <HStack spacing={4} mt={8}>
                          <Button
                            onClick={() => setActiveStepForSteps(0)}
                            bg="gray.100"
                          >
                            戻る
                          </Button>
                          <Button
                            onClick={() => setActiveStepForSteps(2)}
                            bg="teal.100"
                          >
                            次へ
                          </Button>
                        </HStack>
                      </>
                    )}
                    {activeStepForSteps === 2 && (
                      <>
                        <Flex
                          w="100%"
                          border="1px solid black"
                          borderColor="gray.200"
                          borderRadius="md"
                          mb={8}
                          h="440px"
                          p={8}
                          direction="column"
                          justifyContent="center"
                        >
                          <VStack spacing={8}>
                            <HStack spacing={8} w="100%">
                              <HStack
                                spacing={4}
                                bg={isIcebreakChecked ? "teal.100" : "gray.100"}
                                p={4}
                                borderRadius="xl"
                                w="50%"
                              >
                                <Checkbox
                                  size="lg"
                                  isChecked={isIcebreakChecked}
                                  onChange={(e) =>
                                    setIsIcebreakChecked(e.target.checked)
                                  }
                                />
                                <Flex alignItems="flex-end" mr={4}>
                                  <Input
                                    type="number"
                                    w="40px"
                                    border="none"
                                    mr={4}
                                    mb={0.5}
                                    value={3}
                                    borderBottom="2px solid black"
                                    borderColor={
                                      isIcebreakChecked
                                        ? "teal.400"
                                        : "gray.400"
                                    }
                                    borderRadius="none"
                                    variant="unstyled"
                                    p={1}
                                    textAlign="right"
                                    fontSize="xl"
                                    fontWeight="bold"
                                  />
                                  <Text
                                    fontSize="sm"
                                    mb={1}
                                    fontWeight="bold"
                                    color="gray.500"
                                  >
                                    分
                                  </Text>
                                </Flex>
                                <Flex direction="column">
                                  <HStack spacing={2} mb={2}>
                                    <Icon
                                      as={PiNumberCircleOneFill}
                                      fontSize="2xl"
                                      color="red.500"
                                    />
                                    <Image
                                      w="32px"
                                      h="32px"
                                      borderRadius="md"
                                      alt=""
                                      src="/images/groups/icon/ice.png"
                                      p={1}
                                      bg="white"
                                      border="1px solid black"
                                      borderColor="gray.200"
                                    />
                                    <Text fontSize="lg" fontWeight="bold">
                                      アイスブレイク
                                    </Text>
                                  </HStack>
                                  <Text fontSize="sm">
                                    ミニゲームをして、緊張を和らげよう
                                  </Text>
                                </Flex>
                              </HStack>
                              <HStack
                                spacing={4}
                                bg={isNoteChecked ? "teal.100" : "gray.100"}
                                p={4}
                                borderRadius="xl"
                                w="50%"
                              >
                                <Checkbox
                                  size="lg"
                                  isChecked={isNoteChecked}
                                  onChange={(e) =>
                                    setIsNoteChecked(e.target.checked)
                                  }
                                />
                                <Flex alignItems="flex-end" mr={4}>
                                  <Input
                                    type="number"
                                    w="40px"
                                    border="none"
                                    mr={4}
                                    mb={0.5}
                                    value={3}
                                    borderBottom="2px solid black"
                                    borderColor={
                                      isNoteChecked ? "teal.400" : "gray.400"
                                    }
                                    borderRadius="none"
                                    variant="unstyled"
                                    p={1}
                                    textAlign="right"
                                    fontSize="xl"
                                    fontWeight="bold"
                                  />
                                  <Text
                                    fontSize="sm"
                                    mb={1}
                                    fontWeight="bold"
                                    color="gray.500"
                                  >
                                    分
                                  </Text>
                                </Flex>
                                <Flex direction="column">
                                  <HStack spacing={2} mb={2}>
                                    <Icon
                                      as={PiNumberCircleTwoFill}
                                      fontSize="2xl"
                                      color="green.500"
                                    />
                                    <Image
                                      w="32px"
                                      h="32px"
                                      borderRadius="md"
                                      alt=""
                                      src="/images/groups/icon/note.png"
                                      p={1}
                                      bg="white"
                                      border="1px solid black"
                                      borderColor="gray.200"
                                    />
                                    <Text fontSize="lg" fontWeight="bold">
                                      ノートまとめ
                                    </Text>
                                  </HStack>
                                  <Text fontSize="sm">
                                    輪読内で担当章をノートにまとめよう
                                  </Text>
                                </Flex>
                              </HStack>
                            </HStack>
                            <HStack spacing={8} w="100%">
                              <HStack
                                spacing={4}
                                bg={
                                  isDiscussionChecked ? "teal.200" : "gray.100"
                                }
                                p={4}
                                borderRadius="xl"
                                w="50%"
                                border="3px solid black"
                                borderColor="teal.300"
                              >
                                <Checkbox
                                  size="lg"
                                  isChecked={isDiscussionChecked}
                                  onChange={(e) =>
                                    setIsDiscussionChecked(e.target.checked)
                                  }
                                  readOnly
                                />
                                <Flex alignItems="flex-end" mr={4}>
                                  <Input
                                    type="number"
                                    w="40px"
                                    border="none"
                                    mr={4}
                                    mb={0.5}
                                    value={3}
                                    borderBottom="2px solid black"
                                    borderColor={
                                      isDiscussionChecked
                                        ? "teal.400"
                                        : "gray.400"
                                    }
                                    borderRadius="none"
                                    variant="unstyled"
                                    p={1}
                                    textAlign="right"
                                    fontSize="xl"
                                    fontWeight="bold"
                                  />
                                  <Text
                                    fontSize="sm"
                                    mb={1}
                                    fontWeight="bold"
                                    color="gray.500"
                                  >
                                    分
                                  </Text>
                                </Flex>
                                <Flex direction="column">
                                  <HStack spacing={2} mb={2}>
                                    <Icon
                                      as={PiNumberCircleThreeFill}
                                      fontSize="2xl"
                                      color="yellow.500"
                                    />
                                    <Image
                                      w="32px"
                                      h="32px"
                                      borderRadius="md"
                                      alt=""
                                      src="/images/groups/icon/talk.png"
                                      p={1}
                                      bg="white"
                                      border="1px solid black"
                                      borderColor="gray.200"
                                    />
                                    <Text fontSize="lg" fontWeight="bold">
                                      ディスカッション
                                    </Text>
                                  </HStack>
                                  <Text fontSize="sm">
                                    まとめた内容をメンバーに共有しよう
                                  </Text>
                                </Flex>
                              </HStack>
                              <HStack
                                spacing={4}
                                bg={isTestChecked ? "teal.100" : "gray.100"}
                                p={4}
                                borderRadius="xl"
                                w="50%"
                              >
                                <Checkbox
                                  size="lg"
                                  isChecked={isTestChecked}
                                  onChange={(e) =>
                                    setIsTestChecked(e.target.checked)
                                  }
                                />
                                <Flex alignItems="flex-end" mr={4}>
                                  <Input
                                    type="number"
                                    w="40px"
                                    border="none"
                                    mr={4}
                                    mb={0.5}
                                    value={3}
                                    borderBottom="2px solid black"
                                    borderColor={
                                      isTestChecked ? "teal.400" : "gray.400"
                                    }
                                    borderRadius="none"
                                    variant="unstyled"
                                    p={1}
                                    textAlign="right"
                                    fontSize="xl"
                                    fontWeight="bold"
                                  />
                                  <Text
                                    fontSize="sm"
                                    mb={1}
                                    fontWeight="bold"
                                    color="gray.500"
                                  >
                                    分
                                  </Text>
                                </Flex>
                                <Flex direction="column">
                                  <HStack spacing={2} mb={2}>
                                    <Icon
                                      as={PiNumberCircleFourFill}
                                      fontSize="2xl"
                                      color="purple.500"
                                    />
                                    <Image
                                      w="32px"
                                      h="32px"
                                      borderRadius="md"
                                      alt=""
                                      src="/images/groups/icon/test.png"
                                      p={1}
                                      bg="white"
                                      border="1px solid black"
                                      borderColor="gray.200"
                                    />
                                    <Text fontSize="lg" fontWeight="bold">
                                      確認テスト
                                    </Text>
                                  </HStack>
                                  <Text fontSize="sm">
                                    テストを行い、理解度を確認しよう
                                  </Text>
                                </Flex>
                              </HStack>
                            </HStack>
                            <HStack spacing={8} w="100%">
                              <HStack
                                spacing={4}
                                bg={isLookbackChecked ? "teal.100" : "gray.100"}
                                p={4}
                                borderRadius="xl"
                                w="50%"
                              >
                                <Checkbox
                                  size="lg"
                                  isChecked={isLookbackChecked}
                                  onChange={(e) =>
                                    setIsLookbackChecked(e.target.checked)
                                  }
                                />
                                <Flex alignItems="flex-end" mr={4}>
                                  <Input
                                    type="number"
                                    w="40px"
                                    border="none"
                                    mr={4}
                                    mb={0.5}
                                    value={3}
                                    borderBottom="2px solid black"
                                    borderColor={
                                      isLookbackChecked
                                        ? "teal.400"
                                        : "gray.400"
                                    }
                                    borderRadius="none"
                                    variant="unstyled"
                                    p={1}
                                    textAlign="right"
                                    fontSize="xl"
                                    fontWeight="bold"
                                  />
                                  <Text
                                    fontSize="sm"
                                    mb={1}
                                    fontWeight="bold"
                                    color="gray.500"
                                  >
                                    分
                                  </Text>
                                </Flex>
                                <Flex direction="column">
                                  <HStack spacing={2} mb={2}>
                                    <Icon
                                      as={PiNumberCircleFiveFill}
                                      fontSize="2xl"
                                      color="pink.500"
                                    />
                                    <Image
                                      w="32px"
                                      h="32px"
                                      borderRadius="md"
                                      alt=""
                                      src="/images/groups/icon/close.png"
                                      p={1}
                                      bg="white"
                                      border="1px solid black"
                                      borderColor="gray.200"
                                    />
                                    <Text fontSize="lg" fontWeight="bold">
                                      振り返り
                                    </Text>
                                  </HStack>
                                  <Text fontSize="sm">
                                    テスト内容を復習しよう
                                  </Text>
                                </Flex>
                              </HStack>
                              <HStack
                                spacing={4}
                                bg={isAssignChecked ? "teal.200" : "gray.100"}
                                p={4}
                                borderRadius="xl"
                                w="50%"
                                border="3px solid black"
                                borderColor="teal.300"
                              >
                                <Checkbox
                                  size="lg"
                                  isChecked={isAssignChecked}
                                  onChange={(e) =>
                                    setIsAssignChecked(e.target.checked)
                                  }
                                  readOnly
                                />
                                <Flex alignItems="flex-end" mr={4}>
                                  <Input
                                    type="number"
                                    w="40px"
                                    border="none"
                                    mr={4}
                                    mb={0.5}
                                    value={3}
                                    borderBottom="2px solid black"
                                    borderColor={
                                      isAssignChecked ? "teal.400" : "gray.400"
                                    }
                                    borderRadius="none"
                                    variant="unstyled"
                                    p={1}
                                    textAlign="right"
                                    fontSize="xl"
                                    fontWeight="bold"
                                  />
                                  <Text
                                    fontSize="sm"
                                    mb={1}
                                    fontWeight="bold"
                                    color="gray.500"
                                  >
                                    分
                                  </Text>
                                </Flex>
                                <Flex direction="column">
                                  <HStack spacing={2} mb={2}>
                                    <Icon
                                      as={PiNumberCircleSixFill}
                                      fontSize="2xl"
                                      color="cyan.500"
                                    />
                                    <Image
                                      w="32px"
                                      h="32px"
                                      borderRadius="md"
                                      alt=""
                                      src="/images/groups/icon/calendar.png"
                                      p={1}
                                      bg="white"
                                      border="1px solid black"
                                      borderColor="gray.200"
                                    />
                                    <Text fontSize="lg" fontWeight="bold">
                                      次回アサイン
                                    </Text>
                                  </HStack>
                                  <Text fontSize="sm">
                                    次回の計画を立てよう
                                  </Text>
                                </Flex>
                              </HStack>
                            </HStack>
                          </VStack>
                        </Flex>
                        <HStack spacing={4} mt={8}>
                          <Button
                            onClick={() => setActiveStepForSteps(1)}
                            bg="gray.100"
                          >
                            戻る
                          </Button>
                          <Button
                            onClick={() =>
                              router.push(
                                `/groups/${groupId}/projects/zM2z6Wh9wlgMtV5fNNx8`
                              )
                            }
                            bg="teal.100"
                          >
                            作成
                          </Button>
                        </HStack>
                      </>
                    )}
                  </Box>
                </Box>
              </>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isAddBookOpen}
        onClose={onAddBookClose}
        isCentered
        size="2xl"
      >
        <ModalOverlay backdropFilter="blur(4px) hue-rotate(10deg)" />
        <ModalContent>
          <ModalBody p={6}>
            <VStack alignItems="flex-start" spacing={4}>
              {/* <Text fontWeight="bold">Add learning materials</Text> */}
              <Stepper
                size="lg"
                index={activeStepForNewSteps}
                colorScheme="teal"
                mb={2}
              >
                {newSteps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>

                    <Box flexShrink="0">
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                    </Box>

                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>
              {activeStepForNewSteps === 0 && (
                <>
                  <HStack w="100%" spacing={8}>
                    <Image
                      h="300px"
                      w="200px"
                      bg="gray.200"
                      borderRadius="lg"
                      alt=""
                      src="/images/books/rails-tutorial.png"
                      objectFit="cover"
                    />
                    <VStack flex={1} spacing={6}>
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="bold">
                          教材名
                        </FormLabel>
                        <Controller
                          name="goal"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="教材名を入力"
                              bg="gray.100"
                            />
                          )}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="bold">
                          教材について
                        </FormLabel>
                        <Controller
                          name="description"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Textarea
                              placeholder="概要"
                              {...field}
                              bg="gray.100"
                            />
                          )}
                        />
                      </FormControl>
                      <FormControl mb="4">
                        <FormLabel fontSize="sm" fontWeight="bold">
                          タグ
                        </FormLabel>
                        <Controller
                          name="tags"
                          control={control}
                          defaultValue={[]}
                          render={({ field }) => (
                            <TagSelect
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.map((tag) => tag))
                              }
                              useTags={useTags}
                            />
                          )}
                        />
                      </FormControl>
                    </VStack>
                  </HStack>
                  <HStack justifyContent="right" w="100%">
                    <Button>キャンセル</Button>
                    <Button onClick={() => setActiveStepForNewSteps(1)}>
                      次へ
                    </Button>
                  </HStack>
                </>
              )}
              {activeStepForNewSteps === 1 && (
                <>
                  <HStack w="100%" spacing={8}>
                    <Image
                      h="300px"
                      w="200px"
                      bg="gray.200"
                      borderRadius="lg"
                      alt=""
                      src="/images/books/rails-tutorial.png"
                      objectFit="cover"
                    />
                    <VStack flex={1} spacing={6}>
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="bold">
                          教材名
                        </FormLabel>
                        <Controller
                          name="goal"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="教材名を入力"
                              bg="gray.100"
                            />
                          )}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="bold">
                          教材について
                        </FormLabel>
                        <Controller
                          name="description"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Textarea
                              placeholder="概要"
                              {...field}
                              bg="gray.100"
                            />
                          )}
                        />
                      </FormControl>
                      <FormControl mb="4">
                        <FormLabel fontSize="sm" fontWeight="bold">
                          タグ
                        </FormLabel>
                        <Controller
                          name="tags"
                          control={control}
                          defaultValue={[]}
                          render={({ field }) => (
                            <TagSelect
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.map((tag) => tag))
                              }
                              useTags={useTags}
                            />
                          )}
                        />
                      </FormControl>
                    </VStack>
                  </HStack>
                  <HStack justifyContent="right" w="100%">
                    <Button onClick={() => setActiveStepForNewSteps(0)}>
                      戻る
                    </Button>
                    <Button>作成</Button>
                  </HStack>
                </>
              )}
              {/* <HStack justifyContent="right" w="100%">
                <Button>キャンセル</Button>
                <Button>作成</Button>
              </HStack> */}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Library;
