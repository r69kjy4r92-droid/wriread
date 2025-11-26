import React, { useState } from "react";
import { CARD, cx, Button, GhostButton, num } from "./ui";
import type { WorkItem } from "../data";

type ProfileProps = {
  t: any;
  items: WorkItem[];
  favorites: string[];
  likedIds: string[];
  commentCounts: Record<string, number>;
  stats: { totalLikes: number; totalDonations: number };
  ratingScore: number;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onOpen: (item: WorkItem) => void;
  onLike: (item: WorkItem) => void;
};

export const Profile: React.FC<ProfileProps> = ({
  t,
  items,
  favorites,
  likedIds,
  commentCounts,
  stats,
  ratingScore,
  onDelete,
  onEdit,
  onOpen,
  onLike,
}) => {
  const [tab, setTab] = useState<"all" | "favorites">("all");

  const visibleItems =
    tab === "favorites"
      ? items.filter((w) => favorites.includes(w.id))
      : items;

  return (
    <section className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="grid md:grid-cols-3 gap-5">
        {/* Левая карточка с балансом и рейтингом */}
        <div className={cx(CARD, "p-5")}>
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 bg-gradient-to-br from-amber-300 to-rose-300 rounded-2xl" />
            <div>
              <div className="font-semibold">Михаил</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-300">
                Автор
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">
            {t.yourBalance}
          </div>
          <div className="mt-1 text-3xl font-extrabold">
            $ {num(Math.round(stats.totalDonations))}
          </div>

          <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">
            {t.authorRating}
          </div>
          <div className="mt-1 text-2xl font-semibold">
            {num(ratingScore)}
          </div>
          <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            {t.totalLikes}: {num(stats.totalLikes)} · {t.totalDonations}:{" "}
            {num(stats.totalDonations)}
          </div>

          <div className="mt-4 flex gap-2">
            <Button className="px-4 py-2 text-sm">{t.withdraw}</Button>
            <GhostButton>{t.history}</GhostButton>
          </div>
        </div>

        {/* Правая часть: сетка работ + вкладки */}
        <div className={cx(CARD, "p-5 md:col-span-2")}>
          <div className="flex items-center justify-between mb-3 gap-2">
            <h3 className="font-semibold">{t.posts}</h3>
            <span className="text-xs text-neutral-500">
              {t.favorites}: {favorites.length}
            </span>
          </div>

          {/* Вкладки "Все работы" / "Избранное" */}
          <div className="mb-4 flex gap-2 text-xs sm:text-sm">
            <button
              onClick={() => setTab("all")}
              className={cx(
                "px-3 py-1.5 rounded-full border",
                tab === "all"
                  ? "bg-neutral-900 text-white border-neutral-900 dark:bg-amber-400 dark:text-neutral-900 dark:border-amber-400"
                  : "bg-white hover:bg-neutral-50 border-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
              )}
            >
              Все работы
            </button>
            <button
              onClick={() => setTab("favorites")}
              className={cx(
                "px-3 py-1.5 rounded-full border",
                tab === "favorites"
                  ? "bg-neutral-900 text-white border-neutral-900 dark:bg-amber-400 dark:text-neutral-900 dark:border-amber-400"
                  : "bg-white hover:bg-neutral-50 border-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
              )}
            >
              ★ Избранное
            </button>
          </div>

          {visibleItems.length === 0 ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {tab === "favorites"
                ? "В избранном пока нет публикаций."
                : "Публикации ещё не созданы."}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {visibleItems.map((w) => {
                const isFav = favorites.includes(w.id);
                const isLiked = likedIds.includes(w.id);
                const commentsCount = commentCounts[w.id] ?? 0;

                return (
                  <div
                    key={w.id}
                    className="border rounded-xl overflow-hidden dark:border-neutral-700"
                  >
                    <button
                      onClick={() => onOpen(w)}
                      className="block w-full text-left"
                    >
                      <img
                        src={w.cover}
                        className="w-full aspect-[3/2] object-cover"
                        loading="lazy"
                      />
                    </button>
                    <div className="p-3 flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium flex items-center gap-1 truncate">
                          {w.title}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                          <span
                            className={cx(
                              "flex items-center gap-1",
                              isLiked && "text-rose-500"
                            )}
                          >
                            ❤ {num(w.likes)}
                          </span>
                          <span className="flex items-center gap-1">
                            💬 {num(commentsCount)}
                          </span>
                          <span
                            className={cx(
                              "flex items-center gap-1",
                              isFav && "text-amber-500"
                            )}
                          >
                            ★ {num(w.donations ?? 0)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-2">
                        <button
                          onClick={() => onLike(w)}
                          className={cx(
                            "text-lg leading-none",
                            isLiked ? "text-rose-500" : "text-neutral-400"
                          )}
                          title={
                            isLiked ? "Убрать лайк" : "Поставить лайк"
                          }
                        >
                          {isLiked ? "❤" : "♡"}
                        </button>
                        <button
                          onClick={() => onEdit(w.id)}
                          className="text-xs text-neutral-400 hover:text-amber-500 transition"
                          title={t.edit}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => onDelete(w.id)}
                          className="text-xs text-neutral-400 hover:text-red-500 transition"
                          title="Delete"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
