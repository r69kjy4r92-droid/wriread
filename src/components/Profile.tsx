import React from "react";
import { CARD, cx, Button, GhostButton, Pill, num } from "./ui";
import type { WorkItem } from "../data";

type ProfileProps = {
  t: any;
  items: WorkItem[];
  favorites: string[];
  likedIds: string[];
  commentCounts: Record<string, number>;
  stats: {
    totalLikes: number;
    totalDonations: number;
  };
  ratingScore: number;
  userName: string | null;
  profileBio: string;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onOpen: (item: WorkItem) => void;
  onLike: (item: WorkItem) => void;
};

export const Profile: React.FC<ProfileProps> = (props) => {
  const {
    t,
    items,
    favorites,
    likedIds,
    commentCounts,
    stats,
    ratingScore,
    userName,
    profileBio,
    onDelete,
    onEdit,
    onOpen,
    onLike,
  } = props;

  // Все работы текущего автора (пока считаем один автор = весь список)
  const authoredWorks = items;
  const postsCount = authoredWorks.length;

  // Автор залогинен, если есть имя
  const isSignedIn = !!(userName && userName.trim().length > 0);
  const loginLabel = t.login || t.signIn || "Войти";
  const displayName = isSignedIn ? userName!.trim() : loginLabel;

  const balance = stats.totalDonations;

  return (
    <section className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* ==== Большой верхний блок профиля ==== */}
      <div className={cx(CARD, "p-4 sm:p-5 flex flex-col gap-4")}>
        {/* Аватар + имя + роль */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center text-2xl">
              🖋️
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-base sm:text-lg font-semibold truncate">
              {displayName}
            </div>
            <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              {t.profileRoleAuthor}
            </div>
          </div>
        </div>

        {/* О себе */}
        <div className="mt-1">
          <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
            {t.profileAboutTitle}
          </div>
          <p className="mt-1 text-sm sm:text-[15px] text-neutral-700 dark:text-neutral-200 leading-snug">
            {profileBio || t.profileAboutText}
          </p>
        </div>

        {/* Баланс + рейтинг + статистика + кнопки */}
        <div className="pt-3 sm:pt-4 border-t border-neutral-800/40 dark:border-neutral-700/60 flex flex-col gap-3 sm:gap-4">
          {/* Баланс */}
          <div>
            <div className="text-sm text-neutral-400 dark:text-neutral-400">
              {t.yourBalance}
            </div>
            <div className="mt-1 text-3xl font-bold">
              ${num(balance)}
            </div>
          </div>

          {/* Рейтинг */}
          <div>
            <div className="text-sm text-neutral-400 dark:text-neutral-400">
              {t.authorRating}
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {num(ratingScore)}
            </div>
          </div>

          {/* Общая статистика */}
          <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            {t.totalLikes}: {num(stats.totalLikes)} · {t.totalDonations}:{" "}
            {num(stats.totalDonations)}
          </div>

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row gap-2 mt-1 sm:mt-2">
            <Button className="w-full sm:w-auto text-sm py-2">
              {t.withdraw}
            </Button>
            <GhostButton className="w-full sm:w-auto text-sm py-2">
              {t.history}
            </GhostButton>
          </div>
        </div>
      </div>

      {/* ==== Список публикаций автора ==== */}
      <div className="mt-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3">
          {t.posts}
          <span className="text-xs sm:text-sm font-normal text-neutral-500 dark:text-neutral-400">
            {" "}
            · {postsCount}
          </span>
        </h2>

        {authoredWorks.length === 0 ? (
          <div
            className={cx(
              CARD,
              "p-4 text-sm text-neutral-500 dark:text-neutral-400"
            )}
          >
            {t.emptyWork}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {authoredWorks.map((w) => {
              const isFav = favorites.includes(w.id);
              const isLiked = likedIds.includes(w.id);
              const commentsForWork = commentCounts[w.id] ?? 0;

              return (
                <div
                  key={w.id}
                  className={cx(
                    CARD,
                    "p-4 sm:p-5 flex flex-col gap-3 sm:gap-4"
                  )}
                >
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {/* Обложка — скрыта на очень маленьких экранах */}
                    <div className="hidden sm:block w-28 h-20 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex-shrink-0">
                      {w.cover && (
                        <img
                          src={w.cover}
                          alt={w.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-semibold truncate">
                          {w.title}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {w.genre} · {w.date}
                        </div>
                      </div>

                      {/* Реакции: ❤ ★ 💬 */}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <Pill>
                          <button
                            type="button"
                            onClick={() => onLike(w)}
                            className="inline-flex items-center gap-1 focus:outline-none"
                          >
                            <span
                              className={cx(
                                "text-sm",
                                isLiked ? "text-rose-500" : "text-neutral-400"
                              )}
                            >
                              {isLiked ? "❤" : "♡"}
                            </span>
                            <span className="text-xs">
                              {num(w.likes)}
                            </span>
                          </button>
                        </Pill>

                        <Pill>
                          <span className="inline-flex items-center gap-1 text-xs">
                            {isFav ? "⭐" : "☆"}
                            <span>{num(w.donations ?? 0)}</span>
                          </span>
                        </Pill>

                        <Pill>
                          <span className="inline-flex items-center gap-1 text-xs">
                            💬
                            <span>{num(commentsForWork)}</span>
                          </span>
                        </Pill>
                      </div>
                    </div>
                  </div>

                  {/* Кнопки действий */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        className="text-xs sm:text-sm px-3 py-1.5"
                        onClick={() => onOpen(w)}
                      >
                        {t.cta_read}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <GhostButton
                        className="text-xs sm:text-sm px-3 py-1.5"
                        onClick={() => onEdit(w.id)}
                      >
                        {t.edit}
                      </GhostButton>
                      <GhostButton
                        className="text-xs sm:text-sm px-3 py-1.5 text-red-500 hover:text-red-600"
                        onClick={() => onDelete(w.id)}
                      >
                        {t.deleteLabel ?? "Удалить"}
                      </GhostButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
