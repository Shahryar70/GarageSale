// src/components/chat/MessageBubble.jsx
export default function MessageBubble({ message, isMe }) {
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs p-3 rounded-lg ${
          isMe ? "bg-green-600 text-white" : "bg-gray-200"
        }`}
      >
        {message.item && (
          <div className="text-xs mb-1 border-b pb-1">
            📦 {message.item}
          </div>
        )}

        <p>{message.text}</p>
        <span className="text-[10px] opacity-70 block mt-1 text-right">
          {new Date(message.createdAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
