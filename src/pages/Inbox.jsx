// src/pages/Inbox.jsx
import { useEffect, useState } from "react";
import { getConversations } from "../services/message.service";
import ConversationList from "../components/chat/ConversationList";
import { Outlet } from "react-router-dom";

export default function Inbox() {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    getConversations().then((res) => setConversations(res.data || []));
  }, []);

  return (
    <div className="flex h-[calc(100vh-120px)] border rounded-lg overflow-hidden">
      <ConversationList conversations={conversations} />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
