# Attendance System Design

## 1. Design Direction
- **Style:** Editorial, cinematic, image-driven, scroll storytelling, smooth transitions.
- **Vibe:** Premium digital exhibition rather than a typical SaaS dashboard.
- **Reference:** RESN, OBYS Agency (Peter Lindbergh case study).
- **Core Philosophy:** "Cinematic, but still usable." Do not sacrifice performance for aesthetics.

## 2. Brand Identity & Color System
- **Logo:** SMKN 40 Jakarta.
- **80%:** Dark Navy (`#080B1A`), Black, White (Base and Backgrounds)
- **15%:** Maroon (`#4A0718`), Deep Red (`#8E0010`), SMKN 40 Red (`#D40000`) (Primary Accents)
- **5%:** Orange (`#F05A00`), Yellow (`#FFBE00`) (Highlights)

## 3. Typography
- Large, bold, cinematic typography for headings.
- Clean, highly legible sans-serif for body text.

## 4. Landing Page
- **Opening:** Full screen, extremely dark/desaturated school photo background. Logo appears slowly.
- **Section 2 (School Intro):** Background transitions from Black to White. Large typography ("PRESENT IS MORE THAN BEING HERE"). School photo revealed through masking. Text follows scroll.
- **Major Gallery:** Vertical interactive gallery showcasing school programs (RPL, DKV, TKJ, AKL, MPLB). Large typography changes with images.
- **How it Works:** Scroll narrative detailing the process.
- **Security:** Dark background. Clean, terminal-like presentation of security checks (Device, Location, Session).
- **Login CTA:** Large CTA. Clicking transitions smoothly to the login form, no harsh page reloads.

## 5. Responsive & Animation System (GSAP / ScrollTrigger / Lenis)

### Desktop
- **Interactions:** Magnetic Cursor Logo, Magnetic CTAs, Hover effects, Smooth Scroll, Mouse Wheel Gallery, Parallax.
- **Cursor Constraints:** Maximum displacement for magnetic elements: 15-30px, uses lerp/easing.

### Mobile
- **Interactions:** Touch, Swipe (e.g., swipe up for Major Gallery), Scroll Reveal, Tap Interaction.
- **Constraints:** Disable cursor effects. Do NOT simply shrink the desktop version; ensure touch-native interactions.

### Performance & Accessibility
- **Performance:** Lazy-load images, optimized image formats, mobile performance optimization.
- **Accessibility:** Respect `prefers-reduced-motion`, ensure keyboard navigation works.

## 6. Authentication & Roles
- **Registration:** Strictly controlled. NO public registration for students.
- **Roles:**
  - **Super Admin:** System & School Configuration.
  - **Admin:** School Operational Management.
  - **Teacher:** Manage & open attendance sessions for their assigned classes.
  - **Student:** Perform attendance.

## 7. Master Data Hierarchy
Data must follow this strict hierarchy to prevent historical data corruption:
`Academic Year -> Grade -> Major -> Class/Homeroom -> Student`

## 8. Student Activation & Device Binding
- **Concept:** Students do not provide hardware IDs (browsers restrict this). Instead, the system generates and stores a **Trusted Device Credential/Binding**.
- **First Login:** Student registers their current device. The credential is tied to their account.
- **Subsequent Logins:** Validate the device binding. If unmatched, trigger a `DEVICE_MISMATCH` security event.

## 9. Attendance Engine & Validation Order
1. Authenticated Student
2. Device Validated
3. QR Token Valid (Not Expired)
4. Attendance Session Active
5. Student Belongs to Session Class
6. **Duplicate Check:** Attendance Not Already Recorded in this session.
7. **Location Valid:** Distance between `School Coordinates` and `Student Coordinates` is within `Allowed Radius` (Note: Geolocation is a security layer, not absolute anti-spoofing).
8. Time Valid
9. Record Attendance

## 10. Security System
Anomalies trigger specific **Security Events**, which feed into **Audit Logs** and **Security Alerts** on the Admin dashboard.
Events include: `DEVICE_MISMATCH`, `INVALID_QR`, `EXPIRED_QR`, `CLASS_MISMATCH`, `OUTSIDE_GEOFENCE`, `DUPLICATE_ATTENDANCE`, `SUSPICIOUS_LOGIN`.
