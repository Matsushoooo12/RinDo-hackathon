/* eslint-disable react/no-deprecated */
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Center,
  ChakraProvider,
  Flex,
  HStack,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  SlideFade,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import ReactDOM from "react-dom";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import Header from "./Header";
import LeftSidebar from "./LeftSidebar";
import { useRoutingCheck } from "@/hooks/useRoutingCheck";
import { AiFillPlayCircle, AiOutlineFieldTime } from "react-icons/ai";
import DetailProject from "@/pages/groups/[groupId]/projects/[projectId]";
import { MdOutlineNavigateNext } from "react-icons/md";
import { useTimer } from "@/hooks/useTimer";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import Draggable from "react-draggable";
import {
  BsCalendar2Range,
  BsFillStopCircleFill,
  BsHourglassSplit,
} from "react-icons/bs";
import { imgUrl } from "@/lib/data";
import { AuthContext } from "@/pages/_app";

const tests = [
  {
    id: 1,
    text: "理解しやすいコードとは何か？",
    choices: [
      {
        id: 1,
        text: "最大限の労力で最小限の情報を得られるコード",
      },
      {
        id: 2,
        text: "他の開発者がそのコードを読む際に、最小限の労力で最大限の情報を得られるコード",
      },
      {
        id: 3,
        text: "コードが短いもの",
      },
      {
        id: 4,
        text: "コメントが多いコード",
      },
    ],
    answerId: 2,
  },
  {
    id: 2,
    text: "コードの意図が明確であれば、___ を早期に発見しやすくなる。",
    choices: [
      {
        id: 1,
        text: "バグや不具合",
      },
      {
        id: 2,
        text: "パフォーマンスの問題",
      },
      {
        id: 3,
        text: "コメント",
      },
      {
        id: 4,
        text: "使われていない変数",
      },
    ],
    answerId: 1,
  },
  {
    id: 3,
    text: "過度な___は避け、コード自体が自己説明的であることが望ましい。",
    choices: [
      {
        id: 1,
        text: "変数",
      },
      {
        id: 2,
        text: "関数",
      },
      {
        id: 3,
        text: "コメント",
      },
      {
        id: 4,
        text: "インポート",
      },
    ],
    answerId: 3,
  },
  {
    id: 4,
    text: "未来の自分や他の開発者がコードを___する際に、理解しやすいコードは大きな助けとなる。",
    choices: [
      {
        id: 1,
        text: "削除",
      },
      {
        id: 2,
        text: "コピー",
      },
      {
        id: 3,
        text: "変更や修正",
      },
      {
        id: 4,
        text: "実行",
      },
    ],
    answerId: 3,
  },
];

const NewWindowComponent = ({ onClose }) => {
  return (
    <div>
      <h1>Reactコンポーネントがここに表示されます</h1>
      <button onClick={onClose}>ウィンドウを閉じる</button>
      {/* ここに複雑なコンポーネントやデータを表示することができます */}
    </div>
  );
};

// コンテキストの作成
const LayoutContext = createContext();

export const useLayout = () => {
  return useContext(LayoutContext);
};

const Layout = ({ children }) => {
  const router = useRouter();
  const { projectId, groupId } = router.query;
  const [searchTerm, setSearchTerm] = useState("");
  const [point, setPoint] = useState(23);
  const [isFocus, setIsFocus] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [pointPercentage, setPointPercentage] = useState(24);
  const [buttonText, setButtonText] = useState("送信する");
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const { currentUser } = useContext(AuthContext);
  const currentTest = tests[3];
  const handlePointPercentage = () => {
    setPointPercentage(46);
  };
  //　テスト
  const [widthPercentage, setWidthPercentage] = useState(0);

  const handleButtonClick = () => {
    setWidthPercentage(10);
  };

  const handleButtonClick2 = () => {
    setWidthPercentage(20);
  };

  const handleSendClick = () => {
    if (buttonText === "送信する") {
      if (currentTestIndex === 0) {
        setBgColor("red.300");
        setButtonBgColor("red.100");
      } else {
        setBgColor("teal.300");
        setButtonBgColor("teal.100");
      }
      setIsNext(true);
      setButtonText("次へ");
    } else {
      setCurrentTestIndex((prevIndex) => prevIndex + 1);
      setSelectTestId(null);
      // 必要に応じて、背景色やボタンのテキストをリセットできます。
      setBgColor("white");
      setButtonBgColor("gray.200");
      setButtonText("送信する");
      setIsNext(false);
      if (currentTestIndex === 0) {
        handleButtonClick();
      } else if (currentTestIndex === 1) {
        handleButtonClick2();
      }
    }
  };
  const [isLeader, setIsLeader] = useState(true);
  const { groupProjectUrl, homeUrl } = useRoutingCheck();
  const [windowRef, setWindowRef] = useState(null);
  const newWindowContainerRef = useRef(null);
  const [isWindowReady, setIsWindowReady] = useState(false);
  const [project, setProject] = useState(null);
  const {
    isOpen: isNextPhaseOpen,
    onOpen: onNextPhaseOpen,
    onClose: onNextPhaseClose,
  } = useDisclosure();
  const {
    isOpen: isPointGetModalOpen,
    onOpen: onPointGetModalOpen,
    onClose: onPointGetModalClose,
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
  console.log("projectId", projectId);
  console.log("groupId", groupId);
  const handleGetProject = useCallback(async () => {
    if (groupId && projectId) {
      const projectRef = doc(db, "groups", groupId, "projects", projectId);
      const projectSnapshot = await getDoc(projectRef);
      if (projectSnapshot.exists()) {
        setProject(projectSnapshot.data());
      }
    }
  }, [groupId, projectId]);

  useEffect(() => {
    handleGetProject();
  }, [groupId, handleGetProject, projectId]);

  console.log("project", project);

  console.log("currentPhase", currentPhase);

  const handleOpenNewWindow = () => {
    const newWindow = window.open("", "_blank", "width=1200,height=800");
    newWindow.document.title = "Share Screen";

    // Chakra UI の現在のスタイルを取得
    const styles = Array.from(document.querySelectorAll("style"))
      .map((style) => style.innerHTML)
      .join("");

    // 新しいウィンドウの <head> にスタイルを注入
    const styleEl = newWindow.document.createElement("style");
    styleEl.innerHTML = styles;
    newWindow.document.head.appendChild(styleEl);

    const reactRoot = newWindow.document.createElement("div");
    newWindow.document.body.appendChild(reactRoot);

    ReactDOM.render(
      <ChakraProvider>
        <DetailProject />
      </ChakraProvider>,
      reactRoot
    );
  };

  const handleCloseWindow = () => {
    if (windowRef) {
      windowRef.close();
      setWindowRef(null);
      setIsWindowReady(false);
    }
  };

  useEffect(() => {
    return () => {
      if (windowRef) {
        windowRef.close();
      }
    };
  }, [windowRef]);

  // タイマー
  // 初期座標を設定します。
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // ドラッグが終了したときの座標を更新します。
  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  useEffect(() => {
    onNextPhaseOpen();
  }, [currentPhase, onNextPhaseOpen]);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const maxTime = 180; // 初期値
  const offset = circumference - (remainingTime / maxTime) * circumference;
  return (
    <LayoutContext.Provider
      value={{ searchTerm, setSearchTerm, point, setPoint }}
    >
      <Box>
        {!groupProjectUrl() && (
          <Header isFocus={isFocus} setIsFocus={setIsFocus} />
        )}
        <Flex position="relative">
          {!isFocus && <LeftSidebar />}
          {groupProjectUrl() ? (
            <>
              <Box flex={1} w="100%">
                <Flex
                  w="100%"
                  h="57px"
                  borderBottom="0.3px solid black"
                  borderColor="gray.200"
                  alignItems="center"
                  justifyContent="space-between"
                  px={4}
                >
                  <HStack>
                    {project?.isBefore === true ? (
                      <HStack>
                        <Center
                          p={1}
                          border="1px solid black"
                          borderColor="gray.200"
                          borderRadius="md"
                          bg="white"
                        >
                          <Image
                            w="28px"
                            h="28px"
                            src="/images/groups/icon/note.png"
                            alt=""
                          />
                        </Center>
                        <Text fontWeight="bold" fontSize="lg">
                          ノートまとめ
                        </Text>
                      </HStack>
                    ) : (
                      <>
                        {currentPhase === 0 && (
                          <HStack>
                            <Center
                              p={1}
                              border="1px solid black"
                              borderColor="gray.200"
                              borderRadius="md"
                              bg="white"
                            >
                              <Image
                                w="28px"
                                h="28px"
                                src="/images/groups/icon/ice.png"
                                alt=""
                              />
                            </Center>
                            <Text fontWeight="bold" fontSize="lg">
                              アイスブレイク
                            </Text>
                          </HStack>
                        )}
                        {currentPhase === 1 && (
                          <HStack>
                            <Center
                              p={1}
                              border="1px solid black"
                              borderColor="gray.200"
                              borderRadius="md"
                              bg="white"
                            >
                              <Image
                                w="28px"
                                h="28px"
                                src="/images/groups/icon/note.png"
                                alt=""
                              />
                            </Center>
                            <Text fontWeight="bold" fontSize="lg">
                              ノートまとめ
                            </Text>
                          </HStack>
                        )}
                        {currentPhase === 2 && (
                          <HStack>
                            <Center
                              p={1}
                              border="1px solid black"
                              borderColor="gray.200"
                              borderRadius="md"
                              bg="white"
                            >
                              <Image
                                w="28px"
                                h="28px"
                                src="/images/groups/icon/talk.png"
                                alt=""
                              />
                            </Center>
                            <Text fontWeight="bold" fontSize="lg">
                              ディスカッション
                            </Text>
                          </HStack>
                        )}
                        {currentPhase === 3 && (
                          <HStack>
                            <Center
                              p={1}
                              border="1px solid black"
                              borderColor="gray.200"
                              borderRadius="md"
                              bg="white"
                            >
                              <Image
                                w="28px"
                                h="28px"
                                src="/images/groups/icon/test.png"
                                alt=""
                              />
                            </Center>
                            <Text fontWeight="bold" fontSize="lg">
                              確認テスト
                            </Text>
                          </HStack>
                        )}
                        {currentPhase === 4 && (
                          <HStack>
                            <Center
                              p={1}
                              border="1px solid black"
                              borderColor="gray.200"
                              borderRadius="md"
                              bg="white"
                            >
                              <Image
                                w="28px"
                                h="28px"
                                src="/images/groups/icon/close.png"
                                alt=""
                              />
                            </Center>
                            <Text fontWeight="bold" fontSize="lg">
                              振り返り
                            </Text>
                          </HStack>
                        )}
                        {currentPhase === 5 && (
                          <HStack>
                            <Center
                              p={1}
                              border="1px solid black"
                              borderColor="gray.200"
                              borderRadius="md"
                              bg="white"
                            >
                              <Image
                                w="28px"
                                h="28px"
                                src="/images/groups/icon/calendar.png"
                                alt=""
                              />
                            </Center>
                            <Text fontWeight="bold" fontSize="lg">
                              次回アサイン
                            </Text>
                          </HStack>
                        )}
                      </>
                    )}
                  </HStack>
                  {project?.isBefore === false ? (
                    <Flex alignItems="center">
                      <Center
                        w="36px"
                        h="36px"
                        bg="white"
                        border="1px solid black"
                        borderColor="gray.200"
                        p={2}
                        borderRadius="md"
                        position="relative"
                      >
                        <Image
                          alt=""
                          width="36px"
                          height="36px"
                          src="/images/groups/icon/ice.png"
                        />
                        <Flex
                          position="absolute"
                          w="100%"
                          h="100%"
                          bg="gray.500"
                          opacity={0.5}
                          borderRadius="md"
                          display={currentPhase === 0 ? "none" : "block"}
                        />
                      </Center>
                      <Flex w="24px" h="3px" bg="white" position="relative">
                        <Flex
                          position="absolute"
                          w="100%"
                          h="100%"
                          bg="gray.500"
                          opacity={0.5}
                        />
                      </Flex>
                      <Center
                        w="36px"
                        h="36px"
                        bg="white"
                        p={2}
                        borderRadius="md"
                        position="relative"
                        border="1px solid black"
                        borderColor="gray.200"
                      >
                        <Image
                          alt=""
                          width="36px"
                          height="36px"
                          src="/images/groups/icon/note.png"
                        />
                        <Flex
                          position="absolute"
                          w="100%"
                          h="100%"
                          bg="gray.500"
                          opacity={0.5}
                          borderRadius="md"
                          display={currentPhase === 1 ? "none" : "block"}
                        />
                      </Center>
                      <Flex w="24px" h="3px" bg="white" position="relative">
                        <Flex
                          position="absolute"
                          w="100%"
                          h="100%"
                          bg="gray.500"
                          opacity={0.5}
                        />
                      </Flex>
                      <Center
                        w="36px"
                        h="36px"
                        bg="white"
                        p={2}
                        borderRadius="md"
                        position="relative"
                        border="1px solid black"
                        borderColor="gray.200"
                      >
                        <Image
                          alt=""
                          width="36px"
                          height="36px"
                          src="/images/groups/icon/talk.png"
                        />
                        <Flex
                          position="absolute"
                          w="100%"
                          h="100%"
                          bg="gray.500"
                          opacity={0.5}
                          borderRadius="md"
                          display={currentPhase === 2 ? "none" : "block"}
                        />
                      </Center>
                      <Flex w="24px" h="3px" bg="white" position="relative">
                        <Flex
                          position="absolute"
                          w="100%"
                          h="100%"
                          bg="gray.500"
                          opacity={0.5}
                        />
                      </Flex>
                      <Center
                        w="36px"
                        h="36px"
                        bg="white"
                        p={2}
                        borderRadius="md"
                        position="relative"
                        border="1px solid black"
                        borderColor="gray.200"
                      >
                        <Image
                          alt=""
                          width="36px"
                          height="36px"
                          src="/images/groups/icon/test.png"
                        />
                        <Flex
                          position="absolute"
                          w="100%"
                          h="100%"
                          bg="gray.500"
                          opacity={0.5}
                          borderRadius="md"
                          display={currentPhase === 3 ? "none" : "block"}
                        />
                      </Center>
                      <Flex w="24px" h="3px" bg="white" position="relative">
                        <Flex
                          position="absolute"
                          w="100%"
                          h="100%"
                          bg="gray.500"
                          opacity={0.5}
                        />
                      </Flex>
                      <Center
                        w="36px"
                        h="36px"
                        bg="white"
                        p={2}
                        borderRadius="md"
                        position="relative"
                        border="1px solid black"
                        borderColor="gray.200"
                      >
                        <Image
                          alt=""
                          width="36px"
                          height="36px"
                          src="/images/groups/icon/close.png"
                        />
                        <Flex
                          position="absolute"
                          w="100%"
                          h="100%"
                          bg="gray.500"
                          opacity={0.5}
                          borderRadius="md"
                          display={currentPhase === 4 ? "none" : "block"}
                        />
                      </Center>
                      <Flex w="24px" h="3px" bg="white" position="relative">
                        <Flex
                          position="absolute"
                          w="100%"
                          h="100%"
                          bg="gray.500"
                          opacity={0.5}
                        />
                      </Flex>
                      <Center
                        w="36px"
                        h="36px"
                        bg="white"
                        p={2}
                        borderRadius="md"
                        position="relative"
                        border="1px solid black"
                        borderColor="gray.200"
                      >
                        <Image
                          alt=""
                          width="36px"
                          height="36px"
                          src="/images/groups/icon/calendar.png"
                        />
                        <Flex
                          position="absolute"
                          w="100%"
                          h="100%"
                          bg="gray.500"
                          opacity={0.5}
                          borderRadius="md"
                          display={currentPhase === 5 ? "none" : "block"}
                        />
                      </Center>
                      <Center
                        w="36px"
                        h="36px"
                        bg="teal.500"
                        p={2}
                        borderRadius="md"
                        ml="24px"
                        cursor="pointer"
                        onClick={handleNextPhase}
                        opacity={isLeader ? 1 : 0.5}
                        border="1px solid black"
                        borderColor="gray.200"
                      >
                        <Icon
                          color="white"
                          fontSize="2xl"
                          as={MdOutlineNavigateNext}
                        />
                      </Center>
                    </Flex>
                  ) : (
                    <Flex
                      alignItems="center"
                      py={1}
                      px={4}
                      bg="teal.100"
                      borderRadius="xl"
                      border="2px solid black"
                      borderColor="teal.500"
                      color="teal.500"
                    >
                      <Icon as={BsCalendar2Range} fontSize="xl" mr={4} />
                      <Text fontWeight="bold">2023-09-23</Text>
                    </Flex>
                  )}
                  {/* <HStack>
                  <Avatar size="sm" />
                  <Avatar size="sm" />
                  <Avatar size="sm" />
                  <Avatar size="sm" />
                </HStack> */}
                </Flex>
                {children}
              </Box>
              {project?.isBefore === false && (
                <>
                  <Draggable position={position} onStop={handleDrag}>
                    <Flex
                      direction="column"
                      // bg="gray.100"
                      border="1px solid black"
                      borderColor="gray.200"
                      bg="white"
                      py={2}
                      px={8}
                      borderRadius="lg"
                      position="fixed"
                      top="120px"
                      right="360px"
                      zIndex="1000"
                      cursor="grab"
                    >
                      <HStack>
                        <Image
                          width="20px"
                          height="20px"
                          alt=""
                          src={phaseText(currentPhase).imageUrl}
                        />
                        <Text fontWeight="bold">
                          {phaseText(currentPhase).name}
                        </Text>
                        {project?.leaderId === currentUser?.uid && (
                          <>
                            {timerStatus === "playing" ? (
                              <Icon
                                as={BsFillStopCircleFill}
                                mt={0.5}
                                cursor="pointer"
                                color="teal.600"
                                onClick={handleToggleTimer}
                                fontSize="lg"
                              />
                            ) : (
                              <Icon
                                as={AiFillPlayCircle}
                                onClick={handleToggleTimer}
                                cursor="pointer"
                                color="teal.600"
                                fontSize="lg"
                              />
                            )}
                          </>
                        )}
                      </HStack>
                      <VStack justifyContent="center">
                        {/* <style>{animationKeyframes}</style> */}
                        <svg width="100" height="100" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="none"
                            stroke="#eee"
                            strokeWidth="10"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="none"
                            stroke="#4FD1C5"
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                          />
                          <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dy=".3em"
                            fontSize="20"
                          >
                            {time}
                          </text>
                        </svg>
                      </VStack>
                    </Flex>
                  </Draggable>
                  <Modal
                    isOpen={isNextPhaseOpen}
                    onClose={onNextPhaseClose}
                    isCentered
                    size="2xl"
                  >
                    <ModalOverlay backdropFilter="blur(4px) hue-rotate(10deg)" />
                    <ModalContent>
                      <ModalBody p={4}>
                        <Flex direction="column" alignItems="center" mb={2}>
                          <HStack mb={2}>
                            <Image
                              width="40px"
                              height="40px"
                              alt=""
                              src={phaseText(currentPhase).imageUrl}
                            />
                            <Text fontWeight="bold" fontSize="xl">
                              {phaseText(currentPhase).name}
                            </Text>
                          </HStack>
                          <HStack spacing={4}>
                            <Flex
                              w="32px"
                              h="10px"
                              borderRadius="full"
                              cursor="pointer"
                              onClick={() => setModalIndex(0)}
                              bg={modalIndex === 0 ? "teal.300" : "gray.300"}
                            />
                            <Flex
                              w="32px"
                              h="10px"
                              bg={modalIndex === 1 ? "teal.300" : "gray.300"}
                              borderRadius="full"
                              cursor="pointer"
                              onClick={() => setModalIndex(1)}
                            />
                          </HStack>
                          {currentPhase === 0 && (
                            <>
                              {modalIndex === 0 && (
                                <Flex
                                  direction="column"
                                  alignItems="center"
                                  mt={4}
                                >
                                  <Box mb={4}>
                                    <Image
                                      width="240px"
                                      height="240px"
                                      alt=""
                                      src="/images/vector/Recess-amico.svg"
                                    />
                                  </Box>
                                  <Box textAlign="center">
                                    <Text fontWeight="bold" mb={1}>
                                      緊張を和らげよう
                                    </Text>
                                    <Box textAlign="center" fontSize="sm">
                                      <Text>
                                        輪読会の開始前に、参加者同士が互いに知り合い、
                                      </Text>
                                      <Text>
                                        リラックスした雰囲気を作るためのアイスブレイクを行います。
                                      </Text>
                                    </Box>
                                  </Box>
                                </Flex>
                              )}
                              {modalIndex === 1 && (
                                <Flex
                                  direction="column"
                                  alignItems="center"
                                  mt={4}
                                >
                                  <Box mb={4}>
                                    <Image
                                      width="400px"
                                      height="240px"
                                      alt=""
                                      src="/images/screenshot/screen-shot01.png"
                                      style={{ borderRadius: "8px" }}
                                    />
                                  </Box>
                                  <Box textAlign="center">
                                    <Text fontWeight="bold" mb={1}>
                                      好きなミニゲームを選ぼう
                                    </Text>
                                    <Box textAlign="center" fontSize="sm">
                                      <Text>
                                        ランダムで選ばれたユーザーが自分のアイテムの中の
                                      </Text>
                                      <Text>
                                        ミニゲームから一つ選んでアイスブレイクしましょう。
                                      </Text>
                                    </Box>
                                  </Box>
                                </Flex>
                              )}
                            </>
                          )}
                          {currentPhase === 1 && (
                            <>
                              {modalIndex === 0 && (
                                <Flex
                                  direction="column"
                                  alignItems="center"
                                  mt={4}
                                >
                                  <Box mb={4}>
                                    <Image
                                      width="240px"
                                      height="240px"
                                      alt=""
                                      src="/images/vector/Notes-cuate.svg"
                                    />
                                  </Box>
                                  <Box textAlign="center">
                                    <Text fontWeight="bold" mb={1}>
                                      担当章をノートにまとめよう
                                    </Text>
                                    <Box textAlign="center" fontSize="sm">
                                      <Text>自分に割り当てられた章を</Text>
                                      <Text>
                                        メンバーが理解しやすいようにわかりやすくまとめていきましょう。
                                      </Text>
                                    </Box>
                                  </Box>
                                </Flex>
                              )}
                              {modalIndex === 1 && (
                                <Flex
                                  direction="column"
                                  alignItems="center"
                                  mt={4}
                                >
                                  <Box mb={4}>
                                    <Image
                                      width="400px"
                                      height="200px"
                                      alt=""
                                      src="/images/screenshot/screen-shot02.png"
                                      style={{ borderRadius: "8px" }}
                                    />
                                  </Box>
                                  <Box textAlign="center">
                                    <Text fontWeight="bold" mb={1}>
                                      Zenn形式のマークダウンエディター
                                    </Text>
                                    <Box textAlign="center" fontSize="sm">
                                      <Text>
                                        Zenn形式のマークダウンエディターで
                                      </Text>
                                      <Text>
                                        わかりやすくまとめることでメンバーに貢献できる
                                      </Text>
                                    </Box>
                                  </Box>
                                </Flex>
                              )}
                            </>
                          )}
                          {currentPhase === 2 && (
                            <>
                              {modalIndex === 0 && (
                                <Flex
                                  direction="column"
                                  alignItems="center"
                                  mt={4}
                                >
                                  <Box mb={4}>
                                    <Image
                                      width="240px"
                                      height="240px"
                                      alt=""
                                      src="/images/vector/Discussion-rafiki.svg"
                                    />
                                  </Box>
                                  <Box textAlign="center">
                                    <Text fontWeight="bold" mb={1}>
                                      まとめた内容をメンバーに共有しよう
                                    </Text>
                                    <Box textAlign="center" fontSize="sm">
                                      <Text>担当章をまとめたノートを</Text>
                                      <Text>
                                        メンバーにわかりやすく共有しよう。
                                      </Text>
                                    </Box>
                                  </Box>
                                </Flex>
                              )}
                              {modalIndex === 1 && (
                                <Flex
                                  direction="column"
                                  alignItems="center"
                                  mt={4}
                                >
                                  <Box mb={4} mt={8}>
                                    <Image
                                      width="500px"
                                      height="240px"
                                      alt=""
                                      src="/images/screenshot/screen-shot03.png"
                                      style={{ borderRadius: "8px" }}
                                    />
                                  </Box>
                                  <Box textAlign="center">
                                    <Text fontWeight="bold" mb={1}>
                                      リアルタイムで積極的にディスカッション
                                    </Text>
                                    <Box textAlign="center" fontSize="sm">
                                      <Text>コメントや反応表示をしながら</Text>
                                      <Text>
                                        リアルタイムでの交流で学びを深めよう
                                      </Text>
                                    </Box>
                                  </Box>
                                </Flex>
                              )}
                            </>
                          )}
                          {currentPhase === 3 && (
                            <>
                              {modalIndex === 0 && (
                                <Flex
                                  direction="column"
                                  alignItems="center"
                                  mt={4}
                                >
                                  <Box mb={4}>
                                    <Image
                                      width="240px"
                                      height="240px"
                                      alt=""
                                      src="/images/vector/Online test-amico.svg"
                                    />
                                  </Box>
                                  <Box textAlign="center">
                                    <Text fontWeight="bold" mb={1}>
                                      理解度を確認しよう
                                    </Text>
                                    <Box textAlign="center" fontSize="sm">
                                      <Text>これまでみんなで学んだことが</Text>
                                      <Text>身についているか確認しよう</Text>
                                    </Box>
                                  </Box>
                                </Flex>
                              )}
                              {modalIndex === 1 && (
                                <Flex
                                  direction="column"
                                  alignItems="center"
                                  mt={4}
                                >
                                  <Box mb={4}>
                                    <Image
                                      width="340px"
                                      height="200px"
                                      alt=""
                                      src="/images/screenshot/screen-shot04.png"
                                      style={{ borderRadius: "8px" }}
                                    />
                                  </Box>
                                  <Box textAlign="center">
                                    <Text fontWeight="bold" mb={1}>
                                      GPTを用いた自動出題
                                    </Text>
                                    <Box textAlign="center" fontSize="sm">
                                      <Text>
                                        まとめたノートをもとにテストが出題されているため
                                      </Text>
                                      <Text>
                                        ディスカッションでの学びを確認することができる
                                      </Text>
                                    </Box>
                                  </Box>
                                </Flex>
                              )}
                            </>
                          )}
                          {currentPhase === 4 && (
                            <>
                              {modalIndex === 0 && (
                                <Flex
                                  direction="column"
                                  alignItems="center"
                                  mt={4}
                                >
                                  <Box mb={4}>
                                    <Image
                                      width="240px"
                                      height="240px"
                                      alt=""
                                      src="/images/vector/Online Review-amico.svg"
                                    />
                                  </Box>
                                  <Box textAlign="center">
                                    <Text fontWeight="bold" mb={1}>
                                      テスト内容を復習しよう
                                    </Text>
                                    <Box textAlign="center" fontSize="sm">
                                      <Text>テスト内容を振り返りながら</Text>
                                      <Text>
                                        学んだことについて考えてみよう
                                      </Text>
                                    </Box>
                                  </Box>
                                </Flex>
                              )}
                              {modalIndex === 1 && (
                                <Flex
                                  direction="column"
                                  alignItems="center"
                                  mt={4}
                                >
                                  <Box mb={4}>
                                    <Image
                                      width="340px"
                                      height="200px"
                                      alt=""
                                      src="/images/screenshot/screen-shot05.png"
                                      style={{ borderRadius: "8px" }}
                                    />
                                  </Box>
                                  <Box textAlign="center">
                                    <Text fontWeight="bold" mb={1}>
                                      参照ノートを確認しよう
                                    </Text>
                                    <Box textAlign="center" fontSize="sm">
                                      <Text>
                                        テストの内容と正解を確認しながら
                                      </Text>
                                      <Text>
                                        出題の参照箇所について振り返ってみよう
                                      </Text>
                                    </Box>
                                  </Box>
                                </Flex>
                              )}
                            </>
                          )}
                          {currentPhase === 5 && (
                            <>
                              {modalIndex === 0 && (
                                <Flex
                                  direction="column"
                                  alignItems="center"
                                  mt={4}
                                >
                                  <Box mb={4}>
                                    <Image
                                      width="340px"
                                      height="340px"
                                      alt=""
                                      src="/images/vector/Events-pana.svg"
                                    />
                                  </Box>
                                  <Box textAlign="center">
                                    <Text fontWeight="bold" mb={1}>
                                      次回の計画を立てよう
                                    </Text>
                                    <Box textAlign="center" fontSize="sm">
                                      <Text>次回の開催日時や章について</Text>
                                      <Text>話し合いながら計画しよう</Text>
                                    </Box>
                                  </Box>
                                </Flex>
                              )}
                              {modalIndex === 1 && (
                                <Flex
                                  direction="column"
                                  alignItems="center"
                                  mt={4}
                                >
                                  <Box mb={4}>
                                    <Image
                                      width="340px"
                                      height="200px"
                                      alt=""
                                      src="/images/screenshot/screen-shot06.png"
                                      style={{ borderRadius: "8px" }}
                                    />
                                  </Box>
                                  <Box textAlign="center">
                                    <Text fontWeight="bold" mb={1}>
                                      ドラッグ&ドロップでアサインできる
                                    </Text>
                                    <Box textAlign="center" fontSize="sm">
                                      <Text>
                                        章のアサインはドラッグ&ドロップで
                                      </Text>
                                      <Text>
                                        視覚的にわかりやすくアサインできる
                                      </Text>
                                    </Box>
                                  </Box>
                                </Flex>
                              )}
                            </>
                          )}
                        </Flex>
                        <Flex w="100%" justifyContent="center">
                          {modalIndex !== 1 ? (
                            <Button
                              onClick={() => setModalIndex((prev) => prev + 1)}
                            >
                              次へ
                            </Button>
                          ) : (
                            <Button onClick={onNextPhaseClose}>はじめる</Button>
                          )}
                        </Flex>
                      </ModalBody>
                    </ModalContent>
                  </Modal>
                  <Modal
                    isCentered
                    size="2xl"
                    onClose={onPointGetModalClose}
                    isOpen={isPointGetModalOpen}
                  >
                    <ModalOverlay backdropFilter="blur(4px) hue-rotate(10deg)" />
                    <ModalContent>
                      <ModalBody p={4} w="100%">
                        <VStack>
                          <Image
                            width={120}
                            height={80}
                            alt=""
                            src={imgUrl(0)}
                          />
                          <Flex direction="column" alignItems="center">
                            <Text fontWeight="bold">
                              {
                                project?.chapters?.find(
                                  (chapter) =>
                                    chapter?.assignId === currentUser?.uid
                                ).index
                              }
                            </Text>
                            <Text fontSize="xl" fontWeight="bold">
                              {
                                project?.chapters?.find(
                                  (chapter) =>
                                    chapter?.assignId === currentUser?.uid
                                ).title
                              }
                            </Text>
                          </Flex>
                          <Text>
                            を
                            <span
                              style={{
                                color: "orange",
                                fontWeight: "bold",
                                fontSize: "lg",
                              }}
                            >
                              クリア
                            </span>
                            しました！
                          </Text>
                          <Box>
                            <Flex
                              mt={4}
                              w="400px"
                              h="10px"
                              bg="gray.300"
                              borderRadius="full"
                              position="relative"
                            >
                              <SlideFade in={true} offsetY="0px">
                                <Flex
                                  position="absolute"
                                  left="0"
                                  top="0"
                                  h="100%"
                                  w={`${pointPercentage}%`}
                                  bg="teal.300"
                                  borderRadius="full"
                                  transition="width 0.5s"
                                />
                              </SlideFade>
                            </Flex>
                            <Text fontSize="sm" fontWeight="bold" mt={1}>
                              Level 67
                            </Text>
                          </Box>
                        </VStack>
                        <HStack justifyContent="center" mt={4}>
                          <Button onClick={handlePointPercentage}>
                            詳細を見る
                          </Button>
                          <Button
                            onClick={() => router.push("/")}
                            bg="teal.100"
                            color="teal.700"
                          >
                            ホームへ戻る
                          </Button>
                        </HStack>
                      </ModalBody>
                    </ModalContent>
                  </Modal>
                </>
              )}
            </>
          ) : (
            <Box
              flex={1}
              w="100%"
              style={{ height: "calc(100vh - 80px)" }}
              overflowY="auto"
            >
              {children}
            </Box>
          )}
        </Flex>
      </Box>
    </LayoutContext.Provider>
  );
};

export default Layout;
