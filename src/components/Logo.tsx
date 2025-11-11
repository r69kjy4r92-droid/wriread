type LogoProps = {
  compact?: boolean;
};

export function Logo({ compact }: LogoProps) {
  return (
    <div className="inline-flex items-center gap-2">
      {/* Иконка-стикер */}
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500 shadow-md transform -rotate-6">
        <span className="text-lg font-black text-white leading-none">W</span>
      </div>

      {/* Текстовая часть: только WriRead, без слогана */}
      {!compact && (
        <span className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          WriRead
        </span>
      )}
    </div>
  );
}
