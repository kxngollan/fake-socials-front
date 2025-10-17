"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { IconAlertOctagon } from "@tabler/icons-react";

import { myFetch } from "@/utils/myFetch";
import { useAuthContext } from "@/hooks/useAuthContext";
import Loader from "@/components/loaders/Loader";

export default function SetUsernamePage() {
  const { user, dispatch } = useAuthContext();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [token, setToken] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const paramToken = searchParams.get("token");
    if (!paramToken && user?.token) {
      setToken(user.token);
    } else if (paramToken) {
      setToken(paramToken);
    } else {
      router.replace("/auth/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length < 2) {
      setError("username must be at least 2 characters");
    } else if (value.length > 35) {
      setError("username cannot exceed 35 characters.");
    } else if (!/^[a-zA-Z0-9_.-]*$/.test(value)) {
      setError("Must be alphanumeric, '-', '_', or '.'");
    } else {
      setError(undefined);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      setError("Missing token. Please re-authenticate.");
      return;
    }

    const form = e.currentTarget as HTMLFormElement;
    const usernameInput = (
      form.elements.namedItem("username") as HTMLInputElement
    )?.value?.trim();

    if (!usernameInput) {
      setError("Please enter a username.");
      return;
    }

    setDisabled(true);
    try {
      const data = await myFetch(
        "/auth/oauth/username",
        {
          method: "PATCH",
          body: JSON.stringify({ username: usernameInput }),
        },
        { token }
      );

      setDisabled(false);
      dispatch({ type: "LOGIN", payload: data });
      localStorage.setItem("user", JSON.stringify(data));
      router.push("/p/home");
    } catch (err: any) {
      setDisabled(false);
      setError(err?.message || "Something went wrong.");
    }
  };

    useEffect(()=>{
    document.title="Set Username - Fake Socials"
  },[])

  return (
    <>
      <p>Almost Done!</p>
      <p>Choose a username:</p>

      <p className="error-box">
        {error ? (
          <>
            <IconAlertOctagon size="22px" />
            <span>{error}</span>
          </>
        ) : (
          ""
        )}
      </p>

      <form className="form-general" onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          name="username"
          type="text"
          required
          minLength={2}
          maxLength={35}
          placeholder="Eg. Randomuser"
          autoComplete="username"
        />
        <button disabled={disabled} type="submit">
          Submit
        </button>
        <Loader loading={disabled} color="black" />
      </form>

      <p>
        Back to login page{" "}
        <Link className="redirect" href="/auth/login">
          here
        </Link>
      </p>
    </>
  );
}
