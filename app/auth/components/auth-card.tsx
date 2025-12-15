import { cn } from "../../components/ui/utils";

export function AuthCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
