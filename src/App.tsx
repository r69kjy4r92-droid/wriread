import React, { useEffect, useMemo, useState } from "react";

// ===== Helpers =====
const ACCENT = "from-rose-400 via-orange-300 to-amber-300";
const RADIUS = "rounded-2xl";
const SHADOW = "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]";
const CARD =
  `${RADIUS} ${SHADOW} bg-white dark:bg-neutral-900 ` +
  "border border-neutral-200 dark:border-neutral-700";

function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}
function num(n: number) {
  return (n ?? 0).toLocaleString();
}

// ===== i18n =====
const DICT = {
  ru: {
    slogan: "Я творец, это моё пространство.",
    cta_create: "Опубликовать",
    cta_read: "Читать лучшее",
    donate: "Поддержать автора",
    like: "Лайк",
    boost: "Продвинуть",
    fullAccess: "Открыть полный доступ",
    excerpt: "Отрывок",
    byAuthor: "Автор",
    publish: "Издать",
    feed: "Лента",
    top: "Топ",
    new: "Новые",
    following: "Подписки",
    profile: "Профиль",
    signIn: "Войти",
    price: "Цена",
    pay: "Оплатить",
    cancel: "Отмена",
    promoted: "Промо",
    share: "Поделиться",
    yourBalance: "Ваш баланс",
    posts: "Публикации",
    language: "Язык",
    publishWork: "Опубликовать работу",
    title: "Заголовок",
    genre: "Жанр",
    text: "Текст",
    audioFile: "Аудиофайл",
    uploadAudio: "Загрузить аудио",
    listen: "Прослушать",
    theme: "Тема",
    light: "Светлая",
    dark: "Тёмная",
  },
  en: {
    slogan: "I’m a creator — this is my space.",
    cta_create: "Publish",
    cta_read: "Read top",
    donate: "Support author",
    like: "Like",
    boost: "Boost",
    fullAccess: "Unlock full access",
    excerpt: "Excerpt",
    byAuthor: "By",
    publish: "Publish",
    feed: "Feed",
    top: "Top",
    new: "New",
    following: "Following",
    profile: "Profile",
    signIn: "Sign in",
    price: "Price",
    pay: "Pay",
    cancel: "Cancel",
    promoted: "Promoted",
    share: "Share",
    yourBalance: "Your balance",
    posts: "Posts",
    language: "Language",
    publishWork: "Publish work",
    title: "Title",
    genre: "Genre",
    text: "Text",
    audioFile: "Audio file",
    uploadAudio: "Upload audio",
    listen: "Listen",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
  },
};

const LANGS = [
  { k: "ru", label: "Русский" },
  { k: "en", label: "English" },
  { k: "tr", label: "Türkçe" },
  { k: "es", label: "Español" },
  { k: "de", label: "Deutsch" },
  { k: "fr", label: "Français" },
  { k: "it", label: "Italiano" },
  { k: "pt", label: "Português" },
  { k: "uk", label: "Українська" },
  { k: "kk", label: "Қазақша" },
];

// ===== Data =====
const GENRES = [
  "Стихи",
  "Роман",
  "Поэма",
  "Рассказ",
  "Детектив",
  "Фэнтези",
  "Музыка/Бит",
  "Игры",
];

type WorkItem = {
  id: string;
  title: string;
  author: string;
  genre: string;
  date: string;
  likes: number;
  donations: number;
  cover: string;
  excerpt: string;
  paywalled: boolean;
  price: number;
  promo: boolean;
  audioUrl: string | null;
};

function makeMockWorks(): WorkItem[] {
  const res: WorkItem[] = [];
  for (let i = 0; i < 12; i++) {
    const genre = GENRES[i % GENRES.length];
    res.push({
      id: `w${i + 1}`,
      title: `Ночное пламя #${i + 1}`,
      author: i % 2 ? "Лира" : "Орфей",
      genre,
      date: "Сегодня",
      likes: Math.floor(Math.random() * 120) + 12,
      donations: Math.floor(Math.random() * 80),
      cover: `https://picsum.photos/seed/wc${i}/900/600`,
      excerpt: "Огонь гудит в пустых сосудах тишины, и ночь дышит янтарём...",
      paywalled: i % 3 === 0,
      price: [2.99, 3.99, 4.99][i % 3],
      promo: i % 4 === 0,
      audioUrl:
        genre === "Музыка/Бит"
          ? "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          : null,
    });
  }
  return res;
}
const MOCK_WORKS: WorkItem[] = makeMockWorks();

// ===== Atoms =====
const GradientBar: React.FC = () => (
  <div className={cx("h-8 w-full", "bg-gradient-to-r", ACCENT, RADIUS)} />
);

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({ children, className, onClick }) => (
  <button
    onClick={onClick}
    className={cx(
      "inline-flex items-center justify-center px-5 py-3 text-base font-semibold",
      "bg-gradient-to-r text-white",
      ACCENT,
      RADIUS,
      SHADOW,
      "hover:opacity-90 active:opacity-85 transition",
      className
    )}
  >
    {children}
  </button>
);

type GhostButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const GhostButton: React.FC<GhostButtonProps> = ({
  children,
  className,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={cx(
      "inline-flex items-center justify-center px-4 py-2 text-sm font-medium",
      RADIUS,
      "border border-neutral-300 bg-white hover:bg-neutral-50 transition",
      "dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-100 hover:dark:bg-neutral-800",
      className
    )}
  >
    {children}
  </button>
);

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    className={cx(
      "px-3 py-1 text-xs font-semibold",
      "bg-neutral-100 text-neutral-700 rounded-full border border-neutral-200"
    )}
  >
    {children}
  </span>
);

// ===== Layout =====
type HeaderProps = {
  t: any;
  onNav: (k: string) => void;
  current: string;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  lang: string;
};

const Header: React.FC<HeaderProps> = ({
  t,
  onNav,
  current,
  theme,
  onToggleTheme,
  lang,
}) => {
  const nav = [
    { k: "landing", label: "WriRead" },
    { k: "feed", label: t.feed },
    { k: "publish", label: t.publish },
    { k: "profile", label: t.profile },
  ];
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-950/70 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div
            className={cx("h-8 w-8 bg-gradient-to-br", ACCENT, "rounded-xl")}
          />
          <div className="font-black tracking-tight">WriRead</div>
        </div>
        <nav className="ml-6 hidden md:flex gap-2">
          {nav.map((n) => (
            <GhostButton
              key={n.k}
              onClick={() => onNav(n.k)}
              className={cx(current === n.k && "ring-2 ring-amber-300")}
            >
              {n.label}
            </GhostButton>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <GhostButton onClick={onToggleTheme}>
            {theme === "dark" ? "🌙 " + t.dark : "🌞 " + t.light}
          </GhostButton>
          <GhostButton>{(lang || "ru").toUpperCase()} ▾</GhostButton>
          <Button className="hidden sm:inline-flex">{t.signIn}</Button>
        </div>
      </div>
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="mt-10 border-t border-neutral-200 dark:border-neutral-800">
    <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-neutral-600 dark:text-neutral-400 flex flex-col md:flex-row gap-2 md:gap-6">
      <span>© {new Date().getFullYear()} WriRead</span>
      <span>Политика контента · Условия · Контакты</span>
    </div>
  </footer>
);

// ===== Pages =====
const Landing: React.FC<{ t: any; onGetStarted: (page: string) => void }> = ({
  t,
  onGetStarted,
}) => (
  <section>
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-100 via-rose-50 to-white" />
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              WriRead
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-orange-500">
                {t.slogan}
              </span>
            </h1>
            <p className="mt-4 text-neutral-600 text-lg max-w-xl">
              WriRead — пространство для поэтов, писателей и музыкантов.
              Публикуй стихи, истории и музыку, получай донаты и продвигай своё
              творчество.
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
          <div className={cx(CARD, "p-4 bg-white/80")}>
            <GradientBar />
            <div className="grid grid-cols-2 gap-3 mt-4">
              {MOCK_WORKS.slice(0, 4).map((w) => (
                <div
                  key={w.id}
                  className="rounded-xl overflow-hidden border"
                >
                  <img
                    src={w.cover}
                    className="w-full aspect-[3/2] object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-neutral-600">
              Мини-превью ленты
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Tabs: React.FC<{
  tabs: { k: string; label: string }[];
  current: string;
  onChange: (k: string) => void;
}> = ({ tabs, current, onChange }) => (
  <div className="flex gap-2">
    {tabs.map((t) => (
      <button
        key={t.k}
        onClick={() => onChange(t.k)}
        className={cx(
          "px-4 py-2 text-sm font-medium",
          RADIUS,
          "border",
          current === t.k
            ? "bg-white border-amber-300 text-amber-700"
            : "bg-white hover:bg-neutral-50 border-neutral-300"
        )}
      >
        {t.label}
      </button>
    ))}
  </div>
);

const WorkCard: React.FC<{
  t: any;
  item: WorkItem;
  onOpen: (item: WorkItem) => void;
  onDonate: (item: WorkItem) => void;
  onBoost: (item: WorkItem) => void;
  onListen: (item: WorkItem) => void;
}> = ({ t, item, onOpen, onDonate, onBoost, onListen }) => (
  <div className={CARD}>
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
          <h3 className="text-lg font-semibold leading-tight">{item.title}</h3>
          <div className="text-sm text-neutral-600 mt-1">
            {t.byAuthor} {item.author} · {item.genre} · {item.date}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Pill>❤ {num(item.likes)}</Pill>
          <Pill>★ {num(item.donations)}</Pill>
        </div>
      </div>
      <p className="text-neutral-700 mt-3 line-clamp-2">{item.excerpt}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => onOpen(item)} className="px-4 py-2 text-sm">
          {t.cta_read}
        </Button>
        {item.audioUrl && (
          <GhostButton onClick={() => onListen(item)}>
            {t.listen}
          </GhostButton>
        )}
        <GhostButton onClick={() => onDonate(item)}>{t.donate}</GhostButton>
        <GhostButton onClick={() => onBoost(item)}>{t.boost}</GhostButton>
      </div>
    </div>
  </div>
);

const Feed: React.FC<{
  t: any;
  onOpen: (item: WorkItem) => void;
  onDonate: (item: WorkItem) => void;
  onBoost: (item: WorkItem) => void;
  onListen: (item: WorkItem) => void;
}> = ({ t, onOpen, onDonate, onBoost, onListen }) => {
  const [tab, setTab] = useState("top");
  const tabs = [
    { k: "top", label: t.top },
    { k: "new", label: t.new },
    { k: "following", label: t.following },
  ];
  const items = useMemo(() => {
    let arr = [...MOCK_WORKS];
    if (tab === "new") arr = [...MOCK_WORKS].reverse();
    if (tab === "following") arr = MOCK_WORKS.filter((_, i) => i % 2 === 0);
    return arr;
  }, [tab]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <Tabs tabs={tabs} current={tab} onChange={setTab} />
        <GhostButton>Фильтры</GhostButton>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <WorkCard
            key={item.id}
            t={t}
            item={item}
            onOpen={onOpen}
            onDonate={onDonate}
            onBoost={onBoost}
            onListen={onListen}
          />
        ))}
      </div>
    </section>
  );
};

const Work: React.FC<{
  t: any;
  item: WorkItem | null;
  onDonate: (item: WorkItem) => void;
}> = ({ t, item, onDonate }) => {
  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-neutral-600">
        Выберите публикацию из ленты.
      </div>
    );
  }
  return (
    <section className="max-w-3xl mx-auto px-4 py-8">
      <div className={CARD}>
        <img
          src={item.cover}
          className={cx("w-full aspect-[3/2] object-cover", RADIUS)}
        />
        <div className="p-5">
          <h1 className="text-2xl font-bold">{item.title}</h1>
          <div className="text-sm text-neutral-600 mt-1">
            {t.byAuthor} {item.author} · {item.genre} · {item.date}
          </div>
          <p className="mt-4 text-neutral-800">
            <strong>{t.excerpt}:</strong> {item.excerpt}
          </p>
          {item.audioUrl && (
            <div className="mt-4">
              <audio controls className="w-full">
                <source src={item.audioUrl} type="audio/mpeg" />
              </audio>
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            <GhostButton onClick={() => onDonate(item)}>
              {t.donate}
            </GhostButton>
            <GhostButton>{t.share}</GhostButton>
          </div>
        </div>
      </div>
    </section>
  );
};

const Publish: React.FC<{ t: any }> = ({ t }) => {
  const [genre, setGenre] = useState(GENRES[0]);
  const isMusic = genre === "Музыка/Бит";
  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className={cx(CARD, "p-5")}>
        <h2 className="text-xl font-semibold mb-4">{t.publishWork}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-neutral-600">{t.title}</label>
            <input
              className="w-full mt-1 px-4 py-3 border rounded-2xl"
              placeholder="…"
            />
          </div>
          <div>
            <label className="text-sm text-neutral-600">{t.genre}</label>
            <select
              className="w-full mt-1 px-4 py-3 border rounded-2xl"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            {isMusic ? (
              <div>
                <label className="text-sm text-neutral-600">
                  {t.audioFile}
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  className="w-full mt-1 px-4 py-3 border rounded-2xl"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {t.uploadAudio}
                </p>
              </div>
            ) : (
              <div>
                <label className="text-sm text-neutral-600">{t.text}</label>
                <textarea
                  rows={6}
                  className="w-full mt-1 px-4 py-3 border rounded-2xl"
                  placeholder="Начните писать…"
                />
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button className="px-6">{t.publish}</Button>
        </div>
      </div>
    </section>
  );
};

const Profile: React.FC<{ t: any }> = ({ t }) => (
  <section className="max-w-5xl mx-auto px-4 py-8">
    <div className="grid md:grid-cols-3 gap-5">
      <div className={cx(CARD, "p-5")}>
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 bg-gradient-to-br from-amber-300 to-rose-300 rounded-2xl" />
          <div>
            <div className="font-semibold">Михаил</div>
            <div className="text-sm text-neutral-600">Автор</div>
          </div>
        </div>
        <div className="mt-4 text-sm text-neutral-600">{t.yourBalance}</div>
        <div className="mt-1 text-3xl font-extrabold">$ 124.50</div>
        <div className="mt-4 flex gap-2">
          <Button className="px-4 py-2 text-sm">Вывести</Button>
          <GhostButton>История</GhostButton>
        </div>
      </div>
      <div className={cx(CARD, "p-5 md:col-span-2")}>
        <h3 className="font-semibold mb-3">{t.posts}</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {MOCK_WORKS.slice(0, 4).map((w) => (
            <div
              key={w.id}
              className="border rounded-xl overflow-hidden"
            >
              <img
                src={w.cover}
                className="w-full aspect-[3/2] object-cover"
              />
              <div className="p-3">
                <div className="font-medium">{w.title}</div>
                <div className="text-xs text-neutral-600 mt-1">
                  ❤ {num(w.likes)} · ★ {num(w.donations)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ===== Modals =====
const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className={cx("w-full max-w-lg", CARD)}>
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-800"
          >
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
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
  if (!item) return null;
  return (
    <Modal open={open} onClose={onClose} title={`${t.donate}: ${item.title}`}>
      <div className="flex items-center gap-2 mb-3">
        {[3, 5, 10, 20].map((v) => (
          <GhostButton key={v} onClick={() => setAmount(v)}>
            {`$${v}`}
          </GhostButton>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={amount}
          onChange={(e) =>
            setAmount(parseFloat(e.target.value || "0") || 0)
          }
          className="w-32 px-3 py-2 border rounded-xl"
        />
        <Button onClick={onClose}>{t.pay}</Button>
        <GhostButton onClick={onClose}>{t.cancel}</GhostButton>
      </div>
      <p className="text-xs text-neutral-500 mt-3">
        Mock-платёж, позже — реальный провайдер.
      </p>
    </Modal>
  );
};

const ListenModal: React.FC<{
  open: boolean;
  onClose: () => void;
  t: any;
  item: WorkItem | null;
}> = ({ open, onClose, t, item }) => {
  if (!item) return null;
  return (
    <Modal open={open} onClose={onClose} title={`${t.listen}: ${item.title}`}>
      {item.audioUrl ? (
        <audio controls className="w-full">
          <source src={item.audioUrl} type="audio/mpeg" />
        </audio>
      ) : (
        <p className="text-sm text-neutral-600">Аудиофайл недоступен.</p>
      )}
      <div className="mt-4 flex gap-3">
        <GhostButton onClick={onClose}>{t.cancel}</GhostButton>
      </div>
    </Modal>
  );
};

// ===== App =====
export default function App() {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("wriread:lang") || "ru";
    } catch {
      return "ru";
    }
  });
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      return (localStorage.getItem("wriread:theme") as "light" | "dark") ||
        "light";
    } catch {
      return "light";
    }
  });
  const [page, setPage] = useState("landing");
  const [current, setCurrent] = useState<WorkItem | null>(
    MOCK_WORKS[0] || null
  );
  const [donateOpen, setDonateOpen] = useState(false);
  const [listenOpen, setListenOpen] = useState(false);

  const t =
    (DICT as any)[(DICT as any)[lang] ? (lang as keyof typeof DICT) : "en"] ||
    DICT.en;

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

  const handleOpen = (item: WorkItem) => {
    setCurrent(item);
    setPage("work");
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <Header
        t={t}
        current={page}
        onNav={setPage}
        theme={theme}
        onToggleTheme={() =>
          setTheme((prev) => (prev === "dark" ? "light" : "dark"))
        }
        lang={lang}
      />

      {page === "landing" && <Landing t={t} onGetStarted={setPage} />}
      {page === "feed" && (
        <Feed
          t={t}
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
        />
      )}
      {page === "work" && (
        <Work
          t={t}
          item={current}
          onDonate={(it) => {
            setCurrent(it);
            setDonateOpen(true);
          }}
        />
      )}
      {page === "publish" && <Publish t={t} />}
      {page === "profile" && <Profile t={t} />}

      <Footer />

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

      {/* Переключатель языка снизу справа */}
      <div className="fixed bottom-4 right-4">
        <div
          className={cx(
            CARD,
            "p-2 flex gap-2 items-center bg-white/90 dark:bg-neutral-900/90"
          )}
        >
          <select
            className="px-3 py-2 bg-transparent outline-none"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
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
  );
}
