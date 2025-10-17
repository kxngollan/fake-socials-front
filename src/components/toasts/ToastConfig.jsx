import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastConfig = () => {
  return (
    <ToastContainer limit={5} autoClose={1800} draggable theme="colored" />
  );
};

export default ToastConfig;
