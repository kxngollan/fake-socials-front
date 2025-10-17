import "./layout.css";
import Image from "next/image";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="auth-page">
      <div className="form-side">{children}</div>
      <div className="art-side">
        <p>Fake Socials</p>
        <p>
          Your network, <span>redefined</span>.
        </p>

        <Image src="https://placehold.co/600x400" alt="" width={0} height={0} />
      </div>
    </div>
  );
};

export default layout;
