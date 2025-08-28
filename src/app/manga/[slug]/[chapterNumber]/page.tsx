// app/manga/[slug]/[chapterNumber]/page.tsx
import Image from 'next/image';
import styles from './ChapterReader.module.css';
import Link from 'next/link';

interface Page {
  page_number: number;
  image: string;
}

interface ChapterDetails {
  manga_title: string;
  chapter_number: string;
  pages: Page[];
}

async function getChapterPages(slug: string, chapterNumber: string): Promise<ChapterDetails | null> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/mangas/${slug}/${chapterNumber}/`;
    const res = await fetch(apiUrl, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error('Capítulo não encontrado');
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ChapterReaderPage({ params }: { params: { slug: string; chapterNumber: string } }) {
  const chapter = await getChapterPages(params.slug, params.chapterNumber);

  if (!chapter) {
    return <div>Capítulo não encontrado.</div>;
  }

  return (
    <main className={styles.readerContainer}>
      <div className={styles.readerHeader}>
        <Link href={`/manga/${params.slug}`}>Voltar para {chapter.manga_title}</Link>
        <h1>Capítulo {chapter.chapter_number}</h1>
      </div>
      <div className={styles.pages}>
        {chapter.pages.map((page) => (
          <Image
            key={page.page_number}
            src={page.image}
            alt={`Página ${page.page_number} de ${chapter.manga_title} - Capítulo ${chapter.chapter_number}`}
            width={800} // Ajuste conforme a largura média das suas imagens
            height={1200} // Ajuste conforme a altura média
            priority={page.page_number <= 3} // Prioriza o carregamento das primeiras páginas
            className={styles.pageImage}
          />
        ))}
      </div>
    </main>
  );
}