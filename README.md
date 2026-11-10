# [Spotify for Car](https://spotifyforcar.com/)

Spotify for Car is a web application that allows a group of users to control music from a central output device while utilizing their personal devices.

## Purpose

This app was created and deployed to solve a problem I shared with a small group of friends. I have made the project public in hopes that people could advise me on what I could improve on and provide a resource for people who could learn something from it. Feel free to reach out if you have any questions or advice or would just like to chat.

## Architecture

A single [Next.js](https://nextjs.org/) app at the repo root (App Router, Cache Components). Server Components read data, Server Actions handle client-triggered reads and mutations (queue polling, search, adding songs), and Route Handlers under `app/api/auth/` only implement the Spotify OAuth flow (`login`, `callback`, `logout`). Users and tokens are stored in MongoDB via Mongoose; sessions are signed JWT cookies. It replaces the old Vite client and separate Express API.

## Local development

Requires Node 20+.

```sh
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # open http://127.0.0.1:3000
```

### Environment variables

| Variable | Description |
| --- | --- |
| `CLIENT_ID` | Spotify app client ID |
| `CLIENT_SECRET` | Spotify app client secret |
| `JWT_SECRET` | Secret used to sign session JWTs |
| `DB_CONNECT` | MongoDB connection URI |
| `APP_URL` | Public origin of the app, e.g. `http://127.0.0.1:3000` locally |

All are server-only; there are no `NEXT_PUBLIC_` variables.

### Spotify dashboard

In your app's settings on the [Spotify developer dashboard](https://developer.spotify.com/dashboard), set the redirect URI to `<APP_URL>/api/auth/callback`. This replaces the old server callback URL. Spotify no longer accepts `localhost` redirect URIs, so for local development register `http://127.0.0.1:3000/api/auth/callback`, set `APP_URL=http://127.0.0.1:3000`, and browse the app at `127.0.0.1` (the login state cookie is tied to the host you start from).

## Tests

End-to-end tests live in `unit_tests/cypress`. They run against a production build of the app on port 3000 and need a root `.env.local`.

```sh
cd unit_tests/cypress
npm install
npm run app        # in one terminal: installs, builds and starts the app
npx cypress open   # in another (or `npx cypress run`)
```

## Deployment

Deployed on [Vercel](https://vercel.com/). Set the five environment variables above in the project settings (with `APP_URL` set to the production origin) and set the project's Root Directory to the repo root (it was previously `client/`). Add the production `<APP_URL>/api/auth/callback` to the Spotify redirect URIs.

## License

See the [LICENSE](https://github.com/orsonjiang/spotify-for-car/blob/main/LICENSE) file.