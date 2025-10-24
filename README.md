# Membership Card SPA

A standalone Single Page Application built with SvelteKit and oidc-client-ts for OIDC authentication.

## Features

- OIDC authentication with oidc-client-ts
- Displays user profile and ID token details
- Built as a standalone SPA using @sveltejs/adapter-static
- Styled with Tailwind CSS
- TypeScript support

## Configuration

Before running the app, update the OIDC configuration in `src/lib/auth.ts`:

```typescript
const userManager = new UserManager({
	authority: 'https://your-oidc-provider.com', // Your OIDC provider's authority URL
	client_id: 'your-client-id', // Your client ID
	redirect_uri: 'http://localhost:5173/callback', // Callback URL (update for production)
	response_type: 'code',
	scope: 'openid profile email'
});
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The built files will be in the `build/` directory, ready to be deployed to any static hosting service.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript checks
- `npm run format` - Format code with Prettier
- `npm run lint` - Lint code with ESLint
