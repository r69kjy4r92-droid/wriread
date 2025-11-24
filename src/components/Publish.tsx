import React, { useState } from "react";
import { GENRE_KEYS, genreLabel, type GenreKey } from "../i18n";
import type { WorkItem } from "../data";
import { CARD, cx, Button, GhostButton } from "./ui";

type PublishProps = {
  t: any;
  lang: string;
  onPublish: (work: WorkItem) => void;
  onBack: () => void;
};

export const Publish: React.FC<PublishProps> = ({
  t,
  lang,
  onPublish,
  onBack,
}) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [genre, setGenre] = useState<GenreKey>(GENRE_KEYS[0]);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isMusic = genre === "music";

  const canPublish = isMusic
    ? Boolean(title.trim() && audioUrl)
    : Boolean(title.trim() && text.trim());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAudioFileName(null);
      setAudioUrl(null);
      return;
    }
    setAudioFileName(file.name);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
  };

  const handleSubmit = () => {
    if (!canPublish) {
      setError("Заполните обязательные поля.");
      return;
    }
    const now = new Date();

    const work: WorkItem = {
      id: "user-" + now.getTime(),
      title: title.trim(),
      author: "Автор",
      genre,
      date: now.toLocaleDateString(),
      likes: 0,
      donations: 0,
      cover: `https://picsum.photos/seed/u${now.getTime()}/900/600`,
      excerpt: isMusic ? "" : text.trim(),
      paywalled: false,
      price: 0,
      promo: false,
      audioUrl: isMusic ? audioUrl : null,
    };

    onPublish(work);

    // очистка формы
    setTitle("");
    setText("");
    setGenre(GENRE_KEYS[0]);
    setAudioFileName(null);
    setAudioUrl(null);
    setError(null);
  };

  return (
    <section className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="mb-3">
        <GhostButton onClick={onBack} className="px-3 py-1.5 text-sm">
          ← {t.back}
        </GhostButton>
      </div>
      <div className={cx(CARD, "p-4 sm:p-5")}>
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
          {t.publishWork}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
              {t.title}
            </label>
            <input
              className="w-full mt-1 px-3 py-2 text-[15px] border rounded-2xl dark:bg-neutral-900 dark:border-neutral-700"
              placeholder="…"
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

          <div className="md:col-span-2">
            {isMusic ? (
              <div>
                <label className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                  {t.audioFile}
                </label>
                <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-2xl border border-neutral-300 bg-white dark:bg-neutral-900 dark:border-neutral-700 cursor-pointer">
                    {t.uploadAudio}
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  {audioFileName && (
                    <p className="text-xs text-neutral-500">
                      {audioFileName}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                  {t.text}
                </label>
                <textarea
                  rows={6}
                  className="w-full mt-1 px-3 py-2 text-[15px] border rounded-2xl dark:bg-neutral-900 dark:border-neutral-700"
                  placeholder={t.startWriting}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
        {error && (
          <p className="mt-3 text-xs text-red-500">{error}</p>
        )}
        <div className="mt-4 flex justify-end">
          <Button
            className="px-6 py-2 text-sm sm:text-base"
            onClick={handleSubmit}
            disabled={!canPublish}
          >
            {t.publish}
          </Button>
        </div>
      </div>
    </section>
  );
};
