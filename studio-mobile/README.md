# Studio Log Mobile

Studio Log Mobile is the native iPhone path for the pottery studio operating system. It is built with Expo, React Native, TypeScript, SQLite, local photo storage, and Codemagic/TestFlight release automation.

## Local Development

Install dependencies:

```powershell
cd studio-mobile
npm install
```

Run checks:

```powershell
npm run check
```

Start the development server for a custom development build:

```powershell
npm start
```

This project does not use Expo Go. Use one of these native paths:

- Custom development build on an iPhone from a Mac with Xcode.
- TestFlight build from Codemagic.

Run a custom development build on iOS when using a Mac with Xcode:

```bash
CI=1 npm run prebuild:ios
npx pod-install ios
npm run ios
```

Then keep the custom Studio Log dev build installed on the device and run:

```bash
npm start
```

For release testing without a Mac, use Codemagic to upload the signed IPA to TestFlight.

## Milestone 1 Features

- Dashboard for low inventory, active projects, upcoming kiln work, and recent photos.
- Inventory records with quantity, units, reorder point, vendor, lot, location, and SDS notes.
- Recipe records with cone, atmosphere, clay body, batch fields, notes, ingredients, and test tile photos.
- Kiln firing records with cone, atmosphere, ramp/hold steps, load photos, costs, and maintenance notes.
- Project records with lifecycle stage, tasks, notes, dimensions, linked recipe/firing fields, and process photos.
- Gallery piece records with pricing, sale status, collection, dimensions, and final photos.
- Inspiration, pricing, social, customer, and sharing models are present for phased expansion.
- SQLite structured persistence and app-document photo storage.
- JSON backup export/import with photo data.

## Codemagic Setup

Use the root `codemagic.yaml`. The workflow expects the mobile project in `studio-mobile`.

Create Codemagic secure groups:

```text
ios-signing
app-store-connect
```

Required variables:

```text
APPLE_TEAM_ID
BUNDLE_ID
PROFILE_UUID
CERT_P12
CERT_PASSWORD
PROVISIONING_PROFILE
APP_STORE_CONNECT_PRIVATE_KEY
APP_STORE_CONNECT_KEY_IDENTIFIER
APP_STORE_CONNECT_ISSUER_ID
TESTFLIGHT_RELEASE_NOTES
```

Signing requirements:

- Apple Developer Program membership.
- App Store distribution certificate exported as `.p12`, base64 encoded into `CERT_P12`.
- Matching App Store provisioning profile for `com.broadhead.studiolog`, base64 encoded into `PROVISIONING_PROFILE`.
- App Store Connect API key with TestFlight upload permission.

## TestFlight Release

1. Confirm the bundle identifier in `app.json` matches the App Store Connect app.
2. Increment `expo.ios.buildNumber` or allow Codemagic build number injection.
3. Update `RELEASE_NOTES.md`.
4. Run `npm run check`.
5. Push to the branch watched by Codemagic.
6. Confirm Codemagic archives the iOS app and uploads to TestFlight.

## Troubleshooting

- If signing fails, verify the certificate password, provisioning profile UUID, bundle identifier, and Apple team ID all match.
- If `pod install` fails, clear the Codemagic dependency cache and rerun Expo prebuild.
- Expo iOS prebuild must run on macOS or Linux. Windows can run TypeScript checks and Metro bundle export, but it cannot generate the iOS native project.
- Expo Go is not supported for this app because native modules such as SQLite, local file storage, image manipulation, and future release behavior must be validated in the real app binary.
- If camera or library import fails on device, confirm iOS permissions exist in `app.json`.
- If backup import fails, verify the file was exported by Studio Log Mobile and has not been edited.

## Known Limitations

- This milestone has local-only data. Cloud sync is planned for a later phase.
- Backup uses JSON with base64 photo data. It is reliable but can become large.
- Pricing and social screens are planning/data-model modules in milestone 1; calculators and content calendars come in milestone 2.
