# azubi-toolbox

## Requirements

- [NodeJS](https://nodejs.org/en/) >= 20.9.0
- [Bun](https://bun.sh) >= 1.0.0

### Installation via proto

Install [proto](https://moonrepo.dev/proto) and run:

```bash
proto install bun 1.0
```

```bash
proto install node 20.9
```

## Development

0. Install dependencies:

   ```bash
   bun install
   ```

1. Start the dev server:

   ```bash
   bun dev
   ```

## Testing

0. Install playwright dependencies:

   ```bash
   bunx playwright install --with-deps
   ```

1. Run tests:

   ```bash
   bun run test
   ```
