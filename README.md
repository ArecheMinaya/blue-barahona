# Larimar Commerce Monorepo

Larimar is now organized as a full-stack pnpm workspace that preserves the original premium storefront while adding production-oriented commerce architecture.

## Workspace Layout

```text
apps/
  api/        Express API for commerce, auth-aware endpoints, and Stripe webhooks
  web/        Next 16 storefront with Supabase auth, account, bag, and checkout flows
packages/
  catalog/    Shared product catalog, shipping methods, and collection filter helpers
  config/     Shared env validation and TypeScript base configs
  types/      Shared commerce and account domain types
supabase/
  migrations/ Commerce schema for profiles, addresses, bag_items, orders, and order_items
```

## Required Environment Variables

Copy the example files and fill in real values:

- `apps/web/.env.example`
- `apps/api/.env.example`

## Commands

```bash
pnpm install
pnpm dev
pnpm dev:web
pnpm dev:api
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Notes

- The web production build uses `next build --webpack` because Turbopack hit a sandbox-level process binding failure while processing CSS in this environment.
- Stripe secret operations live in `apps/api`; the web app only handles client-side checkout confirmation.
- Supabase migrations are included under `supabase/migrations` but still need to be applied to a real project.
