// src/components/chat/ConversationList.jsx
import { Link, useLocation } from "react-router-dom";
import UserAvatar from "./UserAvatar";

export default function ConversationList({ conversations }) {
  const { pathname } = useLocation();

  return (
    <div className="w-80 border-r overflow-y-auto">
      {conversations.map((c) => (
        <Link
          key={c.id}
          to={`/messages/${c.id}`}
          className={`flex items-center gap-3 p-4 hover:bg-gray-100 ${
            pathname.includes(c.id) ? "bg-gray-100" : ""
          }`}
        >
          <UserAvatar name={c.user} />
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="font-medium">{c.user}</span>
              {c.unread > 0 && (
                <span className="bg-green-600 text-white text-xs px-2 rounded-full">
                  {c.unread}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 truncate">{c.lastMessage}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
