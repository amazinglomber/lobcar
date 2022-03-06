import type { LoaderFunction } from 'remix';
import { getAllQuestionsWithoutTranslations } from '~/data';

export const loader: LoaderFunction = async () => {
  const questions = await getAllQuestionsWithoutTranslations();

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    
      <url>
        <loc>https://lobcar.niezurawski.com/</loc>
        <priority>1.0</priority>
      </url>
      
      <url>
        <loc>https://lobcar.niezurawski.com/app/questions</loc>
        <priority>0.7</priority>
      </url>  
      
      <url>
        <loc>https://lobcar.niezurawski.com/app/exam</loc>
        <priority>0.7</priority>
      </url>
      
      <url>
        <loc>https://lobcar.niezurawski.com/app/random</loc>
      </url>
      
      ${questions.map((question) => (
    `<url>
          <loc>https://lobcar.niezurawski.com/app/questions/${question.slug}</loc>
          <priority>0.8</priority>
        </url>`
  ))}
    </urlset>
  `.trim();

  return new Response(sitemap, {
    headers: {
      'Cache-Control': `public, max-age=${604800 /* ONE WEEK */}`,
      'Content-Type': 'application/xml',
      'Content-Length': String(Buffer.byteLength(sitemap)),
    },
  });
};
