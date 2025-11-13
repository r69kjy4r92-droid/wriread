import { GENRE_KEYS, type GenreKey } from "./i18n";

export type WorkItem = {
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

export function makeMockWorks(): WorkItem[] {
  const res: WorkItem[] = [];
  for (let i = 0; i < 12; i++) {
    const genre = GENRE_KEYS[i % GENRE_KEYS.length] as GenreKey;
    res.push({
      id: `w${i + 1}`,
      title: `Ночное пламя #${i + 1}`,
      author: i % 2 ? "Лира" : "Орфей",
      genre,
      date: "Сегодня",
      likes: Math.floor(Math.random() * 120) + 12,
      donations: Math.floor(Math.random() * 80),
      cover: `https://picsum.photos/seed/wc${i}/900/600`,
      excerpt:
        "Огонь гудит в пустых сосудах тишины, и ночь дышит янтарём...",
      paywalled: i % 3 === 0,
      price: [2.99, 3.99, 4.99][i % 3],
      promo: i % 4 === 0,
      audioUrl:
        genre === "music"
          ? "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          : null,
    });
  }
  return res;
}

export const MOCK_WORKS: WorkItem[] = makeMockWorks();
