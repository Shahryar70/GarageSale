// src/components/chat/MessageInput.jsx
import { useState } from "react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <form
      onSubmit={submit}
      className="flex items-center p-3 border-t gap-2"
    >
      <input
        className="flex-1 border rounded-full px-4 py-2 outline-none"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded-full">
        Send
      </button>
    </form>
  );
}
