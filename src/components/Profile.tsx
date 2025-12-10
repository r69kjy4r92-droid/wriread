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
  profileBirthdate?: string;
  profileGender?: string;
  profileEmail?: string;
  profileSocials?: string;
  profileAvatarUrl?: string | null;
  followingCount: number;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onOpen: (item: WorkItem) => void;
  onLike: (item: WorkItem) => void;
  onEditProfile: () => void;
};

export const Profile: React.FC<ProfileProps> = ({
  t,
  items,
  favorites,
  likedIds,
  commentCounts,
  stats,
  ratingScore,
  userName,
  profileBio,
  profileBirthdate,
  profileGender,
  profileEmail,
  profileSocials,
  profileAvatarUrl,
  followingCount,
  onDelete,
  onEdit,
  onOpen,
  onLike,
  onEditProfile,
}) => {
  const authoredWorks = items;
  const postsCount = authoredWorks.length;

  const isSignedIn = !!userName;
  const loginLabel = t.login || t.signIn || "Войти";
  const displayName = isSignedIn ? userName! : loginLabel;
  const aboutText =
    profileBio && profileBio.trim().length > 0
      ? profileBio
      : t.profileAboutText;

  const balance = stats.totalDonations;

  return (
    <section className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* ==== Верхний блок: профиль + рейтинг + баланс ==== */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Левая колонка: аватар + имя + О себе + доп. поля */}
        <div className={cx(CARD, "flex-1 p-4 sm:p-5")}>
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
            {/* Аватар */}
            <div className="flex-shrink-0">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center overflow-hidden">
                {profileAvatarUrl ? (
                  <img
                    src={profileAvatarUrl}
                    alt={displayName || "Avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">🖋️</span>
                )}
              </div>
            </div>

            {/* Имя / роль / кнопка редактирования */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-base sm:text-lg font-semibold truncate">
                    {displayName}
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {t.profileRoleAuthor}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <Button
                    className="px-4 py-1.5 text-xs sm:text-sm w-full sm:w-auto"
                    onClick={onEditProfile}
                  >
                    {t.edit}
                  </Button>
                </div>
              </div>

              {/* О себе */}
              <div className="mt-3 sm:mt-4">
                <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                  {t.profileAboutTitle}
                </div>
                <p className="mt-1 text-sm sm:text-[15px] text-neutral-700 dark:text-neutral-200 leading-snug whitespace-pre-line">
                  {aboutText}
                </p>
              </div>

              {/* Дополнительные поля: ДР, пол, email, соцсети */}
              {(profileBirthdate ||
                profileGender ||
                profileEmail ||
                profileSocials) && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                  {profileBirthdate && (
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {t.profileBirthdateLabel}:
                      </span>
                      <span className="truncate">{profileBirthdate}</span>
                    </div>
                  )}
                  {profileGender && (
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {t.profileGenderLabel}:
                      </span>
                      <span className="truncate">{profileGender}</span>
                    </div>
                  )}
                  {profileEmail && (
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {t.profileEmailLabel}:
                      </span>
                      <a
                        href={`mailto:${profileEmail}`}
                        className="truncate underline decoration-dotted"
                      >
                        {profileEmail}
                      </a>
                    </div>
                  )}
                  {profileSocials && (
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {t.profileSocialsLabel}:
                      </span>
                      <a
                        href={profileSocials}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate underline decoration-dotted"
                      >
                        {profileSocials}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Подписки */}
              {followingCount > 0 && (
                <div className="mt-3 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                  {t.following}: {followingCount}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Правая колонка: рейтинг + баланс */}
        <div className="md:w-72 flex flex-col gap-4">
          {/* Рейтинг автора */}
          <div className={cx(CARD, "p-4 sm:p-5")}>
            <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
              {t.authorRating}
            </div>
            <div className="mt-2 text-2xl font-bold">{num(ratingScore)}</div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div>
                <div className="text-neutral-500 dark:text-neutral-400">
                  {t.totalLikes}
                </div>
                <div className="font-semibold">{num(stats.totalLikes)}</div>
              </div>
              <div>
                <div className="text-neutral-500 dark:text-neutral-400">
                  {t.totalDonations}
                </div>
                <div className="font-semibold">
                  {num(stats.totalDonations)}
                </div>
              </div>
              <div>
                <div className="text-neutral-500 dark:text-neutral-400">
                  {t.posts}
                </div>
                <div className="font-semibold">{postsCount}</div>
              </div>
            </div>
          </div>

          {/* Баланс */}
          <div className={cx(CARD, "p-4 sm:p-5 flex flex-col gap-3")}>
            <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
              {t.yourBalance}
            </div>
            <div className="text-2xl font-bold">${num(balance)}</div>
            <div className="flex flex-col sm:flex-row gap-2 mt-1">
              <Button className="w-full sm:w-auto text-sm py-2">
                {t.withdraw}
              </Button>
              <GhostButton className="w-full sm:w-auto text-sm py-2">
                {t.history}
              </GhostButton>
            </div>
          </div>
        </div>
      </div>

      {/* ==== Список публикаций автора ==== */}
      <div className="mt-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3">
          {t.posts}
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
                                isLiked
                                  ? "text-rose-500"
                                  : "text-neutral-400"
                              )}
                            >
                              {isLiked ? "❤" : "♡"}
                            </span>
                            <span className="text-xs">{num(w.likes)}</span>
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
                        {t.deleteLabel}
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
