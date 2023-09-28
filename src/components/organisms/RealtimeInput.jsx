import { db } from "@/config/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

function RealtimeInput() {
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const inputRef = doc(db, "realtimeInput", "sharedInput");

  useEffect(() => {
    const unsubscribe = onSnapshot(inputRef, (snapshot) => {
      const data = snapshot.data();
      setInputValue(data?.value || "");
      setCursorPosition(data?.position || { x: 0, y: 0 });
      setShowInput(true);
    });

    return () => unsubscribe();
  }, [inputRef]);

  const handleKeyDown = async (e) => {
    if (e.key === "/") {
      const position = getCursorPosition(e.target);
      console.log("position", position);
      setCursorPosition(position);
      await setDoc(inputRef, { position });
      setShowInput(true);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);
    await setDoc(inputRef, { value, position: cursorPosition });
  };

  const inputStyles = {
    position: "absolute",
    top: `${cursorPosition.y}px`,
    left: `${cursorPosition.x}px`,
  };

  return (
    <div onKeyDown={handleKeyDown}>
      {showInput && (
        <input
          style={inputStyles}
          value={inputValue}
          onChange={handleInputChange}
        />
      )}
    </div>
  );
}

function getCursorPosition(textarea) {
  const range = document.createRange();
  const sel = window.getSelection();
  const start = textarea.selectionStart;
  const text = textarea.value.substring(0, start);
  const span = document.createElement("span");
  span.innerHTML = text.replace(/\n$/, "\n");
  textarea.after(span);
  const rect = span.getBoundingClientRect();
  const textareaRect = textarea.getBoundingClientRect();
  span.remove();

  return {
    x: rect.left - textareaRect.left,
    y: rect.bottom - textareaRect.top,
  };
}

export default RealtimeInput;
