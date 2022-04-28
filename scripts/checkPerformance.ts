import _ from 'lodash';
import JSONDatabase from '../app/data/data.json';

const dataset = JSONDatabase as Dataset;

const category = 'B';

interface Result {
  time: number;
  name: string;
}

interface Results {
  results: Result[];
  tries: number;
}

const checkPerformance = (tries: number, log = true, ...args: Function[]): Results => {
  const results = ({
    tries,
    results: args.map((arg) => {
      const start = performance.now();
      for (let i = 0; i < tries; i++) {
        arg();
      }
      const time = performance.now() - start;

      return {
        time,
        name: arg.name,
      } as Result;
    }),
  });

  if (log) {
    console.log(results);
  }

  return results;
};

const getRandomQuestion = (): Question => {
  const randomId = _.sample(dataset.byCategory.B) as Question['id'];
  return dataset.byId[randomId];
};

checkPerformance(1e6, true, getRandomQuestion);
