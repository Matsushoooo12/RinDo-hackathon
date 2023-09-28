/* eslint-disable react/display-name */
import { joinGroupsData, presentImages } from "@/lib/data";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  VStack,
  keyframes,
  useDisclosure,
  useMultiStyleConfig,
  useStyleConfig,
  useTab,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AiOutlineCalendar,
  AiOutlineDown,
  AiOutlinePlus,
  AiOutlineSetting,
} from "react-icons/ai";
import { LuLayoutDashboard } from "react-icons/lu";
import { GoProject } from "react-icons/go";
import { PiUsersThree, PiBooksLight } from "react-icons/pi";
import { AuthContext } from "@/pages/_app";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { useRoutingCheck } from "@/hooks/useRoutingCheck";
import { Badges } from "@/components/atoms/Badges";
import {
  BsChatDots,
  BsChevronLeft,
  BsFillMicFill,
  BsHeadphones,
} from "react-icons/bs";
import DoughnutItem from "@/components/organisms/DoughnutItem";
import { FaCoins, FaRegPaperPlane } from "react-icons/fa";
import { TbProgressCheck } from "react-icons/tb";
import { MdScreenShare } from "react-icons/md";
import { useLayout } from "./Layout";

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const LeftSidebar = () => {
  const router = useRouter();
  const { groupId, projectId } = router.query;
  const [projectInfoStatus, setProjectInfoStatus] = useState("Members");
  const chatRef = useRef(null);
  const [message, setMessage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
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
  }, [handleGetLoginUser]); // この配列内に依存関係がある場合は追加してください。例：[currentUser]
  const {
    homeUrl,
    groupCalendarUrl,
    groupDashboardUrl,
    groupLibraryUrl,
    groupProjectsUrl,
    groupMemberUrl,
    groupSettingUrl,
    startGroupUrl,
    groupProjectUrl,
  } = useRoutingCheck();
  const [groups, setGroups] = useState(null);
  const [project, setProject] = useState(null);
  const { point, setPoint } = useLayout();
  const [groupName, setGroupName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const handleGetGroups = useCallback(async () => {
    // groups コレクションを繰り返し処理して、それぞれのドキュメントに対してサブコレクションの members から特定の userId を探します。
    const groupsCollection = collection(db, "groups");
    const groupSnapshots = await getDocs(groupsCollection);
    const matchingGroups = [];

    for (const groupSnapshot of groupSnapshots.docs) {
      const memberDocRef = doc(
        db,
        "groups",
        groupSnapshot.id,
        "members",
        currentUser.uid
      );
      const memberDocSnapshot = await getDoc(memberDocRef);

      if (memberDocSnapshot.exists()) {
        matchingGroups.push({ id: groupSnapshot.id, ...groupSnapshot.data() });
      }
    }

    // router.queryからgroupIdを取得
    const currentGroupId = router.query.groupId;

    // groupIdが一致するグループを探す
    const selected = matchingGroups.find(
      (group) => group.id === currentGroupId
    );

    // 一致するグループが見つかった場合、それをsetSelectedGroupに設定
    if (selected) {
      setSelectedGroup(selected);
    } else {
      // 一致するものがない場合、デフォルトのグループを設定
      setSelectedGroup(matchingGroups[0]);
    }

    setGroups(matchingGroups);
  }, [currentUser.uid, router.query.groupId]);

  console.log("groups", groups);

  const handleAddGroup = useCallback(async () => {
    try {
      // groups コレクションに新しいドキュメントを追加
      const groupDocRef = await addDoc(collection(db, "groups"), {
        name: groupName,
      });

      // 新しいドキュメントに members サブコレクションを追加
      const memberDocRef = doc(
        db,
        "groups",
        groupDocRef.id,
        "members",
        currentUser.uid
      );
      await setDoc(memberDocRef, {
        status: "manager",
      });

      setSelectedGroup({
        id: groupDocRef.id,
        name: groupName,
      });

      handleGetGroups();

      router.push(`/groups/${groupDocRef.id}/dashboard`);

      onClose();

      console.log("Document added successfully!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }, [currentUser.uid, groupName, handleGetGroups, onClose, router]);

  useEffect(() => {
    handleGetGroups();
  }, [handleGetGroups]);

  const CustomTab = forwardRef((props, ref) => {
    const tabProps = useTab({ ...props, ref });
    const isSelected = !!tabProps["aria-selected"];
    const styles = useMultiStyleConfig("Tabs", tabProps);

    const getTabLabel = (label) => {
      switch (label) {
        case "Members":
          return { number: project?.members?.length, color: "gray" };
        case "Chat":
          return { number: 2, color: "red" };
        case "Progress":
          return { number: project?.book?.chapters?.length, color: "teal" };
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

  const handleGetProject = useCallback(async () => {
    if (!groupId || !projectId) return;

    // groupIdに一致するgroupsコレクションのドキュメントを取得
    const groupDocRef = doc(db, "groups", groupId);
    const groupDocSnapshot = await getDoc(groupDocRef);

    if (!groupDocSnapshot.exists) {
      console.error("Specified groupId does not exist.");
      return;
    }

    // projectIdに一致するprojectsサブコレクションのドキュメントを取得
    const projectDocRef = doc(groupDocSnapshot.ref, "projects", projectId);
    const projectDocSnapshot = await getDoc(projectDocRef);

    if (!projectDocSnapshot.exists) {
      console.error("Specified projectId does not exist.");
      return;
    }

    const projectData = projectDocSnapshot.data();

    // projectDataがundefinedでないことを確認
    if (!projectData) {
      console.error("Failed to retrieve project data.");
      return;
    }

    // projectのbookIdフィールドに基づいて、関連するbookを取得
    const bookId = projectData.bookId;
    const bookDocRef = doc(db, "books", bookId);
    const bookDocSnapshot = await getDoc(bookDocRef);

    if (bookDocSnapshot.exists) {
      const bookData = bookDocSnapshot.data();

      // bookのtagsフィールドに基づいて、関連するbookTagsを取得
      if (bookData.tags && Array.isArray(bookData.tags)) {
        const tagsData = [];

        for (const tag of bookData.tags) {
          const tagDocRef = doc(db, "bookTags", tag);
          const tagDocSnapshot = await getDoc(tagDocRef);

          if (tagDocSnapshot.exists) {
            tagsData.push(tagDocSnapshot.data());
          }
        }

        bookData.tags = tagsData; // tags配列をbookTagsコレクションのデータで置き換え
      }

      projectData.book = bookData;
    }

    // projectIdに一致するchaptersサブコレクションのドキュメントを取得
    const chaptersCollectionRef = collection(projectDocRef, "chapters");
    const chaptersSnapshot = await getDocs(chaptersCollectionRef);

    const chaptersData = await Promise.all(
      chaptersSnapshot.docs.map(async (chapterDoc) => {
        const chapterData = chapterDoc.data();

        // chapterのassignIdフィールドに基づいて、関連するuserを取得
        const assignId = chapterData.assignId;
        const userDocRef = doc(db, "users", assignId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists) {
          chapterData.user = userDocSnapshot.data();
        }

        return chapterData;
      })
    );

    projectData.chapters = chaptersData;

    // projectのmembersフィールドに基づいて、関連するusersを取得
    const memberIds = projectData.members;
    const membersData = [];

    for (const memberId of memberIds) {
      const userDocRef = doc(db, "users", memberId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists) {
        const userData = userDocSnapshot.data();
        userData.id = userDocSnapshot.id; // ドキュメントIDをidキーとして追加
        membersData.push(userData);
      }
    }

    projectData.members = membersData;

    setProject(projectData);
  }, [groupId, projectId]);

  useEffect(() => {
    handleGetProject();
  }, [handleGetProject]);

  console.log("project", project);

  const [group, setGroup] = useState(null);

  const handleGetGroup = useCallback(async () => {
    if (!groupId) return; // groupIdが存在しない場合は何もしない

    const groupDocRef = doc(db, "groups", groupId);
    const groupDocSnapshot = await getDoc(groupDocRef);

    if (groupDocSnapshot.exists) {
      setGroup({
        id: groupDocSnapshot.id,
        ...groupDocSnapshot.data(),
      });
    } else {
      console.error("Specified groupId does not exist.");
    }
  }, [groupId]);

  useEffect(() => {
    handleGetGroup();
  }, [handleGetGroup]);

  console.log("group", group);

  const totalChapterRatio = Math.ceil(
    ((project?.chapters?.filter((c) => c.isCompleted === true)?.length || 0) /
      (project?.book?.chapters?.length || 1)) *
      100
  );

  console.log(
    "ccc",
    project?.chapters?.filter((c) => c.isCompleted === true).length
  );

  console.log("totalChapterRatio", totalChapterRatio);

  const handleEmojiClick = async (emoji) => {
    const emojiRef = doc(
      db,
      "groups",
      groupId,
      "projects",
      projectId,
      "emoji",
      currentUser?.uid
    );
    await setDoc(emojiRef, { text: emoji });
  };

  const [emojis, setEmojis] = useState({});
  const [emoji, setEmoji] = useState(null);
  const styles = useStyleConfig("Emoji", {
    animation: `${fadeOut} 2s forwards`,
  });
  useEffect(() => {
    if (!groupId || !projectId) return;

    const emojiCollection = collection(
      db,
      "groups",
      groupId,
      "projects",
      projectId,
      "emoji"
    );

    const unsubscribe = onSnapshot(emojiCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          const emojiData = change.doc.data();
          setEmoji({
            text: emojiData.text,
            top: Math.random() * window.innerHeight,
            left: Math.random() * window.innerWidth,
          });

          // 2秒後に絵文字を削除します
          setTimeout(() => {
            setEmoji(null);
          }, 2000);
        }
      });
    });

    return () => unsubscribe();
  }, [groupId, projectId]);

  return (
    <>
      {!groupProjectUrl() ? (
        <Flex style={{ height: "calc(100vh - 80px)" }}>
          <Flex
            w="64px"
            overflowY="auto"
            h="100%"
            direction="column"
            py="24px"
            borderRight="1px solid black"
            borderColor="gray.200"
            justifyContent="space-between"
          >
            <VStack spacing="16px">
              {/* グループ配列 */}
              {groups?.map((group) => (
                <Image
                  key={group.id}
                  w="32px"
                  h="32px"
                  bg="gray.300"
                  borderRadius="md"
                  border={
                    startGroupUrl() && selectedGroup.id === group.id
                      ? "4px solid black"
                      : "none"
                  }
                  borderColor="teal.300"
                  cursor="pointer"
                  onClick={() => {
                    setSelectedGroup(group);
                    router.push(`/groups/${group.id}/dashboard`);
                  }}
                  src={group.imageUrl}
                  alt=""
                />
              ))}
              {/* Plusアイコン */}
              <Center
                p={1}
                _hover={{ bg: "teal.100" }}
                borderRadius="full"
                transition="ease-in-out 0.2s"
                onClick={onOpen}
              >
                <Icon as={AiOutlinePlus} w="20px" h="20px" cursor="pointer" />
              </Center>
            </VStack>
          </Flex>
          {groupId && (
            <Box w="240px" borderRight="1px solid black" borderColor="gray.200">
              <>
                <Flex
                  w="100%"
                  borderBottom="1px solid black"
                  borderColor="gray.200"
                  p={4}
                  justify="space-between"
                  alignItems="center"
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                >
                  <Text fontWeight="bold">{selectedGroup?.name}</Text>
                </Flex>
                <Flex
                  direction="column"
                  w="100%"
                  pt={2}
                  px={2}
                  pb={4}
                  justifyContent="space-between"
                  style={{ height: "calc(100vh - 137px)" }}
                >
                  <VStack w="100%" spacing={2}>
                    <Flex
                      w="100%"
                      p={2}
                      borderRadius="lg"
                      _hover={{ bg: "teal.100", color: "teal.700" }}
                      transition="ease-in-out 0.2s"
                      cursor="pointer"
                      alignItems="center"
                      onClick={() =>
                        router.push(`/groups/${groupId}/dashboard`)
                      }
                      bg={groupDashboardUrl() ? "teal.200" : "white"}
                      color={groupDashboardUrl() ? "teal.800" : "black"}
                    >
                      <Icon w="20px" h="20px" as={LuLayoutDashboard} mr={4} />
                      <Text fontSize="sm" fontWeight="bold">
                        Dashboard
                      </Text>
                    </Flex>
                    <Flex
                      w="100%"
                      p={2}
                      // bg="teal.200"
                      borderRadius="lg"
                      _hover={{ bg: "teal.100", color: "teal.700" }}
                      transition="ease-in-out 0.2s"
                      cursor="pointer"
                      alignItems="center"
                      onClick={() => router.push(`/groups/${groupId}/projects`)}
                      bg={groupProjectsUrl() ? "teal.200" : "white"}
                      color={groupProjectsUrl() ? "teal.800" : "black"}
                    >
                      <Icon w="20px" h="20px" as={GoProject} mr={4} />
                      <Text fontSize="sm" fontWeight="bold">
                        Projects
                      </Text>
                    </Flex>
                    <Flex
                      w="100%"
                      p={2}
                      borderRadius="lg"
                      _hover={{ bg: "teal.100", color: "teal.700" }}
                      transition="ease-in-out 0.2s"
                      cursor="pointer"
                      alignItems="center"
                      onClick={() => router.push(`/groups/${groupId}/library`)}
                      bg={groupLibraryUrl() ? "teal.200" : "white"}
                      color={groupLibraryUrl() ? "teal.800" : "black"}
                    >
                      <Icon w="20px" h="20px" as={PiBooksLight} mr={4} />
                      <Text fontSize="sm" fontWeight="bold">
                        Library
                      </Text>
                    </Flex>
                    <Flex
                      w="100%"
                      p={2}
                      borderRadius="lg"
                      _hover={{ bg: "teal.100", color: "teal.700" }}
                      transition="ease-in-out 0.2s"
                      cursor="pointer"
                      alignItems="center"
                      onClick={() => router.push(`/groups/${groupId}/members`)}
                      bg={groupMemberUrl() ? "teal.200" : "white"}
                      color={groupMemberUrl() ? "teal.800" : "black"}
                    >
                      <Icon w="20px" h="20px" as={PiUsersThree} mr={4} />
                      <Text fontSize="sm" fontWeight="bold">
                        Members
                      </Text>
                    </Flex>
                    <Flex
                      w="100%"
                      p={2}
                      borderRadius="lg"
                      _hover={{ bg: "teal.100", color: "teal.700" }}
                      transition="ease-in-out 0.2s"
                      cursor="pointer"
                      alignItems="center"
                      onClick={() => router.push(`/groups/${groupId}/calendar`)}
                      bg={groupCalendarUrl() ? "teal.200" : "white"}
                      color={groupCalendarUrl() ? "teal.800" : "black"}
                    >
                      <Icon w="20px" h="20px" as={AiOutlineCalendar} mr={4} />
                      <Text fontSize="sm" fontWeight="bold">
                        Calendar
                      </Text>
                    </Flex>
                    <Flex
                      w="100%"
                      p={2}
                      borderRadius="lg"
                      _hover={{ bg: "teal.100", color: "teal.700" }}
                      transition="ease-in-out 0.2s"
                      cursor="pointer"
                      alignItems="center"
                      onClick={() => router.push(`/groups/${groupId}/setting`)}
                      bg={groupSettingUrl() ? "teal.200" : "white"}
                      color={groupSettingUrl() ? "teal.800" : "black"}
                    >
                      <Icon w="20px" h="20px" as={AiOutlineSetting} mr={4} />
                      <Text fontSize="sm" fontWeight="bold">
                        Setting
                      </Text>
                    </Flex>
                  </VStack>
                  <Center
                    w="100%"
                    bg="teal.100"
                    borderRadius="xl"
                    boxShadow="md"
                    p={6}
                    position="relative"
                  >
                    <Text
                      position="absolute"
                      bg="teal.600"
                      color="white"
                      borderTopRadius="lg"
                      borderBottomRightRadius="lg"
                      fontSize="xs"
                      py={1}
                      px={3}
                      top="14px"
                      right="44px"
                      zIndex={10}
                      fontWeight="bold"
                    >
                      Free
                    </Text>
                    <VStack spacing={2}>
                      <Avatar src={loginUserData?.photoUrl} />
                      <VStack spacing={1}>
                        <Text fontSize="sm" fontWeight="bold">
                          {loginUserData?.displayName}
                        </Text>
                        <Text color="gray.500" fontSize="xs">
                          @{loginUserData?.userId}
                        </Text>
                      </VStack>
                      <Flex
                        p={2}
                        bg="black"
                        fontWeight="bold"
                        color="white"
                        fontSize="sm"
                        borderRadius="lg"
                        mt={2}
                        cursor="pointer"
                        _hover={{ bg: "gray.700" }}
                      >
                        Upgrade to Pro
                      </Flex>
                    </VStack>
                  </Center>
                </Flex>
              </>
            </Box>
          )}
        </Flex>
      ) : (
        <Flex style={{ height: "100vh" }}>
          <Box w="380px" borderRight="0.3px solid black" borderColor="gray.200">
            <Flex
              w="100%"
              borderBottom="0.3px solid black"
              borderColor="gray.200"
              p={4}
              cursor="pointer"
              direction="column"
              position="relative"
            >
              <Text
                position="absolute"
                right="10px"
                top="10px"
                bg="gray.700"
                py={1}
                px={3}
                borderRadius="xl"
                zIndex={30}
                color="white"
                fontSize="sm"
                fontWeight="bold"
              >
                Invite
              </Text>
              <Box
                w="100%"
                h="100%"
                bg="white"
                opacity={0.9}
                position="absolute"
                top="0"
                left="0"
                zIndex={5}
              />
              <Image
                w="100%"
                h="100%"
                src={project?.backgroundImageUrl}
                alt=""
                position="absolute"
                top="0"
                left="0"
              />
              <HStack alignItems="flex-start" zIndex={10}>
                <Icon
                  as={BsChevronLeft}
                  onClick={() => router.push(`/groups/${groupId}/dashboard`)}
                />
                <Text fontSize="xs" fontWeight="bold" mb={2}>
                  {group?.name}
                </Text>
              </HStack>
              <HStack alignItems="flex-start" zIndex={10}>
                <Image
                  w="40px"
                  h="60px"
                  bg="gray.400"
                  borderRadius="md"
                  alt=""
                  src={project?.book?.imageUrl}
                />
                <VStack alignItems="flex-start">
                  <Text fontWeight="bold">{project?.book?.title}</Text>
                  <Badges isBook tags={project?.book?.tags} />
                </VStack>
              </HStack>
            </Flex>
            {emoji && (
              <span
                style={{
                  ...styles,
                  position: "fixed",
                  top: emoji.top + "px",
                  left: emoji.left + "px",
                  fontSize: "64px",
                  zIndex: 1000,
                }}
              >
                {emoji.text}
              </span>
            )}
            <Flex
              style={{ height: "calc(100vh - 200px)" }}
              w="100%"
              position="relative"
            >
              <Box w="100%">
                <Flex w="100%" pt={4} px={4}>
                  <Tabs colorScheme="teal" variant="unstyled">
                    <TabList>
                      <CustomTab>Members</CustomTab>
                      <CustomTab>Chat</CustomTab>
                      <CustomTab>Progress</CustomTab>
                    </TabList>
                    <TabIndicator
                      mt="-1.5px"
                      height="2px"
                      bg="teal.500"
                      borderRadius="1px"
                    />
                    <TabPanels>
                      <TabPanel px={0}>
                        <Flex
                          direction="column"
                          w="100%"
                          justifyContent="space-between"
                          style={{ height: "calc(100vh - 200px)" }}
                        >
                          {projectInfoStatus === "Members" && (
                            <VStack
                              alignItems="flex-start"
                              w="100%"
                              overflowY="auto"
                              pb={4}
                              px={4}
                            >
                              {project?.members?.map((member) => (
                                <HStack
                                  key={member.id}
                                  p={2}
                                  _hover={{ bg: "gray.100" }}
                                  w="100%"
                                  borderRadius="lg"
                                  cursor="pointer"
                                  justifyContent="space-between"
                                >
                                  <HStack
                                    justifyContent="space-between"
                                    w="100%"
                                  >
                                    <HStack>
                                      <Flex position="relative">
                                        <Avatar
                                          width="40px"
                                          height="40px"
                                          alt=""
                                          src={member.photoUrl}
                                        />
                                      </Flex>
                                      <Box>
                                        <Text fontWeight="bold" fontSize="sm">
                                          {member.displayName}
                                        </Text>
                                        <Text fontSize="10px">
                                          @{member.userId}
                                        </Text>
                                      </Box>
                                    </HStack>
                                    <Center
                                      w="40px"
                                      h="40px"
                                      position="relative"
                                      borderRadius="full"
                                    >
                                      <DoughnutItem
                                        percentage={member.experiencePoint}
                                        type="USER_LEVEL"
                                        backgroundColor={["#38B2AC", "#E2E8F0"]}
                                        borderColor={["#4FD1C5", "#CBD5E0"]}
                                      />
                                      <Text
                                        fontSize="xs"
                                        fontWeight="bold"
                                        position="absolute"
                                        color="teal.700"
                                      >
                                        {member.level}
                                      </Text>
                                    </Center>
                                  </HStack>
                                </HStack>
                              ))}
                            </VStack>
                          )}
                          <Box w="100%" p={4} bg="gray.100" borderRadius="xl">
                            <HStack mb={4} justifyContent="space-between">
                              <HStack>
                                <Avatar
                                  size="lg"
                                  src={loginUserData?.photoUrl}
                                />
                                <Flex direction="column">
                                  <Text fontWeight="bold">
                                    {loginUserData?.displayName}
                                  </Text>
                                  <Text
                                    fontSize="xs"
                                    fontWeight="bold"
                                    color="gray.500"
                                  >
                                    {loginUserData?.userId}
                                  </Text>
                                </Flex>
                              </HStack>
                              <Center
                                w="64px"
                                h="64px"
                                position="relative"
                                borderRadius="full"
                              >
                                <DoughnutItem
                                  percentage={point}
                                  type="USER_LEVEL"
                                  backgroundColor={["#FAF089", "#cccccc"]}
                                  borderColor={["#ECC94B", "#FAF0C1"]}
                                />
                                <Icon
                                  color="yellow.500"
                                  fontSize="24px"
                                  as={FaCoins}
                                  position="absolute"
                                />
                              </Center>
                            </HStack>
                            <HStack
                              w="100%"
                              justifyContent="space-between"
                              mb={4}
                            >
                              <Center
                                w="40px"
                                h="40px"
                                borderRadius="full"
                                bg="gray.300"
                                fontSize="24px"
                                cursor="pointer"
                                onClick={() => handleEmojiClick("🥹")}
                              >
                                🥹
                              </Center>
                              <Center
                                w="40px"
                                h="40px"
                                borderRadius="full"
                                bg="gray.300"
                                fontSize="24px"
                                cursor="pointer"
                                onClick={() => handleEmojiClick("🤣")}
                              >
                                🤣
                              </Center>
                              <Center
                                w="40px"
                                h="40px"
                                borderRadius="full"
                                bg="gray.300"
                                fontSize="24px"
                                cursor="pointer"
                                onClick={() => handleEmojiClick("🥳")}
                              >
                                🥳
                              </Center>
                              <Center
                                w="40px"
                                h="40px"
                                borderRadius="full"
                                bg="gray.300"
                                fontSize="24px"
                                cursor="pointer"
                                onClick={() => handleEmojiClick("😱")}
                              >
                                😱
                              </Center>
                              <Center
                                w="40px"
                                h="40px"
                                borderRadius="full"
                                bg="gray.300"
                                fontSize="24px"
                                cursor="pointer"
                                onClick={() => handleEmojiClick("🤬")}
                              >
                                🤬
                              </Center>
                            </HStack>
                            <HStack
                              w="100%"
                              // bg={chapter?.assignId ? "teal.300" : "gray.300"}
                              bg="teal.100"
                              _hover={{ bg: "gray.100" }}
                              borderRadius="lg"
                              p={2}
                              cursor="pointer"
                            >
                              <Image
                                src={presentImages[3]}
                                width="32px"
                                height="32px"
                                borderRadius="md"
                                bg="white"
                                alt=""
                              />
                              <Flex direction="column">
                                <Text
                                  fontSize="xs"
                                  fontWeight="bold"
                                  color="gray.500"
                                >
                                  ４章
                                </Text>
                                <Text fontWeight="bold" fontSize="sm">
                                  美しさ
                                </Text>
                              </Flex>
                            </HStack>
                          </Box>
                        </Flex>
                      </TabPanel>
                      <TabPanel px={0}>
                        <Flex direction="column" w="100%">
                          <VStack
                            alignItems="flex-start"
                            as="div"
                            css={{
                              // スクロールバーのスタイル
                              "&::-webkit-scrollbar": {
                                width: "8px",
                                color: "gray.700",
                              },
                              "&::-webkit-scrollbar-track": {
                                backgroundColor: "#A0AEC0",
                                borderRadius: "20px",
                              },
                              "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#1A202C",
                                borderRadius: "20px",
                              },
                            }}
                            // h="full"
                            overflowY="auto"
                            ref={chatRef}
                            spacing={2}
                            px={2}
                            position="relative"
                            style={{ height: "calc(100vh - 220px)" }}
                          >
                            <MyMessage
                              msg="Hello World"
                              date="1992-05-28T15:00:00.000Z"
                            />
                            <MemberMessage
                              user={{ name: "Shogo", photoUrl: "" }}
                              msg="Hello World"
                              date="1992-05-28T15:00:00.000Z"
                            />
                            <InputGroup
                              mt={4}
                              w="100%"
                              position="absolute"
                              bottom="10"
                              left="0"
                              px={2}
                            >
                              <Input
                                bg="gray.100"
                                borderRadius="full"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                // onKeyDown={async (e) => {
                                //   if (e.key === "Enter" && e.ctrlKey) {
                                //     await sendMessage();
                                //   }
                                // }}
                                placeholder="メッセージを入力"
                              />

                              {/*右*/}
                              <InputRightElement mr={2}>
                                <IconButton
                                  aria-label="メッセージ送信"
                                  border="none"
                                  color="teal.800"
                                  icon={<FaRegPaperPlane />}
                                  // onClick={handleSendMessage}
                                  rounded="full"
                                  size="sm"
                                  bg="teal.200"
                                />
                              </InputRightElement>
                            </InputGroup>
                          </VStack>
                        </Flex>
                      </TabPanel>
                      <TabPanel px={0}>
                        <Flex direction="column" w="100%">
                          <>
                            <VStack>
                              <Center w="160px" h="160px" position="relative">
                                <HStack spacing={0.5} position="absolute">
                                  <Text fontSize="4xl" fontWeight="bold">
                                    {totalChapterRatio}
                                  </Text>
                                  <Text mt={2}>%</Text>
                                </HStack>
                                <DoughnutItem
                                  percentage={totalChapterRatio}
                                  type="USER_LEVEL"
                                  backgroundColor={["#38B2AC", "#E2E8F0"]}
                                  borderColor={["#4FD1C5", "#CBD5E0"]}
                                />
                              </Center>
                            </VStack>
                            <VStack
                              w="100%"
                              direction="column"
                              px={4}
                              mt={4}
                              spacing={0.5}
                              style={{ height: "calc(100vh - 380px)" }}
                              overflowY="scroll"
                              pb={4}
                            >
                              {project?.book?.chapters?.map((chapter) => (
                                <HStack
                                  key={chapter.index}
                                  w="100%"
                                  // bg={chapter?.assignId ? "teal.300" : "gray.300"}
                                  // bg="teal.100"
                                  bg={
                                    project?.chapters?.find(
                                      (c) => c.index === chapter.index
                                    )?.isCompleted === true
                                      ? "teal.100"
                                      : ""
                                  }
                                  _hover={{ bg: "gray.100" }}
                                  borderRadius="lg"
                                  p={2}
                                  cursor="pointer"
                                  // opacity={chapter?.isCompleted === true ? 1 : 0.5}
                                >
                                  <Avatar
                                    width="32px"
                                    height="32px"
                                    // src={chapter?.assignUser?.photoUrl}
                                    src={
                                      project?.chapters?.find(
                                        (c) => c.index === chapter.index
                                      )?.user?.photoUrl
                                        ? project?.chapters?.find(
                                            (c) => c.index === chapter.index
                                          )?.user?.photoUrl
                                        : "/images/avatar/anonymous.png"
                                    }
                                    boxShadow="md"
                                  />
                                  <Flex direction="column">
                                    <Text fontSize="xs">{chapter.index}</Text>
                                    <Text fontWeight="bold" fontSize="sm">
                                      {chapter.title}
                                    </Text>
                                  </Flex>
                                </HStack>
                              ))}
                            </VStack>
                          </>
                        </Flex>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </Flex>
              </Box>
            </Flex>
          </Box>
        </Flex>
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px) hue-rotate(10deg)" />
        <ModalContent>
          <ModalBody>
            <VStack alignItems="flex-start">
              <Text>Hello World</Text>
              <Input
                placeholder="グループ名"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <Button onClick={handleAddGroup}>作成</Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export const tszToTimeString = (timestamptz) => {
  const date = new Date(timestamptz);
  const localString = date.toUTCString();

  const timeString = localString.split(" ")[4]; // '06:20:20'
  const [hour, minute] = timeString.split(":"); // ['06', '20']

  return `${hour}:${minute}`; // '06:20'
};

const MemberMessage = ({ user, msg, date }) => {
  return (
    <Flex>
      <Avatar
        alt={user?.name}
        height="35px"
        src={user?.photoUrl}
        width="35px"
      />
      <VStack alignItems="flex-start" ml={2} spacing={0}>
        <Text fontSize="xs" mb={1} fontWeight="bold">
          {user?.name}
        </Text>
        <HStack alignItems="end">
          <MessageText direction="right">{msg}</MessageText>
          <Text color="gray.500" fontSize={10}>
            {tszToTimeString(date)}
          </Text>
        </HStack>
      </VStack>
    </Flex>
  );
};

const MyMessage = ({ msg, date }) => {
  return (
    <HStack alignItems="flex-end" alignSelf="flex-end">
      <Text color="gray.800" fontSize={10}>
        {tszToTimeString(date)}
      </Text>
      <MessageText direction="left">{msg}</MessageText>
    </HStack>
  );
};

const MessageText = ({ direction, ...props }) => {
  const styles = {
    left: {
      borderBottomRightRadius: "20px",
      borderLeftRadius: "20px",
    },
    right: {
      borderBottomLeftRadius: "20px",
      borderRightRadius: "20px",
    },
  };

  return (
    <Text
      bg="gray.100"
      fontSize="xs"
      maxW={240}
      px={4}
      py={2}
      {...styles[direction]}
      {...props}
    />
  );
};

export default LeftSidebar;
