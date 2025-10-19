"use client";

import { formatDistanceToNowStrict } from "date-fns";
import "./PostCard.css";
import {
  IconBrandGithub,
  IconHeart,
  IconHeartFilled,
  IconMessageCircle,
  IconTrash,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import usePostMutation from "@/hooks/usePostMutation";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type PostCardProps = {
  post: any;
  pageQueryKey?: any[];
  showDelete?: boolean;
};

const PostCard = ({
  post,
  pageQueryKey,
  showDelete = false,
}): PostCardProps => {
  const written_time = formatDistanceToNowStrict(new Date(post.createdAt));
  const queryKey = pageQueryKey || ["feed"];

  const { likePost, unlikePost, deletePost } = usePostMutation(post, queryKey);
  const router = useRouter();

  const { user } = useAuthContext();
  const currUserId = Number(user?.id);

  type VidorImg = "img" | "video" | null;

  const [type, setType] = useState<VidorImg>(null);

  useEffect(() => {
    if (!post?.attachment) return;
    const ext = post.attachment.split(".").pop()?.toLowerCase();
    const imgExt = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "avif"];
    const vidExt = ["mp4", "webm", "ogg", "mkv"];
    if (ext && imgExt.includes(ext)) setType("img");
    else if (ext && vidExt.includes(ext)) setType("video");
    else setType(null);
  }, [post]);

  const normalizedGitLink = useMemo(() => {
    if (!post?.gitLink) return null;
    let url = post.gitLink.trim();
    if (url.startsWith("www.")) url = `https://${url}`;
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    return url;
  }, [post?.gitLink]);

  const goToPost = () => router.push(`/p/posts/${post.id}`);
  const goToUser = (id: number | string) => router.push(`/p/users/${id}`);

  return (
    <div onClick={goToPost} className="postcard" role="button">
      <div className="post-header">
        {post.author?.profile?.profilePicture ? (
          <img
            src={post.author?.profile?.profilePicture}
            alt={`${post.author?.username || "user"} avatar`}
            onClick={(e) => {
              e.stopPropagation();
              goToUser(post.author.id);
            }}
            style={{ borderRadius: "50%", cursor: "pointer" }}
          />
        ) : (
          <img
            src={
              "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
            }
            alt={`default profile picture`}
            onClick={(e) => {
              e.stopPropagation();
              goToUser(post.author.id);
            }}
            style={{ borderRadius: "50%", cursor: "pointer" }}
          />
        )}
        <span
          onClick={(e) => {
            e.stopPropagation();
            goToUser(post.author.id);
          }}
        >
          {post.author.username}
        </span>
        <span>•</span>
        <span className="written-time">{written_time} ago</span>

        {post.userId === currUserId && showDelete && (
          <IconTrash
            onClick={(e) => {
              e.stopPropagation();
              deletePost.mutate();
            }}
            style={{ cursor: "pointer", marginLeft: "auto" }}
            aria-label="Delete post"
            title="Delete post"
          />
        )}
      </div>

      <div className="post-body">
        <p>{post.body}</p>

        <p className="post-tags">
          {post.tags?.map((tag: any, key: number) => (
            <span key={key}>#{tag.name}</span>
          ))}
        </p>

        {post.attachment && type === "img" && (
          <Image
            src={post.attachment}
            alt="Post Media"
            width={800}
            height={450}
            style={{ width: "100%", height: "auto" }}
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {post.attachment && type === "video" && (
          <video
            controls
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", height: "auto" }}
          >
            <source src={post.attachment} type="video/mp4" />
            {/* Consider adding other sources if you support them */}
          </video>
        )}
      </div>

      <div className="post-buttons">
        <p>
          {post.likes.length > 0 ? (
            <IconHeartFilled
              className="red-heart"
              onClick={(e) => {
                e.stopPropagation();
                unlikePost.mutate();
              }}
            />
          ) : (
            <IconHeart
              onClick={(e) => {
                e.stopPropagation();
                likePost.mutate();
              }}
            />
          )}
          {post._count.likes}
        </p>

        <p>
          <IconMessageCircle /> {post._count.comments}
        </p>

        {normalizedGitLink && (
          <IconBrandGithub
            onClick={(e) => {
              e.stopPropagation();
              window.open(normalizedGitLink, "_blank", "noopener,noreferrer");
            }}
            style={{ cursor: "pointer" }}
            title="Open repository"
            aria-label="Open repository"
          />
        )}
      </div>
    </div>
  );
};

export default PostCard;
