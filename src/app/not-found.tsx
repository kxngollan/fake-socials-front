import { IconZoomExclamation } from "@tabler/icons-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="">
      <div className="error-404">
        <IconZoomExclamation size={100} />
        <h1>404 Page not found</h1>
        <p>
          Lost in the digital wilderness? This page {"couldn't"} find its way
          either.
        </p>
        <Link href="/">Return Home</Link>
      </div>
    </div>
  );
}
