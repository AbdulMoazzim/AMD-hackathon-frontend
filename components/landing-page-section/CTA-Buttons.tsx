import Link from "next/link";
import { Button } from "../ui/button";

export function CtaButtons() {
  return (
    <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:justify-center">
      <Button aschild="true" className="px-5 py-">
        <Link href="/symptoms">Describe my symptoms</Link>
      </Button>
      <Button aschild="true" variant="outline" className="px-5 py-" >
        <Link href="/documents">Understand my document</Link>
      </Button>
    </div>
  );
}