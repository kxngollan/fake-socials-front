"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./BackNav.css";

interface BackNavProps {
  label?: string;
  customNav?: string;
  image?: string | null;
  labelLink?: string | null;
}

const BackNav = ({
  label = "Post",
  customNav,
  image = null,
  labelLink = null,
}: BackNavProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (!customNav) {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      }
    } else {
      router.push(customNav);
    }
  };

  const goToLabelLink = () => {
    if (labelLink) router.push(labelLink);
  };

  return (
    <div className="nav-back">
      <IconArrowLeft onClick={handleClick} />

      {image && labelLink && (
        <Image
          onClick={goToLabelLink}
          src={image}
          alt="profile picture"
          width={28}
          height={28}
          style={{ borderRadius: "50%", cursor: "pointer" }}
        />
      )}

      {labelLink ? (
        <p className="back-nav-link" onClick={goToLabelLink}>
          {label}
        </p>
      ) : (
        <p>{label}</p>
      )}
    </div>
  );
};

export default BackNav;
