"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TagPreview from "@/components/tagpreview/TagPreview";
import {
  IconAlertOctagon,
  IconBrandGithub,
  IconPaperclip,
  IconTagsFilled,
  IconX,
} from "@tabler/icons-react";
import Loader from "@/components/loaders/Loader";
import "./Create.css";

export default function CreatePostPage() {
  const queryClient = useQueryClient();
  const route = useRouter();
  const myF = useFetch();

  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const [git, setGit] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [attachmentType, setAttachmentType] = useState(null);
  const [options, setOptions] = useState("tags");

  const attachmentRef = useRef(null);
  const tagsRef = useRef(null);

  const MAX_FILE_SIZE = 1024 * 1024 * 8; // 8MB max

  useEffect(() => {
    document.title = "Create Post - Fake Socials";
  }, []);

  const handleAddTag = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (document.activeElement === tagsRef.current && tag.trim() !== "") {
          const value = tag.toLowerCase();
          if (!tags.includes(value)) {
            setTags((prevTags) => [...prevTags, value]);
          }
          setTag("");
        }
      }
    },
    [tag, tags]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleAddTag);
    return () => document.removeEventListener("keydown", handleAddTag);
  }, [handleAddTag]);

  // ✅ Handle File Upload
  const onAttachmentChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.warn("File exceeded 8MB");
      return;
    }

    if (file.type.startsWith("image")) setAttachmentType("image");
    else if (file.type.startsWith("video")) setAttachmentType("video");
    else {
      toast.warn("Unsupported file type");
      return;
    }

    setAttachment(URL.createObjectURL(file));
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentType(null);
    if (attachmentRef.current) attachmentRef.current.value = "";
  };

  const deleteTag = (name) => {
    setTags((prev) => prev.filter((t) => t !== name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Post cannot be empty");
      return;
    }

    const data = new FormData();
    data.append("body", text);
    if (attachmentRef.current?.files[0])
      data.append("attachment", attachmentRef.current.files[0]);
    tags.forEach((t) => data.append("tags", t));
    if (git) data.append("gitLink", git);

    createPostMutation.mutate(data);
  };

  const createPostMutation = useMutation({
    mutationFn: (variables) =>
      myF("/api/posts", { method: "POST", body: variables }, false),
    onSuccess: () => {
      toast.success("Post created");
      queryClient.invalidateQueries(["feed"]);
      route.push("/p/home");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  return (
    <div className="content new-post">
      <div>
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <TextareaAutosize
            onChange={(e) => setText(e.target.value)}
            className="textarea"
            name="body"
            required
            maxLength={2000}
            placeholder="Share something special..."
            value={text}
          />

          {attachment && (
            <div className="mediaContainer">
              {attachmentType === "image" && (
                <Image
                  src={attachment}
                  alt="Attachment preview"
                  width={0}
                  height={0}
                />
              )}
              {attachmentType === "video" && (
                <video controls>
                  <source src={attachment} />
                  Your browser does not support the video tag.
                </video>
              )}
              <IconX onClick={removeAttachment} className="removeIcon" />
            </div>
          )}

          <div className="tags">
            {tags.map((t, key) => (
              <TagPreview key={key} name={t} deleteTag={deleteTag} />
            ))}
          </div>

          <div className="formOptions">
            <div className="attachmentContainer">
              <label htmlFor="attachment">
                <IconPaperclip />
              </label>
              <input
                ref={attachmentRef}
                type="file"
                id="attachment"
                name="attachment"
                onChange={onAttachmentChange}
                accept=".png,.jpeg,.jpg,.gif,.mp4,.avi,.mov,.wmv,.mkv,.webm"
              />
            </div>

            <IconTagsFilled
              className={options === "tags" ? "selected" : ""}
              onClick={() => setOptions("tags")}
            />
            <IconBrandGithub
              className={options === "git" ? "selected" : ""}
              onClick={() => setOptions("git")}
            />

            <p>{text.length}/2000</p>
            <Loader loading={createPostMutation.isPending} />
            <button disabled={createPostMutation.isPending} type="submit">
              Post
            </button>
          </div>

          {/* ✅ Options */}
          {options === "tags" ? (
            <>
              <p className="optionsName">Tags:</p>
              <input
                ref={tagsRef}
                type="text"
                placeholder="Press Enter to add a tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
            </>
          ) : (
            <>
              <p className="optionsName">Post Repo (Optional):</p>
              <input
                onChange={(e) => setGit(e.target.value)}
                type="text"
                placeholder="Eg. https://github.com/user/project"
                value={git}
              />
            </>
          )}
        </form>

        {error && (
          <p className="errorBox">
            <IconAlertOctagon size={18} /> {error}
          </p>
        )}
      </div>
    </div>
  );
}
