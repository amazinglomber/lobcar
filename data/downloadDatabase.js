"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var axios_1 = require("axios");
var cheerio_1 = require("cheerio");
var XLSX = require("xlsx");
var client_1 = require("@prisma/client");
var url = 'https://www.gov.pl/web/infrastruktura/prawo-jazdy';
var header = [
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
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            downloadHTML()
                .then(getAttachmentURL)
                .then(downloadDatabase)
                .then(createSQLiteDatabase);
            return [2 /*return*/];
        });
    });
}
main()["catch"](function (e) {
    throw e;
})["finally"](function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function createSQLiteDatabase(workbook) {
    return __awaiter(this, void 0, void 0, function () {
        var sheet, data, i, row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sheet = workbook.Sheets[workbook.SheetNames[0]];
                    data = XLSX.utils.sheet_to_json(sheet, { header: header }).splice(1);
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < data.length)) return [3 /*break*/, 4];
                    row = data[i];
                    return [4 /*yield*/, prisma.question.create({
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
                                    connectOrCreate: row['categories'].split(',').map(function (category) { return ({
                                        where: {
                                            name: category
                                        },
                                        create: {
                                            name: category
                                        }
                                    }); })
                                },
                                translations: {
                                    create: [
                                        {
                                            languageCode: 'pl',
                                            questionContent: row['question PL'],
                                            answerA: row['answer A PL'],
                                            answerB: row['answer B PL'],
                                            answerC: row['answer C PL']
                                        },
                                        {
                                            languageCode: 'en',
                                            questionContent: row['question ENG'],
                                            answerA: row['answer A ENG'],
                                            answerB: row['answer B ENG'],
                                            answerC: row['answer C ENG']
                                        },
                                        {
                                            languageCode: 'de',
                                            questionContent: row['question DE'],
                                            answerA: row['answer A DE'],
                                            answerB: row['answer B DE'],
                                            answerC: row['answer C DE']
                                        },
                                    ]
                                }
                            }
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function downloadDatabase(url) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, axios_1["default"].get(url, {
                    responseType: 'arraybuffer'
                })
                    .then(function (response) {
                    throwIfNot200(response);
                    return XLSX.read(response.data);
                })];
        });
    });
}
function getAttachmentURL(html) {
    return __awaiter(this, void 0, void 0, function () {
        var $, attachment, databaseURL;
        return __generator(this, function (_a) {
            $ = cheerio_1["default"].load(html);
            attachment = $('.file-download').first();
            databaseURL = $(attachment).attr('href');
            databaseURL = "https://gov.pl".concat(databaseURL);
            return [2 /*return*/, databaseURL];
        });
    });
}
function downloadHTML() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"].get(url)
                        .then(function (response) {
                        throwIfNot200(response);
                        return response.data;
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function throwIfNot200(response) {
    if (response.status !== 200) {
        console.error(response);
        throw new Error('Response is other than 200');
    }
}
function createSlug(question, id) {
    return "".concat(question.substring(0, 65), "-").concat(id)
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
}
function fixMediaURI(media) {
    // copy media string
    var m = "".concat(media);
    m = m.trim();
    m = m.replace(/.wmv/g, '.mp4');
    m = m.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // replace accent chars
    m = m.replace(/\u0142/g, 'l'); // replace ł with l
    m = m.replace(/\u0141/g, 'L'); // replace Ł with L
    m = m.replace(/  +/g, ' '); // replace double whitespaces with single ones
    // one exception that will be wrongly "fixed" by below script
    if (m === "1.5.1.-3 IMG_0720orgbm.jpg")
        return m;
    if (m.startsWith('W11') ||
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
        m.includes('orgpo')) {
        m = m.replace(/ /g, "_");
    }
    m = m.replace("powolny pas_2aorg.mp4", "powolny_pas_2aorg.mp4");
    m = m.replace("Zmiana_pasa_ruchu_53 P.jpg", "Zmiana_pasa_ruchu_53_P.jpg");
    m = m.replace("Klip7 00_00_05-00_00_13~1.mp4", "Klip7_00_00_05-00_00_13-1.mp4");
    m = m.replace("0229D14MM_a - dr.eksp.dwujezd._org.jpg", "0229D14MM_a_-_dr.eksp.dwujezd._org.jpg");
    m = m.replace("774. RONDO_12org.mp4", "774._RONDO_12org.mp4");
    m = m.replace(/\s/g, '');
    return m;
}
