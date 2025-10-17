import { DotLoader, RotateLoader } from "react-spinners";
import "./Loader.css";

const Loader = ({ loading, loaderType = "dot", color = "white" }) => {
  if (loaderType == "rotate")
    return (
      <RotateLoader
        className="loader"
        aria-label="Loading spinner"
        loading={loading || false}
        color={color}
        size={"11"}
      />
    );

  if (loaderType == "dot")
    return (
      <DotLoader
        className="loader"
        aria-label="Loading spinner"
        loading={loading || false}
        color={color}
        size={25}
      />
    );
};

export default Loader;
