# Testing checklist (what was actually run)
Automated with Playwright (Chromium), file:// URLs.

- [x] No horizontal overflow on all 13 pages at 320, 375, 430, 768, 1024, 1280, 1440, 1920 px
- [x] No JavaScript errors and no failed requests (font preload warnings on file:// ignored)
- [x] Every local href/src on all 13 pages resolves to an existing file (0 missing)
- [x] Project filters: Power Electronics shows 5 of 12; All shows 12; counter updates
- [x] Form: empty submit shows 4 inline errors and focuses the first; failed network keeps entered data and shows alternatives; confirmed (mocked) response shows success and resets; double-submit blocked while sending
- [x] Service "Ask about this" preselects the project type
- [x] Lightbox opens from an image and closes with Escape
- [x] Inspector tabs and `<details>` work (earlier run)
- [x] Visual review of hero, projects, services, contact at 1440 px

Not verified: live FormSubmit delivery, Core Web Vitals numbers, screen-reader testing, external links (Fiverr, Upwork, LinkedIn, GitHub) reachability, video playback.
