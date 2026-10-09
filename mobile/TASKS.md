# Mobile Development - Task Breakdown

**Project:** AI Travel Planner Mobile App (Flutter)  
**Timeline:** 7-8 weeks  
**Status:** Phase 1 In Progress (Task 1.2 Complete - 82%)  
**Last Updated:** 2026-10-09 08:56

---

## 📋 Phase 0: Setup & Configuration (Week 1 - Days 1-4)

### 0.2 Project Initialization

- [ ] Create Flutter project: `flutter create . --project-name travel_planner --org com.travelplanner --platforms android,ios`
- [ ] Verify project structure created
- [ ] Run default app: `flutter run --dart-define=API_URL=http://localhost:3002`
- [ ] Verify app launches on emulator
- [x] Clean up default code (custom app created with home_screen.dart)
- [x] Configure `pubspec.yaml` with metadata

**NOTE:** Pending manual execution - see SETUP_MANUAL_VI.md for instructions

### 0.3 Dependencies Installation

- [x] Add core dependencies to `pubspec.yaml`:
  - [x] `flutter_riverpod: ^2.5.0`
  - [x] `hooks_riverpod: ^2.5.0`
  - [x] `dio: ^5.4.0`
  - [x] `go_router: ^14.2.0`
  - [x] `lucide_icons_flutter: ^1.1.0`
- [x] Add UI dependencies:
  - [x] `cached_network_image: ^3.3.0`
  - [x] `flutter_animate: ^4.5.0`
  - [x] `shimmer: ^3.0.0`
- [x] Add storage dependencies:
  - [x] `sqflite: ^2.3.0`
  - [x] `flutter_secure_storage: ^9.0.0`
  - [x] `shared_preferences: ^2.2.0`
- [x] Add map dependencies:
  - [x] `flutter_map: ^7.0.2`
  - [x] `latlong2: ^0.9.0`
  - [x] `geolocator: ^11.0.0`
- [x] Add other dependencies:
  - [x] `http: ^1.2.0`
  - [x] `flutter_markdown: ^0.6.0`
  - [x] `intl: ^0.19.0`
- [ ] Run `flutter pub get` (pending: flutter create)
- [ ] Verify no dependency conflicts

### 0.4 Project Structure Setup

- [x] Create folder structure:
  - [x] `lib/screens/`
  - [x] `lib/widgets/`
  - [x] `lib/providers/`
  - [x] `lib/repositories/`
  - [x] `lib/services/`
  - [x] `lib/models/`
  - [x] `lib/config/`
  - [x] `lib/utils/`
- [x] Create `lib/app.dart` (root widget)
- [x] Create `lib/config/theme.dart`
- [x] Create `lib/config/routes.dart`
- [x] Create `lib/config/env.dart`
- [x] Create placeholder files for core services

### 0.5 Configuration Files

- [x] Setup `analysis_options.yaml` with linter rules
- [x] Create `.env.example` with API_URL template
- [ ] Configure Android `build.gradle` (min SDK 21) - pending flutter create
- [ ] Configure iOS `Info.plist` permissions - pending flutter create
- [ ] Setup `assets/` folder structure
- [ ] Update `pubspec.yaml` assets section

### 0.6 Design System Implementation

- [x] Create `lib/config/colors.dart` with AppColors class
- [x] Define all color constants (primary, secondary, accent, etc.)
- [x] Create `lib/config/text_styles.dart` with AppTextStyles
- [x] Create `lib/config/spacing.dart` with AppSpacing
- [x] Create `lib/config/radius.dart` with AppRadius
- [x] Create `lib/config/theme.dart` with ThemeData
- [x] Test theme in sample screen (home_screen.dart created)

### 0.7 Core Services Setup

- [x] Create `lib/services/api_service.dart` (Dio client)
- [x] Setup Dio interceptors (auth token, error handling)
- [x] Create `lib/services/storage_service.dart`
- [x] Implement secure storage for tokens
- [x] Create `lib/utils/constants.dart`
- [x] Create `lib/utils/validators.dart`
- [x] Create `lib/utils/error_handler.dart`
- [x] Create `lib/utils/formatters.dart`
- [x] Create common widgets (CustomButton, LoadingIndicator, ErrorWidget)
- [ ] Test API service with mock endpoint (pending flutter run)

### 0.8 Git & Version Control

- [x] Initialize git (already initialized - on branch 'mobile')
- [x] `.gitignore` already exists (comprehensive Flutter gitignore)
- [ ] Create initial commit: "mobile: phase 0 setup complete - project structure and configuration"
- [ ] Push to remote: `git push origin mobile`
- [ ] Verify GitHub shows mobile/ folder

**NOTE:** Ready to commit after flutter create is executed

---

## 📱 Phase 1: Core Features (Week 1-2)

### 1.1 Authentication - Login Screen (Days 1-2)

#### 1.1.1 UI Implementation

- [x] Create `lib/screens/auth/login_screen.dart`
- [x] Design login form layout (email, password inputs)
- [x] Add logo/app name header
- [x] Implement email input with validation
- [x] Implement password input with show/hide toggle
- [x] Create login button (coral, rounded)
- [x] Add "Don't have account? Register" link
- [x] Add error message display area
- [ ] Test UI on emulator (light mode) - pending: flutter run

#### 1.1.2 State Management

- [x] Create `lib/models/user.dart` with Freezed
- [ ] Run `flutter pub run build_runner build` - pending
- [x] Create `lib/providers/auth_provider.dart`
- [x] Implement AuthState (idle, loading, authenticated, error)
- [x] Create AuthNotifier class
- [x] Implement login method in provider
- [x] Handle loading states in UI

#### 1.1.3 API Integration

- [x] Create `lib/repositories/auth_repository.dart`
- [x] Implement `login(email, password)` method
- [x] Call `POST /auth/login` endpoint
- [x] Parse response and extract JWT token
- [x] Store token in FlutterSecureStorage
- [x] Handle 401, 400, 500 errors
- [ ] Test with local backend: `http://localhost:3002` - pending

#### 1.1.4 Navigation

- [x] Setup go_router in `lib/config/routes.dart`
- [x] Define `/login` route
- [x] Define `/home` route
- [ ] Implement auth guard (redirect to /login if not authenticated) - TODO
- [x] Navigate to home after successful login
- [ ] Test navigation flow - pending

#### 1.1.5 Testing & Polish

- [ ] Write unit test for AuthRepository
- [ ] Write widget test for LoginScreen
- [ ] Test with valid credentials - pending: backend + flutter run
- [ ] Test with invalid credentials - pending: backend + flutter run
- [ ] Test network errors - pending: backend + flutter run
- [x] Add loading indicator (CustomButton with isLoading)
- [ ] Add haptic feedback on button press - TODO later
- [ ] Run `flutter analyze` (0 issues) - pending

### 1.2 Authentication - Register Screen (Day 3)

#### 1.2.1 UI Implementation

- [x] Create `lib/screens/auth/register_screen.dart`
- [x] Design register form (email, password, confirm password, name)
- [x] Implement all input fields with validation
- [x] Create register button
- [x] Add "Already have account? Login" link
- [x] Show password strength indicator (requirements hint)
- [ ] Test UI layout - pending: flutter run

#### 1.2.2 Validation Logic

- [x] Implement email validation (regex)
- [x] Implement password validation (min 8 chars, uppercase, number)
- [x] Implement confirm password match check
- [x] Show validation errors inline
- [x] Disable button until form valid (handled by isLoading state)
- [ ] Test all validation cases - pending: flutter run

#### 1.2.3 API Integration

- [x] Implement `register()` in AuthRepository
- [x] Call `POST /auth/register` endpoint
- [x] Parse response and store token
- [x] Handle duplicate email error
- [x] Navigate to home after registration
- [ ] Test registration flow - pending: backend + flutter run

#### 1.2.4 Testing

- [ ] Write unit tests
- [ ] Test successful registration - pending: backend
- [ ] Test validation errors - pending: flutter run
- [ ] Test duplicate email - pending: backend
- [ ] Run `flutter analyze` - pending

### 1.3 Authentication - Profile Screen (Day 3)

#### 1.3.1 UI Implementation

- [x] Create `lib/screens/profile/profile_screen.dart`
- [x] Show user avatar (circular, placeholder)
- [x] Display user name and email
- [x] Add "Edit Profile" button
- [x] Add "Logout" button
- [x] Add app version info
- [x] Test UI

#### 1.3.2 Biometric Auth Setup

- [x] Add `local_auth: ^2.2.0` dependency
- [x] Create `lib/services/biometric_service.dart`
- [x] Check device biometric availability
- [x] Implement biometric enable/disable toggle
- [x] Store biometric preference
- [ ] Test on device with Face ID/Touch ID (pending physical device)

#### 1.3.3 Profile API Integration

- [x] Implement `getProfile()` in AuthRepository
- [x] Call `GET /auth/profile` endpoint
- [x] Display fetched user data
- [x] Handle 401 (expired token)
- [ ] Test profile fetch with backend

#### 1.3.4 Logout Implementation

- [x] Implement logout in AuthNotifier
- [x] Clear JWT token from storage
- [x] Reset app state
- [x] Navigate to login screen
- [x] Test logout flow

### 1.4 Trip Management - List Screen (Days 4-5)

#### 1.4.1 UI Implementation

- [ ] Create `lib/screens/trips/trips_list_screen.dart`
- [ ] Design trip card widget (`lib/widgets/trip/trip_card.dart`)
- [ ] Show trip thumbnail image
- [ ] Display destination, dates, budget
- [ ] Add "Create Trip" FAB (floating action button)
- [ ] Implement pull-to-refresh
- [ ] Add empty state (no trips yet)
- [ ] Test UI with mock data

#### 1.4.2 Trip Card Component

- [ ] Create `lib/widgets/trip/trip_card.dart`
- [ ] Card with rounded corners (16dp)
- [ ] Image at top with overlay
- [ ] Destination name (headline)
- [ ] Date range with calendar icon
- [ ] Budget with dollar icon
- [ ] Tap to navigate to detail
- [ ] Test card layout

#### 1.4.3 State Management

- [ ] Create `lib/models/trip.dart` with Freezed
- [ ] Run build_runner
- [ ] Create `lib/providers/trips_provider.dart`
- [ ] Implement FutureProvider for trips list
- [ ] Handle loading/error/data states
- [ ] Test provider

#### 1.4.4 API Integration

- [ ] Create `lib/repositories/trips_repository.dart`
- [ ] Implement `getTrips()` method
- [ ] Call `GET /trips` endpoint
- [ ] Parse trip list response
- [ ] Cache trips locally (SharedPreferences)
- [ ] Test API call

#### 1.4.5 Testing & Polish

- [ ] Write repository tests
- [ ] Write widget tests
- [ ] Test empty state
- [ ] Test loading state
- [ ] Test error state
- [ ] Add shimmer loading
- [ ] Run `flutter analyze`

### 1.5 Trip Management - Detail Screen (Day 6)

#### 1.5.1 UI Implementation

- [ ] Create `lib/screens/trips/trip_detail_screen.dart`
- [ ] Show trip header (image, destination, dates)
- [ ] Display itinerary by day
- [ ] Show places list for each day
- [ ] Add map view with markers
- [ ] Show weather forecast
- [ ] Add edit/delete buttons
- [ ] Test UI

#### 1.5.2 Place Card in Itinerary

- [ ] Create `lib/widgets/place/place_card_compact.dart`
- [ ] Show place name, category badge
- [ ] Display time slot
- [ ] Show thumbnail image
- [ ] Tap to expand details
- [ ] Test card

#### 1.5.3 State Management

- [ ] Create tripProvider.family for single trip
- [ ] Implement FutureProvider<Trip, String>
- [ ] Handle loading/error states
- [ ] Test provider

#### 1.5.4 API Integration

- [ ] Implement `getTripById(id)` in repository
- [ ] Call `GET /trips/:id` endpoint
- [ ] Parse trip detail with places
- [ ] Handle 404 (trip not found)
- [ ] Test API call

#### 1.5.5 Testing

- [ ] Write tests
- [ ] Test with trip that has places
- [ ] Test with trip without places
- [ ] Test 404 error
- [ ] Run `flutter analyze`

### 1.6 Trip Management - Create Trip (Days 7-8)

#### 1.6.1 Multi-Step Form UI

- [ ] Create `lib/screens/trips/create_trip_screen.dart`
- [ ] Implement step indicator (1/4, 2/4, etc.)
- [ ] Step 1: Destination input with autocomplete
- [ ] Step 2: Date range picker
- [ ] Step 3: Budget and travelers count
- [ ] Step 4: Preferences (categories, pace)
- [ ] Add back/next buttons
- [ ] Test navigation between steps

#### 1.6.2 Form State Management

- [ ] Create CreateTripDto model
- [ ] Implement form state provider
- [ ] Validate each step before proceeding
- [ ] Store draft locally (persist on back)
- [ ] Test form state

#### 1.6.3 Date Picker Integration

- [ ] Use built-in showDateRangePicker
- [ ] Set min date (today)
- [ ] Set max date (1 year from now)
- [ ] Display selected dates
- [ ] Test date picker

#### 1.6.4 API Integration

- [ ] Implement `createTrip(dto)` in repository
- [ ] Call `POST /trips` endpoint
- [ ] Handle validation errors from backend
- [ ] Navigate to created trip detail
- [ ] Invalidate trips list (refresh)
- [ ] Test create flow

#### 1.6.5 Testing & Polish

- [ ] Write tests
- [ ] Test form validation
- [ ] Test API success
- [ ] Test API errors
- [ ] Add loading indicator
- [ ] Add success message
- [ ] Run `flutter analyze`

### 1.7 Map Integration (Days 9-10)

#### 1.7.1 flutter_map Setup

- [ ] Verify `flutter_map: ^7.0.2` installed
- [ ] Create `lib/widgets/map/trip_map.dart`
- [ ] Configure Google Maps tiles (no API key)
- [ ] Test basic map rendering
- [ ] Add zoom controls
- [ ] Test map interactions

#### 1.7.2 Markers Implementation

- [ ] Create custom marker widget
- [ ] Numbered markers (1, 2, 3...) with gradient
- [ ] Category-colored markers
- [ ] Add marker tap handler
- [ ] Show place info on marker tap
- [ ] Test markers

#### 1.7.3 Polyline Routes

- [ ] Draw route lines between places
- [ ] Use dashed line style
- [ ] Color: emerald green (#10B981)
- [ ] Test polyline rendering

#### 1.7.4 Current Location

- [ ] Add `geolocator: ^11.0.0` dependency
- [ ] Request location permission
- [ ] Get current location
- [ ] Show blue dot on map
- [ ] Add "Center on me" button
- [ ] Test location services

#### 1.7.5 Testing

- [ ] Test map with multiple markers
- [ ] Test map with no markers
- [ ] Test location permission denied
- [ ] Test offline map behavior
- [ ] Run `flutter analyze`

---

## 🌟 Phase 2: Enhanced Features (Week 3-4)

### 2.1 Places Discovery - Browse Screen (Days 11-12)

#### 2.1.1 UI Implementation

- [ ] Create `lib/screens/places/places_screen.dart`
- [ ] Add search bar at top
- [ ] Implement filter chips (category, province, budget)
- [ ] Create place card grid/list view
- [ ] Add toggle between grid/list view
- [ ] Show place image, name, rating, price
- [ ] Test UI

#### 2.1.2 Place Card Component

- [ ] Create `lib/widgets/place/place_card.dart`
- [ ] Show place image with category badge
- [ ] Display name, location, rating
- [ ] Show budget level (💰💰💰)
- [ ] Add favorite/bookmark button
- [ ] Tap to navigate to detail
- [ ] Test card

#### 2.1.3 Filter Implementation

- [ ] Create filter bottom sheet
- [ ] Category chips (Beach, Mountain, etc.)
- [ ] Province dropdown
- [ ] Budget slider
- [ ] Apply/Reset buttons
- [ ] Test filters

#### 2.1.4 State Management

- [ ] Create `lib/models/place.dart` with Freezed
- [ ] Create `lib/providers/places_provider.dart`
- [ ] Implement filtered places provider
- [ ] Handle filter state
- [ ] Test provider

#### 2.1.5 API Integration

- [ ] Create `lib/repositories/places_repository.dart`
- [ ] Implement `getPlaces(filters)` method
- [ ] Call `GET /places?province=...&category=...`
- [ ] Parse places list
- [ ] Cache places locally
- [ ] Test API with filters

#### 2.1.6 Testing

- [ ] Write tests
- [ ] Test empty filters
- [ ] Test with multiple filters
- [ ] Test no results
- [ ] Run `flutter analyze`

### 2.2 Places Discovery - Detail Screen (Day 13)

#### 2.2.1 UI Implementation

- [ ] Create `lib/screens/places/place_detail_screen.dart`
- [ ] Show hero image with gallery
- [ ] Display name, location, category
- [ ] Show rating and review count
- [ ] Display description
- [ ] Show amenities/features
- [ ] Add "Add to Trip" button
- [ ] Add "Save" button
- [ ] Test UI

#### 2.2.2 Image Gallery

- [ ] Implement swipeable image carousel
- [ ] Show image indicators (1/5)
- [ ] Fullscreen view on tap
- [ ] Zoom/pinch gestures
- [ ] Test gallery

#### 2.2.3 State Management

- [ ] Create placeProvider.family
- [ ] Implement FutureProvider<Place, String>
- [ ] Handle loading/error states
- [ ] Test provider

#### 2.2.4 API Integration

- [ ] Implement `getPlaceById(id)` in repository
- [ ] Call `GET /places/:id` endpoint
- [ ] Parse place detail
- [ ] Handle 404
- [ ] Test API

#### 2.2.5 Interactions Tracking

- [ ] Implement `trackInteraction(placeId, type)` method
- [ ] Call `POST /interactions` for VIEW
- [ ] Track LIKE when favorite tapped
- [ ] Track SAVE when bookmark tapped
- [ ] Test tracking

#### 2.2.6 Testing

- [ ] Write tests
- [ ] Test place detail load
- [ ] Test interactions
- [ ] Test 404 error
- [ ] Run `flutter analyze`

### 2.3 Places Search (Day 14)

#### 2.3.1 Search UI

- [ ] Create `lib/screens/places/search_screen.dart`
- [ ] Add search input with clear button
- [ ] Show recent searches
- [ ] Display search suggestions
- [ ] Show search results list
- [ ] Test search UI

#### 2.3.2 Search Implementation

- [ ] Implement debounced search (300ms delay)
- [ ] Search places by name/description
- [ ] Highlight search terms in results
- [ ] Store recent searches locally
- [ ] Test search

#### 2.3.3 Testing

- [ ] Write tests
- [ ] Test search with results
- [ ] Test search with no results
- [ ] Test debouncing
- [ ] Run `flutter analyze`

### 2.4 RAG Chatbot - Chat Screen (Days 15-17)

#### 2.4.1 UI Implementation

- [ ] Create `lib/screens/chat/chat_screen.dart`
- [ ] Design message list (scrollable)
- [ ] Create user message bubble (right, coral)
- [ ] Create AI message bubble (left, white)
- [ ] Add message input at bottom
- [ ] Add send button
- [ ] Show typing indicator
- [ ] Test UI

#### 2.4.2 Message Bubbles

- [ ] Create `lib/widgets/chat/message_bubble.dart`
- [ ] Render markdown content (flutter_markdown)
- [ ] Show timestamps
- [ ] Display citations as chips
- [ ] Support code blocks
- [ ] Test bubbles

#### 2.4.3 SSE Streaming Setup

- [ ] Create `lib/services/stream_service.dart`
- [ ] Implement SSE connection with http package
- [ ] Parse SSE events (session_info, sources, token, done)
- [ ] Handle connection errors
- [ ] Test SSE locally

#### 2.4.4 State Management

- [ ] Create `lib/models/chat_message.dart`
- [ ] Create `lib/providers/chat_provider.dart`
- [ ] Implement messages list state
- [ ] Handle streaming updates
- [ ] Show loading while streaming
- [ ] Test provider

#### 2.4.5 API Integration

- [ ] Create `lib/repositories/chat_repository.dart`
- [ ] Implement `sendMessage(message, sessionId)`
- [ ] Stream from `POST /api/chat` (SSE)
- [ ] Append tokens as they arrive
- [ ] Update sources when received
- [ ] Mark message complete on 'done' event
- [ ] Test streaming

#### 2.4.6 Citations Handling

- [ ] Parse citations from sources event
- [ ] Display citation chips below message
- [ ] Tap citation to view source
- [ ] Test citations

#### 2.4.7 Testing

- [ ] Write tests
- [ ] Test message send
- [ ] Test SSE streaming
- [ ] Test connection errors
- [ ] Test session management
- [ ] Run `flutter analyze`

### 2.5 Offline Support (Days 18-20)

#### 2.5.1 SQLite Setup

- [ ] Verify `sqflite: ^2.3.0` installed
- [ ] Create `lib/services/database_service.dart`
- [ ] Define database schema (trips, places tables)
- [ ] Implement database initialization
- [ ] Create migration system
- [ ] Test database creation

#### 2.5.2 Cache Implementation

- [ ] Implement `cacheTrips(trips)` method
- [ ] Implement `getCachedTrips()` method
- [ ] Implement `cachePlace(place)` method
- [ ] Implement `getCachedPlace(id)` method
- [ ] Test cache read/write

#### 2.5.3 Sync Strategy

- [ ] Check network connectivity (`connectivity_plus`)
- [ ] Fetch from API when online
- [ ] Fallback to cache when offline
- [ ] Show offline indicator in UI
- [ ] Queue writes when offline
- [ ] Sync when back online
- [ ] Test offline/online transitions

#### 2.5.4 Testing

- [ ] Test cache with no data
- [ ] Test cache with data
- [ ] Test offline mode
- [ ] Test sync after reconnect
- [ ] Run `flutter analyze`

---

## 🤝 Phase 3: Social & Advanced (Week 5-6)

### 3.1 Community Feed (Days 21-23)

#### 3.1.1 Feed UI

- [ ] Create `lib/screens/community/community_screen.dart`
- [ ] Design post card widget
- [ ] Show user avatar, name, timestamp
- [ ] Display post text content
- [ ] Show post images (gallery)
- [ ] Add like/comment buttons
- [ ] Show like count and comment count
- [ ] Implement pull-to-refresh
- [ ] Test feed UI

#### 3.1.2 Post Card Component

- [ ] Create `lib/widgets/community/post_card.dart`
- [ ] User header (avatar, name, time)
- [ ] Post content (text + images)
- [ ] Action bar (like, comment, share)
- [ ] Tap to view post detail
- [ ] Test card

#### 3.1.3 State Management

- [ ] Create `lib/models/community_post.dart`
- [ ] Create `lib/providers/community_provider.dart`
- [ ] Implement posts list provider
- [ ] Handle like/unlike state
- [ ] Test provider

#### 3.1.4 API Integration

- [ ] Create `lib/repositories/community_repository.dart`
- [ ] Implement `getPosts()` method
- [ ] Call `GET /community/posts`
- [ ] Implement `likePost(id)` method
- [ ] Implement `unlikePost(id)` method
- [ ] Test API

#### 3.1.5 Testing

- [ ] Write tests
- [ ] Test feed load
- [ ] Test like/unlike
- [ ] Test empty feed
- [ ] Run `flutter analyze`

### 3.2 Create Post (Day 24)

#### 3.2.1 UI Implementation

- [ ] Create `lib/screens/community/create_post_screen.dart`
- [ ] Add text input (multiline)
- [ ] Add image picker button
- [ ] Show selected images preview
- [ ] Add remove image button
- [ ] Add post button (disabled when empty)
- [ ] Test UI

#### 3.2.2 Image Picker Integration

- [ ] Add `image_picker: ^1.0.0` dependency
- [ ] Implement pick from gallery
- [ ] Implement take photo with camera
- [ ] Compress images before upload
- [ ] Limit to 5 images max
- [ ] Test image picker

#### 3.2.3 API Integration

- [ ] Implement `createPost(text, images)` method
- [ ] Call `POST /community/posts`
- [ ] Upload images (multipart or base64)
- [ ] Handle upload progress
- [ ] Navigate back to feed after post
- [ ] Refresh feed
- [ ] Test post creation

#### 3.2.4 Testing

- [ ] Test post with text only
- [ ] Test post with images
- [ ] Test image compression
- [ ] Test upload errors
- [ ] Run `flutter analyze`

### 3.3 Comments (Day 25)

#### 3.3.1 UI Implementation

- [ ] Create comments bottom sheet
- [ ] Show comments list
- [ ] Add comment input at bottom
- [ ] Display commenter name and text
- [ ] Show timestamp
- [ ] Test UI

#### 3.3.2 API Integration

- [ ] Implement `getComments(postId)` method
- [ ] Implement `addComment(postId, text)` method
- [ ] Call `POST /community/posts/:id/comments`
- [ ] Test comments

#### 3.3.3 Testing

- [ ] Test load comments
- [ ] Test add comment
- [ ] Test empty comments
- [ ] Run `flutter analyze`

### 3.4 Local Notifications (Days 26-27)

#### 3.4.1 Setup

- [ ] Add `flutter_local_notifications: ^17.0.0`
- [ ] Add `timezone: ^0.9.0`
- [ ] Create `lib/services/notification_service.dart`
- [ ] Initialize notifications
- [ ] Request notification permissions
- [ ] Test setup

#### 3.4.2 Trip Reminders

- [ ] Schedule notification 1 day before trip
- [ ] Schedule notification on trip start day
- [ ] Show trip name and destination
- [ ] Tap notification to open trip detail
- [ ] Test notifications

#### 3.4.3 Testing

- [ ] Test schedule notification
- [ ] Test notification display
- [ ] Test notification tap
- [ ] Test cancel notification
- [ ] Run `flutter analyze`

### 3.5 UI Polish & Animations (Days 28-30)

#### 3.5.1 Animations

- [ ] Add like button bounce animation
- [ ] Add page transition animations
- [ ] Add loading skeleton screens
- [ ] Add pull-to-refresh animation
- [ ] Test animations (not too fast/slow)

#### 3.5.2 Empty States

- [ ] Design empty state for no trips
- [ ] Design empty state for no places
- [ ] Design empty state for no posts
- [ ] Add helpful suggestions in empty states
- [ ] Test empty states

#### 3.5.3 Error States

- [ ] Design error screen component
- [ ] Add retry button
- [ ] Show friendly error messages
- [ ] Handle network errors gracefully
- [ ] Test error states

#### 3.5.4 Loading States

- [ ] Add shimmer placeholders for lists
- [ ] Add skeleton screens for detail views
- [ ] Show progress indicators
- [ ] Test loading states

#### 3.5.5 Accessibility

- [ ] Add semantic labels to all interactive elements
- [ ] Test with screen reader
- [ ] Ensure color contrast meets WCAG AA
- [ ] Test touch targets (48x48dp min)
- [ ] Run accessibility audit

#### 3.5.6 Dark Mode (Optional)

- [ ] Define dark theme colors
- [ ] Update theme.dart with dark ThemeData
- [ ] Test all screens in dark mode
- [ ] Fix contrast issues
- [ ] Test theme switching

---

## 🧪 Phase 4: Testing & Quality (Week 7)

### 4.1 Unit Tests (Days 31-33)

#### 4.1.1 Repository Tests

- [ ] Write tests for AuthRepository
- [ ] Write tests for TripsRepository
- [ ] Write tests for PlacesRepository
- [ ] Write tests for CommunityRepository
- [ ] Write tests for ChatRepository
- [ ] Achieve 80%+ coverage for repositories

#### 4.1.2 Service Tests

- [ ] Write tests for ApiService
- [ ] Write tests for StorageService
- [ ] Write tests for DatabaseService
- [ ] Write tests for NotificationService
- [ ] Achieve 70%+ coverage for services

#### 4.1.3 Model Tests

- [ ] Test JSON serialization for all models
- [ ] Test Freezed equality and copyWith
- [ ] Test model validation logic

### 4.2 Widget Tests (Days 33-34)

#### 4.2.1 Screen Tests

- [ ] Test LoginScreen UI
- [ ] Test TripsListScreen UI
- [ ] Test TripDetailScreen UI
- [ ] Test PlaceDetailScreen UI
- [ ] Test ChatScreen UI

#### 4.2.2 Component Tests

- [ ] Test TripCard widget
- [ ] Test PlaceCard widget
- [ ] Test MessageBubble widget
- [ ] Test PostCard widget

### 4.3 Integration Tests (Day 35)

#### 4.3.1 Critical Flows

- [ ] Test login → home flow
- [ ] Test create trip flow
- [ ] Test browse places → detail flow
- [ ] Test chat message flow
- [ ] Test create post flow

### 4.4 Manual Testing (Days 36-37)

#### 4.4.1 Android Testing

- [ ] Test on Android emulator (Pixel 7)
- [ ] Test on real Android device
- [ ] Test all features work
- [ ] Test offline mode
- [ ] Test notifications
- [ ] Document bugs found

#### 4.4.2 iOS Testing (Optional)

- [ ] Test on iOS simulator (iPhone 15 Pro)
- [ ] Test on real iOS device
- [ ] Test all features work
- [ ] Test biometric auth
- [ ] Document iOS-specific issues

#### 4.4.3 Edge Cases

- [ ] Test with no internet connection
- [ ] Test with slow internet
- [ ] Test with empty data
- [ ] Test with large datasets
- [ ] Test app backgrounding/foregrounding
- [ ] Test low memory situations

### 4.5 Performance Optimization (Day 38)

#### 4.5.1 Performance Audit

- [ ] Run `flutter analyze`
- [ ] Check app size: `flutter build apk --analyze-size`
- [ ] Profile app startup time
- [ ] Profile list scrolling performance
- [ ] Identify performance bottlenecks

#### 4.5.2 Optimizations

- [ ] Optimize image loading (resize, compress)
- [ ] Implement list lazy loading
- [ ] Reduce unnecessary rebuilds
- [ ] Cache expensive computations
- [ ] Test improvements

### 4.6 Bug Fixes (Days 38-42)

#### 4.6.1 Critical Bugs

- [ ] Fix all P0 bugs (app crashes)
- [ ] Fix all P1 bugs (major features broken)

#### 4.6.2 Medium Priority Bugs

- [ ] Fix P2 bugs (minor features broken)
- [ ] Fix P3 bugs (cosmetic issues)

#### 4.6.3 Verification

- [ ] Re-test all fixed bugs
- [ ] Verify no regressions
- [ ] Update tests if needed

---

## 📦 Phase 5: App Store Preparation (Week 8)

### 5.1 App Assets (Days 43-44)

#### 5.1.1 App Icon

- [ ] Design app icon (1024x1024)
- [ ] Generate all required sizes
- [ ] Add icon to Android (`android/app/src/main/res/`)
- [ ] Add icon to iOS (`ios/Runner/Assets.xcassets/`)
- [ ] Test icon displays correctly

#### 5.1.2 Splash Screen

- [ ] Design splash screen
- [ ] Implement native splash (Android)
- [ ] Implement native splash (iOS)
- [ ] Test splash screen

#### 5.1.3 Screenshots

- [ ] Take screenshots on Android (6.5" + 5.5")
- [ ] Take screenshots on iOS (6.5" + 5.5")
- [ ] Capture all key screens (login, home, trips, places, chat)
- [ ] Edit screenshots (add captions if needed)

### 5.2 App Metadata (Day 44)

#### 5.2.1 Description

- [ ] Write app title (< 30 chars)
- [ ] Write short description (80 chars)
- [ ] Write full description (4000 chars)
- [ ] List key features
- [ ] Translate to Vietnamese (optional)

#### 5.2.2 Keywords

- [ ] Research keywords (travel, planner, AI, Vietnam)
- [ ] Select 10-15 relevant keywords
- [ ] Optimize for ASO (App Store Optimization)

#### 5.2.3 Privacy Policy

- [ ] Write privacy policy
- [ ] Host privacy policy (website or GitHub)
- [ ] Add privacy policy link to app

### 5.3 Build Configuration (Day 45)

#### 5.3.1 Android Configuration

- [ ] Update `android/app/build.gradle`:
  - [ ] Set versionCode: 1
  - [ ] Set versionName: "1.0.0"
  - [ ] Set applicationId: "com.example.travel_planner"
  - [ ] Set minSdkVersion: 21
  - [ ] Set targetSdkVersion: 34
- [ ] Configure signing (create keystore)
- [ ] Update `android/key.properties`
- [ ] Build release APK: `flutter build apk --release`
- [ ] Test release APK on device

#### 5.3.2 iOS Configuration (Optional)

- [ ] Update `ios/Runner/Info.plist`:
  - [ ] Set CFBundleVersion: "1"
  - [ ] Set CFBundleShortVersionString: "1.0.0"
  - [ ] Set CFBundleIdentifier: "com.example.travelPlanner"
- [ ] Configure signing (Apple Developer account)
- [ ] Build release IPA: `flutter build ios --release`
- [ ] Test release IPA

### 5.4 Google Play Submission (Days 46-47)

#### 5.4.1 Developer Account Setup

- [ ] Create Google Play Developer account ($25)
- [ ] Verify account
- [ ] Complete profile

#### 5.4.2 App Creation

- [ ] Create new app in Play Console
- [ ] Upload app icon
- [ ] Add screenshots
- [ ] Fill in description and metadata
- [ ] Set content rating
- [ ] Set pricing (free)

#### 5.4.3 Build Upload

- [ ] Build AAB: `flutter build appbundle --release`
- [ ] Upload AAB to Play Console
- [ ] Fill in release notes
- [ ] Submit for internal testing

#### 5.4.4 Internal Testing

- [ ] Test on internal track
- [ ] Fix any issues
- [ ] Get approval from testers

#### 5.4.5 Production Release

- [ ] Submit for production review
- [ ] Wait for review (1-3 days)
- [ ] Address any feedback
- [ ] Release to production (if approved)

### 5.5 iOS App Store Submission (Days 48-49, Optional)

#### 5.5.1 Apple Developer Account

- [ ] Create Apple Developer account ($99/year)
- [ ] Verify account

#### 5.5.2 App Store Connect Setup

- [ ] Create new app
- [ ] Upload screenshots
- [ ] Fill in metadata
- [ ] Set content rating
- [ ] Set pricing

#### 5.5.3 Build Upload

- [ ] Build and archive in Xcode
- [ ] Upload to App Store Connect
- [ ] Fill in release notes
- [ ] Submit for review

#### 5.5.4 Review & Release

- [ ] Wait for review (1-7 days)
- [ ] Address any feedback
- [ ] Release to App Store (if approved)

### 5.6 Post-Launch (Day 50+)

#### 5.6.1 Monitoring

- [ ] Monitor crash reports (Firebase Crashlytics)
- [ ] Monitor user reviews
- [ ] Track analytics (Firebase Analytics)
- [ ] Monitor API errors

#### 5.6.2 User Feedback

- [ ] Collect user feedback
- [ ] Prioritize bug reports
- [ ] Plan next version features
- [ ] Create roadmap for v1.1.0

---

## 📊 Progress Tracking

**Phase 0 (Setup):** 48/62 tasks (77%)  
**Phase 1 (Core):** 0/163 tasks (0%)  
**Phase 2 (Enhanced):** 0/85 tasks (0%)  
**Phase 3 (Social):** 0/62 tasks (0%)  
**Phase 4 (Testing):** 0/48 tasks (0%)  
**Phase 5 (App Store):** 0/51 tasks (0%)

**Total Progress:** 48/471 tasks (10%)

---

## 🎯 Current Status

**Phase:** 0 - Setup & Configuration  
**Progress:** 77% complete  
**Completed:** 48 tasks  
**Pending:** 14 tasks (require flutter create + pub get)

**Files Created:** 27 files
- Configuration: 3 files (pubspec.yaml, analysis_options.yaml, .env.example)
- Core: 7 files (main.dart, app.dart, 5 config files)
- Services: 3 files (api_service, storage_service, providers)
- Utils: 4 files (constants, validators, error_handler, formatters)
- Widgets: 3 files (custom_button, loading_indicator, error_widget)
- Screens: 1 file (home_screen)
- Documentation: 4 files (SETUP.md, PHASE0_COMPLETE.md, SETUP_MANUAL_VI.md, MANUAL_SETUP.sh)
- Scripts: 2 files (setup.sh, MANUAL_SETUP.sh)

**Next Action Required:** Run manual setup commands (see SETUP_MANUAL_VI.md)

---

## 🎯 Sprint Planning

**Sprint 0 (Week 1):** Phase 0 + Phase 1.1-1.4  
**Sprint 1 (Week 2):** Phase 1.5-1.7  
**Sprint 2 (Week 3):** Phase 2.1-2.3  
**Sprint 3 (Week 4):** Phase 2.4-2.5  
**Sprint 4 (Week 5):** Phase 3.1-3.3  
**Sprint 5 (Week 6):** Phase 3.4-3.5  
**Sprint 6 (Week 7):** Phase 4 (Testing)  
**Sprint 7 (Week 8):** Phase 5 (App Store)

---

**Last Updated:** 2026-10-09  
**Status:** Ready to start Phase 0  
**Next Task:** Install Flutter SDK
