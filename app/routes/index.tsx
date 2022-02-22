import { Link } from 'remix';

export default function Index() {

  return (
    <div>
      <h1>Welcome to Remix</h1>

      <Link to="/app/questions">GO TO APP</Link>

    </div>
  );
}
