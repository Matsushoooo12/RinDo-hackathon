import { db } from "@/config/firebase";
import { useTimer } from "@/hooks/useTimer";
import { AuthContext } from "@/pages/_app";
import {
  Avatar,
  Box,
  Center,
  Flex,
  HStack,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AiOutlineSetting, AiOutlineSearch } from "react-icons/ai";
import { BiHelpCircle } from "react-icons/bi";
import { BsArrowLeft } from "react-icons/bs";
import { LiaCircle } from "react-icons/lia";
import { useLayout } from "./Layout";

const Header = (props) => {
  const router = useRouter();
  const { searchTerm, setSearchTerm } = useLayout();
  const { projectId, groupId } = router.query;
  const { isFocus, setIsFocus } = props;
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
  const goBack = () => {
    if (window) {
      window.history.back();
    }
  };
  const {
    isOpen: isNextPhaseOpen,
    onOpen: onNextPhaseOpen,
    onClose: onNextPhaseClose,
  } = useDisclosure();
  const {
    time,
    timerStatus,
    remainingTime,
    currentPhase,
    handleToggleTimer,
    handleNextPhase,
    phaseText,
  } = useTimer(groupId, projectId, onNextPhaseOpen);

  // タイマー
  // 初期座標を設定します。
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // ドラッグが終了したときの座標を更新します。
  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };
  return (
    <Flex
      w="100%"
      h="80px"
      borderBottom="1px solid black"
      borderColor="gray.200"
      justify="space-between"
      alignItems="center"
      px={8}
    >
      {isFocus ? (
        <Icon
          fontSize="24px"
          as={BsArrowLeft}
          mr={10}
          onClick={() => {
            goBack();
            setIsFocus(false);
          }}
          cursor="pointer"
        />
      ) : (
        <HStack spacing={2} mr={10}>
          <Image
            h="32px"
            bg="gray.300"
            alt=""
            src="/images/logo/1.png"
            mr={60}
            cursor="pointer"
          />
        </HStack>
      )}
      <HStack spacing={4} flex={1}>
        <InputGroup>
          <InputLeftElement>
            <Icon fontSize="20px" as={AiOutlineSearch} />
          </InputLeftElement>
          <Input
            focusBorderColor="teal.300"
            placeholder="Search..."
            flex={1}
            borderRadius="full"
            onFocus={() => {
              setIsFocus(true);
              router.push("/search?tab=books");
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        <Center
          py={1}
          px={3}
          _hover={{ bg: "teal.100", color: "teal.700" }}
          borderRadius="full"
          transition="ease-in-out 0.2s"
          cursor="pointer"
        >
          <HStack>
            <Icon as={LiaCircle} />
            <Text whiteSpace="nowrap" fontWeight="bold">
              7 days left
            </Text>
          </HStack>
        </Center>
        <Center
          p={1}
          _hover={{ bg: "teal.100" }}
          borderRadius="full"
          transition="ease-in-out 0.2s"
          cursor="pointer"
        >
          <Icon fontSize="28px" as={BiHelpCircle} color="teal.700" />
        </Center>
        <Center
          p={1}
          _hover={{ bg: "teal.100" }}
          borderRadius="full"
          transition="ease-in-out 0.2s"
          cursor="pointer"
        >
          <Icon fontSize="28px" as={AiOutlineSetting} color="teal.700" />
        </Center>
        <Popover>
          <PopoverTrigger>
            <Center
              p={1}
              _hover={{ bg: "teal.100" }}
              borderRadius="full"
              transition="ease-in-out 0.2s"
              cursor="pointer"
            >
              <Avatar w="32px" h="32px" src={loginUserData?.photoUrl} />
            </Center>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <VStack>
                <Text onClick={() => router.push("/profile/1")}>
                  プロフィール
                </Text>
                <Text>ランキング</Text>
                <Text>ショップ</Text>
                <Text>ショップ</Text>
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </HStack>
    </Flex>
  );
};

export default Header;
