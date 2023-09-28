import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "easymde/dist/easymde.min.css";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SlideFade,
  Spinner,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import markdownHTML from "zenn-markdown-html";
import { MdOutlinePreview } from "react-icons/md";
import {
  AiOutlineFileText,
  AiOutlineLeft,
  AiOutlineRight,
} from "react-icons/ai";
import { ImCancelCircle } from "react-icons/im";
import { FaCoins, FaRegCheckCircle } from "react-icons/fa";
import Assign from "@/components/organisms/Assign";
import {
  chaptersData,
  imgUrl,
  playersData,
  presentImages,
  userGames,
} from "@/lib/data";
import { Controller, useForm } from "react-hook-form";
import { BsWindowSplit } from "react-icons/bs";
import { useTimer } from "@/hooks/useTimer";
import { useRouter } from "next/router";
import { AuthContext } from "@/pages/_app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import markdownToHtml from "zenn-markdown-html";
import { GoProjectTemplate } from "react-icons/go";
import { useLayout } from "@/components/layouts/main/Layout";
import DoughnutItem from "@/components/organisms/DoughnutItem";
import RealtimeInput from "@/components/organisms/RealtimeInput";

const userPoint = [43, 32, 21, 13];

const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

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

const DetailProject = () => {
  const router = useRouter();
  const { point, setPoint } = useLayout();
  const { groupId, projectId } = router.query;
  // const [currentPhase, setCurrentPhase] = useState(0);
  const {
    time,
    timerStatus,
    remainingTime,
    currentPhase,
    handleToggleTimer,
    handleNextPhase,
    phaseText,
  } = useTimer(groupId, projectId);
  const [previewState, setPreviewState] = useState("preview");
  const toast = useToast();
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  // const currentTest = currentTestIndex === 0 ? tests[0]
  const currentTestA = (currentTestIndex) => {
    if (currentTestIndex === 0) {
      return { test: tests[0], user: project?.members[0] };
    } else if (currentTestIndex === 1) {
      return { test: tests[1], user: project?.members[1] };
    } else if (currentTestIndex === 2) {
      return { test: tests[2], user: project?.members[2] };
    }
  };
  // const [currentTest, setCurrentTest] = useState(tests[3]);
  const markdownA = `

## 📌 概要

1章では、コードの品質を測る基準として「他の人がそのコードを理解するのにかかる時間」を挙げています。つまり、他の人がすぐに理解できるコードが良質なコードとされます。

## 📜 参考コード

\`\`\`javascript
// 良くない例
function d(s) {
  return s.split('@')[0];
}

// 良い例
function getUsernameFromEmail(email) {
  return email.split('@')[0];
}
\`\`\`

上記の例では、関数名が明確になっているため、第二のコードの方が理解しやすい。

:::message
 ⚠️ 注意点

- コードは読む時間の方が書く時間よりも長いため、読みやすさを最優先にする。
- 変数名や関数名は具体的で明確に。
- 無駄なコメントは避ける。コード自体が自己説明的であるべき。
:::

## 💭 気付き・感想

この章を読んで、コードの読みやすさの重要性を再認識しました。特に、他の人が読むことを前提としたコーディングの重要性を強く感じました。

## 📝 まとめ

理解しやすいコードとは、他の人が最小限の時間で理解できるコードです。変数名や関数名を明確にし、無駄なコメントを避けることで、コードの品質を向上させることができます。
`;

  const defaultMarkdown = `
# セクション1
:::details タイトル1
ここにセクション1の内容を書いてください。
:::

## 気付き・感想
- 気付き1

:::message
疑問点や気付きなどを書いてください。
:::

# セクション2
:::details タイトル2
ここにセクション2の内容を書いてください。
:::

# セクション3
:::details タイトル3
ここにセクション3の内容を書いてください。
:::

# まとめ
:::message alert
ここにまとめを書いてください。
:::
このテンプレートはZennのマークダウン記法を使用しており、特に:::messageや:::detailsなどのZenn独自の記法を多めに使用しています。必要に応じて内容を編集してご利用ください。
	`;
  const dummyMarkdown = `
## 概要

:::message alert
書籍の簡単な概要や要点を記述します。
:::

## 目次
1. [セクション１](#セクション１)
	1. [サブセクション１](#サブセクション１)
2. [セクション２](#セクション２)
2. [セクション３](#セクション３)

## セクション1

:::message
書籍の内容を記述します。
:::

### 参考コード
\`\`\`js:index.js
const a = "Hello world"
\`\`\`

\`\`\`diff js
+ const foo = bar.baz([1, 2, 3]) + 1;
- let foo = bar.baz([1, 2, 3]);
\`\`\`

@[codesandbox](https://codesandbox.io/embed/koh-test-forked-e5v71k?fontsize=14&hidenavigation=1&theme=dark)

### サブセクション1
- 主要なポイント1
- 主要なポイント2
  - 詳細なポイント1
  - 詳細なポイント2

## figma
...

@[figma](https://www.figma.com/file/Ue5ar2K2kCA7KdopNlt0lL/RinDo?type=design&mode=design&t=Uo0OUAB57RMTwsSr-1)

## セクション３
...

## 考察
書籍全体を通じての考察や感想を記述します。

## まとめ
書籍の要点や学びを簡潔にまとめます。

## 参考リンク
- [関連するリンク1](URL)
- [関連するリンク2](URL)
...

:::message
次回の輪読会の日程や注意点など、参加者へのメッセージを記述します。
:::
  `;
  const [markdownValue, setMarkdownValue] = useState(markdownA);
  const onClickTemplte = () => {
    setMarkdownValue(dummyMarkdown);
  };
  const onClickTemplte2 = () => {
    setMarkdownValue(defaultMarkdown);
  };
  const [isNext, setIsNext] = useState(false);
  const { handleSubmit, control } = useForm();

  const { currentUser } = useContext(AuthContext);

  const onChange = (value) => {
    setMarkdownValue(value);
  };

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

  console.log("loginUserData", loginUserData);

  useEffect(() => {
    handleGetLoginUser();
  }, [handleGetLoginUser]); // この配列内に依存関係がある場合は追加してください。例：[currentUser]

  const options = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false,
      hideIcons: ["guide", "fullscreen", "side-by-side", "preview"],
      minHeight: "640px",
    };
  }, []);

  const [content, setContent] = useState("");
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }

    const timeoutId = setTimeout(() => {
      setContent(
        markdownToHtml(markdownValue, {
          embedOrigin: "https://embed.zenn.studio",
        })
      );
    }, 1000); // デバウンシング 1秒

    setTimer(timeoutId);

    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markdownValue]);

  console.log("markdownValue", markdownValue);

  // コメント
  const [commentText, setCommentText] = useState("");
  const [selectionData, setSelectionData] = useState(null);
  const contentRef = useRef(null);

  const handleTextSelect = (e) => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    setSelectionData({
      top: rect.top - contentRect.top,
      left: rect.left - contentRect.left,
      height: rect.height,
      text: selection.toString(),
    });
  };

  useEffect(() => {
    // 外側のクリックを検知する関数
    const handleClickOutside = (event) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target) &&
        selectionData
      ) {
        setSelectionData(null);
      }
    };

    // イベントリスナーを追加
    document.addEventListener("click", handleClickOutside);
    return () => {
      // コンポーネントのアンマウント時にイベントリスナーを削除
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectionData]);

  const [selectGameId, setSelectGameId] = useState(null);
  const [icebreakPhase, setIcebreakPhase] = useState(0);

  console.log("selectionData", selectionData);

  console.log("currentPhase", currentPhase);

  const [project, setProject] = useState(null);

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

  // カーソルの位置を管理する;
  const [cursors, setCursors] = useState({});

  const handleMouseMove = async (e) => {
    if (currentUser && groupId && projectId) {
      // projectIdも確認
      const cursorRef = doc(
        db,
        "groups",
        groupId,
        "projects",
        projectId,
        "cursors",
        currentUser?.uid
      );
      try {
        await setDoc(cursorRef, { x: e.clientX, y: e.clientY, isActive: true });
      } catch (error) {
        console.error("Failed to update cursor:", error);
      }
    }
  };

  const handleMouseOut = async (e) => {
    if (currentUser && groupId && projectId) {
      // projectIdも確認
      const cursorRef = doc(
        db,
        "groups",
        groupId,
        "projects",
        projectId,
        "cursors",
        currentUser?.uid
      );
      try {
        await setDoc(cursorRef, { isActive: false });
      } catch (error) {
        console.error("Failed to update cursor:", error);
      }
    }
  };

  useEffect(() => {
    // Ensure router is ready and groupId is available
    if (router.isReady && groupId && projectId) {
      // projectIdも確認
      // cursor positions のリアルタイム更新をリッスンします
      const unsubscribe = onSnapshot(
        collection(db, "groups", groupId, "projects", projectId, "cursors"), // <-- Corrected path
        (snapshot) => {
          const newCursors = {};
          snapshot.forEach((doc) => {
            newCursors[doc.id] = doc.data();
          });
          setCursors(newCursors);
        }
      );
      return unsubscribe;
    }
  }, [router.isReady, groupId, projectId]);

  console.log("cursors", cursors);

  console.log("project", project);

  console.log(
    "aaa",
    project?.chapters
      ?.filter((chapter) => chapter.isCompleted === false)
      .filter((chapter) => chapter.assignId === currentUser?.uid)[0]
  );

  const loginUserChapter = project?.chapters
    ?.filter((chapter) => chapter.isCompleted === false)
    .filter((chapter) => chapter.assignId === currentUser?.uid)[0];

  // submit
  const [isLoading, setIsLoading] = useState(false);

  const handleStoreMarkdown = async () => {
    if (!groupId || !projectId || !currentUser?.uid) {
      console.error("Required parameters are missing.");
      return;
    }
    const groupRef = doc(db, "groups", groupId);
    const projectsRef = collection(groupRef, "projects");
    const targetProjectRef = doc(projectsRef, projectId);
    const chaptersQuery = query(
      collection(targetProjectRef, "chapters"),
      where("assignId", "==", currentUser?.uid),
      where("isCompleted", "==", false)
    );

    const chaptersSnapshot = await getDocs(chaptersQuery);
    const targetChapter = chaptersSnapshot.docs[0];

    if (targetChapter) {
      await setDoc(
        targetChapter.ref,
        {
          content: markdownValue,
        },
        { merge: true }
      );
    } else {
      console.error("No matching chapter found.");
    }
  };

  const handleSubmitClick = async () => {
    setIsLoading(true); // スピナーを表示

    try {
      // handleStoreMarkdown関数を実行してFirestoreに保存
      await handleStoreMarkdown();
      toast({
        title: `You have submitted your notes! Congratulations 🎉`,
        position: "top",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      toast({
        title: `Error occurred while saving data!`,
        position: "top",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // スピナーを非表示
    }
  };

  const [showCoin, setShowCoin] = useState(false);

  useEffect(() => {
    if (
      markdownValue?.length % 100 === 0 &&
      markdownValue?.length > 0 &&
      !showCoin
    ) {
      setShowCoin(true);
      if (point < 33) {
        setPoint(point + 10);
      }
    }
  }, [markdownValue, point, setPoint, showCoin]);

  useEffect(() => {
    if (showCoin) {
      const timer = setTimeout(() => {
        setShowCoin(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showCoin]);

  const [selectedGameId, setSelectedGameId] = useState(null);

  const [icebreakText, setIcebreakText] = useState("");
  const [isIcebreakText, setIsIcebreakText] = useState(false);

  const handleIcebreakSubmit = () => {
    setIcebreakText("");
    setIsIcebreakText(true);
  };

  const [selectTestId, setSelectTestId] = useState(null);

  const [bgColor, setBgColor] = useState("white");
  const [buttonBgColor, setButtonBgColor] = useState("gray.200");
  const [buttonText, setButtonText] = useState("送信する");

  const {
    isOpen: isPointGetModalOpen,
    onOpen: onPointGetModalOpenOpen,
    onClose: onPointGetModalOpenClose,
  } = useDisclosure();

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

  const handleTestNumber = (currentTestIndex) => {
    if (currentTestIndex === 0) {
      return 1;
    } else if (currentTestIndex === 1) {
      return 2;
    } else if (currentTestIndex === 2) {
      return 3;
    }
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

  const [pointPercentage, setPointPercentage] = useState(24);

  useEffect(() => {
    if (isPointGetModalOpen) {
      setTimeout(() => {
        setPointPercentage(50); // ここでの値は例として70%を設定しています
      }, 300); // 0.5秒後にアニメーションを開始
    }
  }, [isPointGetModalOpen]);

  return (
    <Box
      // onMouseMove={handleMouseMove}
      // onMouseLeave={handleMouseOut} // <-- Re-enabled mouse leave event
      w="100%"
      minH="calc(100vh - 160px)"
      position="relative"
    >
      {/* <RealtimeInput /> */}
      {/* カーソル表示 */}
      {/* {Object.entries(cursors).map(
        ([id, pos]) =>
          pos.isActive &&
          id !== currentUser?.uid && ( // isActive が true のときだけ表示
            <div
              key={id}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y - 120,
                zIndex: 100,
              }}
            >
              <Avatar
                w="40px"
                h="40px"
                src={
                  project?.members?.find((member) => member.id === id)?.photoUrl
                }
              />
            </div>
          )
      )} */}
      {project?.isBefore === true && (
        <>
          <Flex
            w="100%"
            h="40px"
            borderRight="0.3px solid black"
            borderBottom="0.3px solid black"
            borderColor="gray.200"
            alignItems="center"
            px={4}
          >
            <Flex mr={16}>
              <Text
                px={3}
                bg="teal.200"
                borderRadius="full"
                fontSize="sm"
                h="24px"
                fontWeight="bold"
                mr={4}
              >
                {loginUserChapter.index}
              </Text>
              <Text fontWeight="bold">{loginUserChapter.title}</Text>
            </Flex>
            <HStack>
              <Avatar size="xs" src={loginUserData.photoUrl} />
              <Text fontSize="xs" fontWeight="bold">
                {loginUserData.displayName}
              </Text>
              <Popover>
                <PopoverTrigger>
                  <Icon cursor="pointer" fontSize="lg" as={GoProjectTemplate} />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader fontWeight="bold">Templates</PopoverHeader>
                  <PopoverBody>
                    <VStack spacing={2}>
                      <HStack
                        p={2}
                        w="100%"
                        _hover={{ bg: "teal.100", borderColor: "teal.500" }}
                        bg="gray.100"
                        borderRadius="lg"
                        cursor="pointer"
                        border="2px solid black"
                        borderColor="gray.500"
                        onClick={onClickTemplte}
                      >
                        <Text fontSize="xl">🙄</Text>
                        <Text
                          fontWeight="bold"
                          color="gray.500"
                          _hover={{ color: "teal.500" }}
                        >
                          基本テンプレート
                        </Text>
                      </HStack>
                      <HStack
                        p={2}
                        w="100%"
                        _hover={{ bg: "teal.100", borderColor: "teal.500" }}
                        bg="gray.100"
                        borderRadius="lg"
                        cursor="pointer"
                        border="2px solid black"
                        borderColor="gray.500"
                      >
                        <Text fontSize="xl">🔥</Text>
                        <Text
                          fontWeight="bold"
                          color="gray.500"
                          _hover={{ color: "teal.500" }}
                        >
                          基本テンプレート２
                        </Text>
                      </HStack>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </HStack>
          </Flex>
          <Flex>
            <Box w="50%">
              <SimpleMdeReact
                value={markdownValue}
                onChange={onChange}
                options={options}
              />
            </Box>
            <Box w="50%">
              <Flex
                w="100%"
                h="49px"
                borderLeft="0.3px solid black"
                borderBottom="0.3px solid black"
                borderColor="gray.200"
                px={4}
                bg="teal.100"
              >
                <HStack spacing={4}>
                  <Icon
                    fontSize="24px"
                    as={MdOutlinePreview}
                    onClick={() => setPreviewState("preview")}
                    cursor="pointer"
                  />
                  <Icon
                    fontSize="24px"
                    as={AiOutlineFileText}
                    onClick={() => setPreviewState("manuscript")}
                    cursor="pointer"
                  />
                  <Icon
                    fontSize="24px"
                    as={BsWindowSplit}
                    onClick={() => setPreviewState("full-preview")}
                    cursor="pointer"
                  />
                </HStack>
              </Flex>
              {previewState === "preview" && (
                <Box
                  dangerouslySetInnerHTML={{
                    __html: content,
                  }}
                  style={{ height: "calc(100vh - 149px)" }}
                  overflowY="auto"
                  bg="teal.50"
                  borderLeft="0.3px solid black"
                  borderColor="gray.200"
                  p={4}
                  className="znc"
                />
              )}
              {previewState === "manuscript" && (
                <Box
                  style={{ height: "calc(100vh - 149px)" }}
                  overflowY="auto"
                  // bg="gray.200"
                  borderLeft="0.3px solid black"
                  borderColor="gray.200"
                  p={4}
                  className="znc"
                ></Box>
              )}
            </Box>
          </Flex>
        </>
      )}
      {project?.isBefore === false && (
        <>
          {currentPhase === 0 && (
            <>
              {icebreakPhase === 0 && (
                <Flex
                  w="100%"
                  justifyContent="center"
                  alignItems="center"
                  h="84vh"
                  direction="column"
                >
                  <HStack mb={12}>
                    <Avatar
                      w="64px"
                      h="64px"
                      src={"/images/avatar/avatar_5.jpg"}
                    />
                    <Text fontWeight="bold" fontSize="3xl">
                      Chris Hemsworth
                    </Text>
                    <Text mt={1.5} fontWeight="bold" fontSize="sm">
                      がゲームを選択中...
                    </Text>
                  </HStack>
                  <Grid
                    gap={8}
                    templateColumns={{
                      base: "repeat(1, 1fr)",
                      lg: "repeat(2, 1fr)",
                      xl: "repeat(2, 1fr)",
                    }}
                  >
                    {userGames?.map((game) => (
                      <GridItem
                        mx="auto"
                        w="full"
                        // cursor={
                        //   selectedUser.id !== currentUser.uid
                        //     ? "default"
                        //     : "pointer"
                        // }
                        cursor="pointer"
                        key={game.id}
                        // opacity={selectedUser.id !== currentUser.uid ? 0.7 : 1}
                        boxShadow="md"
                        borderRadius="md"
                        border="1px solid gray.200"
                      >
                        <VStack
                          color="black"
                          // cursor={
                          //   selectedUser.id !== currentUser.uid
                          //     ? "default"
                          //     : "pointer"
                          // }
                          h="full"
                          borderRadius="lg"
                          p={4}
                          spacing={4}
                          // bg={game.id === selectedGame ? "teal.400" : "white"}
                          // onClick={
                          //   selectedUser.id === currentUser.uid
                          //     ? () => handleSelectGame(game.id)
                          //     : null
                          // }
                          // opacity={
                          //   selectedUser.userId !== currentUser.uid ? 1 : 0.7
                          // }
                          bg={selectedGameId === game.id ? "teal.400" : "white"}
                          onClick={() => setSelectedGameId(game.id)}
                        >
                          {/* <Flex
                              w="100%"
                              h="80px"
                              bg="gray.200"
                              borderRadius="md"
                            ></Flex> */}
                          <Image
                            w="100%"
                            h="80px"
                            borderRadius="md"
                            src={game.imageUrl}
                            alt=""
                          />
                          <Text fontSize="lg" fontWeight="bold">
                            {game.name}
                          </Text>
                        </VStack>
                      </GridItem>
                    ))}
                  </Grid>
                  <Button
                    mt={8}
                    colorScheme="teal"
                    // onClick={handleConfirmSelection}
                    // isDisabled={selectedUser.id !== currentUser.uid}
                    onClick={() => setIcebreakPhase(1)}
                  >
                    確定
                  </Button>
                </Flex>
              )}
              {icebreakPhase === 1 && (
                <>
                  {icebreakPhase !== 0 && (
                    <HStack
                      position="absolute"
                      top="20px"
                      left="20px"
                      bg="gray.50"
                      px={4}
                      py={2}
                      borderRadius="lg"
                      boxShadow="md"
                      border="2px solid black"
                      borderColor="teal.800"
                    >
                      <Image
                        w="32px"
                        h="32px"
                        src="/images/icebreak/undraw_questions_re_1fy7.svg"
                        borderRadius="lg"
                        alt=""
                      />
                      <Text fontWeight="bold" color="teal.800">
                        ２つの真実と１つの嘘
                      </Text>
                    </HStack>
                  )}
                  <Flex
                    w="100%"
                    justifyContent="center"
                    alignItems="center"
                    h="84vh"
                    direction="column"
                  >
                    <Flex
                      w="100%"
                      justifyContent="center"
                      alignItems="center"
                      h="80vh"
                      direction="column"
                    >
                      <Grid
                        gap={20}
                        templateColumns={{
                          base: "repeat(1, 1fr)",
                          lg: "repeat(3, 1fr)",
                          xl: "repeat(4, 1fr)",
                        }}
                        mb="32px"
                      >
                        {project?.members?.map((user) => (
                          <GridItem
                            mx="auto"
                            w="full"
                            cursor="pointer"
                            key={user.id}
                          >
                            <VStack spacing={4}>
                              <HStack>
                                <Avatar w="48px" h="48px" src={user.photoUrl} />
                                <Text fontSize="xl" fontWeight="bold">
                                  {user.displayName}
                                </Text>
                              </HStack>
                              <HStack justifyContent="space-between">
                                <Center
                                  w="32px"
                                  h="32px"
                                  bg={
                                    user?.id === currentUser?.uid &&
                                    isIcebreakText
                                      ? "teal.400"
                                      : "gray.300"
                                  }
                                  borderRadius="full"
                                />
                                <Center
                                  w="32px"
                                  h="32px"
                                  bg="gray.300"
                                  borderRadius="full"
                                />
                                <Center
                                  w="32px"
                                  h="32px"
                                  bg="gray.300"
                                  borderRadius="full"
                                />
                              </HStack>
                            </VStack>
                          </GridItem>
                        ))}
                      </Grid>
                      <VStack spacing={4}>
                        <Text fontWeight="bold" alignSelf="flex-start">
                          真実を２つ、嘘を１つ記入してください。
                        </Text>
                        <HStack spacing={4}>
                          <Center
                            w="40px"
                            h="40px"
                            bg="teal.100"
                            borderRadius="full"
                            fontWeight="bold"
                            color="teal.700"
                          >
                            真
                          </Center>
                          <Input
                            type="text"
                            w="400px"
                            bg="teal.100"
                            border="1px solid #000"
                            borderColor="teal.700"
                            placeholder="本当のことを記述してください。"
                            value={icebreakText}
                            onChange={(e) => setIcebreakText(e.target.value)}
                          />
                          <Button
                            bg="teal.700"
                            color="white"
                            onClick={handleIcebreakSubmit}
                          >
                            確定
                          </Button>
                        </HStack>
                        <HStack spacing={4}>
                          <Center
                            w="40px"
                            h="40px"
                            bg="teal.100"
                            color="teal.700"
                            borderRadius="full"
                            fontWeight="bold"
                          >
                            真
                          </Center>
                          <Input
                            type="text"
                            w="400px"
                            bg="teal.100"
                            border="1px solid #000"
                            borderColor="teal.700"
                            placeholder="本当のことを記述してください。"
                          />
                          <Button bg="teal.700" color="white">
                            確定
                          </Button>
                        </HStack>
                        <HStack spacing={4}>
                          <Center
                            w="40px"
                            h="40px"
                            bg="red.100"
                            color="red.700"
                            borderRadius="full"
                            fontWeight="bold"
                          >
                            嘘
                          </Center>
                          <Input
                            type="text"
                            w="400px"
                            bg="red.100"
                            border="1px solid #000"
                            borderColor="red.700"
                            placeholder="嘘のことを記述してください。"
                          />
                          <Button bg="red.700" color="white">
                            確定
                          </Button>
                        </HStack>
                      </VStack>
                    </Flex>
                  </Flex>
                </>
              )}
            </>
          )}
          {currentPhase === 1 && (
            <>
              <Flex
                w="100%"
                h="40px"
                borderRight="0.3px solid black"
                borderBottom="0.3px solid black"
                borderColor="gray.200"
                alignItems="center"
                px={4}
              >
                <Flex mr={16}>
                  <Text
                    px={3}
                    bg="teal.200"
                    borderRadius="full"
                    fontSize="sm"
                    h="24px"
                    fontWeight="bold"
                    mr={4}
                  >
                    {loginUserChapter.index}
                  </Text>
                  <Text fontWeight="bold">{loginUserChapter.title}</Text>
                </Flex>
                <HStack spacing={4}>
                  <Avatar size="xs" src="/images/avatar/avatar_5.jpg" />
                  <Text fontSize="xs" fontWeight="bold">
                    Chris Hemsworth
                  </Text>
                  <Popover>
                    <PopoverTrigger>
                      <Icon
                        cursor="pointer"
                        fontSize="lg"
                        as={GoProjectTemplate}
                      />
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader fontWeight="bold">Templates</PopoverHeader>
                      <PopoverBody>
                        <VStack spacing={2}>
                          <HStack
                            p={2}
                            w="100%"
                            _hover={{ bg: "teal.100", borderColor: "teal.500" }}
                            bg="gray.100"
                            borderRadius="lg"
                            cursor="pointer"
                            border="2px solid black"
                            borderColor="gray.500"
                            onClick={onClickTemplte}
                          >
                            <Text fontSize="xl">🙄</Text>
                            <Text
                              fontWeight="bold"
                              color="gray.500"
                              _hover={{ color: "teal.500" }}
                            >
                              基本テンプレート
                            </Text>
                          </HStack>
                          <HStack
                            p={2}
                            w="100%"
                            _hover={{ bg: "teal.100", borderColor: "teal.500" }}
                            bg="gray.100"
                            borderRadius="lg"
                            cursor="pointer"
                            border="2px solid black"
                            borderColor="gray.500"
                          >
                            <Text fontSize="xl">🔥</Text>
                            <Text
                              fontWeight="bold"
                              color="gray.500"
                              _hover={{ color: "teal.500" }}
                            >
                              基本テンプレート２
                            </Text>
                          </HStack>
                        </VStack>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                  <HStack>
                    <Text
                      fontSize="sm"
                      fontWeight="bold"
                      py={1}
                      px={3}
                      bg={showCoin ? "yellow.200" : "gray.200"}
                      borderRadius="xl"
                    >
                      {markdownValue?.length}文字
                    </Text>
                    {showCoin && (
                      <Icon color="yellow.500" fontSize="xl" as={FaCoins} />
                    )}
                  </HStack>
                </HStack>
              </Flex>
              <Flex>
                <Box w="50%">
                  <SimpleMdeReact
                    value={markdownValue}
                    onChange={onChange}
                    options={options}
                  />
                </Box>
                <Box w="50%">
                  <Flex
                    w="100%"
                    h="49px"
                    borderLeft="0.3px solid black"
                    borderBottom="0.3px solid black"
                    borderColor="gray.200"
                    px={4}
                    bg="teal.100"
                  >
                    <HStack justifyContent="space-between" w="100%">
                      <HStack spacing={4}>
                        <Icon
                          fontSize="24px"
                          as={MdOutlinePreview}
                          onClick={() => setPreviewState("preview")}
                          cursor="pointer"
                        />
                        <Icon
                          fontSize="24px"
                          as={AiOutlineFileText}
                          onClick={() => setPreviewState("manuscript")}
                          cursor="pointer"
                        />
                        <Icon
                          fontSize="24px"
                          as={BsWindowSplit}
                          onClick={() => setPreviewState("full-preview")}
                          cursor="pointer"
                        />
                      </HStack>
                      <Button
                        boxShadow="md"
                        border="2px solid black"
                        borderColor="teal.800"
                        bg="white"
                        color="teal.800"
                        onClick={handleSubmitClick}
                        loadingText="Loading"
                        isLoading={isLoading}
                      >
                        {isLoading ? <Spinner size="xs" /> : "Submit"}
                      </Button>
                    </HStack>
                  </Flex>
                  {previewState === "preview" && (
                    <Box
                      dangerouslySetInnerHTML={{
                        __html: content,
                      }}
                      style={{ height: "calc(100vh - 149px)" }}
                      overflowY="auto"
                      bg="teal.50"
                      borderLeft="0.3px solid black"
                      borderColor="gray.200"
                      p={4}
                      className="znc"
                    />
                  )}
                  {previewState === "manuscript" && (
                    <Box
                      style={{ height: "calc(100vh - 149px)" }}
                      overflowY="auto"
                      // bg="gray.200"
                      borderLeft="0.3px solid black"
                      borderColor="gray.200"
                      p={4}
                      className="znc"
                    ></Box>
                  )}
                </Box>
              </Flex>
            </>
          )}

          {currentPhase === 2 && (
            <Flex onMouseUp={handleTextSelect}>
              <Box flex={1} ref={contentRef}>
                <Flex
                  w="100%"
                  h="40px"
                  borderRight="0.3px solid black"
                  borderBottom="0.3px solid black"
                  borderColor="gray.200"
                  alignItems="center"
                  px={4}
                >
                  <Flex mr={16}>
                    <Text
                      px={3}
                      bg="teal.200"
                      borderRadius="full"
                      fontSize="sm"
                      h="24px"
                      fontWeight="bold"
                      mr={4}
                    >
                      第４章
                    </Text>
                    <Text fontWeight="bold">美しさ</Text>
                  </Flex>
                  <HStack>
                    <Avatar size="xs" src="/images/avatar/avatar_5.jpg" />
                    <Text fontSize="xs" fontWeight="bold">
                      Chris Hemsworth
                    </Text>
                  </HStack>
                </Flex>
                {/* <Flex
              w="100%"
              h="49px"
              borderRight="0.3px solid black"
              borderBottom="0.3px solid black"
              borderColor="gray.200"
            ></Flex> */}
                <Flex style={{ height: "calc(100vh - 97px)" }} overflowY="auto">
                  <Flex
                    w="0.3px"
                    style={{ height: "calc(100vh - 97px)" }}
                    position="fixed"
                    bg="gray.200"
                    bottom={0}
                    right="400px"
                  />
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: content,
                    }}
                    bg="white"
                    p={4}
                    className="znc"
                    flex={1}
                  />
                  <Box w="400px" h="100%">
                    <Box>
                      <Box
                        mt={`${74 - 56}px`}
                        bg="white"
                        border="1px solid black"
                        borderColor="gray.200"
                        p={4}
                        w="90%"
                        borderRadius="md"
                        mx="auto"
                        boxShadow="md"
                      >
                        <HStack mb={2}>
                          <Avatar
                            size="sm"
                            src="/images/avatar/avatar_23.jpg"
                          />
                          <Flex direction="column">
                            <Text fontSize="sm" fontWeight="bold">
                              Dwayne Johnson
                            </Text>
                            <Text fontSize="xs">10:12</Text>
                          </Flex>
                        </HStack>
                        <Text
                          mb={2}
                          p={1}
                          bg="#fed7d7"
                          borderRadius="md"
                          fontSize="sm"
                          display="inline-block"
                        >
                          他の人がすぐに理解できるコードが良質なコード
                        </Text>
                        <Text mb={2}>すごくわかりやすいです！！</Text>
                        <HStack>
                          <Button
                            fontSize="xs"
                            borderRadius="full"
                            h="32px"
                            bg="teal.100"
                          >
                            返信
                          </Button>
                          <Button
                            fontSize="xs"
                            borderRadius="full"
                            h="32px"
                            bg="gray.200"
                          >
                            キャンセル
                          </Button>
                        </HStack>
                      </Box>
                      <Box
                        mt={`390px`}
                        bg="white"
                        border="1px solid black"
                        borderColor="gray.200"
                        p={4}
                        w="90%"
                        borderRadius="md"
                        mx="auto"
                        boxShadow="md"
                      >
                        <HStack mb={2}>
                          <Avatar size="sm" src="/images/avatar/avatar_5.jpg" />
                          <Flex direction="column">
                            <Text fontSize="sm" fontWeight="bold">
                              Chris Hemsworth
                            </Text>
                            <Text fontSize="xs">10:12</Text>
                          </Flex>
                        </HStack>
                        <Text
                          mb={2}
                          p={1}
                          bg="#fed7d7"
                          borderRadius="md"
                          fontSize="sm"
                          display="inline-block"
                        >
                          第二のコードの方が理解しやすい。
                        </Text>
                        <Text mb={2}>納得しました！</Text>
                        <HStack>
                          <Button
                            fontSize="xs"
                            borderRadius="full"
                            h="32px"
                            bg="teal.100"
                          >
                            返信
                          </Button>
                          <Button
                            fontSize="xs"
                            borderRadius="full"
                            h="32px"
                            bg="gray.200"
                          >
                            キャンセル
                          </Button>
                        </HStack>
                      </Box>
                      {/* {selectionData?.text && (
                        <Box
                          position="absolute"
                          right="10px"
                          top={`${selectionData.top}px`}
                          bg="white"
                          border="1px solid black"
                          borderColor="gray.200"
                          boxShadow="md"
                          p={4}
                          w="400px"
                          borderRadius="md"
                          mx="auto"
                        >
                          <HStack mb={2}>
                            <Avatar
                              size="sm"
                              src="/images/avatar/avatar_5.jpg"
                            />
                            <Flex direction="column">
                              <Text fontSize="sm" fontWeight="bold">
                                Chris Hemsworth
                              </Text>
                              <Text fontSize="xs">10:12</Text>
                            </Flex>
                          </HStack>
                          <Text
                            mb={2}
                            p={1}
                            bg="#fed7d7"
                            borderRadius="md"
                            fontSize="sm"
                            display="inline-block"
                          >
                            {selectionData?.text}
                          </Text>
                          <Input
                            bg="white"
                            borderRadius="full"
                            placeholder="コメントを入力"
                            onBlur={(e) => setCommentText(e.target.value)}
                            mb={2}
                          />
                          <HStack>
                            <Button
                              fontSize="xs"
                              borderRadius="full"
                              h="32px"
                              bg="teal.100"
                            >
                              コメント
                            </Button>
                            <Button
                              fontSize="xs"
                              borderRadius="full"
                              h="32px"
                              bg="gray.200"
                            >
                              キャンセル
                            </Button>
                          </HStack>
                        </Box>
                      )} */}
                      {/* <Box
                        position="absolute"
                        right="10px"
                        top={`530px`}
                        bg="white"
                        border="1px solid black"
                        borderColor="gray.200"
                        boxShadow="md"
                        p={4}
                        w="400px"
                        borderRadius="md"
                        mx="auto"
                      >
                        <HStack mb={2}>
                          <Avatar size="sm" src="/images/avatar/avatar_5.jpg" />
                          <Flex direction="column">
                            <Text fontSize="sm" fontWeight="bold">
                              Chris Hemsworth
                            </Text>
                            <Text fontSize="xs">10:12</Text>
                          </Flex>
                        </HStack>
                        <Input
                          bg="white"
                          borderRadius="full"
                          placeholder="コメントを入力"
                          onBlur={(e) => setCommentText(e.target.value)}
                          mb={2}
                        />
                        <HStack>
                          <Button
                            fontSize="xs"
                            borderRadius="full"
                            h="32px"
                            bg="teal.100"
                          >
                            コメント
                          </Button>
                          <Button
                            fontSize="xs"
                            borderRadius="full"
                            h="32px"
                            bg="gray.200"
                          >
                            キャンセル
                          </Button>
                        </HStack>
                      </Box> */}
                    </Box>
                  </Box>
                </Flex>
              </Box>
              {/* <Box w="400px" h="100%">
            <Box style={{ height: "calc(100vh - 140px)" }} overflowY="auto">
              <Box
                mt={`${74 - 56}px`}
                bg="gray.100"
                p={4}
                w="90%"
                borderRadius="md"
                mx="auto"
              >
                <HStack mb={2}>
                  <Avatar size="sm" />
                  <Flex direction="column">
                    <Text fontSize="sm ">Shogo</Text>
                    <Text fontSize="xs">10:12</Text>
                  </Flex>
                </HStack>
                <Text mb={2}>Hello World!</Text>
                <HStack>
                  <Button
                    fontSize="xs"
                    borderRadius="full"
                    h="32px"
                    bg="teal.100"
                  >
                    返信
                  </Button>
                  <Button
                    fontSize="xs"
                    borderRadius="full"
                    h="32px"
                    bg="gray.200"
                  >
                    キャンセル
                  </Button>
                </HStack>
              </Box>
              {selectionData?.text && (
                <Box
                  mt={`${selectionData.top - 56}px`}
                  bg="gray.100"
                  p={4}
                  w="90%"
                  borderRadius="md"
                  mx="auto"
                >
                  <HStack mb={2}>
                    <Avatar size="sm" />
                    <Flex direction="column">
                      <Text fontSize="sm ">Shogo</Text>
                      <Text fontSize="xs">10:12</Text>
                    </Flex>
                  </HStack>
                  <Input
                    bg="white"
                    borderRadius="full"
                    placeholder="コメントを入力"
                    onBlur={(e) => setCommentText(e.target.value)}
                    mb={2}
                  />
                  <HStack>
                    <Button
                      fontSize="xs"
                      borderRadius="full"
                      h="32px"
                      bg="teal.100"
                    >
                      コメント
                    </Button>
                    <Button
                      fontSize="xs"
                      borderRadius="full"
                      h="32px"
                      bg="gray.200"
                    >
                      キャンセル
                    </Button>
                  </HStack>
                </Box>
              )}
            </Box>
          </Box> */}
            </Flex>
          )}
          {currentPhase === 3 && (
            <Flex
              w="100%"
              justifyContent="center"
              alignItems="center"
              h="80vh"
              direction="column"
            >
              <VStack w="600px">
                <HStack mb={4}>
                  <Avatar
                    w="24px"
                    h="24px"
                    src={currentTestA(currentTestIndex)?.user?.photoUrl}
                  />
                  <Text fontWeight="bold" fontSize="xl">
                    {currentTestA(currentTestIndex)?.user?.displayName}
                  </Text>
                  <Text fontWeight="bold" fontSize="xs">
                    が回答者
                  </Text>
                </HStack>
                <HStack w="100%" mb={4}>
                  <Text fontSize="xs" fontWeight="bold">
                    {handleTestNumber(currentTestIndex)} / 10
                  </Text>
                  <Box
                    flex={1}
                    h="8px"
                    bg="gray.300"
                    borderRadius="lg"
                    position="relative"
                  >
                    <SlideFade in={true} offsetY="0px">
                      <Box
                        position="absolute"
                        top="0"
                        left="0"
                        h="100%"
                        w={`${widthPercentage}%`}
                        // w="100%"
                        bg="teal.300"
                        borderRadius="lg"
                        transition="width 0.5s"
                      />
                    </SlideFade>
                  </Box>
                </HStack>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  mb={2}
                  alignSelf="flex-start"
                >
                  {currentTestA(currentTestIndex)?.test.text}
                </Text>
                <VStack w="100%" spacing={4} mb={6}>
                  {currentTestA(currentTestIndex)?.test?.choices?.map(
                    (choice) => (
                      <Flex
                        alignItems="center"
                        key={choice.id}
                        w="100%"
                        borderRadius="lg"
                        cursor="pointer"
                        p={4}
                        bg={selectTestId === choice.id ? "teal.100" : "white"}
                        onClick={() => setSelectTestId(choice.id)}
                        boxShadow="md"
                        border="1px solid black"
                        borderColor="gray.200"
                      >
                        <Text mr={4}>{choice.id}.</Text>
                        <Text fontWeight="bold">{choice.text}</Text>
                      </Flex>
                    )
                  )}
                </VStack>
                <HStack
                  w="100%"
                  justifyContent="space-between"
                  bg={bgColor}
                  p={4}
                  borderRadius="lg"
                >
                  {currentTestIndex < project?.book?.chapters?.length + 1 && (
                    <>
                      {isNext ? (
                        <>
                          {currentTestIndex === 0 && (
                            <HStack spacing={4}>
                              <Icon
                                as={ImCancelCircle}
                                w="48px"
                                h="48px"
                                bg="red.100"
                                color="red.500"
                                borderRadius="full"
                              />
                              <HStack color="red.600">
                                <Text fontSize="xl" fontWeight="bold">
                                  正解
                                </Text>
                                <Text fontSize="xl" fontWeight="bold">
                                  3
                                </Text>
                              </HStack>
                            </HStack>
                          )}
                          {currentTestIndex === 1 && (
                            <HStack spacing={4}>
                              <Icon
                                as={FaRegCheckCircle}
                                w="48px"
                                h="48px"
                                bg="teal.100"
                                color="teal.500"
                                borderRadius="full"
                              />
                              <HStack color="red.600">
                                <Text
                                  color="teal.600"
                                  fontSize="xl"
                                  fontWeight="bold"
                                >
                                  正解！よくできたね！
                                </Text>
                              </HStack>
                            </HStack>
                          )}
                        </>
                      ) : (
                        <Button
                          onClick={() => {
                            setCurrentTestIndex((prevIndex) => prevIndex - 1);
                          }}
                        >
                          スキップ
                        </Button>
                      )}
                    </>
                  )}
                  {/* {currentTestIndex < chapters.length - 1 && ( */}
                  <Button
                    onClick={handleSendClick}
                    bg={buttonBgColor}
                    color={selectTestId ? "gray.900" : "gray.400"}
                    _hover={{ bg: buttonBgColor }}
                  >
                    {buttonText}
                  </Button>
                  {/* )} */}
                </HStack>
              </VStack>
            </Flex>
          )}
          {currentPhase === 4 && (
            <>
              {/* <Flex
                w="100%"
                h="40px"
                borderRight="0.3px solid black"
                borderBottom="0.3px solid black"
                borderColor="gray.200"
                alignItems="center"
                px={4}
              >
                <Flex mr={16}>
                  <Text
                    px={3}
                    bg="gray.200"
                    borderRadius="full"
                    fontSize="sm"
                    h="24px"
                    fontWeight="bold"
                    mr={4}
                  >
                    第１章
                  </Text>
                  <Text fontWeight="bold">良いコードとは？</Text>
                </Flex>
                <Flex>
                  <Avatar size="xs" />
                </Flex>
              </Flex> */}
              <Flex>
                <Flex w="50%" alignItems="center">
                  <VStack
                    w="500px"
                    margin="auto"
                    style={{ height: "calc(100vh - 189px)" }}
                    overflowY="auto"
                    justifyContent="center"
                  >
                    <HStack mb={4}>
                      <Avatar
                        w="24px"
                        h="24px"
                        src={currentTestA(currentTestIndex)?.user?.photoUrl}
                      />
                      <Text fontWeight="bold" fontSize="xl">
                        {currentTestA(currentTestIndex)?.user?.displayName}
                      </Text>
                      <Text fontWeight="bold" fontSize="xs">
                        が回答者
                      </Text>
                    </HStack>
                    <HStack w="100%" mb={4}>
                      <Text fontSize="xs" fontWeight="bold">
                        {currentTestIndex === 0 ? 1 : 2} / 10
                      </Text>
                      <Box
                        flex={1}
                        h="8px"
                        bg="gray.300"
                        borderRadius="lg"
                        position="relative"
                      >
                        <SlideFade in={true} offsetY="0px">
                          <Box
                            position="absolute"
                            top="0"
                            left="0"
                            h="100%"
                            w={`${widthPercentage}%`}
                            // w="100%"
                            bg="teal.300"
                            borderRadius="lg"
                            transition="width 0.5s"
                          />
                        </SlideFade>
                      </Box>
                    </HStack>
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      mb={2}
                      alignSelf="flex-start"
                    >
                      {currentTestA(currentTestIndex)?.test?.text}
                    </Text>
                    <VStack w="100%" spacing={4} mb={6}>
                      {currentTestA(currentTestIndex)?.test?.choices?.map(
                        (choice) => (
                          <Flex
                            alignItems="center"
                            key={choice.id}
                            w="100%"
                            borderRadius="lg"
                            cursor="pointer"
                            p={4}
                            bg={
                              currentTestA(currentTestIndex)?.test?.answerId ===
                              choice.id
                                ? currentTestIndex === 1
                                  ? "teal.300"
                                  : "red.300"
                                : "gray.200"
                            }
                            onClick={() => setSelectTestId(choice.id)}
                          >
                            <Text mr={4}>{choice.id}.</Text>
                            <Text fontWeight="bold">{choice.text}</Text>
                          </Flex>
                        )
                      )}
                    </VStack>
                    <HStack
                      w="100%"
                      justifyContent="space-between"
                      p={4}
                      borderRadius="lg"
                    >
                      {currentTestIndex === 0 && (
                        <HStack spacing={4}>
                          <Icon
                            as={ImCancelCircle}
                            w="48px"
                            h="48px"
                            bg="red.100"
                            color="red.500"
                            borderRadius="full"
                          />
                          <HStack color="red.600">
                            <Text fontSize="xl" fontWeight="bold">
                              正解
                            </Text>
                            <Text fontSize="xl" fontWeight="bold">
                              3
                            </Text>
                          </HStack>
                        </HStack>
                      )}
                      {currentTestIndex === 1 && (
                        <HStack spacing={4}>
                          <Icon
                            as={FaRegCheckCircle}
                            w="48px"
                            h="48px"
                            bg="teal.100"
                            color="teal.500"
                            borderRadius="full"
                          />
                          <HStack color="red.600">
                            <Text
                              color="teal.600"
                              fontSize="xl"
                              fontWeight="bold"
                            >
                              正解！よくできたね！
                            </Text>
                          </HStack>
                        </HStack>
                      )}

                      {/* {currentTestIndex < chapters.length - 1 && ( */}
                      {/* )} */}
                    </HStack>
                  </VStack>
                </Flex>
                <Box w="50%">
                  <Flex
                    w="100%"
                    h="49px"
                    borderLeft="0.3px solid black"
                    borderBottom="0.3px solid black"
                    borderColor="gray.200"
                    px={4}
                  >
                    <HStack spacing={4}>
                      <Icon
                        fontSize="24px"
                        as={MdOutlinePreview}
                        onClick={() => setPreviewState("preview")}
                        cursor="pointer"
                      />
                      <Icon
                        fontSize="24px"
                        as={AiOutlineFileText}
                        onClick={() => setPreviewState("manuscript")}
                        cursor="pointer"
                      />
                    </HStack>
                  </Flex>
                  {previewState === "preview" && (
                    <Box
                      dangerouslySetInnerHTML={{
                        __html: content,
                      }}
                      style={{ height: "calc(100vh - 189px)" }}
                      overflowY="auto"
                      bg="white"
                      borderLeft="0.3px solid black"
                      borderColor="gray.200"
                      p={4}
                      className="znc"
                    />
                  )}
                  {previewState === "manuscript" && (
                    <Box
                      style={{ height: "calc(100vh - 189px)" }}
                      overflowY="auto"
                      bg="gray.200"
                      borderLeft="0.3px solid black"
                      borderColor="gray.200"
                      p={4}
                      className="znc"
                    ></Box>
                  )}
                </Box>
              </Flex>
              <Center
                w="56px"
                h="56px"
                bg="gray.900"
                borderRadius="full"
                position="absolute"
                top="0"
                bottom="0"
                left="10px"
                margin="auto"
                opacity={0.5}
                cursor="pointer"
                onClick={() =>
                  setCurrentTestIndex((prevIndex) => prevIndex - 1)
                }
              >
                <Icon as={AiOutlineLeft} fontSize="2xl" color="white" />
              </Center>
              <Center
                w="56px"
                h="56px"
                bg="gray.900"
                borderRadius="full"
                position="absolute"
                zIndex={100}
                top="0"
                bottom="0"
                right="680px"
                margin="auto"
                opacity={0.5}
                cursor="pointer"
                onClick={() => {
                  handleButtonClick();
                  setCurrentTestIndex((prevIndex) => prevIndex + 1);
                }}
              >
                <Icon as={AiOutlineRight} fontSize="2xl" color="white" />
              </Center>
            </>
          )}
          {currentPhase === 5 && (
            <Flex
              w="100%"
              justifyContent="center"
              alignItems="center"
              h="80vh"
              direction="column"
            >
              <Flex
                maxW="1080px"
                w="100%"
                margin="auto"
                alignItems="center"
                style={{ height: "calc(100vh - 201px)" }}
                overflowY="auto"
                justifyContent="center"
                direction="column"
              >
                <Box
                  w="100%"
                  // border="0.3px solid black"
                  // borderColor="gray.200"
                  p={8}
                  borderRadius="md"
                >
                  <Flex mt="64px">
                    <Assign
                      chapters={project?.book?.chapters?.filter(
                        (chapter, index) => index > 3
                      )}
                      players={project?.members}
                    />
                  </Flex>
                  <VStack mt={6} spacing={6}>
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
                  </VStack>
                </Box>
                <HStack justifyContent="flex-end" alignSelf="flex-end" mr={8}>
                  <Button onClick={handlePointPercentage}>詳細を見る</Button>
                  <Button
                    onClick={onPointGetModalOpenOpen}
                    bg="teal.100"
                    color="teal.700"
                  >
                    終了
                  </Button>
                </HStack>
              </Flex>
              <Modal
                isCentered
                size="2xl"
                onClose={onPointGetModalOpenClose}
                isOpen={isPointGetModalOpen}
              >
                <ModalOverlay backdropFilter="blur(4px) hue-rotate(10deg)" />
                <ModalContent>
                  <ModalBody p={8} w="100%">
                    <VStack>
                      <Image
                        width="120px"
                        height="80px"
                        alt=""
                        src={presentImages[3]}
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
                      <HStack w="100%" spacing={8}>
                        <Flex
                          flex={1}
                          borderRadius="md"
                          direction="column"
                          alignItems="center"
                        >
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            alignSelf="center"
                          >
                            Group score
                          </Text>
                          <Center
                            w="120px"
                            h="120px"
                            position="relative"
                            my={4}
                          >
                            <HStack spacing={0.5} position="absolute">
                              <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color="teal.400"
                              >
                                E
                              </Text>
                            </HStack>
                            <DoughnutItem
                              percentage={10}
                              type="USER_LEVEL"
                              backgroundColor={["#38B2AC", "#E2E8F0"]}
                              borderColor={["#4FD1C5", "#CBD5E0"]}
                            />
                          </Center>
                        </Flex>
                        <Flex
                          flex={1}
                          borderRadius="md"
                          direction="column"
                          alignItems="center"
                        >
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            alignSelf="center"
                          >
                            User Level
                          </Text>
                          <Center
                            w="120px"
                            h="120px"
                            position="relative"
                            my={4}
                          >
                            <HStack spacing={0.5} position="absolute">
                              <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color="teal.400"
                              >
                                0
                              </Text>
                            </HStack>
                            <DoughnutItem
                              percentage={36}
                              type="USER_LEVEL"
                              backgroundColor={["#38B2AC", "#E2E8F0"]}
                              borderColor={["#4FD1C5", "#CBD5E0"]}
                            />
                          </Center>
                        </Flex>
                        <Flex
                          flex={1}
                          borderRadius="md"
                          direction="column"
                          alignItems="center"
                        >
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            alignSelf="center"
                          >
                            Point
                          </Text>
                          <Center
                            w="120px"
                            h="120px"
                            position="relative"
                            my={4}
                          >
                            <HStack spacing={0.5} position="absolute">
                              <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color="yellow.400"
                              >
                                0
                              </Text>
                            </HStack>
                            <DoughnutItem
                              percentage={24}
                              type="USER_LEVEL"
                              backgroundColor={["#FAF089", "#cccccc"]}
                              borderColor={["#ECC94B", "#FAF0C1"]}
                            />
                          </Center>
                        </Flex>
                      </HStack>
                    </VStack>
                    <HStack justifyContent="center" mt={4}>
                      <Button onClick={handlePointPercentage}>
                        詳細を見る
                      </Button>
                      <Button
                        onClick={() =>
                          router.push(`/groups/${groupId}/dashboard`)
                        }
                        bg="teal.100"
                        color="teal.700"
                      >
                        ホームへ戻る
                      </Button>
                    </HStack>
                  </ModalBody>
                </ModalContent>
              </Modal>
            </Flex>
          )}
        </>
      )}
    </Box>
  );
};

export default DetailProject;
