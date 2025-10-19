"use client";

import "./Sidebar.css";
import { data } from "./data";
import { IconLogout } from "@tabler/icons-react";
import { useAuthContext } from "@/hooks/useAuthContext";

import { useRouter, usePathname } from "next/navigation";

const Sidebar = () => {
  const navigate = useRouter();
  const location = usePathname();

  const { dispatch } = useAuthContext();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
  };

  const isActive = (path) => {
    return location.endsWith(path);
  };

  return (
    <div className="sidebar">
      <ul className="sidebar-ul">
        {data.map((item, key) => (
          <li
            className={
              isActive(item.link)
                ? "sidebar-element hovered"
                : "sidebar-element"
            }
            key={key}
            onClick={() => {
              navigate.push(`/p${item.link}`);
            }}
          >
            {<item.icon />}
            <p className="nav-name">{item.name} </p>
          </li>
        ))}
        <li className="sidebar-element" onClick={handleLogout}>
          <IconLogout /> <p className="nav-name">Logout</p>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
