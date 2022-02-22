const axios = require('axios');
const cheerio = require('cheerio');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

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
  'asked for',
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

function main() {
  downloadHTML()
    .then(getAttachmentURL)
    .then(downloadDatabase)
    .then(createJSONDatabase);
}

main();

async function createJSONDatabase(workbook) {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet, { header }).splice(1);
  const json = {
    version: new Date(workbook.Props.ModifiedDate),
    questions: [], // value is inserted below
  };

  json.questions = data.map((row) => ({
    name: row['name'],
    id: row['id'],
    slug: createSlug(row['question PL'], row['id']),
    question: {
      pl: row['question PL'],
      en: row['question ENG'],
      de: row['question DE'],
    },
    answers: {
      pl: {
        a: row['answer A PL'],
        b: row['answer B PL'],
        c: row['answer C PL'],
      },
      en: {
        a: row['answer A ENG'],
        b: row['answer B ENG'],
        c: row['answer C ENG'],
      },
      de: {
        a: row['answer A DE'],
        b: row['answer B DE'],
        c: row['answer C DE'],
      },
    },
    correctAnswer: row['correct answer'],
    media: fixMediaURI(row['media']),
    scope: row['scope'],
    points: row['points'],
    categories: row['categories'].split(','),
    block: row['block name'],
    source: row['question source'],
    askedFor: row['asked for'],
    safety: row['safety'],
    status: row['status'],
    subject: row['subject'],
  }))

  const _path = path.resolve(__dirname, 'data.json');
  fs.writeFileSync(_path, JSON.stringify(json), 'utf8');
}

async function downloadDatabase(url) {
  return axios.get(url, {
    responseType: 'arraybuffer',
  })
    .then((response) => {
      throwIfNot200(response);

      return XLSX.read(response.data);
    });
}

async function getAttachmentURL(html) {
  const $ = cheerio.load(html);
  const attachment = $('.file-download').first()
  let databaseURL = $(attachment).attr('href');
  databaseURL = `https://gov.pl${databaseURL}`;

  return databaseURL;
}

async function downloadHTML() {
  return await axios.get(url)
    .then((response) => {
      throwIfNot200(response);

      return response.data;
    });
}

function throwIfNot200(response) {
  if (response.status !== 200) {
    console.error(response);
    throw new Error('Response is other than 200');
  }
}

function createSlug(question, id) {
  return `${question.substring(0, 65)}-${id}`
    .toLowerCase()
    .replace(/ /g,'-')
    .replace(/[^\w-]+/g,'');
}

function fixMediaURI(media) {
  // copy media string
  let m = `${media}`;
  m = m.trim()
  m = m.replaceAll('.wmv', '.mp4');
  m = m.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // replace accent chars
  m = m.replaceAll(/\u0142/g, 'l'); // replace ł with l
  m = m.replaceAll(/\u0141/g, 'L'); // replace Ł with L
  m = m.replaceAll( /  +/g, ' '); // replace double whitespaces with single ones


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
    m = m.replaceAll(" ", "_")
  }

  m = m.replaceAll("powolny pas_2aorg.mp4", "powolny_pas_2aorg.mp4")
  m = m.replaceAll("Zmiana_pasa_ruchu_53 P.jpg", "Zmiana_pasa_ruchu_53_P.jpg")
  m = m.replaceAll("Klip7 00_00_05-00_00_13~1.mp4", "Klip7_00_00_05-00_00_13-1.mp4")
  m = m.replaceAll("0229D14MM_a - dr.eksp.dwujezd._org.jpg", "0229D14MM_a_-_dr.eksp.dwujezd._org.jpg")
  m = m.replaceAll("774. RONDO_12org.mp4", "774._RONDO_12org.mp4")

  m = m.replaceAll(/\s/g, '')

  return m;
}
