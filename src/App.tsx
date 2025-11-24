

import React, { useEffect, useMemo, useState } from "react";
import { DICT, LANGS, GENRE_KEYS, genreLabel, type GenreKey } from "./i18n";
import {
  ACCENT,
  RADIUS,
  CARD,
  cx,
  Button,
  GhostButton,
} from "./components/ui";
import { MOCK_WORKS, type WorkItem } from "./data";
import { Logo } from "./components/Logo";
import { Feed } from "./components/Feed";
import { Work } from "./components/Work";
import { Profile } from "./components/Profile";
type Comment = {
  id: string;
  workId: string;
  text: string;
  createdAt: string;
};

// ===== Helpers =====


// Локализованный текст подтверждения удаления
function getDeleteConfirmMessage(lang: string): string {
  switch (lang) {
    case "en":
      return "Delete this publication? This action cannot be undone.";
    case "tr":
      return "Bu paylaşımı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.";
    case "es":
      return "¿Seguro que quieres eliminar esta publicación? Esta acción no se puede deshacer.";
    case "de":
      return "Diese Veröffentlichung wirklich löschen? Dieser Vorgang kann nicht rückgängig gemacht werden.";
    case "fr":
      return "Voulez-vous vraiment supprimer cette publication ? Cette action est irréversible.";
    case "it":
      return "Sei sicuro di voler eliminare questa pubblicazione? Questa azione non può essere annullata.";
    case "pt":
      return "Tem certeza de que deseja excluir esta publicação? Esta ação não pode ser desfeita.";
    case "uk":
      return "Справді видалити публікацію? Цю дію не можна скасувати.";
    case "kk":
      return "Жарияланымды шынымен өшіргіңіз келе ме? Бұл әрекетті болдырмау мүмкін емес.";
    default:
      return "Удалить публикацию? Это действие нельзя отменить.";
  }
}

// ===== Layout: Header / Footer / Mobile Tabs =====
type HeaderProps = {
  t: any;
  onNav: (k: string) => void;
  current: string;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  lang: string;
  onChangeLang: (value: string) => void;
};

const Header: React.FC<HeaderProps> = ({
  t,
  onNav,
  current,
  theme,
  onToggleTheme,
  lang,
  onChangeLang,
}) => {
  const nav = [
    { k: "landing", label: "WriRead" },
    { k: "feed", label: t.feed },
    { k: "publish", label: t.publish },
    { k: "profile", label: t.profile },
  ];
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-950/70 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 flex items-center gap-2">
        <button
          onClick={() => onNav("landing")}
          className="flex items-center gap-2 hover:opacity-90 transition"
        >
          <Logo />
        </button>

        <nav className="ml-4 hidden md:flex gap-2">
          {nav.map((n) => (
            <button
              key={n.k}
              onClick={() => onNav(n.k)}
              className={cx(
                "px-3 py-1.5 text-sm font-medium rounded-full border transition",
                current === n.k
                  ? "bg-neutral-900 text-white border-neutral-900 dark:bg-amber-400 dark:text-neutral-900 dark:border-amber-400"
                  : "bg-white hover:bg-neutral-50 border-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
              )}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className={cx(
              "px-3 py-1.5 text-xs sm:text-sm rounded-full border flex items-center gap-1",
              "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
            )}
          >
            {theme === "dark" ? "🌙 " + t.dark : "🌞 " + t.light}
          </button>

          <div className={cx(CARD, "px-2 py-1 flex items-center gap-1")}>
            <span className="hidden sm:inline text-xs text-neutral-500">
              {t.language}:
            </span>
            <select
              className="bg-transparent text-xs sm:text-sm outline-none"
              value={lang}
              onChange={(e) => onChangeLang(e.target.value)}
            >
              {LANGS.map((l) => (
                <option key={l.k} value={l.k}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

type FooterProps = { t: any };

const Footer: React.FC<FooterProps> = ({ t }) => (
  <footer className="mt-10 border-t border-neutral-200 dark:border-neutral-800">
    <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-neutral-600 dark:text-neutral-400 flex flex-col md:flex-row gap-2 md:gap-6">
      <span>© {new Date().getFullYear()} WriRead</span>
      <span>{t.footerLine}</span>
    </div>
  </footer>
);

type MobileTabBarProps = {
  t: any;
  page: string;
  onNav: (p: string) => void;
};

const MobileTabBar: React.FC<MobileTabBarProps> = ({ t, page, onNav }) => {
  const tabs = [
    { k: "landing", label: "Home", icon: "🏠" },
    { k: "feed", label: t.feed, icon: "📜" },
    { k: "publish", label: t.publish, icon: "➕" },
    { k: "profile", label: t.profile, icon: "👤" },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 dark:bg-neutral-950/95 border-t border-neutral-200 dark:border-neutral-800 backdrop-blur">
      <div className="max-w-6xl mx-auto px-2 py-1.5 flex justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.k}
            onClick={() => onNav(tab.k)}
            className={cx(
              "flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[11px]",
              page === tab.k
                ? "text-amber-600 dark:text-amber-400"
                : "text-neutral-500 dark:text-neutral-400"
            )}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="leading-none">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

// ===== Atoms & small components =====
const GradientBar: React.FC = () => (
  <div className={cx("h-8 w-full", "bg-gradient-to-r", ACCENT, RADIUS)} />
);


// ===== Pages =====
const Landing: React.FC<{
  t: any;
  onGetStarted: (page: string) => void;
}> = ({ t, onGetStarted }) => (
  <section>
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-100 via-rose-50 to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950" />
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
              WriRead
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-orange-500 mt-1">
                {t.slogan}
              </span>
            </h1>
            <p className="mt-4 text-neutral-600 dark:text-neutral-300 text-base sm:text-lg max-w-xl">
              {t.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => onGetStarted("publish")}
                className="px-6 py-3 text-base"
              >
                {t.cta_create}
              </Button>
              <GhostButton
                onClick={() => onGetStarted("feed")}
                className="px-6 py-3 text-base"
              >
                {t.cta_read}
              </GhostButton>
            </div>
          </div>
          <div className={cx(CARD, "p-4 bg-white/80 dark:bg-neutral-900/80")}>
            <GradientBar />
            <div className="grid grid-cols-2 gap-3 mt-4">
              {MOCK_WORKS.slice(0, 4).map((w) => (
                <div
                  key={w.id}
                  className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700"
                >
                  <img
                    src={w.cover}
                    className="w-full aspect-[3/2] object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
              {t.feedPreview}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
 
const Publish: React.FC<{
  t: any;
  lang: string;
  onPublish: (work: WorkItem) => void;
  onBack: () => void;
}> = ({ t, lang, onPublish, onBack }) => {
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

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    <section className="max-w-4xl mx_auto px-3 sm:px-4 py-6 sm:py-8">
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
              onChange={(e) =>
                setGenre(e.target.value as GenreKey)
              }
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

// ===== Modals =====
const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ open, onClose, title, children }) => {
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
        <div className="p-4 overflow-y-auto max-h-[70vh] sm:max-h-[65vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

const DonateModal: React.FC<{
  open: boolean;
  onClose: () => void;
  t: any;
  item: WorkItem | null;
}> = ({ open, onClose, t, item }) => {
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

const ListenModal: React.FC<{
  open: boolean;
  onClose: () => void;
  t: any;
  item: WorkItem | null;
}> = ({ open, onClose, t, item }) => {
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

const EditWorkModal: React.FC<{
  open: boolean;
  onClose: () => void;
  t: any;
  lang: string;
  item: WorkItem | null;
  onSave: (item: WorkItem) => void;
}> = ({ open, onClose, t, lang, item, onSave }) => {
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

// ===== App =====
export default function App() {
  const [lang, setLang] = useState<string>(() => {
    try {
      return localStorage.getItem("wriread:lang") || "ru";
    } catch {
      return "ru";
    }
  });

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const stored = localStorage.getItem("wriread:theme");
      return stored === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  const [page, setPage] = useState<"landing" | "feed" | "publish" | "profile" | "work">("landing");
  const [prevPage, setPrevPage] = useState<"landing" | "feed" | "publish" | "profile" | "work" | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  const commentsCountByWork = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of comments) {
      map[c.workId] = (map[c.workId] || 0) + 1;
    }
    return map;
  }, [comments]);

  const [current, setCurrent] = useState<WorkItem | null>(
    MOCK_WORKS[0] || null
  );
  const [works, setWorks] = useState<WorkItem[]>(MOCK_WORKS);
  // ID избранных публикаций
   const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("wriread:favorites");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("wriread:liked");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const stats = useMemo(() => {
    let totalLikes = 0;
    let totalDonations = 0;

    for (const w of works) {
      totalLikes += w.likes;
      totalDonations += w.donations;
    }

    return { totalLikes, totalDonations };
  }, [works]);


  const [donateOpen, setDonateOpen] = useState(false);
  const [listenOpen, setListenOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<WorkItem | null>(null);
  const handleAddComment = (workId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const now = new Date();
    const newComment: Comment = {
      id: "c-" + now.getTime() + "-" + Math.random().toString(36).slice(2, 8),
      workId,
      text: trimmed,
      createdAt: now.toLocaleString(),
    };

    setComments((prev) => [...prev, newComment]);
  };

  const currentLangKey = (
    Object.prototype.hasOwnProperty.call(DICT, lang) ? lang : "en"
  ) as keyof typeof DICT;
  const t = DICT[currentLangKey];
  const favoritesCount = favoriteIds.length;
  const ratingScore =
    stats.totalLikes + stats.totalDonations * 5 + favoritesCount * 3;


  useEffect(() => {
    try {
      localStorage.setItem("wriread:lang", lang);
    } catch {}
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem("wriread:theme", theme);
    } catch {}
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (theme === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
    }
  }, [theme]);

   useEffect(() => {
    try {
      localStorage.setItem("wriread:favorites", JSON.stringify(favoriteIds));
    } catch {}
  }, [favoriteIds]);

  useEffect(() => {
    try {
      localStorage.setItem("wriread:liked", JSON.stringify(likedIds));
    } catch {}
  }, [likedIds]);

  const goTo = (next: typeof page) => {
    setPrevPage(page);
    setPage(next);
  };

  const goBack = () => {
    if (prevPage) {
      setPage(prevPage);
      setPrevPage(null);
    } else {
      setPage("feed");
    }
  };

  const handleOpen = (item: WorkItem) => {
    setCurrent(item);
    goTo("work");
  };                                                                                                        
  
  const handleLike = (item: WorkItem) => {
    const isLiked = likedIds.includes(item.id);

    // Обновляем лайки в works
    setWorks((prev) =>
      prev.map((w) => {
        if (w.id !== item.id) return w;
        const delta = isLiked ? -1 : 1;
        return { ...w, likes: Math.max(0, w.likes + delta) };
      })
    );

    // Обновляем список лайкнутых id
    setLikedIds((prev) =>
      prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id]
    );
  };
                                                                            
  const handleToggleFavorite = (item: WorkItem) => {
    setFavoriteIds((prev) =>
      prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id]
    );
  };

  const handleDeleteWork = (id: string) => {
    setWorks((prev) => prev.filter((w) => w.id !== id));
    setCurrent((prev) => (prev && prev.id === id ? null : prev));
    // если пост был в избранном — убираем его
    setFavoriteIds((prev) => prev.filter((fid) => fid !== id));
    // рейтинг не трогаем — считается по всем лайкам/донатам за жизнь автора
  };

  const handleDeleteWorkClick = (id: string) => {
    const message = getDeleteConfirmMessage(lang);
    if (typeof window === "undefined") {
      handleDeleteWork(id);
      return;
    }
    if (window.confirm(message)) {
      handleDeleteWork(id);
    }
  };

  const handleEditWorkClick = (id: string) => {
    const found = works.find((w) => w.id === id);
    if (found) {
      setEditing(found);
      setEditOpen(true);
    }
  };

  const handleSaveEditedWork = (updated: WorkItem) => {
    setWorks((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
    setCurrent((prev) => (prev && prev.id === updated.id ? updated : prev));
  };

  const handleCreateWork = (work: WorkItem) => {
    setWorks((prev) => [work, ...prev]);
    setCurrent(work);
    setPage("profile");
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 pb-16 sm:pb-0">
      <Header
        t={t}
        current={page}
        onNav={(k) => goTo(k as typeof page)}
        theme={theme}
        onToggleTheme={() =>
          setTheme((prev) => (prev === "dark" ? "light" : "dark"))
        }
        lang={lang}
        onChangeLang={setLang}
      />

      {page === "landing" && (
        <Landing t={t} onGetStarted={(p) => goTo(p as typeof page)} />
      )}
      {page === "feed" && (
        <Feed
          t={t}
          lang={lang}
          items={works}
          favoriteIds={favoriteIds}
          likedIds={likedIds}
          commentCounts={commentsCountByWork}
          onOpen={handleOpen}
          onDonate={(it) => {
            setCurrent(it);
            setDonateOpen(true);
          }}
          onBoost={() => {}}
          onListen={(it) => {
            setCurrent(it);
            setListenOpen(true);
          }}
          onToggleFavorite={handleToggleFavorite}
          onLike={handleLike}
        />
      )}
{page === "work" && current && (
  <Work
    t={t}
    item={current}
    onDonate={(it) => {
      setCurrent(it);
      setDonateOpen(true);
    }}
    onBack={goBack}
    comments={comments.filter((c) => c.workId === current.id)}
    onAddComment={(text: string) => handleAddComment(current.id, text)}
  />
)}
      {page === "publish" && (
        <Publish
          t={t}
          lang={lang}
          onPublish={handleCreateWork}
          onBack={goBack}
        />
      )}
      {page === "profile" && (
        <Profile
          t={t}
          items={works}
          favorites={favoriteIds}
          likedIds={likedIds}
          commentCounts={commentsCountByWork}
          stats={stats}
          ratingScore={ratingScore}
          onDelete={handleDeleteWorkClick}
          onEdit={handleEditWorkClick}
          onOpen={handleOpen}
          onToggleFavorite={handleToggleFavorite}
          onLike={handleLike}
        />
      )}

      <div className="h-16 sm:hidden" />
      <Footer t={t} />
      <MobileTabBar t={t} page={page} onNav={(p) => goTo(p as typeof page)} />

      <DonateModal
        open={donateOpen}
        onClose={() => setDonateOpen(false)}
        t={t}
        item={current}
      />
      <ListenModal
        open={listenOpen}
        onClose={() => setListenOpen(false)}
        t={t}
        item={current}
      />
      <EditWorkModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        t={t}
        lang={lang}
        item={editing}
        onSave={handleSaveEditedWork}
      />
    </div>
  );
}

