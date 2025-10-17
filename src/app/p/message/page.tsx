"use client";

import "./Message.css";
import { useQuery } from "@tanstack/react-query";
import { useFetch } from "@/hooks/useFetch";
import Link from "next/link";
import ChatPreview from "@/components/profilepreview/ChatPreview";
import BackNav from "@/components/backnav/BackNav";
import BadRequest from "@/components/error/BadRequest";
import MultipleProfilePreviewSkeleton from "@/components/skeletons/profilepreview/MultipleProfilePreviewSkeleton";
import { useEffect } from "react";

const ChatsPage=()=> {
  const myFetch = useFetch();

  const { data, isPending, isError } = useQuery({
    queryFn: () => myFetch("/api/chats"),
    queryKey: ["chats"],
  });

    useEffect(()=>{
      document.title="Messages - Fake Socials"
    },[])

  return (
    <div className={`content chats`}>
      <div>
        <BackNav label="Messages" />
        {isPending ? (
          <MultipleProfilePreviewSkeleton count={7} classes={"chat-preview"} />
        ) : isError ? (

          <BadRequest />
        ) : (data?.chats?.length ?? 0) > 0 ? (
          <div className={"chatList"}>
            {data.chats.map((chat: any) => (
              <ChatPreview key={chat.id ?? chat._id} chat={chat} />
            ))}
          </div>
        ) : (
          <p className={"grey"}>
            No Chats. Send a message to other{" "}
            <Link className={"redirect"} href="/p/search">
              users
            </Link>{" "}
            to create a chat.
          </p>
        )}
      </div>
      <div></div>
    </div>
  );
}

export default ChatsPage