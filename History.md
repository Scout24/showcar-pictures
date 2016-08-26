
1.3.6 / 2016-08-26
==================

  * Fixed loading images (white square instead of an image)

1.3.5 / 2016-08-22
==================

  * added as24-pictures.slider.tap event
  * added docs folder for github pages

1.3.4 / 2016-08-17
==================

  * Improved postcss config, changed positioning of elements in pictures

1.3.2 / 2016-08-17
==================

  * Fixed the background color of the carousel-item

1.3.1 / 2016-08-17
==================

  * Show thumbs only for L viewport

1.3.0 / 2016-08-16
==================

  * New release

1.2.10 / 2016-08-16
==================

  * implemented fix for iframe positioning

1.2.9 / 2016-08-16
==================

  * fixed background of pictures

1.2.8 / 2016-08-16
==================

  * Fixed background of the fullscreen

1.2.7 / 2016-08-16
==================

  * Fixed media query for Lightbox appearance on tables

1.2.6 / 2016-08-16
==================

  * Fixed pictures content min width problem

1.2.5 / 2016-08-12
==================

  * Fixed the size and positioning of thumbnails

1.2.3 / 2016-08-11
==================

  * Fixed a bug with opening fullscreen mode after going back

1.2.0 / 2016-08-10
==================

  * Added custom events
  * Prevent opening full screen mode on < 1024
  * Minor bug fix

1.1.5 / 2016-08-08
==================

  * Removed gray background from as24-pictures element

1.1.4 / 2016-08-08
==================

  * fixed background of the slider item

1.1.2 / 2016-08-04
==================

  * Mathias / Ivan: fix for full screen state handling which in turn fix the bug when only 2 imgs are there

1.1.1 / 2016-08-04
==================

  * Added custom importer in order to be able to import external sass files using npm: prefix

1.1.0 / 2016-08-03
==================

  * Full screen improvements
  * Merge pull request #1 from andreas-schroeder/master
  * whitelisting git secrets false positives

1.0.13 / 2016-07-26
==================

  * Updated version of carousel

1.0.12 / 2016-07-22
==================

  * Execute carousel redrawing in set timeout to avoid miscalculation issues in FF

1.0.11 / 2016-07-21
==================

  * Removed transition from thumbnail border

1.0.10 / 2016-07-21
==================

  * Moved the check for fullscreen into click handler to avoid resizing issues.
  * Undo centering of thumbs in L view

1.0.9 / 2016-07-20
==================

  * Updated carousel version to 2.1.8
  * Removed video frame from sample causing errors
  * Reverted centering of counter

1.0.8 / 2016-07-20
==================

  * Carousel version update
  * Fixed broken html in sample

1.0.7 / 2016-07-20
==================

  * Small check to avoid js error
  * Centered the pagination counter for the gallery
  * Fix problem with flickering thumbnail section when hovering over thumbnail paging button

1.0.6 / 2016-07-19
==================

  * Fullscreen view should be anchored on the top left side of the window

1.0.5 / 2016-07-19
==================

  * Don't show thumbs when cursor is over pagination buttons

1.0.4 / 2016-07-19
==================

  * Added handling for stopping video on slide change
  * Cursor type pointer when hovering over gallery images.
  * Added break for full screen mode(L view only)
  * thumbnail border orange, thinner and out of thumb picture.
  * Changed naming for slider div container to avoid conflicts
  * Added additional container for gallery slider and thumbs to make hover events work smoothly

1.0.3 / 2016-07-18
==================

  * Adapted fullscreen gallery background to transparent black.
  * Changed event handlers for showing/hiding thumbs.
  * implemented closing button
  * implemented open/close events when clicking on image/outside
  * Fixed position of thumbnail gallery navigation buttons
  * centering thumbs in lightbox mode

1.0.2 / 2016-07-08
==================

  * changed thumbnail behaviour on desktop. Thumbnails are now shown when user hovers over whole gallery, not just a part of it.

1.0.1 / 2016-06-30
==================
  * refactored the fullscreen method.
  * changed the example markup
  * updated the documentation
