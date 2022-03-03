import { Outlet } from 'remix';
import type { MetaFunction } from 'remix';
import PageOffset from '~/components/PageOffset';

export const meta: MetaFunction = () => ({
  title: 'lobcar - Egzamin',
  description: 'Sprawdź swoją wiedzę rozwiązując egzamin',
});

// FIXME: UI on mobile is bruh
export default function Exam() {
  return (
    <PageOffset>
      <Outlet />
    </PageOffset>
  );
}
