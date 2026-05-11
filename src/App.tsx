import React, { useEffect, useMemo, useState } from "react";
import { DICT, LANGS } from "./i18n";
import { MOCK_WORKS, type WorkItem } from "./data";
import { Logo } from "./components/Logo";
import { CARD, cx, Button, GhostButton } from "./components/ui";
import { Feed } from "./components/Feed";
import { Work } from "./components/Work";
import { Profile } from "./components/Profile";
import { Publish } from "./components/Publish";
import { DonateModal,ListenModal,EditWorkModal,Modal,} from "./components/Modals";

type Comment = {
  id: string;
  workId: string;
  text: string;
  createdAt: string;
};

type Donation = {
  id: string;
  workId: string;
  amount: number;
  createdAt: string;
};

const formatBirthdateInput = (value: string) => {
  const v = (value || "").trim();

  // если вставили ISO дату: 1985-12-17 -> 17.12.1985
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const [y, m, d] = v.split("-");
    return `${d}.${m}.${y}`;
  }

  // оставляем только цифры, максимум 8 (ddmmyyyy)
  const digits = v.replace(/\D/g, "").slice(0, 8);

  const dd = digits.slice(0, 2);
  const mm = digits.slice(2, 4);
  const yyyy = digits.slice(4, 8);

  if (digits.length <= 2) return dd;
  if (digits.length <= 4) return `${dd}.${mm}`;
  return `${dd}.${mm}.${yyyy}`;
};

// ===== Layout: Header / Footer / Mobile Tabs =====
type HeaderProps = {
  t: any;
  onNav: (k: string) => void;
  current: string;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  lang: string;
  onChangeLang: (value: string) => void;
  userName: string | null;
  onOpenLogin: () => void;
};

const Header: React.FC<HeaderProps> = ({
  t,
  onNav,
  current,
  theme,
  onToggleTheme,
  lang,
  onChangeLang,
  userName,
  onOpenLogin,
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
        {/* Логотип */}
        <button
          onClick={() => onNav("landing")}
          className="flex items-center gap-2 hover:opacity-90 transition"
        >
          <Logo />
        </button>

        {/* Навигация (только на десктопе) */}
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

        {/* Правый блок: Тема / Язык / Войти */}
        <div className="ml-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2 max-w-full">
          {/* Тема + Язык в одной группе, умеют переноситься */}
          <div className="flex flex-row flex-wrap items-center gap-1 sm:gap-2 justify-end">
            {/* Переключатель темы */}
            <button
              onClick={onToggleTheme}
              className={cx(
                "px-3 py-1 text-xs sm:text-sm rounded-full border flex items-center gap-1",
                "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
              )}
            >
              {theme === "dark" ? "🌙 " + t.dark : "🌞 " + t.light}
            </button>

            {/* Язык */}
            <div className={cx(CARD, "px-2 py-1 flex items-center gap-1")}>
              <span className="hidden sm:inline text-xs text-neutral-500">
                {t.language}:
              </span>
              <select
                className="bg-transparent text-xs sm:text-sm outline-none max-w-[120px]"
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

          {/* Кнопка Войти / имя автора */}
          <button
            onClick={onOpenLogin}
            className={cx(
              "mt-1 sm:mt-0 px-3 py-1 text-xs sm:text-sm rounded-full border flex items-center gap-1 justify-center sm:justify-start max-w-[220px]",
              "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
            )}
          >
            <span>👤</span>
            <span className="truncate">
              {userName || t.profileNamePlaceholder || "Войти / имя автора"}
            </span>
          </button>
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
   <nav className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 dark:bg-neutral-950/95 border-t border-neutral-200 dark:border-neutral-800 backdrop-blur pb-[env(safe-area-inset-bottom)]">
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

// ===== Pages: Landing =====

const Landing: React.FC<{
  onOpenLogin: () => void;
}> = ({ onOpenLogin }) => (
  <section>
    <div className="relative overflow-hidden bg-gradient-to-b from-[#fffdf9] via-[#fff8f2] to-[#fffdf9] dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="absolute -top-20 -left-16 w-64 h-64 rounded-full bg-gradient-to-br from-orange-200/65 via-amber-200/50 to-rose-200/25 blur-2xl" />
      <div className="absolute top-36 -right-20 w-72 h-72 rounded-full bg-gradient-to-br from-rose-200/60 via-orange-200/45 to-amber-100/20 blur-3xl" />
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 items-center">
          <div className="relative z-10">
            <p className="text-sm tracking-[0.2em] uppercase text-neutral-500 dark:text-neutral-400">WriRead</p>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Пиши. Читай. Вдохновляй.</p>
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight text-neutral-900 dark:text-neutral-50">
              Пусть творчество
              <span className="block">увидит <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500">свет.</span></span>
            </h1>
            <p className="mt-5 max-w-xl text-[15px] sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
              WriRead — пространство для авторов и читателей, где слова находят отклик, вдохновение — путь, а творчество становится выражением вас.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <button onClick={onOpenLogin} className="px-7 py-3 rounded-2xl text-white font-semibold bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 shadow-[0_12px_26px_-10px_rgba(244,114,50,0.55)] hover:brightness-105 transition">Войти</button>
              <button onClick={onOpenLogin} className="px-7 py-3 rounded-2xl font-semibold border border-orange-100 bg-white/90 text-neutral-800 shadow-[0_10px_22px_-16px_rgba(0,0,0,0.45)] dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-100">Создать аккаунт</button>
              <button onClick={() => document.getElementById("about-wriread")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="px-3 py-3 text-sm font-medium text-neutral-500 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-white transition">Подробнее</button>
            </div>
            <div className="mt-6">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">или войдите с помощью</p>
              <div className="mt-3 flex gap-2.5">
                {['Apple', 'Google', 'Email'].map((provider) => (
                  <button key={provider} onClick={onOpenLogin} className="w-11 h-11 rounded-full border border-orange-100 bg-white/90 text-xs font-medium text-neutral-700 shadow-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200">{provider[0]}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="relative">
            <div className={cx(CARD, "relative bg-white/85 dark:bg-neutral-900/85 border-orange-100 dark:border-neutral-700 p-6 sm:p-7 shadow-[0_20px_45px_-30px_rgba(180,90,30,0.55)]")}>
              <div className="absolute -top-6 left-6 w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-200 to-rose-200 opacity-80 rotate-12" />
              <div className="absolute -bottom-5 right-7 w-14 h-14 rounded-full bg-gradient-to-br from-orange-200 to-amber-100 opacity-70" />
              <div className="relative rounded-3xl border border-orange-100/80 dark:border-neutral-700 bg-gradient-to-b from-[#fffefc] to-[#fff7ef] dark:from-neutral-900 dark:to-neutral-900 p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">creative note</span>
                  <span className="text-2xl text-orange-300 dark:text-amber-300">✒️</span>
                </div>
                <p className="mt-8 text-center text-2xl sm:text-3xl font-semibold text-neutral-800 dark:text-neutral-100 leading-tight">Мысли становятся историями</p>
                <div className="mt-8 grid grid-cols-2 gap-3 opacity-80">
                  <div className="h-20 rounded-2xl bg-white/80 dark:bg-neutral-800 border border-orange-100 dark:border-neutral-700" />
                  <div className="h-20 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 dark:from-neutral-800 dark:to-neutral-800 border border-orange-100/70 dark:border-neutral-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="about-wriread" className="mt-10 rounded-3xl border border-orange-100/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70 p-5 sm:p-6 text-sm text-neutral-600 dark:text-neutral-300">
          <p className="font-medium text-neutral-900 dark:text-neutral-100">WriRead — место, где тексты обретают читателей.</p>
          <p className="mt-2">Публикуйте работы, читайте вдохновляющие истории, поддерживайте авторов комментариями, лайками и донатами.</p>
            </div>
      </div>
    </div>
  </section>
);

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

  const [userName, setUserName] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem("wriread:userName");
      return stored || null;
    } catch {
      return null;
    }
  });

  const [profileName] = useState<string>(() => {
    try {
      return localStorage.getItem("wriread:profile:name") || "Михаил";
    } catch {
      return "Михаил";
    }
  });

     const [profileBio, setProfileBio] = useState<string>(() => {
    try {
      return localStorage.getItem("wriread:profile:bio") || "";
    } catch {
      return "";
    }
  });

  const [profileBirthdate, setProfileBirthdate] = useState<string>(() => {
    try {
      return localStorage.getItem("wriread:profile:birthdate") || "";
    } catch {
      return "";
    }
  });

  const [profileGender, setProfileGender] = useState<string>(() => {
    try {
      return localStorage.getItem("wriread:profile:gender") || "";
    } catch {
      return "";
    }
  });

  const [profileEmail, setProfileEmail] = useState<string>(() => {
    try {
      return localStorage.getItem("wriread:profile:email") || "";
    } catch {
      return "";
    }
  });

  const [profileSocials, setProfileSocials] = useState<string>(() => {
    try {
      return localStorage.getItem("wriread:profile:socials") || "";
    } catch {
      return "";
    }
  });

  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string>(() => {
    try {
      return localStorage.getItem("wriread:profile:avatarUrl") || "";
    } catch {
      return "";
    }
  });

  const [profileEditorOpen, setProfileEditorOpen] = useState(false);


  const [page, setPage] = useState<
    "landing" | "feed" | "publish" | "profile" | "work"
  >("landing");

  const [prevPage, setPrevPage] = useState<
    "landing" | "feed" | "publish" | "profile" | "work" | null
  >(null);

  const [feedVersion, setFeedVersion] = useState(0);

  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const raw = localStorage.getItem("wriread:comments");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [donations, setDonations] = useState<Donation[]>(() => {
    try {
      const raw = localStorage.getItem("wriread:donations");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [current, setCurrent] = useState<WorkItem | null>(
    MOCK_WORKS[0] || null
  );

  const [works, setWorks] = useState<WorkItem[]>(MOCK_WORKS);

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
      const raw = localStorage.getItem("wriread:likes");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [followingAuthors, setFollowingAuthors] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("wriread:followingAuthors");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [donateOpen, setDonateOpen] = useState(false);
  const [listenOpen, setListenOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<WorkItem | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginDraft, setLoginDraft] = useState("");
  const [profileBioDraft, setProfileBioDraft] = useState("");
  


  const stats = useMemo(() => {
    let totalLikes = 0;
    let totalDonationsCount = 0;

    for (const w of works) {
      totalLikes += w.likes;
      totalDonationsCount += w.donations ?? 0;
    }

    const favoritesBonus = favoriteIds.length;

    const totalDonationsAmount = donations.reduce(
      (sum, d) => sum + (d.amount || 0),
      0
    );

    return {
      totalLikes: totalLikes + favoritesBonus,
      totalDonations: totalDonationsAmount,
    };
  }, [works, favoriteIds, donations]);

  const ratingScore = stats.totalLikes + stats.totalDonations;

  const commentsCountByWork = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of comments) {
      map[c.workId] = (map[c.workId] || 0) + 1;
    }
    return map;
  }, [comments]);

  // ===== Effects: persist to localStorage, theme, etc. =====

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
      localStorage.setItem(
        "wriread:followingAuthors",
        JSON.stringify(followingAuthors)
      );
    } catch {}
  }, [followingAuthors]);

  useEffect(() => {
    try {
      localStorage.setItem("wriread:donations", JSON.stringify(donations));
    } catch {}
  }, [donations]);

  useEffect(() => {
    try {
      localStorage.setItem("wriread:likes", JSON.stringify(likedIds));
    } catch {}
  }, [likedIds]);

  useEffect(() => {
    try {
      if (userName && userName.trim()) {
        localStorage.setItem("wriread:userName", userName.trim());
      } else {
        localStorage.removeItem("wriread:userName");
      }
    } catch {}
  }, [userName]);

  useEffect(() => {
    try {
      localStorage.setItem("wriread:comments", JSON.stringify(comments));
    } catch {}
  }, [comments]);

  useEffect(() => {
    try {
      localStorage.setItem("wriread:profile:name", profileName);
    } catch {}
  }, [profileName]);

  useEffect(() => {
    try {
      localStorage.setItem("wriread:profile:birthdate", profileBirthdate);
    } catch {}
  }, [profileBirthdate]);

  useEffect(() => {
    try {
      localStorage.setItem("wriread:profile:gender", profileGender);
    } catch {}
  }, [profileGender]);

  useEffect(() => {
    try {
      localStorage.setItem("wriread:profile:email", profileEmail);
    } catch {}
  }, [profileEmail]);

  useEffect(() => {
    try {
      localStorage.setItem("wriread:profile:socials", profileSocials);
    } catch {}
  }, [profileSocials]);

  useEffect(() => {
    try {
      localStorage.setItem("wriread:profile:avatarUrl", profileAvatarUrl);
    } catch {}
  }, [profileAvatarUrl]);

  useEffect(() => {
    try {
      localStorage.setItem("wriread:profile:bio", profileBio);
    } catch {}
  }, [profileBio]);

  // ===== Navigation helpers =====

  const goTo = (next: typeof page) => {
    if (next === "feed") {
      setFeedVersion((v) => v + 1);
    }
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

  // ===== Handlers =====

  const handleOpen = (item: WorkItem) => {
    setCurrent(item);
    goTo("work");
  };

  const handleToggleFavorite = (item: WorkItem) => {
    const isFav = favoriteIds.includes(item.id);
    setFavoriteIds((prev) =>
      isFav ? prev.filter((id) => id !== item.id) : [...prev, item.id]
    );
  };

  const handleLike = (item: WorkItem) => {
    const isLiked = likedIds.includes(item.id);
    setLikedIds((prev) =>
      isLiked ? prev.filter((id) => id !== item.id) : [...prev, item.id]
    );
    setWorks((prev) =>
      prev.map((w) =>
        w.id === item.id
          ? { ...w, likes: w.likes + (isLiked ? -1 : 1) }
          : w
      )
    );
  };

  const handleToggleFollowAuthor = (author: string) => {
    setFollowingAuthors((prev) =>
      prev.includes(author) ? prev.filter((a) => a !== author) : [...prev, author]
    );
  };

  const handleDonate = (item: WorkItem, amount: number) => {
    if (!amount || amount <= 0) return;

    const now = new Date();
    const newDonation: Donation = {
      id: "d-" + now.getTime() + "-" + Math.random().toString(36).slice(2, 8),
      workId: item.id,
      amount,
      createdAt: now.toISOString(),
    };

    setDonations((prev) => [...prev, newDonation]);

    setWorks((prev) =>
      prev.map((w) =>
        w.id === item.id ? { ...w, donations: (w.donations ?? 0) + 1 } : w
      )
    );
  };

  const handleAddComment = (workId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const now = new Date();
    const newComment: Comment = {
      id: "c-" + now.getTime() + "-" + Math.random().toString(36).slice(2, 8),
      workId,
      text: trimmed,
      createdAt: now.toISOString(),
    };

    setComments((prev) => [...prev, newComment]);
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleDeleteWork = (id: string) => {
    setWorks((prev) => prev.filter((w) => w.id !== id));
    setCurrent((prev) => (prev && prev.id === id ? null : prev));
    setFavoriteIds((prev) => prev.filter((fid) => fid !== id));
    setComments((prev) => prev.filter((c) => c.workId !== id));
  };

    const handleDeleteWorkClick = (id: string) => {
    if (typeof window === "undefined") {
      handleDeleteWork(id);
      return;
    }

    const langKeyForConfirm = (
      Object.prototype.hasOwnProperty.call(DICT, lang) ? lang : "en"
    ) as keyof typeof DICT;

    const message = DICT[langKeyForConfirm].deleteConfirm;

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

     const handleOpenLogin = () => {
    setLoginDraft(userName || "");
    setProfileBioDraft(profileBio || "");
    setLoginOpen(true);
  };

  const handleSaveLogin = () => {
    const nameTrimmed = loginDraft.trim();
    const bioTrimmed = profileBioDraft.trim();

    if (!nameTrimmed) return;

    setUserName(nameTrimmed);
    setProfileBio(bioTrimmed);
    setLoginOpen(false);
  };

  const handleLogout = () => {
    setUserName(null);
    setLoginOpen(false);
  };

  // ===== i18n =====

   const currentLangKey = (
    Object.prototype.hasOwnProperty.call(DICT, lang) ? lang : "en"
  ) as keyof typeof DICT;
  const t = DICT[currentLangKey];

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 pb-[calc(4rem+env(safe-area-inset-bottom))] sm:pb-0">
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
        userName={userName}
        onOpenLogin={handleOpenLogin}
      />

      {page === "landing" && (
        <Landing onOpenLogin={handleOpenLogin} />
      )}

      {page === "feed" && (
        <Feed
          key={feedVersion}
          t={t}
          lang={lang}
          items={works}
          favoriteIds={favoriteIds}
          likedIds={likedIds}
          commentCounts={commentsCountByWork}
          followingAuthors={followingAuthors}
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
          onDeleteComment={handleDeleteComment}
          isFollowingAuthor={followingAuthors.includes(current.author)}
          onToggleFollow={() => handleToggleFollowAuthor(current.author)}
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
          userName={userName}
          profileBio={profileBio}
          profileBirthdate={profileBirthdate}
          profileGender={profileGender}
          profileEmail={profileEmail}
          profileSocials={profileSocials}
          profileAvatarUrl={profileAvatarUrl || null}
          followingCount={followingAuthors.length}
          onDelete={handleDeleteWorkClick}
          onEdit={handleEditWorkClick}
          onOpen={handleOpen}
          onLike={handleLike}
          onEditProfile={() => setProfileEditorOpen(true)}
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
        onConfirm={handleDonate}
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

      <Modal
        open={profileEditorOpen}
        onClose={() => setProfileEditorOpen(false)}
        title={t.profile}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {t.profileBirthdateLabel}
            </label>
            <input
  type="text"
  inputMode="numeric"
  placeholder="ДД.ММ.ГГГГ"
  className="w-full px-3 py-2 text-[15px] border rounded-2xl dark:bg-neutral-900 dark:border-neutral-700"
  value={profileBirthdate}
  onChange={(e) =>
    setProfileBirthdate(formatBirthdateInput(e.target.value))
  }
/>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {t.profileGenderLabel}
            </label>
            <input
              className="w-full px-3 py-2 text-[15px] border rounded-2xl dark:bg-neutral-900 dark:border-neutral-700"
              value={profileGender}
              onChange={(e) => setProfileGender(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {t.profileEmailLabel}
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 text-[15px] border rounded-2xl dark:bg-neutral-900 dark:border-neutral-700"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {t.profileSocialsLabel}
            </label>
            <input
              className="w-full px-3 py-2 text-[15px] border rounded-2xl dark:bg-neutral-900 dark:border-neutral-700"
              placeholder="https://..."
              value={profileSocials}
              onChange={(e) => setProfileSocials(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {t.profileAvatarLabel}
            </label>
            <input
              className="w-full px-3 py-2 text-[15px] border rounded-2xl dark:bg-neutral-900 dark:border-neutral-700"
              placeholder="https://your-image-url..."
              value={profileAvatarUrl}
              onChange={(e) => setProfileAvatarUrl(e.target.value)}
            />
          </div>

          <div className="mt-1 flex flex-col sm:flex-row gap-2 sm:justify-end">
            <GhostButton
              onClick={() => setProfileEditorOpen(false)}
              className="w-full sm:w-auto"
            >
              {t.cancel}
            </GhostButton>
            <Button
              onClick={() => setProfileEditorOpen(false)}
              className="w-full sm:w-auto"
            >
              {t.save}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        title={t.profile}
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            {t.profileAboutText}
          </p>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {t.profileRoleAuthor}
            </label>
            <input
              className="w-full px-3 py-2 text-[15px] border rounded-2xl dark:bg-neutral-900 dark:border-neutral-700"
              placeholder={t.profileRoleAuthor}
              value={loginDraft}
              onChange={(e) => setLoginDraft(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {t.profileAboutTitle}
            </label>
            <textarea
              className="w-full min-h-[80px] px-3 py-2 text-[15px] border rounded-2xl resize-none dark:bg-neutral-900 dark:border-neutral-700"
              placeholder={t.profileAboutText}
              value={profileBioDraft}
              onChange={(e) => setProfileBioDraft(e.target.value)}
            />
          </div>

          <div className="mt-1 flex flex-col sm:flex-row gap-2 sm:justify-end">
            <GhostButton
              onClick={() => setLoginOpen(false)}
              className="w-full sm:w-auto"
            >
              {t.cancel}
            </GhostButton>
            <Button
              onClick={handleSaveLogin}
              className="w-full sm:w-auto"
              disabled={!loginDraft.trim()}
            >
              {t.save}
            </Button>
            {userName && (
              <GhostButton
                onClick={handleLogout}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                {t.logout}
              </GhostButton>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
