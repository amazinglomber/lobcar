import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import * as XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const url = 'https://www.gov.pl/web/infrastruktura/prawo-jazdy';
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

const prisma = new PrismaClient();

async function main() {
  downloadHTML()
    .then(getAttachmentURL)
    .then(downloadDatabase)
    .then(createSQLiteDatabase);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function createSQLiteDatabase(workbook: XLSX.WorkBook) {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet, { header }).splice(1) as any;

  // const media = data.map((row: any) => fixMediaURI(row['media']));

  // fs.writeFileSync('./data.json', Buffer.from(JSON.stringify(media)));

  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    await prisma.question.create({
      data: {
        id: row['id'],
        name: row['name'],
        slug: createSlug(row['question PL'], row['id']),
        media: fixMediaURI(row['media']),
        correctAnswer: row['correct answer'],
        scope: row['scope'] === 'PODSTAWOWY' ? 'basic' : 'advanced',
        points: parseInt(row['points']),
        block: row['block name'],
        source: row['question source'],
        askingFor: row['asking for'],
        safety: row['safety'],
        status: row['status'],
        subject: row['subject'],
        categories: {
          connectOrCreate: (row['categories'] as string).split(',').map((category) => ({
            where: {
              name: category,
            },
            create: {
              name: category,
            },
          })),
        },
        translations: {
          create: [
            {
              languageCode: 'pl',
              questionContent: row['question PL'],
              answerA: row['answer A PL'],
              answerB: row['answer B PL'],
              answerC: row['answer C PL'],
            },
            {
              languageCode: 'en',
              questionContent: row['question ENG'],
              answerA: row['answer A ENG'],
              answerB: row['answer B ENG'],
              answerC: row['answer C ENG'],
            },
            {
              languageCode: 'de',
              questionContent: row['question DE'],
              answerA: row['answer A DE'],
              answerB: row['answer B DE'],
              answerC: row['answer C DE'],
            },
          ],
        },
      },
    })
  }
}

async function downloadDatabase(url: string) {
  return axios.get(url, {
    responseType: 'arraybuffer',
  })
    .then((response) => {
      throwIfNot200(response);

      return XLSX.read(response.data);
    });
}

async function getAttachmentURL(html: string) {
  const $ = cheerio.load(html);
  const attachment = $('.file-download').first()
  let databaseURL = $(attachment).attr('href');
  databaseURL = `https://gov.pl${databaseURL}`;

  return databaseURL;
}

async function downloadHTML(): Promise<string> {
  return await axios.get<string>(url)
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
    .replace(/ /g,'-')
    .replace(/[^\w-]+/g,'');
}

function fixMediaURI(media: string) {
  // copy media string
  let m = `${media}`;
  m = m.trim()
  m = m.replace(/.wmv/g, '.mp4');
  m = m.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // replace accent chars
  m = m.replace(/\u0142/g, 'l'); // replace ł with l
  m = m.replace(/\u0141/g, 'L'); // replace Ł with L
  m = m.replace( /  +/g, ' '); // replace double whitespaces with single ones

  // one exception that will be wrongly "fixed" by below script
  if (m === "1.5.1.-3 IMG_0720orgbm.jpg") return m;

  if (
    m.startsWith('W11') ||
    m.startsWith('w11') ||
    m.startsWith('JAZDA') ||
    m.startsWith('5-') ||
    m.startsWith('G-') ||
    m.startsWith('GM_') ||
    m.startsWith('A-') ||
    m.startsWith('1.5.2') ||
    m.startsWith('3-') ||
    m.includes('dod.') ||
    m.includes('orgbez') ||
    m.includes('po korekcie') ||
    m.includes('orgbm') ||
    m.includes('org po') ||
    m.includes('org3po') ||
    m.includes('orgpo')
  ) {
    m = m.replace(/ /g, "_")
  }

  m = m.replace("powolny pas_2aorg.mp4", "powolny_pas_2aorg.mp4")
  m = m.replace("Zmiana_pasa_ruchu_53 P.jpg", "Zmiana_pasa_ruchu_53_P.jpg")
  m = m.replace("Klip7 00_00_05-00_00_13~1.mp4", "Klip7_00_00_05-00_00_13-1.mp4")
  m = m.replace("0229D14MM_a - dr.eksp.dwujezd._org.jpg", "0229D14MM_a_-_dr.eksp.dwujezd._org.jpg")
  m = m.replace("774. RONDO_12org.mp4", "774._RONDO_12org.mp4")

  m = m.replace(/\s/g, '')

  return m;
}
