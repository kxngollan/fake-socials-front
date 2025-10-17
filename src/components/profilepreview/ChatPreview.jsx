"use client"

import "./ProfilePreview.css";
import { useRouter } from "next/navigation";

const ChatPreview = ({ chat, hover = false }) => {
  const user = chat.otherUser;
  const navigate = useRouter();

  const image_url =
    user.profile && user.profile?.profilePicture
      ? user.profile.profilePicture
      : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

  const handleClick = () => {
    navigate.push(`/p/message/${chat.id}`, { state: { url: image_url } });
  };
  return (
    <div onClick={handleClick} className="profile-preview-card chat-preview cursor-pointer">
      <img src={image_url} alt="" />
      <div>
        <p
          onClick={(e) => {
            e.stopPropagation();
            navigate.push(`/p/users/${user.id}`);
          }}
        >
          {user.username}
        </p>
        <p>{chat.lastMessage || "(New Chat)"}</p>
      </div>
    </div>
  );
};

export default ChatPreview;
