// app/manga/[slug]/[chapterNumber]/page.tsx
import Image from 'next/image';
import styles from './ChapterReader.module.css';
import Link from 'next/link';

interface Page {
  page_number: number;
  image: string;
}

interface ChapterDetails {
  manga_title: string
  chapter_number: string;
  pages: Page[];
}

async function getChapterPages(slug: string, chapterNumber: string): Promise<ChapterDetails | null> {
  try {
    // A URL deve ser ajustada para o endpoint correto da API de capítulos
    // e usar query parameters para filtrar pelo slug do mangá e o número do capítulo.
    // Presumindo que sua API de Django REST Framework está configurada para filtrar por 'manga__slug' e 'chapter_number'.
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/chapters/?manga__slug=${slug}&chapter_number=${chapterNumber}`;
    console.log("Tentando buscar capítulo na API:", apiUrl);
    const res = await fetch(apiUrl, { cache: 'no-store' });

    console.log("Res: ",res)
    if (!res.ok) {
      // Se a resposta não for 200 OK, lançar um erro
      throw new Error(`Capítulo não encontrado ou erro na API: ${res.status} ${res.statusText}`);
    }

    const data = await res.json(); // A API de /api/chapters/ retorna uma lista

    // Precisamos verificar se a lista não está vazia e pegar o primeiro (e esperado único) item
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Capítulo não encontrado na resposta da API para os parâmetros fornecidos.');
    }

    const chapterData = data[0]; // Pega o primeiro objeto de capítulo da lista

    return {
      manga_title: chapterData.manga,
      chapter_number: chapterData.chapter_number,
      pages: chapterData.pages,
    };
  } catch (error) {
    console.error("Erro ao buscar detalhes do capítulo:", error);
    return null;
  }
}

export default async function ChapterReaderPage({ params }: { params: { slug: string; chapterNumber: string } }) {
  const chapter = await getChapterPages(params.slug, params.chapterNumber);
  console.log("--- Dentro de ChapterReaderPage ---");
  console.log("params.slug:", params.slug);
  console.log("params.chapterNumber:", params.chapterNumber);

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
            width={800} 
            height={1200} 
            priority={page.page_number <= 3}
            className={styles.pageImage}
          />
        ))}
      </div>
    </main>
  );
}
