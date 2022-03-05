import { redirect } from 'remix';

export const loader = async () => {
  throw redirect('/app/questions');
};
