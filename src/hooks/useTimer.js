import { db } from "@/config/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";

export const useTimer = (groupId, projectId, onOpen) => {
  const [time, setTime] = useState(null);
  const [timerStatus, setTimerStatus] = useState("stopped");
  const [remainingTime, setRemainingTime] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(0);

  const formatTime = useCallback((seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
  }, []);

  useEffect(() => {
    let intervalId;
    if (projectId && groupId) {
      const projectRef = doc(db, "groups", groupId, "projects", projectId);

      const unsubscribe = onSnapshot(projectRef, (snapshot) => {
        const data = snapshot.data();
        if (data && data.timer) {
          const timerData = data.timer;
          setTimerStatus(timerData.status);
          setCurrentPhase(timerData.currentPhase);
          if (timerData.status === "playing") {
            if (intervalId) {
              clearInterval(intervalId);
            }
            const calculateTime = () => {
              const elapsedTime = Math.floor(
                Date.now() / 1000 - timerData.startTime.seconds
              );
              const remaining = timerData.remainingTime - elapsedTime;

              if (remaining <= 0) {
                setTimerStatus("stopped");
                setTime("00:00");
                clearInterval(intervalId);
              } else {
                setRemainingTime(remaining);
                setTime(formatTime(remaining));
              }
            };

            calculateTime();
            intervalId = setInterval(calculateTime, 1000);
          } else {
            setTime(
              timerData.remainingTime
                ? formatTime(timerData.remainingTime)
                : "00:00"
            );
            if (intervalId) {
              clearInterval(intervalId);
            }
          }
        }
      });

      return () => {
        unsubscribe();
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, projectId, formatTime]);

  const handleToggleTimer = async () => {
    if (timerStatus === "stopped" && remainingTime && remainingTime > 0) {
      setTimerStatus("playing");
      setTime(formatTime(remainingTime));
    } else if (timerStatus === "playing") {
      setTimerStatus("stopped");
    }

    const toggleTimerFunction = httpsCallable(getFunctions(), "toggleTimer");
    await toggleTimerFunction({ groupId, projectId });
  };

  const handleNextPhase = async () => {
    const nextPhaseFunction = httpsCallable(getFunctions(), "nextPhase");
    await nextPhaseFunction({ groupId, projectId });
    if (onOpen) {
      onOpen();
    }
  };

  const phaseText = (phase) => {
    if (phase === 0) {
      return {
        name: "アイスブレイク",
        imageUrl: "/images/groups/icon/ice.png",
      };
    } else if (phase === 1) {
      return {
        name: "ノート作成",
        imageUrl: "/images/groups/icon/note.png",
      };
    } else if (phase === 2) {
      return {
        name: "ディスカッション",
        imageUrl: "/images/groups/icon/talk.png",
      };
    } else if (phase === 3) {
      return {
        name: "確認テスト",
        imageUrl: "/images/groups/icon/test.png",
      };
    } else if (phase === 4) {
      return {
        name: "振り返り",
        imageUrl: "/images/groups/icon/close.png",
      };
    } else if (phase === 5) {
      return {
        name: "次回アサイン",
        imageUrl: "/images/groups/icon/calendar.png",
      };
    }
  };

  return {
    time,
    timerStatus,
    remainingTime,
    currentPhase,
    handleToggleTimer,
    handleNextPhase,
    phaseText,
  };
};
