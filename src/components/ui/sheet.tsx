import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export function SheetContent({
  className,
  children,
  side = "left",
}: {
  className?: string;
  children: React.ReactNode;
  side?: "left" | "right";
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-bg/70" />
      <Dialog.Content
        className={cn(
          "fixed z-50 flex h-full w-[min(20rem,88vw)] flex-col border-border bg-surface p-4 shadow-panel",
          side === "left" ? "inset-y-0 left-0 border-r" : "inset-y-0 right-0 border-l",
          className,
        )}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
