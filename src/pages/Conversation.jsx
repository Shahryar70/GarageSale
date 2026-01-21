// src/pages/Conversation.jsx
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMessages,
  sendMessage,
} from "../services/message.service";
import MessageBubble from "../components/chat/MessageBubble";
import MessageInput from "../components/chat/MessageInput";

export default function Conversation() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef();

  const load = () => {
    getMessages(id).then((res) => setMessages(res.data || []));
  };

  useEffect(load, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text) => {
    await sendMessage(id, { text });
    load();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            isMe={m.isMe}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={handleSend} />
    </div>
  );
}
