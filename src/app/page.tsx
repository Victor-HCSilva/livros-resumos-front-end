// app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './Home.module.css';

// Tipagem para os dados do mangá que esperamos da API
interface Manga {
  id: number;
  title: string;
  slug: string;
  cover_image: string;
}


async function getMangas(): Promise<Manga[]> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/mangas/`;

  // LOG 1: Vamos ver se a URL está correta
  console.log(`Buscando dados da API em: ${apiUrl}`);

  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });

    // LOG 2: Vamos ver o status da resposta da API
    console.log(`Status da resposta da API: ${res.status}`);

    if (!res.ok) {
      throw new Error('Falha ao buscar os mangás da API');
    }

    const data = await res.json();

    // LOG 3: Vamos ver se os dados chegaram
    console.log('Dados recebidos com sucesso:', data);

    return data;

  } catch (error) {
    // LOG 4: Se der erro, vamos ver qual foi o erro
    console.error('Ocorreu um erro ao tentar buscar os dados:', error);
    return [];
  }
}


export default async function HomePage() {
  const mangas = await getMangas();

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Leituras disponíveis</h1>

      {/* ↓↓↓ ESSA DIV É A CHAVE PARA O LAYOUT DE GRADE ↓↓↓ */}
      <div className={styles.grid}>
        {mangas.length > 0 ? (
          mangas.map((manga) => (
            <Link href={`/manga/${manga.slug}`} key={manga.id} className={styles.card}>
              <Image
                src={manga.cover_image}
                alt={`Capa de ${manga.title}`}
                width={200}
                height={300}
                className={styles.coverImage}
              />
              <h2>{manga.title}</h2>
            </Link>
          ))
        ) : (
          <p>Nenhum mangá encontrado. Verifique se a sua API está rodando.</p>
        )}
      </div>

    </main>
  );
}
