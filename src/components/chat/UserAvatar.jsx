export default function UserAvatar({ name }) {
  return (
    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
      {name?.[0]?.toUpperCase()}
    </div>
  );
}