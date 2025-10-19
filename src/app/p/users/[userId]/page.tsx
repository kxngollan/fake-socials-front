"use client";

import "./User.css";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  IconBrandGithub,
  IconMessageCircle,
  IconWorld,
} from "@tabler/icons-react";
import { useAuthContext } from "@/hooks/useAuthContext";
import useFollowMutation from "@/hooks/useFollowMutation";
import { useFetch } from "@/hooks/useFetch";

import PostCard from "@/components/postcard/PostCard";
import BackNav from "@/components/backnav/BackNav";
import ProfileStats from "@/components/profilestats/ProfileStats";
import Loader from "@/components/loaders/Loader";
import { useEffect } from "react";

const UserProfile = () => {
  const route = useRouter();
  const { userId } = useParams();

  const myFetch = useFetch();
  const getUser = async ({ queryKey }) => {
    return await myFetch(`/api/users/${queryKey[1]}`);
  };
  const queryKey = ["user", userId, "post"];
  const authContext = useAuthContext();
  const { unfollow, follow } = useFollowMutation({ id: userId }, queryKey);
  const { data, isPending } = useQuery({
    queryKey,
    queryFn: getUser,
  });

  const { user } = data || {};

  // const handleChat = async () => {
  //   try {
  //     const data = await myFetch(`/api/chats/user/${userId}`, {
  //       method: "PUT",
  //     });
  //     route.push(`/p/message/${data.chat.id}`);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  if (user && user.profile?.website) {
    user.profile.website = user.profile.website.startsWith("http")
      ? user.profile.website
      : `https://${user.profile.website}`;
  }
  if (user && user.profile?.github) {
    user.profile.github = user.profile.github.startsWith("http")
      ? user.profile.github
      : `https://${user.profile.github}`;
  }

  useEffect(() => {
    document.title = `${user?.username ?? ""} Profile - Fake Socials`;
  }, [user]);

  console.log(authContext);

  if (user?.username === authContext?.user?.username) route.push("/p/profile");

  return (
    <div className="content user-profile-page">
      <div>
        {isPending ? (
          <Loader loading={isPending} />
        ) : (
          <>
            <BackNav label="User" />
            <div className="profile-main">
              {user?.profile?.profilePicture ? (
                <img src={user.profile.profilePicture} alt="Profile Picture" />
              ) : (
                <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                  alt="default profile picture"
                />
              )}
              <div>
                <p className="profile-username">{user.username}</p>
                <p className="profile-displayname">{user.displayName}</p>
                <ProfileStats
                  followers={user._count.followers}
                  following={user._count.following}
                  posts={user._count.posts}
                />
                {user.id !== Number(authContext.user.id) ? (
                  <div className="user-actions">
                    {user.followers.length > 0 ? (
                      <button onClick={() => unfollow.mutate()}>
                        Unfollow
                      </button>
                    ) : (
                      <button
                        className="follow"
                        onClick={() => follow.mutate()}
                      >
                        Follow
                      </button>
                    )}
                    {/* <button onClick={handleChat}>
                      <IconMessageCircle />
                    </button> */}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="profile-details">
              {user?.profile?.bio && (
                <div>
                  <p className="profile-bio">{user.profile.bio}</p>
                </div>
              )}
              {user?.profile?.website && (
                <div>
                  <IconWorld />
                  <a href={`${user.profile.website.trim()}`} target="_blank">
                    {user.profile.website}
                  </a>
                </div>
              )}
              {user?.profile?.github && (
                <div>
                  <IconBrandGithub />
                  <a target="_blank" href={`${user.profile.github.trim()}`}>
                    github
                  </a>
                </div>
              )}
              <a href=""></a>
            </div>
            <div className="profile-posts">
              <p>Posts</p>
              {user.posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  handleClick={() => route.push(`/p/posts/${post.id}`)}
                  pageQueryKey={["user", userId, "post"]}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default UserProfile;
