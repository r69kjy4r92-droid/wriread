import React, { useState } from "react";
import { CARD, RADIUS, cx, Button, GhostButton } from "./ui";
import type { WorkItem } from "../data";

function formatCommentDate(raw: string): string {
  // Пытаемся распарсить дату
  const date = new Date(raw);
  if (isNaN(date.getTime())) {
    // Если не получилось (старый формат) — показываем как есть
    return raw;
  }

  const now = new Date();

  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const time = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (sameDay) {
    // Сегодня — показываем только время
    return time;
  }

  const dateStr = date.toLocaleDateString();

  // Вчера и более старые даты — дата + время
  return `${dateStr} ${time}`;
}

// Локальный тип комментария, совместимый с тем, что в App.tsx
type WorkComment = {
  id: string;
  workId: string;
  text: string;
  createdAt: string;
};

type WorkProps = {
  t: any;
  item: WorkItem | null;
  onDonate: (item: WorkItem) => void;
  onBack: () => void;
  comments: WorkComment[];
  onAddComment: (text: string) => void;
  onDeleteComment: (commentId: string) => void;
  isFollowing: boolean;
  onToggleFollow: () => void;
};

export const Work: React.FC<WorkProps> = ({
  t,
  item,
  onDonate,
  onBack,
  comments,
  onAddComment,
  onDeleteComment,
  isFollowing,
  onToggleFollow,
}) => {
  const [commentText, setCommentText] = useState("");

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-neutral-600 dark:text-neutral-300">
        {t.emptyWork}
      </div>
    );
  }

  const handleSubmitComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;

    onAddComment(trimmed);
    setCommentText("");
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-3 flex items-center justify-between gap-2">
        <GhostButton onClick={onBack} className="px-3 py-1.5 text-sm">
          ← {t.back}
        </GhostButton>
      </div>

      <div className={CARD}>
        <img
          src={item.cover}
          className={cx("w-full aspect-[3/2] object-cover", RADIUS)}
        />
        <div className="p-5">
          <h1 className="text-2xl font-bold">{item.title}</h1>
          <div className="mt-1 flex items-center justify-between gap-3">
            <div className="text-sm text-neutral-600 dark:text-neutral-300">
              {t.byAuthor} {item.author} · {item.genre} · {item.date}
            </div>
            <button
              type="button"
              onClick={onToggleFollow}
              className={cx(
                "px-3 py-1 text-xs sm:text-sm rounded-full border transition",
                isFollowing
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              )}
            >
              {isFollowing ? "Вы подписаны" : "Подписаться"}
            </button>
          </div>

          {!item.audioUrl && (
            <p className="mt-4 text-neutral-800 dark:text-neutral-100">
              <strong>{t.excerpt}:</strong> {item.excerpt}
            </p>
          )}

          {item.audioUrl && (
            <div className="mt-4">
              <audio controls className="w-full" src={item.audioUrl ?? ""} />
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <GhostButton onClick={() => onDonate(item)}>
              {t.donate}
            </GhostButton>
            <GhostButton>{t.share}</GhostButton>
          </div>

          {/* Блок комментариев */}
          <div className="mt-6 pt-5 border-t border-neutral-200 dark:border-neutral-800">
            <h2 className="text-lg font-semibold mb-3">
              {t.commentsTitle}
            </h2>

            <div className="flex flex-col gap-3 mb-4">
              <textarea
                className="w-full px-3 py-2 text-[15px] border rounded-2xl dark:bg-neutral-900 dark:border-neutral-700"
                placeholder={t.commentPlaceholder}
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  className="px-6 py-2 text-sm sm:text-base"
                  onClick={handleSubmitComment}
                >
                  {t.sendComment}
                </Button>
              </div>
            </div>

            {comments.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {t.noCommentsYet}
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className="px-3 py-2 rounded-2xl bg-neutral-900/40 border border-neutral-800"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="text-xs text-neutral-500">
                        {formatCommentDate(c.createdAt)}
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteComment(c.id)}
                        className="text-xs text-neutral-500 hover:text-red-400 transition"
                        title={t.deleteComment || "Удалить комментарий"}
                      >
                        🗑
                      </button>
                    </div>
                    <div>{c.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
