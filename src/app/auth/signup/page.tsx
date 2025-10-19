"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import GoogleLogo from "@/assets/images/google.svg";

import { useAuthContext } from "@/hooks/useAuthContext";
import { myFetch } from "@/utils/myFetch";
import { IconAlertOctagon, IconEye, IconEyeOff } from "@tabler/icons-react";
import Loader from "@/components/loaders/Loader";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const { dispatch } = useAuthContext();

  const [disabled, setDisabled] = useState(false);
  const [passVisible, setPassVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const passChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPass(e.target.value);
  };
  const confirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirm(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const username = (form.elements.namedItem("username") as HTMLInputElement)
      .value;
    const displayName = (
      form.elements.namedItem("displayName") as HTMLInputElement
    ).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const confirm_password = (
      form.elements.namedItem("confirm_password") as HTMLInputElement
    ).value;

    if (password !== confirm_password) {
      setError("Passwords do not match");
      return;
    }

    setDisabled(true);
    setError(undefined);

    try {
      const data = await myFetch("/auth/local/signup", {
        method: "POST",
        body: JSON.stringify({
          username,
          displayName,
          password,
          confirm_password,
        }),
      });

      dispatch({ type: "LOGIN", payload: data });
      localStorage.setItem("user", JSON.stringify(data));
      router.push("/p/home");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Something went wrong.");
      setDisabled(false);
    }
  };

  const goGoogle = () => {
    window.location.href = `${API_URL}/api/auth/oauth/google`;
  };

  const passwordsMismatch = pass !== "" && confirm !== "" && pass !== confirm;

  useEffect(() => {
    document.title = "Sign Up - Fake Socials";
  }, []);

  return (
    <>
      <Image
        src={"https://placehold.co/600x400"}
        width={0}
        height={0}
        alt="Logo"
      />
      <p>Join us Today!</p>
      <p>Please fill in your details below</p>
      <form className="form-general login" onSubmit={handleSubmit}>
        <input
          name="username"
          type="text"
          placeholder="Username"
          required
          minLength={2}
          maxLength={35}
          autoComplete="new-password"
          pattern="^[a-zA-Z0-9_.-]*$"
          title="Username must be alphanumeric and may include periods (.), underscores (_), and hyphens (-)"
        />

        <input
          name="displayName"
          type="text"
          placeholder="Display Name"
          required
          minLength={2}
          maxLength={35}
        />

        <div className="input-container">
          <input
            value={pass}
            onChange={passChange}
            name="password"
            type={passVisible ? "text" : "password"}
            placeholder="Password"
            minLength={3}
            required
            autoComplete="new-password"
          />
          {passVisible ? (
            <IconEye
              className="input-icon"
              onClick={() => setPassVisible(false)}
            />
          ) : (
            <IconEyeOff
              className="input-icon"
              onClick={() => setPassVisible(true)}
            />
          )}
        </div>

        <div className="input-container">
          <input
            value={confirm}
            className={passwordsMismatch ? "mismatch" : ""}
            onChange={confirmChange}
            name="confirm_password"
            type={confirmVisible ? "text" : "password"}
            placeholder="Confirm Password"
            minLength={3}
            required
            autoComplete="new-password"
          />
          {confirmVisible ? (
            <IconEye
              className="input-icon"
              onClick={() => setConfirmVisible(false)}
            />
          ) : (
            <IconEyeOff
              className="input-icon"
              onClick={() => setConfirmVisible(true)}
            />
          )}
        </div>

        <button disabled={disabled} type="submit">
          Sign up
        </button>
      </form>
      <p className="signup">
        Already have an account?{" "}
        <Link href="/auth/login">
          <span>Login</span>
        </Link>
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
        {passwordsMismatch ? (
          <>
            <IconAlertOctagon size="18px" />
            <span>Passwords do not match</span>
          </>
        ) : (
          ""
        )}
      </p>
      <p className="or">
        <span>or</span>
      </p>
      <button className="google" onClick={goGoogle}>
        <Image
          className="google-icon"
          src={GoogleLogo}
          alt="Google"
          width={0}
          height={0}
        />
        <span>Continue with Google</span>
      </button>
    </>
  );
}
