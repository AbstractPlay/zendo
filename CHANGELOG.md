# Change log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.2] - 2022-07-30

### Changed

* Your ID code no longer displays by default. You can click to copy it to clipboard or to show/hide it. This is to make it safer to stream. You typically do not want to show the code to the global Internet, or else anyone could join your lobby.

## [1.3.1] - 2022-07-22

### Fixed

* PlantUML URL changed to HTTPS to fix blocked content.
* Line breaks are now preserved when viewing multiline koan source.

## [1.3.0] - 2022-07-22

### Added

* Added [PlantUML](https://plantuml.com/) koan type. Rendering is offloaded to PlantUML's web server because they make it essentially impossible to just run in the browser. If that goes down, then things won't work.

### Changed

* Exported game codes are now compressed and base64 encoded for brevity and cleanliness. You can still download and import the raw JSON.

## [1.2.0] - 2022-07-21

### Added

* Added a `2dpyramids` koan type (rectangular grid of pyramids).
* Added 45-degree rotations to the pyramids (`NE`, `SE`, `SW`, `NW`).
* Added 1d and 2d playing card koans.
* Added download button for SVG koans (buggy with playing cards).

### Changed

* Refactored `ViewKoan.svelte` to break out helper functions with lengthy SVG code.

## [1.1.0] - 2022-07-17

### Added

* The import code can now be passed by appending `?import=CODE` to the URL.

## [1.0.0] - 2022-07-15

### Added

* Added export/import feature. This includes all the guesses and koans but not the student list or guessing stone counts. You can export at any time. When the game ends, the code will also be provided.

### Removed

* Removed the secret rule from the game object and from the master's screen. There's no way to truly secure it in a peer-to-peer environment, and the intent of the app is to facilitate synchronous games, where the master shouldn't need a constant reminder. KISS, as they say.

## [0.4.0] - 2022-07-14

### Added

* Added GraphViz dojo (rendered by `dot`)

## [0.3.0] - 2022-07-14

### Added

* Added peer count to new peer list.
* Added the dot matrix dojo type.

### Removed

* Stripped out the inter-client chat feature. Players have to find each other using external means anyway. The intent is just to make it possible to moderate a remote synchronous game, and it is expected that players will be on Discord or something. It also frees up more horizontal space for koans.

## [0.2.1] - 2022-07-14

### Added

* The expanded koan screen now includes the text used to generate the koan (doesn't apply to image or text koans, but will be applied to any future koan types where text is interpreted).
* Added `title` element to the SVGs containing the generating string. This should appear on hover in modern browsers.

### Changed

* Condensed chat bar to make more room for koans.
* Renamed `2dpyramids` to `1dpyramids`.

## [0.2.0] - 2022-07-13

### Added

* Added `2dpyramids` dojo type.
* Added a "Reject Koan" button for the master.
* You can now click on non-text koans to expand them.

## [0.1.0] - 2022-07-10

Initial alpha release.
