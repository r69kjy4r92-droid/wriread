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

type AuthUser = {
  name: string;
  email: string;
  telegram?: string;
  role: "author" | "reader";
  donationMethod: "card" | "crypto" | "later";
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
  onOpenRegister: () => void;
}> = ({ onOpenLogin, onOpenRegister }) => (
  <section>
    <div className="relative overflow-hidden bg-gradient-to-b from-[#fffdfa] via-[#fff7ef] to-[#fffdfb] dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] rounded-full bg-gradient-to-br from-orange-200/45 via-rose-100/30 to-amber-100/10 blur-3xl" />
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-10 sm:py-14 flex justify-center">
        <div className="relative w-full max-w-[430px] rounded-[3rem] border-[10px] border-neutral-900/95 dark:border-neutral-700 bg-neutral-900 shadow-[0_35px_80px_-35px_rgba(0,0,0,0.65)]">
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-36 h-8 rounded-full bg-black" />
          <div className="relative rounded-[2.4rem] overflow-hidden bg-gradient-to-b from-[#fffdf8] via-[#fff7ef] to-[#fffdf9] dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900 min-h-[820px] px-6 pt-14 pb-8">
            <div className="absolute top-5 left-6 text-[10px] text-neutral-500 dark:text-neutral-400">9:41</div>
            <div className="absolute top-5 right-6 flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-400"><span>◉◉◉</span><span>▮</span></div>

            <div className="text-center">
              <h1 className="text-[48px] leading-none font-semibold tracking-tight">
                <span className="text-neutral-800 dark:text-neutral-100">Wri</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-rose-400 to-amber-400">Read</span>
                <span className="inline-block ml-1 text-xl -translate-y-5">🪶</span>
              </h1>
              <p className="mt-2 text-sm tracking-[0.12em] lowercase text-neutral-500 dark:text-neutral-400">пиши. читай. вдохновляй.</p>
            </div>

            <div className="relative mt-6 h-[265px]">
              <div className="absolute left-0 top-8 w-28 h-20 rounded-[45%] bg-gradient-to-br from-neutral-200/45 to-neutral-300/20 blur-sm dark:from-neutral-700/50 dark:to-neutral-800/20" />
              <div className="absolute right-3 top-0 w-24 h-24 rounded-full bg-gradient-to-br from-amber-200/80 to-orange-200/30 blur-[2px]" />
              <div className="absolute right-0 top-20 text-2xl opacity-60">🥀</div>
              <div className="absolute left-6 bottom-5 w-64 h-14 rounded-[100%] bg-gradient-to-r from-orange-200/30 via-rose-200/45 to-amber-100/35 rotate-[-8deg]" />
              <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-[250px] h-[165px] rounded-[1.75rem] rotate-[-8deg] bg-gradient-to-b from-[#fdf4e6] via-[#fff6eb] to-[#f7ead7] border border-[#f0dfc8] shadow-[0_16px_35px_-20px_rgba(110,72,35,0.6)]" />
              <div className="absolute left-1/2 top-[49%] -translate-x-1/2 -translate-y-1/2 w-[236px] h-[155px] rounded-[1.5rem] bg-gradient-to-b from-[#fffaf2] to-[#f7eddc] border border-[#efdfc5] shadow-inner" />
              <p className="absolute left-1/2 top-[49%] -translate-x-1/2 -translate-y-1/2 text-center text-[28px] leading-tight text-[#7d5b43] [font-family:ui-serif,Georgia,serif]">
                Мысли становятся<br />историями
              </p>
              <div className="absolute left-[53%] top-[58%] text-lg opacity-80">✒️</div>
              <div className="absolute left-12 top-4 text-amber-300 text-xs">✦ ✧</div>
              <div className="absolute right-12 bottom-4 text-amber-300 text-xs">✧ ✦</div>
            </div>

            <h2 className="mt-2 text-center text-[40px] leading-[1.02] font-semibold text-neutral-900 dark:text-neutral-100">
              Пусть творчество<br />увидит <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500">свет.</span>
            </h2>
            <p className="mt-4 text-center text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300 px-1">
              WriRead — пространство для авторов и читателей,<br />
              где слова находят отклик, вдохновение — путь,<br />
              а творчество становится выражением вас.
            </p>

            <div className="mt-6 flex flex-col items-center gap-3">
              <button onClick={onOpenLogin} className="w-full max-w-[290px] py-3.5 rounded-[1.1rem] text-white text-base font-semibold bg-gradient-to-r from-[#ff8a5c] via-[#ff7a5d] to-[#f7b55b] shadow-[0_14px_28px_-14px_rgba(246,117,71,0.85)]">Войти</button>
              <button onClick={onOpenRegister} className="w-full max-w-[290px] py-3.5 rounded-[1.1rem] text-[#ea7b57] text-base font-semibold bg-[#fffdf8] border border-[#f8dcc8] shadow-[0_14px_28px_-18px_rgba(186,118,79,0.7)] dark:bg-neutral-800 dark:border-neutral-700 dark:text-orange-300">Создать аккаунт</button>
              <button onClick={() => document.getElementById("about-wriread")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="text-sm font-medium text-amber-600 dark:text-amber-400">Подробнее</button>
            </div>

            <div className="mt-5 flex items-center gap-3 text-neutral-400 dark:text-neutral-500">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neutral-300 dark:to-neutral-600" />
              <span className="text-xs">или войдите с помощью</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neutral-300 dark:to-neutral-600" />
            </div>
            <div className="mt-3 flex justify-center gap-3">
              {["", "G", "✉"].map((icon) => (
                <button key={icon} onClick={onOpenLogin} className="w-11 h-11 rounded-full bg-white/90 border border-[#f7dfcd] text-neutral-700 shadow-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200">{icon}</button>
              ))}
            </div>

            <div className="absolute bottom-8 left-7 text-lg opacity-70">🖋️ ✧</div>
            <div className="absolute bottom-8 right-7 text-lg opacity-70">📖 ✦</div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-amber-300">✦ ✧ ✦</div>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 pb-10">
        <div id="about-wriread" className={cx(CARD, "rounded-3xl bg-white/85 dark:bg-neutral-900/75 border-orange-100 dark:border-neutral-800 p-5 sm:p-6 text-sm text-neutral-600 dark:text-neutral-300")}>
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

     const [profileBio] = useState<string>(() => {
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
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginError, setLoginError] = useState("");
  const [registerDraft, setRegisterDraft] = useState<AuthUser>({
    name: "",
    email: "",
    telegram: "",
    role: "author",
    donationMethod: "later",
    createdAt: "",
  });
  const [registerAccepted, setRegisterAccepted] = useState(false);
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});
  


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

  const readStoredAuth = (): AuthUser | null => {
    try {
      const raw = localStorage.getItem("wriread:auth");
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  };
  const handleOpenLogin = () => {
    setLoginIdentifier(userName || "");
    setLoginError("");
    setLoginOpen(true);
  };
  const handleOpenRegister = () => {
    setRegisterErrors({});
    setRegisterAccepted(false);
    setRegisterDraft({ name: "", email: "", telegram: "", role: "author", donationMethod: "later", createdAt: "" });
    setRegisterOpen(true);
  };
  const handleLogin = () => {
    const auth = readStoredAuth();
    const value = loginIdentifier.trim().toLowerCase();
    if (!auth || !value) {
      setLoginError("Аккаунт не найден. Зарегистрируйтесь.");
      return;
    }
    if (auth.email.toLowerCase() !== value && auth.name.toLowerCase() !== value) {
      setLoginError("Аккаунт не найден. Зарегистрируйтесь.");
      return;
    }
    setUserName(auth.name);
    setProfileEmail(auth.email);
    setLoginOpen(false);
    goTo("profile");
  };
  const handleRegister = () => {
    const e: Record<string, string> = {};
    if (!registerDraft.name.trim()) e.name = "Введите имя или псевдоним.";
    if (!registerDraft.email.trim()) e.email = "Введите email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerDraft.email.trim())) e.email = "Введите корректный email.";
    if (!registerDraft.role) e.role = "Выберите роль.";
    if (!registerAccepted) e.terms = "Нужно принять условия использования.";
    setRegisterErrors(e);
    if (Object.keys(e).length) return;
    const auth: AuthUser = { ...registerDraft, name: registerDraft.name.trim(), email: registerDraft.email.trim(), createdAt: new Date().toISOString() };
    try {
      localStorage.setItem("wriread:auth", JSON.stringify(auth));
      localStorage.setItem("wriread:userName", auth.name);
      localStorage.setItem("wriread:profile:email", auth.email);
      localStorage.setItem("wriread:profile:telegram", auth.telegram || "");
      localStorage.setItem("wriread:profile:role", auth.role);
      localStorage.setItem("wriread:profile:donationMethod", auth.donationMethod);
    } catch {}
    setUserName(auth.name);
    setProfileEmail(auth.email);
    setRegisterOpen(false);
    goTo("profile");
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
        <Landing onOpenLogin={handleOpenLogin} onOpenRegister={handleOpenRegister} />
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
        title="Войти в WriRead"
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">Введите email или имя автора, чтобы войти.</p>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Email или имя</label>
            <input
              className="w-full px-3 py-2 text-[15px] border rounded-2xl dark:bg-neutral-900 dark:border-neutral-700"
              placeholder="name@mail.com или псевдоним"
              value={loginIdentifier}
              onChange={(e) => setLoginIdentifier(e.target.value)}
            />
          </div>
          {loginError && <p className="text-sm text-rose-500">{loginError}</p>}

          <div className="mt-1 flex flex-col sm:flex-row gap-2 sm:justify-end">
            <GhostButton
              onClick={() => setLoginOpen(false)}
              className="w-full sm:w-auto"
            >
              {t.cancel}
            </GhostButton>
            <Button
              onClick={handleLogin}
              className="w-full sm:w-auto"
              disabled={!loginIdentifier.trim()}
            >
              Войти
            </Button>
            <GhostButton onClick={handleOpenRegister} className="w-full sm:w-auto">Создать аккаунт</GhostButton>
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
      <Modal open={registerOpen} onClose={() => setRegisterOpen(false)} title="Создать аккаунт">
        <div className="flex flex-col gap-3">
          <input className="w-full px-3 py-2 text-[15px] border rounded-2xl dark:bg-neutral-900 dark:border-neutral-700" placeholder="Имя или псевдоним" value={registerDraft.name} onChange={(e) => setRegisterDraft((p) => ({ ...p, name: e.target.value }))} />
          {registerErrors.name && <p className="text-xs text-rose-500 -mt-2">{registerErrors.name}</p>}
          <input className="w-full px-3 py-2 text-[15px] border rounded-2xl dark:bg-neutral-900 dark:border-neutral-700" placeholder="Email" value={registerDraft.email} onChange={(e) => setRegisterDraft((p) => ({ ...p, email: e.target.value }))} />
          {registerErrors.email && <p className="text-xs text-rose-500 -mt-2">{registerErrors.email}</p>}
          <input className="w-full px-3 py-2 text-[15px] border rounded-2xl dark:bg-neutral-900 dark:border-neutral-700" placeholder="Telegram (необязательно)" value={registerDraft.telegram || ""} onChange={(e) => setRegisterDraft((p) => ({ ...p, telegram: e.target.value }))} />
          <select className="w-full px-3 py-2 text-[15px] border rounded-2xl dark:bg-neutral-900 dark:border-neutral-700" value={registerDraft.role} onChange={(e) => setRegisterDraft((p) => ({ ...p, role: e.target.value as AuthUser['role'] }))}><option value="author">Автор</option><option value="reader">Читатель</option></select>
          <select className="w-full px-3 py-2 text-[15px] border rounded-2xl dark:bg-neutral-900 dark:border-neutral-700" value={registerDraft.donationMethod} onChange={(e) => setRegisterDraft((p) => ({ ...p, donationMethod: e.target.value as AuthUser['donationMethod'] }))}><option value="card">Банковская карта</option><option value="crypto">Криптокошелёк</option><option value="later">Позже</option></select>
          <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={registerAccepted} onChange={(e) => setRegisterAccepted(e.target.checked)} /><span>Я принимаю условия использования</span></label>
          {registerErrors.terms && <p className="text-xs text-rose-500 -mt-2">{registerErrors.terms}</p>}
          <Button onClick={handleRegister} className="w-full">Зарегистрироваться</Button>
        </div>
      </Modal>
    </div>
  );
}
