"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import GoogleLogo from "@/assets/images/google.svg";
import { IconAlertOctagon } from "@tabler/icons-react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { myFetch } from "@/utils/myFetch";
import Loader from "@/components/loaders/Loader";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dispatch } = useAuthContext();

  const [error, setError] = useState<string | undefined>();
  const [disabled, setDisabled] = useState(false);
  const goHome = () => router.push("/p/home");
  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const userParam = searchParams.get("username");
    const idParam = searchParams.get("id");
    const profilePictureParam = searchParams.get("profilePicture");

    if (tokenParam && userParam && idParam && profilePictureParam) {
      const payload = {
        token: tokenParam,
        username: userParam,
        id: idParam,
        profilePicture: profilePictureParam,
      };
      dispatch({ type: "LOGIN", payload });
      localStorage.setItem("user", JSON.stringify(payload));
      goHome();
    }
  }, [searchParams]);

  const handleSubmit = async (
    e?: React.FormEvent<HTMLFormElement>,
    inputUser?: string,
    inputPass?: string
  ) => {
    setDisabled(true);
    if (e) e.preventDefault();
    setError(undefined);

    try {
      const form = e?.currentTarget;
      const username =
        inputUser ??
        (form
          ? (form.elements.namedItem("username") as HTMLInputElement)?.value
          : "");
      const password =
        inputPass ??
        (form
          ? (form.elements.namedItem("password") as HTMLInputElement)?.value
          : "");

      const res = await myFetch("/auth/local/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      console.log(res);

      dispatch({ type: "LOGIN", payload: res });
      localStorage.setItem("user", JSON.stringify(res));
      goHome();

      setTimeout(() => setDisabled(false), 1000);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Something went wrong. Please try again.");
      setDisabled(false);
    }
  };

  useEffect(() => {
    document.title = "Login - Fake Socials";
  }, []);

  return (
    <>
      <Image
        src={"https://placehold.co/600x400"}
        alt="Logo"
        width={0}
        height={0}
        priority
      />
      <p>Welcome!</p>
      <p>Please fill in your login details</p>

      <form onSubmit={handleSubmit} className="form-general login">
        <input
          name="username"
          type="text"
          placeholder="Username"
          minLength={2}
          maxLength={35}
          pattern="^[a-zA-Z0-9_.-]*$"
          autoComplete="new-password"
          title="Username must be alphanumeric, and may contain periods, underscores, and hyphens"
          required
        />
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Password"
          minLength={2}
          required
        />
        <button disabled={disabled} type="submit">
          Login
        </button>
      </form>

      <button
        onClick={() => handleSubmit(undefined, "222", "222")}
        disabled={disabled}
        id="guest-login"
      >
        Guest User
      </button>

      <p className="signup">
        Don{"'"}t have an account?{" "}
        <span onClick={() => router.push("./signup")}>Sign up</span>
        {disabled && <Loader color="grey" loading={true} />}
      </p>

      <p className="error-box">
        {error ? (
          <>
            <IconAlertOctagon size="18px" />
            {error}
          </>
        ) : (
          ""
        )}
      </p>

      <p className="or">
        <span>or</span>
      </p>

      <button
        className="google"
        disabled={disabled}
        onClick={() => {
          if (!API_URL) {
            setError("Missing NEXT_PUBLIC_API_URL environment variable.");
            return;
          }
          window.location.href = `${API_URL}/api/auth/oauth/google`;
        }}
      >
        <Image
          className="google-icon"
          src={GoogleLogo}
          alt=""
          width={0}
          height={0}
        />
        <span>Continue with Google</span>
      </button>
    </>
  );
};

const Page = () => {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
};

export default Page;
