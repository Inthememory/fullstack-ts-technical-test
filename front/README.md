# Frontend

React and TypeScript frontend for the technical test.

From repository root, use `make` for complete Docker development or
`make local` for host development. Both provide hot reload at
http://localhost:4200.

## Run this service directly

Start the API on port 3000 first, then run:

```bash
yarn install --frozen-lockfile
yarn start
```

The development proxy forwards `/metrics` and `/up` to `API_PROXY_TARGET`,
defaulting to `http://localhost:3000`.

Other commands:

```bash
yarn test --watchAll=false
yarn build
```
