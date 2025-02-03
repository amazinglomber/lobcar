import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { sys } from 'typescript';

const URL = 'https://www.gov.pl/web/infrastruktura/prawo-jazdy';
const header = [
  'name',
  'id',
  'question PL',
  'answer A PL',
  'answer B PL',
  'answer C PL',
  'question ENG',
  'answer A ENG',
  'answer B ENG',
  'answer C ENG',
  'question DE',
  'answer A DE',
  'answer B DE',
  'answer C DE',
  'correct answer',
  'media',
  'scope',
  'points',
  'categories',
  'block name',
  'question source',
  'asking for',
  'safety',
  'status',
  'subject',
  'question SIGN PJM',
  'answer A SIGN PJM',
  'answer B SIGN PJM',
  'question SIGN SJM',
  'answer A SIGN SJM',
  'answer B SIGN SJM',
  'answer C SIGN SJM',
];

// const prisma = new PrismaClient();

async function main() {
  console.log('== DATABASE GENERATOR ==');

  // downloadHTML()
  // .then(getAttachmentURL)
  // .then(downloadDatabase)

  const file = readXlsxFile('./app/data/data_22_02_2022r.xlsx');
  readData(file)
    .then(createJSONDatabase)
    .then(generateSitemap)
    .then(() => console.log('== FINISHED =='));
}

main()
  .catch((e) => {
    throw e;
  });
// .finally(async () => {
//   await prisma.$disconnect();
// });

// byId contains all questions as a hashmap with the key being an id
// byCategory contains IDs (to reduce the size) of questions filtered by id
// ids contains all question IDs
// categories contains all categories
interface JSONDatabase {
  byId: {
    [key: Question['id']]: Question;
  };
  byCategory: {
    [key: string]: Set<Question['id']>;
  };
  ids: Set<string>;
  categories: Set<string>;
}

// Creates denormalized JSON database of questions
async function createJSONDatabase(data: XLSXQuestionRow[]) {
  console.log('Creating denormalized JSON database...');

  const database: JSONDatabase = {
    byId: {},
    byCategory: {},
    ids: new Set<XLSXQuestionRow['id']>(),
    categories: new Set<string>(),
  };

  data.forEach((row) => {
    const { id } = row;
    const categories = row.categories.split(',');
    const question: Question = {
      id,
      name: row.name,
      slug: createSlug(row['question PL'], row.id),
      media: fixMediaURI(row.media),
      correctAnswer: row['correct answer'],
      scope: row.scope === 'PODSTAWOWY' ? 'basic' : 'advanced',
      points: +row.points,
      block: row['block name'],
      source: row['question source'],
      askingFor: row['asking for'],
      safety: row.safety,
      status: row.status,
      subject: row.subject,
      categories,
      translations: {
        pl: {
          question: row['question PL'],
          answers: {
            a: row['answer A PL'],
            b: row['answer B PL'],
            c: row['answer C PL'],
          },
        },
        en: {
          question: row['question ENG'],
          answers: {
            a: row['answer A ENG'],
            b: row['answer B ENG'],
            c: row['answer C ENG'],
          },
        },
        de: {
          question: row['question DE'],
          answers: {
            a: row['answer A DE'],
            b: row['answer B DE'],
            c: row['answer C DE'],
          },
        },
      },
    };

    database.ids.add(id);
    database.byId[id] = question;
    categories.forEach((cat) => database.categories.add(cat));
    database.byCategory = categories.reduce(
      (acc, curr) => (acc[curr] !== undefined ? acc[curr].add(id) : acc[curr] = new Set([id]), acc),
      database.byCategory,
    );
  });

  // Concert sets to arrays
  const databaseJSON = JSON.stringify(
    database,
    (key, value) => (value instanceof Set ? Array.from(value) : value),
  );
  fs.writeFileSync('./app/data/data.json', databaseJSON);

  return database;
}

async function generateSitemap(database: JSONDatabase) {
  console.log('Generating sitemap.xml...');

  const questionUrls = Array.from(database.ids).map((id: string) => {
    const question = database.byId[id];

    return [
      '  <url>',
      `    <loc>https://lobcar.niezurawski.com/app/questions/${question.slug}</loc>`,
      '    <priority>0.8</priority>',
      '  </url>',
    ].join('\n');
  }).join('\n');

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url>',
    '    <loc>https://lobcar.niezurawski.com</loc>',
    '    <priority>1.0</priority>',
    '  </url>',
    '  <url>',
    '    <loc>https://lobcar.niezurawski.com/app/questions</loc>',
    '    <priority>0.7</priority>',
    '  </url>',
    '  <url>',
    '    <loc>https://lobcar.niezurawski.com/app/exam</loc>',
    '    <priority>0.7</priority>',
    '  </url>',
    '  <url>',
    '    <loc>https://lobcar.niezurawski.com/app/random</loc>',
    '  </url>',
    questionUrls,
    '</urlset>',
  ].join('\n');

  fs.writeFileSync('./public/sitemap.xml', sitemap);
}

async function readData(workbook: XLSX.WorkBook): Promise<XLSXQuestionRow[]> {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { header }).splice(1) as XLSXQuestionRow[];
}

async function downloadDatabase(url: string): Promise<XLSX.WorkBook> {
  console.log('Downloading question dataset...');

  return axios.get(url, {
    responseType: 'arraybuffer',
  })
    .then((response) => {
      throwIfNot200(response);

      return XLSX.read(response.data);
    });
}

function readXlsxFile(filename: string) {
  return XLSX.readFile(filename);
}

async function getAttachmentURL(html: string) {
  console.log('Looking for dataset file attachment...');

  const $ = cheerio.load(html);
  const attachment = $('.file-download').first();
  let databaseURL = $(attachment).attr('href');
  databaseURL = `https://gov.pl${databaseURL}`;

  return databaseURL;
}

async function downloadHTML(): Promise<string> {
  console.log('Downloading HTML...');

  return axios.get<string>(URL)
    .then((response) => {
      throwIfNot200(response);

      return response.data;
    });
}

function throwIfNot200(response: AxiosResponse) {
  if (response.status !== 200) {
    console.error(response);
    throw new Error('Response is other than 200');
  }
}

function createSlug(question: string, id: string) {
  return `${question.substring(0, 65)}-${id}`
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}

function fixMediaURI(media: string) {
  // copy media string
  let m = media.trim()
    .replace(/.wmv/g, '.mp4')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // replace accent chars
    .replace(/\u0142/g, 'l') // replace ł with l
    .replace(/\u0141/g, 'L') // replace Ł with L
    .replace(/  +/g, ' '); // replace double whitespaces with single ones

  // one exception that will be wrongly "fixed" by below script
  if (m === '1.5.1.-3 IMG_0720orgbm.jpg') return m;

  if (
    ['W11', 'w11', 'JAZDA', '5-', 'G-', 'GM_', 'A-', '1.5.2', '3-'].some((prefix) => m.startsWith(prefix))
    || ['dod.', 'orgbez', 'po korekcie', 'orgbm', 'org po', 'org3po', 'orgpo'].some((prefix) => m.includes(prefix))
  ) {
    m = m.replace(/ /g, '_');
  }

  m = m.replace('powolny pas_2aorg.mp4', 'powolny_pas_2aorg.mp4')
    .replace('Zmiana_pasa_ruchu_53 P.jpg', 'Zmiana_pasa_ruchu_53_P.jpg')
    .replace('Klip7 00_00_05-00_00_13~1.mp4', 'Klip7_00_00_05-00_00_13-1.mp4')
    .replace('0229D14MM_a - dr.eksp.dwujezd._org.jpg', '0229D14MM_a_-_dr.eksp.dwujezd._org.jpg')
    .replace('774. RONDO_12org.mp4', '774._RONDO_12org.mp4')
    .replace(/\s/g, '');

  return `https://d2v1k3xewbu9zy.cloudfront.net/${m}`;
}
