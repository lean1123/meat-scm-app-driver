# Copilot Coding Agent Instructions for Meat SCM Driver

## Project Overview

- **Domain:** Supply chain management for meat logistics; this app is for drivers to track, update, and confirm shipments.
- **Stack:** React Native (Expo), TypeScript, Redux, WebSocket, Tailwind CSS (via nativewind), Cloudinary for image uploads.
- **Structure:**
  - `app/` – Expo Router entry points, page layouts, navigation.
  - `components/` – UI components (CardItem, TripItem, DeliveryList, DeliveryStop, UploadImage, FormInput, etc.).
  - `api/` – API clients (axios-based), e.g., `axiosClient.ts`, `traceabilityApi.ts`.
  - `data/` – Local mock data for development (`Home.ts`, `Traceability.ts`).
  - `types/` – TypeScript types for domain models (shipment, event, etc.).
  - `hellpers/` – Utility functions (e.g., `formatter.ts`).
  - `meat-supply-chain/` – Monorepo root for shared configs, not the main app code.

## Key Patterns & Conventions

- **Componentization:**
  - All UI logic is split into small, focused components. Example: `DeliveryList` renders multiple `DeliveryStop` components, each handling its own upload and QR logic.
  - Form fields are abstracted via `FormInput` for consistency and validation.
- **Image Upload:**
  - Use `UploadImageComponent` for all image capture/upload flows. It uploads to Cloudinary via `uploadService.ts` and returns real URLs to parent components.
  - Always update the correct `ShipmentStop.items[].images` after upload.
- **Navigation:**
  - Use Expo Router for navigation. Pages are in `app/`, with nested folders for tabs and modals.
- **State Management:**
  - Local state is managed via React hooks. Redux is available for global state but not always used in component logic.
- **Styling:**
  - Use Tailwind classes via `nativewind` for all styling. Avoid inline styles except for dynamic cases.

## Developer Workflows

- **Start App:**
  - `npx expo start` (from project root)
- **Install Dependencies:**
  - Use `npx expo install <package>` for Expo-compatible packages.
- **Testing:**
  - No formal test suite; test via manual interaction in Expo Go or emulator.
- **Debugging:**
  - Use React Native Debugger or Expo's built-in tools.
- **Image Upload Debug:**
  - Cloudinary credentials are loaded from `@env` (see `.env` and `uploadService.ts`).

## Integration Points

- **API:**
  - Use `api/axiosClient.ts` for HTTP requests. Mock data is in `data/` for local dev.
- **Image Upload:**
  - All uploads go through `src/services/uploadService.ts` (Cloudinary REST API).
- **QR/Camera:**
  - Use `expo-camera` and `expo-image-picker` for all camera/QR flows.

## Project-Specific Notes

- **Vietnamese Comments:**
  - Many comments and variable names are in Vietnamese; preserve intent and meaning when refactoring.
- **Data Flow:**
  - Shipment and stop updates are passed via props and callbacks (see `onUpdateStop`).
- **Do not edit files in `meat-supply-chain/` unless updating shared configs.**

## Example: Updating a Stop After Image Upload

```tsx
<DeliveryStop
  stop={stop}
  onUpdateStop={handleUpdateStop} // handleUpdateStop updates the parent shipment state
/>
```

---

For questions about unclear patterns, check `README.md` and component usage in `components/confirmation/`.
