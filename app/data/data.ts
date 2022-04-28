import _ from 'lodash';
import JSONDatabase from './data.json';

const dataset = JSONDatabase as Dataset;

const filterQuestionsByCategory = (category: Category): Question[] => dataset.byCategory[category].map((id) => dataset.byId[id]);

export const getQuestionBySlug = (slug: Question['slug']): Question | undefined => {
  const id = slug.split('-').at(-1);

  if (id === undefined) {
    return undefined;
  }

  return dataset.byId[id];
};

export const getAllQuestions = (category: Category, take: number, skip: number): Question[] => {
  const questions = filterQuestionsByCategory(category);
  return questions.splice(skip, take);
};

export const getRandomQuestion = (category: Category): Question => {
  const randomId = _.sample(dataset.byCategory[category]) as Question['id'];
  return dataset.byId[randomId];
};

export const getExam = (category: Category): Question[] => {
  const questions = filterQuestionsByCategory(category);

  const basic1: Question[] = [];
  const basic2: Question[] = [];
  const basic3: Question[] = [];
  const adv1: Question[] = [];
  const adv2: Question[] = [];
  const adv3: Question[] = [];

  questions.forEach((q) => {
    if (q.scope === 'basic') {
      if (q.points === 3) {
        basic3.push(q);
      } else if (q.points === 2) {
        basic2.push(q);
      } else {
        basic1.push(q);
      }
    } else if (q.points === 3) {
      adv3.push(q);
    } else if (q.points === 2) {
      adv2.push(q);
    } else {
      adv1.push(q);
    }
  });

  return [
    ..._.sampleSize(basic3, 10),
    ..._.sampleSize(basic2, 6),
    ..._.sampleSize(basic1, 4),
    ..._.sampleSize(adv3, 6),
    ..._.sampleSize(adv2, 4),
    ..._.sampleSize(adv1, 2),
  ];
};

export const getCategories = (): Category[] => dataset.categories;
