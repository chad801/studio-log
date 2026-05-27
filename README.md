# Studio Log

Native iPhone app for pottery and ceramics studios.

The mobile app lives in `studio-mobile`.

## Build Checks

```powershell
cd studio-mobile
npm ci
npm run check
```

## Codemagic

The root `codemagic.yaml` defines the TestFlight workflow:

```text
ios-testflight-studio-log
```

Codemagic should connect to this repository root.
