// app/manga/[slug]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './MangaDetail.module.css';

// Tipagens para os dados detalhados do mangá
interface Chapter {
  chapter_number: string;
  title: string;
}

interface MangaDetails {
  title: string;
  description: string;
  cover_image: string;
  author: { name: string };
  artist: { name: string };
  status: string;
  slug: string;
  chapters: Chapter[];
}

// Função para buscar os detalhes de um mangá específico
async function getMangaDetails(slug: string): Promise<MangaDetails | null> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/mangas/${slug}/`;
    const res = await fetch(apiUrl, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error('Mangá não encontrado');
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// O `params` vem da URL (o valor de [slug])
export default async function MangaDetailPage({ params }: { params: { slug: string } }) {
  const manga = await getMangaDetails(params.slug);
  console.log(manga)

  if (!manga) {
    return <div>Mangá não encontrado.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Image
          src={manga.cover_image}
          alt={`Capa de ${manga.title}`}
          width={250}
          height={375}
          className={styles.coverImage}
        />
        <div className={styles.info}>
          <h1>{manga.title}</h1>
          <p><strong>Autor:</strong> {manga.author.name}</p>
          <p><strong>Artista:</strong> {manga.artist.name}</p>
          <p><strong>Status:</strong> {manga.status}</p>
          <p className={styles.description}>{manga.description}</p>
        </div>
      </div>


      <div className={styles.chaptersSection}>
        <h2>Capítulos</h2>
        <ul className={styles.chapterList}>
          {manga.chapters.map((chapter) => (
            <li key={chapter.chapter_number}>
              <Link href={`/manga/${params.slug}/${parseFloat(chapter.chapter_number)}`}>
                Capítulo {chapter.chapter_number} {chapter.title && `- ${chapter.title}`}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>

  );
}
