# Studio Log Native Architecture

## Stack Recommendation

The recommended milestone-1 stack is React Native with Expo and TypeScript.

Tradeoffs:

- iPhone quality: SwiftUI has the highest native ceiling, but React Native can ship App Store-quality iPhone UX when the design is mobile-specific and the app avoids webview-style patterns. Expo gives native camera, photo, file, SQLite, sharing, and iOS build support.
- Codemagic builds: Expo prebuild creates a normal iOS project that Codemagic can archive and upload to TestFlight with standard signing.
- TestFlight: Codemagic can use App Store Connect API keys, distribution certificates, and provisioning profiles without local secrets.
- Camera/photo handling: Expo Image Picker, Image Manipulator, File System, and Sharing cover milestone-1 capture/import/compression/export. If deeper camera control is needed later, Expo prebuild still permits native module additions.
- Offline data: SQLite stores structured records. Photos live in app document storage. This is more durable than browser localStorage/IndexedDB and appropriate for large studio photo workflows.
- Future cloud sync: The repository layer isolates storage so a sync engine can later mirror local mutations to Supabase, CloudKit-backed services, or a custom API. Sync should not be bolted directly into screens.
- Maintainability: TypeScript domain models and storage boundaries are more maintainable than a single PWA script. SwiftUI should be reconsidered only if the product becomes iOS-only and development moves to a Mac/Xcode workflow.

Flutter was not selected because it adds a separate Dart stack without a clear advantage for this workspace. SwiftUI was not selected for milestone 1 because local iteration from this Windows workspace would depend entirely on CI.

## Architecture

- `src/domain`: typed studio entities, seed data, model smoke tests.
- `src/storage`: SQLite record repository, photo file storage, JSON backup/export/import.
- `src/store`: React context that exposes records, photos, mutations, photo capture/import, and backup actions.
- `src/screens`: mobile-first screens for dashboard, inventory, recipes, projects, kiln, gallery, and studio OS modules.
- `src/components`: reusable cards, photo rails, buttons, and quick-add form modal.

The database uses a flexible record table for milestone speed:

- `records(id, type, title, payload, updated_at, search_text)`
- `photos(id, owner_id, owner_type, uri, payload, created_at)`

This keeps milestone 1 durable and flexible while the product model is still expanding. Milestone 2 should add migration-tested tables for high-volume formulas, firings, tasks, and sales analytics if query complexity grows.

## Data Model

Primary entity types:

- Inventory: clay, glaze materials, chemicals, tools, equipment, consumables, vendors, cost, units, reorder alerts, SDS notes, lot numbers, locations, barcode/QR fields.
- Recipes: glazes, slips, clay bodies, underglazes, stains, washes, percentage formulas, batch size, cost fields, cone, atmosphere, schedule link, defects, version history fields, test tile links.
- Glaze tests: linked recipe, clay body, application, cone, atmosphere, surface, rating, defect tags, test tile photos.
- Kiln firings: kiln name, status, cone, atmosphere, ramp/hold steps, load photos, shelves/posts future fields, maintenance notes, energy/firing cost, reminders.
- Projects: idea through sold stages, tasks, notes, dimensions, materials, linked recipes, linked firings, linked pieces, photos.
- Pieces: bisque and finished gallery records, pricing, cost/profit fields, sale status, customer/commission fields, collection names, tags.
- Pricing: material, labor, firing, overhead, wholesale, retail, margin, consignment fields.
- Social assets: platform plans, content status, caption drafts, hashtags, linked photos/pieces, export workflow status.
- Inspiration: reference photos, notes, links, sketches, tags, conversion to project.
- Customers and sales: customer details, sale date, marketplace, consignment, commission info.
- Shared recipes: private/link/public visibility, moderation status, support contact.

## App Store Risks

Recipe sharing and social/community features create user-generated content risk. Public sharing should not ship until the app includes:

- Report content workflow.
- Block user workflow.
- Moderation queue and content removal process.
- Support/contact route in-app and in App Store metadata.
- Terms/EULA covering objectionable content and recipe safety limitations.
- Ability to remove reported content within App Store policy expectations.

Chemicals and kiln schedules also carry safety/liability risk. The app should present SDS/safety notes as user-managed studio records, not as authoritative safety advice. Avoid claims that recipes or firing schedules are safe for food, thermal shock, toxicity, or regulatory compliance unless backed by tested standards.

## Phased Roadmap

1. Milestone 1: native offline studio core with dashboard, inventory, recipes, projects, kiln, gallery, photo capture/import, backup/export/import, and TestFlight build path.
2. Milestone 2: formula engine, batch scaling, cost per batch, recipe version history, before/after glaze tests, firing load details, piece lifecycle moves, pricing calculator.
3. Milestone 3: account and cloud sync, conflict resolution, encrypted remote backups, device restore, optional collaboration.
4. Milestone 4: private recipe sharing and share links; public community only after moderation/report/block/support workflows exist.
5. Milestone 5: App Store launch hardening: onboarding, privacy labels, accessibility audit, performance budget, crash reporting, release analytics, ASO assets.

## Milestone 1 Definition Of Done

- App has a verified Expo/Codemagic iOS build path.
- SQLite persists structured records.
- Photos can be captured/imported, compressed, saved locally, and attached to records.
- Backup export/import exists from the beginning.
- Screens are usable one-handed and are not placeholder-only.
- README, release notes, known limitations, and next milestone are documented.

## Known Limitations

- Local iOS simulator/device execution is not available from this Windows workspace.
- Current storage uses JSON payloads in SQLite for flexibility. High-volume analytics may need normalized tables in milestone 2.
- Backup export includes local photo data as base64 JSON. A zip-based backup format would be more efficient in a later release.
- Direct social platform posting is intentionally out of scope for milestone 1.
