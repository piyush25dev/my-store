export function BackgroundDecorations() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-r from-rose-50/40 to-amber-50/40 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r from-blue-50/40 to-cyan-50/40 blur-3xl" />
    </div>
  );
}