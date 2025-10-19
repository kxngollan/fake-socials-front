import BadRequest from "@/components/error/BadRequest";

const Page = () => {
  return (
    <div className="content">
      <div>
        <BadRequest />
      </div>
    </div>
  );
};

export default Page;

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { IconSend } from "@tabler/icons-react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { io, Socket } from "socket.io-client";
// import TextBubble from "@/components/textbubble/TextBubble";
// import TextareaAutosize from "react-textarea-autosize";
// import { useAuthContext } from "@/hooks/useAuthContext";
// import { format } from "date-fns";
// import { toast } from "react-toastify";
// import BackNav from "@/components/backnav/BackNav";
// import Loader from "@/components/loaders/Loader";
// import BadRequest from "@/components/error/BadRequest";
// import "../Message.css";

// const SERVER_URL: string = process.env.NEXT_PUBLIC_API_URL ?? "";

// async function myFetch<T>(path: string, init?: RequestInit): Promise<T> {
//   console.log(`${SERVER_URL}${path}`);
//   const res = await fetch(`${SERVER_URL}${path}`, {
//     credentials: "include",
//     ...init,
//     headers: {
//       "Content-Type": "application/json",
//       ...(init?.headers || {}),
//     },
//   });
//   if (!res.ok) {
//     throw new Error(`Request failed: ${res.status}`);
//   }
//   return res.json() as Promise<T>;
// }

// type Message = {
//   content: string;
//   createdAt: string;
//   senderId: number | string;
//   chatId: number | string;
//   fromUser?: boolean;
// };

// type ChatResponse = {
//   otherUser: {
//     id: number | string;
//     username: string;
//   };
//   messages: Message[];
// };

// const DMs = ({ chatId, pfpUrl }: { chatId: string; pfpUrl?: string }) => {
//   const { user } = useAuthContext();
//   const currUserId = Number(user?.id);
//   const queryClient = useQueryClient();

//   const [input, setInput] = useState("");
//   const socketRef = useRef<Socket | null>(null);
//   const bottomChatRef = useRef<HTMLDivElement | null>(null);
//   const inputRef = useRef<HTMLTextAreaElement | null>(null);

//   // fetch initial message with useQuery
//   const { data, isPending, isError } = useQuery<ChatResponse>({
//     queryKey: ["DM", chatId],
//     queryFn: () => myFetch(`/api/chats/${chatId}`),
//   });

//   useEffect(() => {
//     if (bottomChatRef.current)
//       bottomChatRef.current.scrollIntoView({ behavior: "smooth" });
//   }, [data?.messages]);

//   useEffect(() => {
//     const socket = io(SERVER_URL, { withCredentials: true });
//     socketRef.current = socket;

//     socket.emit("join_DM", chatId);

//     socket.on("receive message", (msg: Message & { senderId: number }) => {
//       queryClient.setQueryData<ChatResponse>(["DM", chatId], (old) => {
//         if (!old) return old as any;
//         return {
//           ...old,
//           messages: [
//             ...old.messages,
//             {
//               ...msg,
//               fromUser: msg.senderId === currUserId,
//             },
//           ],
//         };
//       });
//     });

//     // shortcut to send text (Enter)
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Enter" && !e.shiftKey) {
//         e.preventDefault();
//         handleSubmit(e as any);
//       }
//     };
//     document.addEventListener("keydown", handleKeyDown);

//     return () => {
//       socket.off("receive message");
//       socket.disconnect();
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [chatId, currUserId, queryClient]);

//   useEffect(() => {
//     document.title = `Chat with ${"Other user"}`;
//   }, []);

//   const sendMessageMutation = useMutation({
//     mutationFn: async (text: string) => {
//       if (!socketRef.current) throw new Error("Socket not connected");
//       socketRef.current.emit("send message", {
//         chatId,
//         input: text,
//         senderId: currUserId,
//       });
//     },
//     onSuccess: () => {
//       const optimisticContent = inputRef.current?.value ?? "";
//       queryClient.setQueryData<ChatResponse>(["DM", chatId], (old) => {
//         if (!old) return old as any;
//         return {
//           ...old,
//           messages: [
//             ...old.messages,
//             {
//               content: optimisticContent,
//               createdAt: new Date().toISOString(),
//               senderId: currUserId,
//               chatId,
//               fromUser: true,
//             },
//           ],
//         };
//       });
//       setInput("");
//     },
//     onError: (error) => {
//       console.error("Error sending message: ", error);
//       toast.warn("Error sending message. Please try again later.");
//     },
//   });

//   const handleSubmit = (
//     e: React.FormEvent<HTMLFormElement> | KeyboardEvent
//   ) => {
//     e.preventDefault?.();
//     const val = inputRef.current?.value?.trim();
//     if (val) {
//       sendMessageMutation.mutate(val);
//     }
//   };

//   return (
//     <div className="content DM">
//       <div>
//         {data && data.otherUser?.username ? (
//           <BackNav
//             label={data.otherUser.username || ""}
//             customNav="/p/message"
//             labelLink={`/p/users/${data.otherUser.id}`}
//             image={pfpUrl}
//           />
//         ) : (
//           <BackNav label="" customNav="/p/message" />
//         )}

//         {isPending ? (
//           <div className="chat-messages">
//             <Loader loading={true} />
//           </div>
//         ) : isError ? (
//           <BadRequest />
//         ) : (
//           <div className="chat-messages">
//             {data?.messages?.map((msg, i) => (
//               <div key={i}>
//                 {i > 1 &&
//                   data.messages[i].createdAt.substring(0, 10) !==
//                     data.messages[i - 1].createdAt.substring(0, 10) && (
//                     <p className="msg-date">
//                       {format(
//                         new Date(data.messages[i].createdAt),
//                         "EEE, do MMM yyyy"
//                       )}
//                     </p>
//                   )}
//                 <TextBubble message={msg} />
//               </div>
//             ))}
//             <div id="bottomChatRef" ref={bottomChatRef} />
//           </div>
//         )}

//         <div className="chat-input">
//           <form onSubmit={handleSubmit}>
//             <TextareaAutosize
//               ref={inputRef}
//               maxRows={3}
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Enter a message..."
//             />
//             <button type="submit" aria-label="Send">
//               <IconSend size={16} />
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DMs;
