import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-6">
      <h2 className="text-4xl font-bold text-slate-900 mb-4">404</h2>
      <p className="text-lg text-slate-600 mb-2">Page not found</p>
      <p className="text-sm text-slate-500 mb-6 text-center max-w-md">
        The page you are looking for does not exist.
      </p>
      <Button asChild>
        <Link href="/">Go home</Link>
      </Button>
    </div>
  );
}
