# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

Vietnamese domestic travelers (solo explorers, couples, families, and friend groups) planning trips, discovering destinations, getting real-time weather/directions, consulting the RAG travel assistant, finding compatible travel buddies, and messaging 1-1 on Android and iOS devices.

## Product Purpose

Deliver a complete end-user mobile companion for AI Travel Planner that turns personalized preferences, LightFM recommendations, Gemini multi-session itineraries, route optimization, and 5-dimension feasibility validation into fast, visual, outdoor-readable mobile workflows.

## Positioning

Combines hybrid LightFM + Gemini itinerary generation, TSP route optimization, 5-dimension Overall Feasibility Score (OFS), real-time Open-Meteo weather + OSRM turn-by-turn routing, RAG travel Q&A with citations, and Socket.IO travel-buddy messaging in one unified Vietnam-first app.

## Operating Context

Used both while planning indoors and outdoors under bright daylight on Android and iOS handsets. End-user only; all admin moderation and knowledge management stay on the Web app.

## Capabilities and Constraints

- Consumes existing NestJS REST + SSE + Socket.IO endpoints without modifying backend schemas or endpoints.
- Built on Flutter 3.5+ with Riverpod, GoRouter, Dio, flutter_map, sqflite, and local_auth.
- Respects OS Reduce Motion (`MediaQuery.disableAnimationsOf`), safe-area insets, system back navigation, and 48x48dp touch targets.

## Brand Commitments

- Palette: Ocean Teal `#0D9488` primary, Lagoon `#14B8A6` secondary, Sand Gold `#F59E0B` accent, Slate off-white `#F8FAFC` background, `#FFFFFF` card surface, Coral `#FF6B6B` strictly reserved for Like hearts and unread notification badges.
- Iconography: Monochrome / semantic `lucide_icons_flutter` line icons only; no emojis as UI icons.

## Product Principles

1. **Craft without clutter**: Real destination photography and crisp typography carry visual weight without purple AI glows, decorative blur blobs, or nested cards.
2. **Purposeful motion**: Motion explains navigation continuity (shared-element Hero transitions), state changes, and tactile feedback while degrading smoothly under Reduce Motion.
3. **Instant visual fallback**: Bundled province covers ensure trip cards and offline/imageless places always look intentional and vibrant.
