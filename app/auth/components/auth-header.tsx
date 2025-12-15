export function AuthHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        {title}
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        {description}
      </p>
    </div>
  );
}
