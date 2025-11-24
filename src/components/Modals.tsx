import React, { useEffect, useState } from "react";
import { CARD, cx, Button, GhostButton } from "./ui";
import { GENRE_KEYS, genreLabel, type GenreKey } from "../i18n";
import type { WorkItem } from "../data";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:items-center bg-black/40">
      <div
        className={cx(
          "w-full max-w-lg",
          CARD,
          isMobile
            ? "fixed bottom-0 left-0 right-0 rounded-b-none max-h-[85vh]"
            : "max-h-[90vh]"
        )}
      >
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur rounded-t-2xl">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h:[70vh] sm:max-h-[65vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

type DonateModalProps = {
  open: boolean;
  onClose: () => void;
  t: any;
  item: WorkItem | null;
};

export const DonateModal: React.FC<DonateModalProps> = ({
  open,
  onClose,
  t,
  item,
}) => {
  const [amount, setAmount] = useState(5);
  if (!open || !item) return null;

  return (
    <Modal open={open} onClose={onClose} title={`${t.donate}: ${item.title}`}>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {[3, 5, 10, 20].map((v) => (
          <GhostButton key={v} onClick={() => setAmount(v)}>
            {`$${v}`}
          </GhostButton>
        ))}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="number"
          value={amount}
          onChange={(e) =>
            setAmount(parseFloat(e.target.value || "0") || 0)
          }
          className="w-32 px-3 py-2 border rounded-xl dark:bg-neutral-900 dark:border-neutral-700 text-sm"
        />
        <Button onClick={onClose}>{t.pay}</Button>
        <GhostButton onClick={onClose}>{t.cancel}</GhostButton>
      </div>
      <p className="text-xs text-neutral-500 mt-3">{t.mockPaymentNote}</p>
    </Modal>
  );
};

type ListenModalProps = {
  open: boolean;
  onClose: () => void;
  t: any;
  item: WorkItem | null;
};

export const ListenModal: React.FC<ListenModalProps> = ({
  open,
  onClose,
  t,
  item,
}) => {
  if (!open || !item) return null;
  return (
    <Modal open={open} onClose={onClose} title={`${t.listen}: ${item.title}`}>
      {item.audioUrl ? (
        <audio controls className="w-full" src={item.audioUrl ?? ""} />
      ) : (
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          {t.audioUnavailable}
        </p>
      )}
      <div className="mt-4 flex gap-3">
        <GhostButton onClick={onClose}>{t.cancel}</GhostButton>
      </div>
    </Modal>
  );
};

type EditWorkModalProps = {
  open: boolean;
  onClose: () => void;
  t: any;
  lang: string;
  item: WorkItem | null;
  onSave: (item: WorkItem) => void;
};

export const EditWorkModal: React.FC<EditWorkModalProps> = ({
  open,
  onClose,
  t,
  lang,
  item,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState<GenreKey>("poetry");
  const [excerpt, setExcerpt] = useState("");

  useEffect(() => {
    if (item && open) {
      setTitle(item.title);
      setGenre((item.genre as GenreKey) || "poetry");
      setExcerpt(item.excerpt || "");
    }
  }, [item, open]);

  if (!open || !item) return null;

  const isMusic = genre === "music";

  const handleSave = () => {
    onSave({
      ...item,
      title,
      genre,
      excerpt: isMusic ? "" : excerpt,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={t.edit}>
      <div className="flex flex-col gap-3">
        <div>
          <label className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
            {t.title}
          </label>
          <input
            className="w-full mt-1 px-3 py-2 text-[15px] border rounded-2xl dark:bg-neutral-900 dark:border-neutral-700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
            {t.genre}
          </label>
          <select
            className="w-full mt-1 px-3 py-2 text-[15px] border rounded-2xl dark:bg-neutral-900 dark:border-neutral-700"
            value={genre}
            onChange={(e) => setGenre(e.target.value as GenreKey)}
          >
            {GENRE_KEYS.map((g) => (
              <option key={g} value={g}>
                {genreLabel(lang, g as GenreKey)}
              </option>
            ))}
          </select>
        </div>

        {!isMusic && (
          <div>
            <label className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
              {t.text}
            </label>
            <textarea
              rows={4}
              className="w-full mt-1 px-3 py-2 text-[15px] border rounded-2xl dark:bg-neutral-900 dark:border-neutral-700"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder={t.startWriting}
            />
          </div>
        )}

        <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:justify-end">
          <GhostButton onClick={onClose} className="w-full sm:w-auto">
            {t.cancel}
          </GhostButton>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            {t.save}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
