import React, { useState } from "react";
import { CARD, RADIUS, cx, Button, GhostButton } from "./ui";
import type { WorkItem } from "../data";

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
};

export const Work: React.FC<WorkProps> = ({
  t,
  item,
  onDonate,
  onBack,
  comments,
  onAddComment,
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
          <div className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
            {t.byAuthor} {item.author} · {item.genre} · {item.date}
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
                    <div className="text-xs text-neutral-500 mb-1">
                      {c.createdAt}
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
