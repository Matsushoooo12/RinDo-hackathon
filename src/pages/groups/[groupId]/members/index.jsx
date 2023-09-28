/* eslint-disable react/display-name */
import MemberCard from "@/components/organisms/members/MemberCard";
import UserCard from "@/components/organisms/users/UserCard";
import { db } from "@/config/firebase";
import {
  Box,
  Button,
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
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  useMultiStyleConfig,
  useTab,
  useToast,
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
import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { AiOutlineCopy, AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import { PiUsersThree } from "react-icons/pi";

const Members = () => {
  const router = useRouter();
  const { groupId } = router.query;
  const toast = useToast();

  const {
    isOpen: isMemberDetailOpen,
    onOpen: onMemberDetailOpen,
    onClose: onMemberDetailClose,
  } = useDisclosure();
  const {
    isOpen: isInviteCodeOpen,
    onOpen: onInviteCodeOpen,
    onClose: onInviteCodeClose,
  } = useDisclosure();
  const {
    isOpen: isAddMemberOpen,
    onOpen: onAddMemberOpen,
    onClose: onAddMemberClose,
  } = useDisclosure();
  const [members, setMembers] = useState([]);
  const [member, setMember] = useState(null);

  const handleInviteClick = () => {
    toast({
      title: "Copied to clipboard!",
      position: "top",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onInviteCodeClose();
  };
  const managerMembers = members.filter(
    (member) => member.status === "manager"
  );
  const applicantMembers = members.filter(
    (member) => member.status === "applicant"
  );
  const participantMembers = members.filter(
    (member) => member.status === "participant"
  );
  const handleGetMembers = useCallback(async () => {
    try {
      const groupDocRef = doc(db, "groups", groupId);
      const membersCollectionRef = collection(groupDocRef, "members");
      const memberSnapshots = await getDocs(membersCollectionRef);

      // 各メンバーに対応するユーザーデータを取得する非同期関数
      const getUserData = async (memberId) => {
        const userDocRef = doc(db, "users", memberId);
        const userDocSnapshot = await getDoc(userDocRef);
        return userDocSnapshot.data();
      };

      // 各メンバーのIDに対応するbooksを取得する非同期関数
      const getBooksForMember = async (memberId) => {
        const booksCollectionRef = collection(db, "books");
        const booksQuery = query(
          booksCollectionRef,
          where("documentId", "==", memberId)
        );
        const booksSnapshots = await getDocs(booksQuery);
        return booksSnapshots.docs.map((doc) => doc.data());
      };

      // fetchedMembersを一時的に格納する配列
      let tempMembers = [];

      for (let doc of memberSnapshots.docs) {
        // 各メンバーのデータを取得
        const memberData = {
          id: doc.id,
          ...doc.data(),
        };

        // 対応するユーザーデータを取得して、memberDataに統合
        const userData = await getUserData(doc.id);
        const memberBooks = await getBooksForMember(doc.id);
        tempMembers.push({
          ...memberData,
          ...userData,
          books: memberBooks,
        });
      }

      setMembers(tempMembers);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  }, [groupId]);
  useEffect(() => {
    if (groupId) {
      handleGetMembers();
    }
  }, [groupId, handleGetMembers]);
  console.log("members", members);
  const CustomTab = forwardRef((props, ref) => {
    const tabProps = useTab({ ...props, ref });
    const isSelected = !!tabProps["aria-selected"];
    const styles = useMultiStyleConfig("Tabs", tabProps);

    const getTabLabel = (label) => {
      switch (label) {
        case "All":
          return { number: members?.length, color: "gray" };
        case "Manager":
          return { number: managerMembers?.length, color: "red" };
        case "Participant":
          return { number: participantMembers?.length, color: "blue" };
        case "Applicant":
          return { number: applicantMembers?.length, color: "teal" };
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
          <Icon w="20px" h="20px" as={PiUsersThree} />
          <Text fontWeight="bold">Members</Text>
        </HStack>
      </Flex>
      <Box maxW="1084px" margin="0px auto" p="32px 16px">
        <Tabs colorScheme="teal" variant="unstyled">
          <TabList>
            <Flex justifyContent="space-between" w="100%">
              <Flex>
                <CustomTab>All</CustomTab>
                <CustomTab>Manager</CustomTab>
                <CustomTab>Participant</CustomTab>
                <CustomTab>Applicant</CustomTab>
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
                  bg="purple.100"
                  fontSize="sm"
                  h="32px"
                  onClick={onAddMemberOpen}
                >
                  <Icon as={AiOutlinePlus} mr={2} />
                  Invite
                </Button>
                {/* <Button
                  bg="yellow.100"
                  fontSize="sm"
                  h="32px"
                  onClick={onInviteCodeOpen}
                >
                  <Icon as={AiOutlineCopy} mr={2} />
                  Copy Invite code
                </Button> */}
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
                {members?.map((member) => (
                  <UserCard
                    key={member.id}
                    user={member}
                    onClick={() => {
                      setMember(member);
                      onMemberDetailOpen();
                    }}
                  />
                ))}
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                {managerMembers?.map((member) => (
                  <UserCard
                    key={member.id}
                    user={member}
                    onClick={() => {
                      setMember(member);
                      onMemberDetailOpen();
                    }}
                  />
                ))}
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                {participantMembers?.map((member) => (
                  <UserCard
                    key={member.id}
                    user={member}
                    onClick={() => {
                      setMember(member);
                      onMemberDetailOpen();
                    }}
                  />
                ))}
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                {applicantMembers?.map((member) => (
                  <UserCard
                    key={member.id}
                    user={member}
                    onClick={() => {
                      setMember(member);
                      onMemberDetailOpen();
                    }}
                  />
                ))}
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      {/* ユーザーモーダル */}
      <Modal
        isOpen={isMemberDetailOpen}
        onClose={onMemberDetailClose}
        isCentered
        size="lg"
      >
        <ModalOverlay backdropFilter="blur(4px) hue-rotate(10deg)" />
        <ModalContent>
          <ModalBody>
            <Text>{member?.id}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* 招待コードモーダル */}
      <Modal
        isOpen={isInviteCodeOpen}
        onClose={onInviteCodeClose}
        isCentered
        size="lg"
      >
        <ModalOverlay backdropFilter="blur(4px) hue-rotate(10deg)" />
        <ModalContent>
          <ModalBody>
            <Text>Invite Code</Text>
            <Input placeholder="Invite..." isReadOnly />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isAddMemberOpen}
        onClose={onAddMemberClose}
        isCentered
        size="lg"
      >
        <ModalOverlay backdropFilter="blur(4px) hue-rotate(10deg)" />
        <ModalContent>
          <ModalBody p={6}>
            <Text textAlign="center" fontWeight="bold" fontSize="xl" mb={4}>
              招待する
            </Text>
            {/* <Image
              w="360px"
              src="/images/groups/invite.svg"
              alt=""
              margin="auto"
              mb={8}
            /> */}
            <HStack
              bg="gray.200"
              py={1}
              px={4}
              justifyContent="space-between"
              borderRadius="md"
              w="440px"
              margin="auto"
            >
              <Text>https://rindo.com/invite?code=adg2egr3whRsd</Text>
              <Icon
                cursor="pointer"
                as={AiOutlineCopy}
                w="40px"
                h="40px"
                p={2}
                borderRadius="full"
                _hover={{ bg: "gray.300" }}
                onClick={handleInviteClick}
              />
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Members;
