"use client";

import "./Header.css";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Header = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const Logo = "https://placehold.co/600x400";

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div id="header">
      <Image
        className="logo"
        src={Logo}
        alt="Logo"
        width={0}
        height={0}
        onClick={() => handleNavigate("/p/home")}
        style={{ cursor: "pointer" }}
      />

      <p className="brand" onClick={() => handleNavigate("/p/home")}>
        Fake Socials
      </p>

      <div className="notif"></div>

      {user.profilePicture ? (
        <Image
          src={user.profilePicture}
          alt="Profile Picture"
          width={0}
          height={0}
          onClick={() => handleNavigate(`/p/users/${user.id}`)}
          style={{ borderRadius: "50%", cursor: "pointer" }}
        />
      ) : (
        <Image
          src={
            "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
          }
          alt="Default Profile Picture"
          width={0}
          height={0}
          style={{ borderRadius: "50%", cursor: "pointer" }}
        />
      )}
    </div>
  );
};

export default Header;
