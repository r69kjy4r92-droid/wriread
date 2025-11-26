import React, { useMemo, useState } from "react";
import { GENRE_KEYS, genreLabel, type GenreKey } from "../i18n";
import { type WorkItem } from "../data";
import {
  CARD,
  RADIUS,
  cx,
  num,
  Button,
  GhostButton,
  Pill,
} from "./ui";

type WorkCardProps = {
  t: any;
  item: WorkItem;
  isFavorite: boolean;
  isLiked: boolean;
  commentsCount: number;
  onOpen: (item: WorkItem) => void;
  onDonate: (item: WorkItem) => void;
  onBoost: (item: WorkItem) => void;
  onListen: (item: WorkItem) => void;
  onToggleFavorite: (item: WorkItem) => void;
  onLike: (item: WorkItem) => void;
};

const WorkCard: React.FC<WorkCardProps> = ({
  t,
  item,
  isFavorite,
  isLiked,
  commentsCount,
  onOpen,
  onDonate,
  onBoost,
  onListen,
  onToggleFavorite,
  onLike,
}) => {
  const baseComments = (item as any).comments ?? 0;
  const totalComments = baseComments + commentsCount;

  

  return (
    <div
      className={cx(
        CARD,
        "transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-15px_rgba(0,0,0,0.40)]"
      )}
    >
      <div className={cx("relative", RADIUS)}>
        <img
          src={item.cover}
          alt="cover"
          className={cx("w-full aspect-[3/2] object-cover", RADIUS)}
        />
        {item.promo && (
          <div className="absolute left-3 top-3">
            <span className="text-xs font-bold text-white px-2 py-1 rounded-full bg-amber-500/90 border border-white/40">
              {t.promoted}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold leading-tight">
              {item.title}
            </h3>
            <div className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              {t.byAuthor} {item.author} · {item.genre} · {item.date}
            </div>
          </div>

          <div className="flex gap-2 shrink-0 items-center">
            {/* Лайки */}
            <button
              type="button"
              onClick={() => onLike(item)}
              className="focus:outline-none"
            >
              <Pill>
                <span
                  className={cx(
                    "inline-flex items-center",
                    isLiked ? "text-rose-500" : "text-neutral-400"
                  )}
                >
                  {isLiked ? "❤" : "♡"}
                  <span className="ml-1">{num(item.likes)}</span>
                </span>
              </Pill>
            </button>

          {/* Комментарии */}
          <button
            type="button"
            onClick={() => onOpen(item)}
            className="focus:outline-none"
          >
            <Pill>
              💬
              {totalComments > 0 && <> {num(totalComments)}</>}
            </Pill>
          </button>

           {/* Избранное (звезда) + счётчик донатов */}
            <button
              type="button"
              onClick={() => onToggleFavorite(item)}
              className="focus:outline-none"
            >
              <Pill>
                {isFavorite ? "⭐" : "☆"} {num(item.donations)}
              </Pill>
            </button>
          </div>
        </div>

        <p className="text-neutral-700 dark:text-neutral-200 mt-3 line-clamp-2">
          {item.excerpt}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {item.genre === "music" ? (
            <>
              {item.audioUrl && (
                <Button
                  onClick={() => onListen(item)}
                  className="px-4 py-2 text-sm"
                >
                  {t.listen}
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                onClick={() => onOpen(item)}
                className="px-4 py-2 text-sm"
              >
                {t.cta_read}
              </Button>
              {item.audioUrl && (
                <GhostButton onClick={() => onListen(item)}>
                  {t.listen}
                </GhostButton>
              )}
            </>
          )}

          <GhostButton onClick={() => onDonate(item)}>
            {t.donate}
          </GhostButton>
          <GhostButton onClick={() => onBoost(item)}>
            {t.boost}
          </GhostButton>
        </div>
      </div>
    </div>
  );
};

type TabsProps = {
  tabs: { k: string; label: string }[];
  current: string;
  onChange: (k: string) => void;
};

const Tabs: React.FC<TabsProps> = ({ tabs, current, onChange }) => (
  <div className="flex gap-2 overflow-x-auto sm:overflow-visible -mx-1 px-1">
    {tabs.map((t) => (
      <button
        key={t.k}
        onClick={() => onChange(t.k)}
        className={cx(
          "px-3 py-1.5 text-xs sm:text-sm font-medium whitespace-nowrap",
          RADIUS,
          "border",
          current === t.k
            ? "bg-white border-amber-300 text-amber-700 dark:bg-neutral-900"
            : "bg-white hover:bg-neutral-50 border-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
        )}
      >
        {t.label}
      </button>
    ))}
  </div>
);

type FeedProps = {
  t: any;
  lang: string;
  items: WorkItem[];
  favoriteIds: string[];
  likedIds: string[];
  commentCounts: Record<string, number>;
  followedAuthors: string[];
  onOpen: (item: WorkItem) => void;
  onDonate: (item: WorkItem) => void;
  onBoost: (item: WorkItem) => void;
  onListen: (item: WorkItem) => void;
  onToggleFavorite: (item: WorkItem) => void;
  onLike: (item: WorkItem) => void;
};

export const Feed: React.FC<FeedProps> = ({
  t,
  lang,
  items,
  favoriteIds,
  likedIds,
  commentCounts,
  followedAuthors,
  onOpen,
  onDonate,
  onBoost,
  onListen,
  onToggleFavorite,
  onLike,
}) => {
  const [tab, setTab] = useState("top");
  const [filterOpen, setFilterOpen] = useState(false);
  const [genreFilter, setGenreFilter] = useState<GenreKey | "all">("all");
  const [onlyPromo, setOnlyPromo] = useState(false);

  const tabs = [
    { k: "top", label: t.top },
    { k: "new", label: t.new },
    { k: "following", label: t.following },
    { k: "favorites", label: "★ Избранное" },
  ];

  const hasActiveFilter = genreFilter !== "all" || onlyPromo;

    const filteredItems = useMemo(() => {
    let arr = [...items];

    if (tab === "new") arr = [...items].reverse();
    if (tab === "following") {
      arr = items.filter((w) => followedAuthors.includes(w.author));
    }
    if (tab === "favorites") {
      arr = arr.filter((w) => favoriteIds.includes(w.id));
    }

    if (genreFilter !== "all") {
      arr = arr.filter((w) => w.genre === genreFilter);
    }
    if (onlyPromo) {
      arr = arr.filter((w) => w.promo);
    }
    return arr;
  }, [items, tab, genreFilter, onlyPromo, favoriteIds, followedAuthors]);

  const handleClearFilters = () => {
    setGenreFilter("all");
    setOnlyPromo(false);
  };

  return (
    <section className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <Tabs tabs={tabs} current={tab} onChange={setTab} />
        <div className="flex-shrink-0">
          <GhostButton onClick={() => setFilterOpen((o) => !o)}>
            {t.filters}
            {hasActiveFilter && (
              <span className="ml-1 text-amber-500">●</span>
            )}
          </GhostButton>
        </div>
      </div>

      {filterOpen && (
        <div className={cx(CARD, "mb-4 p-4 flex flex-wrap gap-4 items-center")}>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-neutral-500">{t.genre}</span>
            <select
              className="px-3 py-2 border rounded-xl text-sm dark:bg-neutral-900 dark:border-neutral-700"
              value={genreFilter}
              onChange={(e) =>
                setGenreFilter(e.target.value as GenreKey | "all")
              }
            >
              <option value="all">{t.allGenres}</option>
              {GENRE_KEYS.map((g) => (
                <option key={g} value={g}>
                  {genreLabel(lang, g as GenreKey)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={onlyPromo}
                onChange={(e) => setOnlyPromo(e.target.checked)}
              />
              <span>{t.onlyPromoted}</span>
            </label>
          </div>

          <div className="ml-auto">
            <GhostButton onClick={handleClearFilters}>
              {t.clearFilters}
            </GhostButton>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <WorkCard
            key={item.id}
            t={t}
            item={item}
            isFavorite={favoriteIds.includes(item.id)}
            isLiked={likedIds.includes(item.id)}
            commentsCount={commentCounts[item.id] ?? 0}
            onOpen={onOpen}
            onDonate={onDonate}
            onBoost={onBoost}
            onListen={onListen}
            onToggleFavorite={onToggleFavorite}
            onLike={onLike}
          />
        ))}
      </div>
    </section>
  );
};
