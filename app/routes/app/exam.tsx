import type { MetaFunction } from 'remix';
import { Outlet } from 'remix';
import PageOffset from '~/components/PageOffset';

export const meta: MetaFunction = () => ({
  title: 'lobcar - Egzamin',
  description: 'Sprawdź swoją wiedzę rozwiązując egzamin',
});

export default function Exam() {
  return (
    <PageOffset>
      <Outlet />
    </PageOffset>
  );
}
