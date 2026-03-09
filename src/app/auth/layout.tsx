import "./layout.css";
import FadingImg from "@/components/FadingImg/FadingImg";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="auth-page">
      <div className="form-side">{children}</div>

      <div className="art-side">
        <p>Fake Socials</p>
        <p>
          Your network, <span>redefined</span>.
        </p>
        <FadingImg />
      </div>
    </div>
  );
};

export default layout;
