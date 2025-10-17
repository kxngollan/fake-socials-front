'use client'
import { useRouter } from "next/navigation";

const Page = () => {
  const route = useRouter();
  route.push("/p/home")
  return null;
};

export default Page;