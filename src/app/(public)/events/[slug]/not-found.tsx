import Link from "next/link";
import React from "react";
import { ArrowLeft, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function EventNotFound(): React.JSX.Element {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <div className="border-border/80 bg-card/80 w-full max-w-md space-y-6 rounded-3xl border p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="bg-muted text-muted-foreground mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
          <SearchX className="size-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-foreground text-2xl font-extrabold tracking-tight">
            Event Not Found
          </h1>
          <p className="text-muted-foreground text-sm">
            The event you are looking for does not exist, has been removed, or is currently
            unpublished.
          </p>
        </div>
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-primary-foreground w-full font-semibold"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 size-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
