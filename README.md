# expo-router redirects repro

Reproduces two problems with the `redirects` option of the expo-router config plugin on native (expo-router 58.0.31, SDK 58).

```sh
npm install
npx jest -t "old/123"
npx jest -t "invoices"
npx jest -t "a /old redirect"
npx jest -t "a /old-secret-page redirect"
```

Run them one at a time. The `/old` redirect case loops forever, so Jest never finishes that one.

## 1. A redirect source matches as a prefix

- `{ source: "/old", destination: "/new" }` also redirects `/old/123` to `/new`, while `app/old/[id].tsx` exists. The test fails, it renders `new`.
- `{ source: "/invoices", destination: "/invoices/list" }` keeps redirecting `/invoices/list` to itself and ends in `RangeError: Maximum call stack size exceeded`.

The app in `app/` has the same redirects in `app.json`, with links to both paths on the home screen.

## 2. Generated redirect routes become the Stack.Protected fallback

- The root layout guards `(auth)` with `Stack.Protected` and shows `login` when logged out.
- With `{ source: "/old", destination: "/secret" }`, a logged-out start on `/` loops with "Maximum update depth exceeded".
- With `{ source: "/old-secret-page", destination: "/secret" }` it shows `login` as expected. The only difference is that the name is longer than `login`.
