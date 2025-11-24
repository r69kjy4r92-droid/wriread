import React from "react";
import { CARD, cx, num, Button, GhostButton } from "./ui";
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
  onToggleFavorite: (item: WorkItem) => void;
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
  onToggleFavorite,
  onLike,
}) => (
  <section className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
    <div className="grid md:grid-cols-3 gap-5">
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
        <div className="mt-1 text-3xl font-extrabold">$ 124.50</div>

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

      <div className={cx(CARD, "p-5 md:col-span-2")}>
        <div className="flex items-center justify-between mb-3 gap-2">
          <h3 className="font-semibold">{t.posts}</h3>
          <span className="text-xs text-neutral-500">
            {t.favorites}: {favorites.length}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((w) => {
            const isFav = favorites.includes(w.id);
            const isLiked = likedIds.includes(w.id);
            const baseComments = (w as any).comments ?? 0;
            const totalComments =
              baseComments + (commentCounts[w.id] ?? 0);

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
                  <div>
                    <div className="font-medium flex items-center gap-1">
                      {w.title}
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
                      <button
                        type="button"
                        onClick={() => onLike(w)}
                        className="inline-flex items-center gap-0.5"
                      >
                        <span
                          className={cx(
                            isLiked
                              ? "text-rose-500"
                              : "text-neutral-400"
                          )}
                        >
                          {isLiked ? "❤" : "♡"}
                        </span>
                        <span>{num(w.likes)}</span>
                      </button>
                      {totalComments > 0 && (
                        <>
                          {" · "}💬 {num(totalComments)}
                        </>
                      )}
                      {" · "}★ {num(w.donations)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={() => onToggleFavorite(w)}
                      className={cx(
                        "text-lg leading-none",
                        isFav ? "text-rose-500" : "text-neutral-400"
                      )}
                      title={
                        isFav
                          ? t.removeFromFavorites
                          : t.addToFavorites
                      }
                    >
                      {isFav ? "❤" : "♡"}
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
      </div>
    </div>
  </section>
);
