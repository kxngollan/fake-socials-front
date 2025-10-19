import "./ProfilePreview.css";
import useFollowMutation from "@/hooks/useFollowMutation";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProfilePreview = ({ user, showFollow = true, clickable = false }) => {
  const route = useRouter();

  const { follow, unfollow } = useFollowMutation(user, ["feed", "post"]);
  return (
    <div
      onClick={() => {
        clickable && route.push(`/p/users/${user.id}`);
      }}
      className="profile-preview-card"
    >
      {user.profile && user.profile?.profilePicture ? (
        <img src={user.profile.profilePicture} alt="profile picture" />
      ) : (
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
          alt="default profile picture"
        />
      )}

      <div>
        <p onClick={() => route.push(`/p/users/${user.id}`)}>{user.username}</p>
        <p>{user.displayName}</p>
      </div>
      {showFollow ? (
        user.followers.length == 0 ? (
          <button className="filled" onClick={() => follow.mutate()}>
            Follow
          </button>
        ) : (
          <button onClick={() => unfollow.mutate()}>Unfollow</button>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default ProfilePreview;
