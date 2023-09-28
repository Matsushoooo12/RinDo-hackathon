/* eslint-disable react/display-name */
import { Badges } from "@/components/atoms/Badges";
import DoughnutItem from "@/components/organisms/DoughnutItem";
import ProjectCard from "@/components/organisms/projects/ProjectCard";
import { db } from "@/config/firebase";
import { AuthContext } from "@/pages/_app";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
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
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useDisclosure,
  useMultiStyleConfig,
  useTab,
} from "@chakra-ui/react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import { GoGoal, GoProject } from "react-icons/go";

const Projects = () => {
  const router = useRouter();
  const { groupId } = router.query;
  const { currentUser } = useContext(AuthContext);
  const {
    isOpen: isDetailProjectOpen,
    onOpen: onDetailProjectOpen,
    onClose: onDetailProjectClose,
  } = useDisclosure();
  const {
    isOpen: isCreateProjectOpen,
    onOpen: onCreateProjectOpen,
    onClose: onCreateProjectClose,
  } = useDisclosure();
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  // projectsサブセット
  const inProgressProjects = projects?.filter(
    (project) => project.status === "In progress"
  );
  const completedProjects = projects?.filter(
    (project) => project.status === "Completed"
  );
  const participatedProjects = projects?.filter((project) =>
    project.members.includes(currentUser.uid)
  );

  const handleGetProjects = useCallback(async () => {
    // ルートのgroupsコレクションのサブコレクションであるprojectsコレクションを参照
    const projectsQuery = query(collection(db, "groups", groupId, "projects"));
    const projectSnapshots = await getDocs(projectsQuery);

    // 各プロジェクトに関連する情報を非同期で取得
    const enrichedProjects = await Promise.all(
      projectSnapshots.docs.map(async (projectDoc) => {
        const projectData = projectDoc.data();

        // membersフィールドに基づいて関連するユーザー情報を取得
        const usersSnapshots = await Promise.all(
          projectData.members.map((userId) => getDoc(doc(db, "users", userId)))
        );
        const users = usersSnapshots.map((userDoc) => userDoc.data());

        // bookIdに基づいて関連する本の情報を取得
        const bookSnapshot = await getDoc(doc(db, "books", projectData.bookId));
        const book = bookSnapshot.data();

        // 本のtagsフィールドに基づいて関連するタグ情報を取得
        const tagsSnapshots = await Promise.all(
          (book.tags || []).map((tagId) => getDoc(doc(db, "bookTags", tagId)))
        );
        const tags = tagsSnapshots.map((tagDoc) => tagDoc.data());

        return {
          id: projectDoc.id,
          ...projectData,
          users, // プロジェクトに関連するユーザーの配列
          book: {
            ...book,
            tags, // 本に関連するタグの配列
          },
        };
      })
    );

    setProjects(enrichedProjects);
  }, [groupId]);

  useEffect(() => {
    handleGetProjects();
  }, [handleGetProjects]);

  console.log("projects", projects);

  const CustomTab = forwardRef((props, ref) => {
    const tabProps = useTab({ ...props, ref });
    const isSelected = !!tabProps["aria-selected"];
    const styles = useMultiStyleConfig("Tabs", tabProps);

    const getTabLabel = (label) => {
      switch (label) {
        case "All":
          return { number: projects?.length, color: "gray" };
        case "Participated":
          return { number: participatedProjects?.length, color: "red" };
        case "In progress":
          return { number: inProgressProjects?.length, color: "teal" };
        case "Completed":
          return { number: completedProjects?.length, color: "blue" };
        default:
          return; // デフォルトの絵文字
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
          <Icon w="20px" h="20px" as={GoProject} />
          <Text fontWeight="bold">Projects</Text>
        </HStack>
      </Flex>
      <Box maxW="1084px" margin="0px auto" p="32px 16px">
        <Tabs colorScheme="teal" variant="unstyled">
          <TabList>
            <Flex justifyContent="space-between" w="100%">
              <Flex>
                <CustomTab>All</CustomTab>
                <CustomTab>Participated</CustomTab>
                <CustomTab>In progress</CustomTab>
                <CustomTab>Completed</CustomTab>
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
                  onClick={onCreateProjectOpen}
                >
                  <Icon as={AiOutlinePlus} mr={2} />
                  Create
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
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                {projects?.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => {
                      setProject(project);
                      onDetailProjectOpen();
                    }}
                  />
                ))}
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                {participatedProjects?.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => {
                      setProject(project);
                      onDetailProjectOpen();
                    }}
                  />
                ))}
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                {inProgressProjects?.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => {
                      setProject(project);
                      onDetailProjectOpen();
                    }}
                  />
                ))}
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                {completedProjects?.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => {
                      setProject(project);
                      onDetailProjectOpen();
                    }}
                  />
                ))}
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <Modal
        isOpen={isDetailProjectOpen}
        onClose={onDetailProjectClose}
        isCentered
        size="lg"
      >
        <ModalOverlay backdropFilter="blur(4px) hue-rotate(10deg)" />
        <ModalContent>
          <ModalBody py={6}>
            <HStack color="black" cursor="pointer" w="100%" spacing={2} mb={4}>
              <Flex bg="gray.200" borderRadius="lg">
                <Image
                  width="120px"
                  height="170px"
                  alt=""
                  // src={imgUrl(0)}
                  objectFit="cover"
                  style={{ borderRadius: "8px" }}
                />
              </Flex>
              <VStack alignItems="flex-start">
                <Text fontSize="sm" mb={1}>
                  次の開催日：
                  {/* {dayjs(group?.nextEventDate.toDate()).format("YYYY-MM-DD")} */}
                </Text>
                <Text fontWeight="bold" fontSize="xl">
                  aaa
                </Text>
                <HStack
                  spacing={2}
                  w="auto"
                  py={1}
                  px={2}
                  bg="teal.100"
                  borderRadius="md"
                  alignItems="center"
                  mb={4}
                >
                  <Icon as={GoGoal} color="teal.500" />
                  <Text fontSize="sm" fontWeight="bold">
                    aaa
                  </Text>
                </HStack>
                <Badges tags={[{ name: "コーディング規則" }]} />
              </VStack>
            </HStack>
            <Tabs colorScheme="teal" mb={8}>
              <TabList mb={4}>
                <Tab>メンバー 1 / 4</Tab>
                <Tab>概要</Tab>
                <Tab>進捗 40%</Tab>
              </TabList>
              <TabPanels>
                <TabPanel
                  h="240px"
                  overflowY="scroll"
                  bg="gray.200"
                  borderRadius="lg"
                >
                  <VStack spacing={4} alignItems="flex-start" mb={4} w="100%">
                    {/* {group?.members?.map((member, index) => ( */}
                    <HStack
                      // key={member?.id}
                      justifyContent="space-between"
                      w="100%"
                    >
                      <HStack>
                        <Flex position="relative">
                          <Avatar
                            width="48px"
                            height="48px"
                            // src={member?.photoUrl}
                            objectPosition="center"
                            objectFit="cover"
                          />
                        </Flex>
                        <Box>
                          <Text fontWeight="bold">ショウゴ</Text>
                          <Text fontSize="xs">@matsushoooo12</Text>
                        </Box>
                      </HStack>
                      <Center w="48px" h="48px" position="relative">
                        <Text
                          position="absolute"
                          fontWeight="bold"
                          fontSize="sm"
                        >
                          32
                        </Text>
                        <DoughnutItem percentage={50} type="QUEST_PROGRESS" />
                      </Center>
                    </HStack>
                    {/* ))} */}
                  </VStack>
                </TabPanel>
                <TabPanel
                  h="240px"
                  overflowY="scroll"
                  bg="gray.200"
                  borderRadius="lg"
                  fontSize="sm"
                  color="black"
                >
                  aaa
                </TabPanel>
                <TabPanel
                  h="240px"
                  overflowY="scroll"
                  bg="gray.200"
                  borderRadius="lg"
                >
                  <HStack fontWeight="bold" fontSize="sm" mb={4}>
                    <Text>全 10章</Text>
                    <Text>完了 40%</Text>
                  </HStack>
                  <VStack spacing={8} alignItems="flex-start" mb={4}>
                    {/* {Object.values(group?.chapters || {}).map(
                      (chapter, index) => ( */}
                    <HStack
                      // key={index}
                      justifyContent="space-between"
                      w="100%"
                    >
                      <HStack>
                        <Center
                          bg="white"
                          width="48px"
                          height="48px"
                          p={1}
                          borderRadius="md"
                          // opacity={chapter.isCompleted ? 1 : 0.3}
                        >
                          <Image
                            width="40px"
                            height="40px"
                            alt=""
                            // src={presentImageUrl[index]}
                          />
                        </Center>
                        <Box>
                          <Text fontSize="sm" mb={1}>
                            第４章
                          </Text>
                          <Text fontWeight="bold">美しさ</Text>
                        </Box>
                      </HStack>
                      <Avatar w="36px" h="36px" />
                    </HStack>
                    {/* )
                    )} */}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
            <HStack justifyContent="flex-end" mt={8}>
              <Button onClick={onDetailProjectClose}>キャンセル</Button>
              <Button
                onClick={() =>
                  router.push(`/groups/${groupId}/projects/${project?.id}`)
                }
              >
                詳細
              </Button>
              {/* {group?.members?.find(
                (member) => member.id === currentUser?.uid
              ) ? (
                <Button
                  onClick={() =>
                    router.push(`/books/${bookId}/groups/${group?.id}`)
                  }
                  bg="teal.100"
                  color="teal.700"
                >
                  プレイ
                </Button>
              ) : applicationStatus === "Applied" ? (
                <Button disabled>申請済み</Button>
              ) : (
                <Button
                  onClick={() => {
                    handleApplyGroup();
                    onGroupDetailsClose();
                  }}
                  bg="teal.100"
                  color="teal.700"
                >
                  参加申請する
                </Button>
              )} */}
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
            <Flex h="80vh">
              <Text>Hello World</Text>
              <Button
                onClick={() => router.push(`/groups/${groupId}/projects/1`)}
              >
                作成する
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Projects;
