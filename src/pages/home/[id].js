import HomePage from "@/components/HomeComponent";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { id } = router.query;

  return <HomePage id={id} />;
}
