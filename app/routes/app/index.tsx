import { redirect } from 'remix';

// ======= Redirect user from /app to /app/questions =======
export const loader = async () => {
  throw redirect('/app/questions');
}
// =========================================================
