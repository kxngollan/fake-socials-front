"use client";

import { useEffect, useState } from "react";
import "./Home.css";
import PostCard from "@/components/postcard/PostCard";
import ProfilePreview from "@/components/profilepreview/ProfilePreview";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import BadRequest from "@/components/error/BadRequest";
import { useFetch } from "@/hooks/useFetch";
import MultiplePostCardSkeleton from "@/components/skeletons/postcardskeleton/MultiplePostCardSkeleton";
import MultipleProfilePreviewSkeleton from "@/components/skeletons/profilepreview/ProfilePreviewSkeleton";
import AnnouncementSkeleton from "@/components/skeletons/announcement/AnnouncementSkeleton";
import { getTodaysQuote } from "success-motivational-quotes";

type FeedResponse = {
  new_post: Array<any>;
  new_follower_posts: Array<any>;
  new_users: Array<any>;
  top_users: Array<any>;
};

type quoteType = {
  id: string;
  catergory: string;
  body: string;
  by: string;
};

export default function Home() {
  const myFetch = useFetch();
  const router = useRouter();

  const [feedSort, setFeedSort] = useState<"recent" | "following">("recent");

  function handleClick(postId: string) {
    router.push(`/p/posts/${postId}`);
  }

  const feedQuery = useQuery<FeedResponse>({
    queryKey: ["feed", "post"],
    queryFn: () => myFetch("/api/init"),
  });

  const {
    new_post = [],
    new_follower_posts = [],
    new_users = [],
    top_users = [],
  } = feedQuery.data || ({} as FeedResponse);

  useEffect(() => {
    document.title = "Home - Fake Socials";
    localStorage.setItem("quote", JSON.stringify(getTodaysQuote()));
  }, []);

  const quote = JSON.parse(localStorage.getItem("quote"));

  return (
    <div className="content" id="home-page">
      <div className="content-main">
        <div className="feed-options">
          <span
            onClick={() => setFeedSort("recent")}
            className={`cursor-pointer ${
              feedSort === "recent" ? "selected" : ""
            }`}
          >
            Recent
          </span>
          <span
            onClick={() => setFeedSort("following")}
            className={`cursor-pointer ${
              feedSort === "following" ? "selected" : ""
            }`}
          >
            Following
          </span>
        </div>

        {feedQuery.isLoading ? (
          <MultiplePostCardSkeleton />
        ) : feedQuery.isError ? (
          <BadRequest />
        ) : feedSort === "recent" ? (
          new_post.map((post: any) => (
            <PostCard
              key={post.id}
              post={post}
              handleClick={() => handleClick(post.id)}
              pageQueryKey={["feed", "post"]}
            />
          ))
        ) : new_follower_posts.length === 0 ? (
          <p className="no-results">No following posts</p>
        ) : (
          new_follower_posts.map((post: any) => (
            <PostCard
              key={post.id}
              post={post}
              handleClick={() => handleClick(post.id)}
              pageQueryKey={["feed", "post"]}
            />
          ))
        )}
      </div>

      <div className="content-side">
        {feedQuery.isLoading ? (
          <>
            <section className="side-content-box">
              <p>Latest users</p>
              <MultipleProfilePreviewSkeleton />
            </section>
            <section className="side-content-box">
              <p>Most followed</p>
              <MultipleProfilePreviewSkeleton />
            </section>
            <AnnouncementSkeleton />
          </>
        ) : (
          <>
            <section className="side-content-box">
              <p>Latest users</p>
              {new_users.map((user: any) => (
                <ProfilePreview key={user.id} user={user} />
              ))}
            </section>

            <section className="side-content-box">
              <p>Most followed</p>
              {top_users.map((user: any) => (
                <ProfilePreview key={user.id} user={user} />
              ))}
            </section>

            <div className="announcement">
              <p>Quote Of The Day </p>
              <ul>
                {quote ? (
                  <>
                    <li>{quote.body}</li>
                    <li className=" text- ">{quote.by}</li>
                  </>
                ) : (
                  ""
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
