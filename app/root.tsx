import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";

import styles from "./tailwind.css";
import type { MetaFunction } from "remix";

export function links() {
  return [{rel: "stylesheet", href: styles}];
}

export const meta: MetaFunction = () => {
  return {
    title: `Darmowe testy na prawo jazdy ${new Date().getUTCFullYear()} - lobcar`,
    description: 'W pełni darmowe testy na prawo jazdy, bez rejestracji. Oficjalna baza pytań 2022. ' +
      'Wszystkie kategorie A, B, C, D, T, AM, A1, A2, B1, C1, D1, PT - pozwolenie na tramwaj.'
  };
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <Meta/>
        <Links/>
      </head>
      <body className="h-screen bg-white dark:bg-surface-dp0 dark:text-white transition duration-500">
        <Outlet/>
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
      </body>
    </html>
  );
}
