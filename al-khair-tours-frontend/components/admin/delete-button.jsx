"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteButton({ action, confirmText = "Delete this item? This cannot be undone." }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={isPending}
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      onClick={() => {
        if (confirm(confirmText)) {
          startTransition(() => {
            action();
          });
        }
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
