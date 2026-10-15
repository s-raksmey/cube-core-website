# Public website UI

The public site follows the news layout of `management-console-web`: a fixed light header with category/topic navigation, search, language and theme controls; a featured-story hero; lead and supporting stories; a popular-news rail; category sections; article archives and detail pages; and a dark footer. Visual assets and local fonts are stored in `public/` so builds do not depend on Google Fonts.

The header uses the same full-width category mega menu, with configured subcategories grouped into columns and an empty state when none exist. Breaking stories use the red, dismissible banner with automatic rotation and story selectors. Featured articles drive the home carousel with the reference red-tinted overlay and bottom-left navigation controls; when no featured article exists, the latest published articles supply slides. The home news grid uses a lead story, supporting stack, popular rail, and compact category sections. It expands the lead story when there are no supporting articles.

The implementation stays within Cube Core's own structure:

- `src/app/(site)` contains route composition and request-specific data loading.
- `src/components/site` contains reusable presentation, including the header, cards, archives, carousel, and Markdown renderer.
- `src/lib/public-site.ts` resolves the active tenant from the hostname and reads the locale cookie.
- `src/lib/public-content.ts` sends server-side, read-only GraphQL operations from `src/graphql/public-content.gql`.
- `src/types/public-content.ts` derives view types from GraphQL codegen.

The site resolves a verified WEBSITE hostname to one active SUB tenant, then sends its tenant ID only from server-side code. The GraphQL server rechecks that tenant before returning public data. Local `localhost` development uses the configured local-development tenant. Configured categories and subcategories appear in navigation even when empty; tags appear once attached to a published article. Article pages use the category/topic/slug path, and tag archives use `/tags/:slug`. Draft, review, scheduled, archived, and future-dated articles are excluded. The website proxies stored public branding assets at `/tenant-assets/*`, allowing an internal GraphQL server URL without broken visitor-facing images.

Set `GRAPHQL_SERVER_URL` to the server's `/graphql` endpoint in the website environment. Configure and verify each SUB tenant's WEBSITE hostname in Cube Core, and point that hostname at this Next.js deployment. Publishing an article in the sub-tenant console makes it available on the public site on the next request; the public reads use no-store fetches. The website has no browser GraphQL proxy; it sends only the dedicated public operations from server components.

The public API returns only published article content for an active SUB tenant. Category and topic menus include configured sections, and empty archive pages show an empty state. The homepage uses published featured articles for the carousel and falls back to the latest published stories. Breaking news appears only when an article is both published and marked breaking. Comments, reader accounts, advertising slots, and managed carousel slides are not available in Cube Core's current public data model, so the UI does not present controls for them.
