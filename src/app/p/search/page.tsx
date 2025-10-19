"use client";

import "./Search.css";
import { IconSearch } from "@tabler/icons-react";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useRef, useState } from "react";
import ProfilePreview from "@/components/profilepreview/ProfilePreview";
import Loader from "@/components/loaders/Loader";
import { toast } from "react-toastify";

const SearchUsers = () => {
  const myFetch = useFetch();
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const queryRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    };
    document.addEventListener("keydown", handleKeydown);

    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    document.title = "Search Users - Fake Socials";
  }, []);

  const handleSubmit = async () => {
    const query = queryRef.current?.value ?? "";
    if (query.length == 0) return; //dont execute
    setLoading(true);
    try {
      const data = await myFetch(`/api/users?search=${query}`);
      setUserList(data.users);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.warn("An Error has occured. Try again later.");
    }
  };

  return (
    <div className="content search-users">
      <div className="search">
        <form onSubmit={(e) => e.preventDefault()}>
          <IconSearch
            className="cursor-pointer hover:bg-black hover:text-white py-2"
            onClick={handleSubmit}
          />
          <input
            type="search"
            name="search"
            placeholder={"Enter a username"}
            autoComplete="off"
            ref={queryRef}
            autoFocus
            className="cursor-text"
          />
        </form>
        <div className="results">
          {loading ? (
            <Loader loading={loading} color="black" />
          ) : userList.length > 0 ? (
            userList.map((user) => (
              <ProfilePreview
                key={user.id}
                user={user}
                showFollow={false}
                clickable={true}
              />
            ))
          ) : (
            <p className="no-results">No results</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUsers;
