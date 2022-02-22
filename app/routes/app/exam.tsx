import type { MetaFunction } from 'remix';

export const meta: MetaFunction = () => {
  return {
    title: `lobcar - Egzamin`,
    description: 'Sprawdź swoją wiedzę rozwiązując egzamin',
  };
};

export default function Question() {
  return (
    <div>
      <h1>egzamin</h1>

      {/*<h2>{question.question.pl}</h2>*/}
    </div>
  );
}
