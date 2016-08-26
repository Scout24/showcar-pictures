'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Add a class to the given DOM element.
 * @param {string} className
 * @param {HTMLElement} element
 * @returns {HTMLElement}
 * ToDo: v3 -> Move to ui utils library.
 */
function addClass(className, element) {
  if (!element.getAttribute) return element;

  var classList = [],
      classesString = element.getAttribute('class');
  if (classesString) {
    classList = classesString.split(' ');
    if (classList.indexOf(className) === -1) {
      classesString = classList.concat(className).join(' ');
    }
  } else {
    classesString = className;
  }
  element.setAttribute('class', classesString);
  return element;
}

/**
 * Remove a class from the given DOM element.
 * @param {string} className
 * @param {HTMLElement} element
 * @returns {HTMLElement}
 * ToDo: v3 -> Move to ui utils library.
 */
function removeClass(className, element) {
  if (!element.getAttribute) return element;

  var classList = [],
      classesString = element.getAttribute('class');
  if (classesString) {
    classList = classesString.split(' ');
    if (classList.indexOf(className) !== -1) {
      classList.splice(classList.indexOf(className), 1);
    }
    element.setAttribute('class', classList.join(' '));
  }
  return element;
}

/**
 * Check if the given DOM element has a class.
 * @param {string} className
 * @param {HTMLElement} element
 * @returns {boolean}
 * ToDo: v3 -> Move to ui utils library.
 */
function containsClass(className, element) {
  if (!element.getAttribute) return false;

  var classList = [],
      classesString = element.getAttribute('class');
  if (classesString) {
    classList = classesString.split(' ');
  }
  return classList.indexOf(className) > -1;
}

function dispatchEvent(evtName, payload, element) {
  var evt = new CustomEvent(evtName, { detail: payload, bubbles: true });
  element.dispatchEvent(evt);
  return element;
}

function extend(dst, src) {
  for (var k in src) {
    dst[k] = src[k];
  }
  return dst;
}

// ToDo: Load larger images (data-src-large?)

var Pictures = function () {

  /** @constructor */
  function Pictures(element) {
    _classCallCheck(this, Pictures);

    this.element = element;
    this.resizeListener = null;
    this.thumbnailsVisible = false;
    this.fullScreenState = false;

    this.element.addEventListener('as24-carousel.slide', function (e) {
      var data = void 0;
      e.stopPropagation();
      if (e.detail.role === "slider") {
        data = extend({ fullscreen: this.fullScreenState }, e.detail);
        dispatchEvent('as24-pictures.slide', data, this.element);
      }
    }.bind(this));

    this.element.addEventListener('as24-carousel.tap', function (e) {
      var data = void 0;
      e.stopPropagation();
      if (e.detail.role === "slider") {
        data = extend({ fullscreen: this.fullScreenState }, e.detail);
        dispatchEvent('as24-pictures.slider.tap', data, this.element);
      }
    }.bind(this));
  }

  /**
   * Adds all handlers for the thumbnails carousel.
   */


  _createClass(Pictures, [{
    key: 'addThumbnails',
    value: function addThumbnails() {
      var _this = this;

      this.thumbnailsItems = this.thumbnails.querySelectorAll('.as24-carousel-item');
      if (!this.thumbnailsItems) return;
      addClass('active', this.thumbnailsItems[0]);
      [].forEach.call(this.thumbnailsItems, function (element, index) {
        element.addEventListener('click', function (e) {
          e.preventDefault();
          _this.slider.goTo(index);
        });
      });
    }

    /**
     * Adds all handlers for the slider carousel.
     */

  }, {
    key: 'addSlider',
    value: function addSlider() {
      var _this2 = this;

      this.slider.addEventListener('as24-carousel.slide', function (e) {
        var index = e.detail.index;
        var goTo = index > _this2.thumbnails.getStepLength() ? _this2.thumbnails.getStepLength() : index;

        switch (e.detail.role) {
          case 'slider':
            _this2.thumbnails.goTo(goTo);
            break;
          case 'thumbnails':
            _this2.slider.goTo(goTo);
            break;
        }

        [].forEach.call(_this2.thumbnailsItems, function (el) {
          return removeClass('active', el);
        });
        addClass('active', _this2.thumbnailsItems[index]);
      });
    }

    /**
     * Set the full screen state.
     * @param {Boolean} state - the full screen state.
     */

  }, {
    key: 'setFullScreenState',
    value: function setFullScreenState(state) {
      if (this.fullScreenState === state) return;

      this.fullScreenState = state;

      var index = parseInt(this.slider.getIndex());

      if (this.fullScreenState) {
        addClass('as24-pictures--fullscreen', this.element);
      } else {
        removeClass('as24-pictures--fullscreen', this.element);
      }

      dispatchEvent('as24-pictures.fullscreen', { fullscreen: this.fullScreenState }, this.element);

      window.setTimeout(function () {
        this.slider.setAttribute('preview', String(!this.fullScreenState));
        this.setThumbnailMouseListeners(!this.fullScreenState);

        addClass('no-transition', this.container);

        this.slider.goTo(index);
        this.slider.redraw(this.fullScreenState ? 'data-fullscreen-src' : 'data-src');
        this.thumbnails.goTo(index);
        this.thumbnails.redraw('data-src');

        removeClass('no-transition', this.container);

        this.redraw();
      }.bind(this));
    }

    /**
     * Adds all handlers for full screen view.
     * {Event} event - the click event.
     */

  }, {
    key: 'fullScreenOpenHandler',
    value: function fullScreenOpenHandler(event) {
      event.preventDefault();

      if (window.innerWidth <= 1024) {
        return;
      }

      var target = event.target || event.srcElement;
      if (!this.fullScreenState && target.nodeName.toLowerCase() === 'img') {
        this.setFullScreenState(true);
      }
    }
  }, {
    key: 'fullScreenCloseHandler',
    value: function fullScreenCloseHandler(event) {
      event.preventDefault();
      var target = event.target || event.srcElement;

      if (this.fullScreenState) {
        if (target.nodeName.toLowerCase() === 'as24-pictures' || target.classList.contains('as24-pictures__fullscreen-close')) {
          this.setFullScreenState(false);
        }
      }
    }

    /**
     * Initializes the pictures by adding all necessary bits and bolts.
     */

  }, {
    key: 'attached',
    value: function attached() {
      this.addContainer();

      // Slider
      this.slider = this.element.querySelector('.as24-pictures__slider');
      if (this.slider) {
        this.addSlider();
      }

      // Thumbnails
      this.thumbnails = this.element.querySelector('.as24-pictures__thumbnails');
      if (this.thumbnails) this.addThumbnails();

      // FullScreen
      this.fullScreen = this.element.querySelector('.as24-pictures as24-carousel');
      if (this.fullScreen) {
        this.fullScreenOpenListener = this.fullScreenOpenHandler.bind(this);
        this.fullScreen.addEventListener('click', this.fullScreenOpenListener);
      }

      this.fullScreenCloseListener = this.fullScreenCloseHandler.bind(this);
      this.element.addEventListener('click', this.fullScreenCloseListener);

      this.closeButton = this.element.querySelector('.as24-pictures__fullscreen-close');
      if (this.closeButton) {
        this.closeButton.addEventListener('click', this.fullScreenCloseListener);
      }

      this.resizeListener = this.resizeTimeoutHandler.bind(this);

      // Add Listeners.
      window.addEventListener('resize', this.resizeListener, true);
      this.setThumbnailMouseListeners(true);

      this.redraw();
    }

    /**
     * Cleans up the pictures component by removing listeners and dom elements.
     */

  }, {
    key: 'detached',
    value: function detached() {
      window.removeEventListener('resize', this.resizeListener, true);
      this.setThumbnailMouseListeners(false);

      this.fullScreen = this.element.querySelector('as24-pictures as24-carousel');
      if (this.fullScreen) {
        this.fullScreen.removeEventListener('click', this.fullScreenOpenListener);
      }

      this.closeButton = this.element.querySelector('.as24-pictures__fullscreen-close');
      if (this.closeButton) {
        this.closeButton.addEventListener('click', this.fullScreenCloseListener);
      }

      this.element.removeEventListener('click', this.fullScreenCloseListener);

      this.removeContainer();
    }

    /**
     * Add or remove thumbnail mouse listeners
     * @param {Boolean} state - the state of the listeners
     */

  }, {
    key: 'setThumbnailMouseListeners',
    value: function setThumbnailMouseListeners(state) {
      this.sliderContainer = this.element.querySelector('.as24-pictures__slider-container');
      if (state) {
        this.setThumbnailMouseListeners(false);
        this.mouseEnterListener = this.mouseEnterHandler.bind(this);
        this.mouseLeaveListener = this.mouseLeaveHandler.bind(this);
        this.sliderContainer.addEventListener('mouseover', this.mouseEnterListener, true);
        this.sliderContainer.addEventListener('mouseleave', this.mouseLeaveListener, true);
      } else {
        this.sliderContainer.removeEventListener('mouseover', this.mouseEnterListener, true);
        this.sliderContainer.removeEventListener('mouseleave', this.mouseLeaveListener, true);
        this.setThumbnailVisibility(false);
      }
    }

    /**
     * Wraps all the pictures items in a container.
     */

  }, {
    key: 'addContainer',
    value: function addContainer() {
      var _this3 = this;

      if (containsClass('as24-pictures__wrapper', this.element.firstChild)) {
        this.wrapper = this.element.querySelector('.as24-pictures__wrapper');
        this.container = this.element.querySelector('.as24-pictures__container');
        return;
      }

      this.wrapper = document.createElement('div');
      addClass('as24-pictures__wrapper', this.wrapper);

      this.container = document.createElement('div');
      addClass('as24-pictures__container', this.container);

      [].forEach.call(this.element.children, function (element) {
        var item = element.cloneNode(true);
        _this3.container.appendChild(item);
      });

      this.wrapper.appendChild(this.container);
      this.element.innerHTML = '';
      this.element.appendChild(this.wrapper);
    }

    /**
     * Removes the container.
     */

  }, {
    key: 'removeContainer',
    value: function removeContainer() {
      var _this4 = this;

      [].forEach.call(this.container.children, function (element) {
        _this4.container.removeChild(element);
      });
      this.wrapper.removeChild(this.container);
      this.element.removeChild(this.wrapper);
    }

    /**
     * Mouse move handler for the thumbnail visibility state.
     */

  }, {
    key: 'mouseEnterHandler',
    value: function mouseEnterHandler(event) {
      var target = event.target || event.srcElement;
      var paginationButtons = this.slider.querySelectorAll('.as24-pagination-button');
      if (paginationButtons && (target == paginationButtons[0] || target == paginationButtons[1])) {
        event.stopPropagation();
        this.setThumbnailVisibility(false);
        return;
      }
      this.setThumbnailVisibility(true);
    }

    /**
     * Mouse leave handler for the thumbnail visibility state.
     */

  }, {
    key: 'mouseLeaveHandler',
    value: function mouseLeaveHandler() {
      this.setThumbnailVisibility(false);
    }

    /**
     * Animates the thumbnail view position according its state.
     * {Boolean} state - the thumbnail component visibility state.
     */

  }, {
    key: 'setThumbnailVisibility',
    value: function setThumbnailVisibility() {
      var state = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      if (!this.thumbnails || this.thumbnailsVisible === state) return;

      this.thumbnailsVisible = state;
      var indicator = this.element.querySelector('.as24-pagination-indicator');
      var thumbsVisibilityModifier = 'as24-pictures__thumbnails--visible';
      var indicatorVisibilityModifier = 'as24-pagination-indicator--upped';

      state ? addClass(thumbsVisibilityModifier, this.thumbnails) : removeClass(thumbsVisibilityModifier, this.thumbnails);
      if (indicator) {
        state ? addClass(indicatorVisibilityModifier, indicator) : removeClass(indicatorVisibilityModifier, indicator);
      }
    }

    /**
     * Takes care of the pictures sizing.
     * @public
     */

  }, {
    key: 'redraw',
    value: function redraw() {
      var isFullScreen = containsClass('as24-pictures--fullscreen', this.element);
      if (isFullScreen) return;
      var sliderSize = this.getElementSize(this.slider);
      // avoids the thumbnail view on small sizes
      if (window.document.body.clientWidth > 1024) {
        this.setThumbnailMouseListeners(true);
      } else {
        this.setThumbnailMouseListeners(false);
      }
    }

    /**
     * Checks if the window width has changed and starts the redraw process.
     */

  }, {
    key: 'resizeHandler',
    value: function resizeHandler() {
      var currentWindowWidth = this.getWindowWidth();
      if (this.windowWidth !== currentWindowWidth) {
        this.windowWidth = currentWindowWidth;
        this.redraw();
      }
    }

    /**
     * Resize timeout call blocker.
     */

  }, {
    key: 'resizeTimeoutHandler',
    value: function resizeTimeoutHandler() {
      // ToDo: v3 -> Uncomment the following two lines and remove the last one if there is a need for an resize maniac execution blocker.
      // clearTimeout(this.resizeTimeout);
      // this.resizeTimeout = setTimeout(this.resizeHandler.bind(this), 300);
      this.resizeHandler();
    }

    /**
     * gets the current client height.
     * @returns {Number} the width.
     */

  }, {
    key: 'getWindowWidth',
    value: function getWindowWidth() {
      return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }

    /**
     * Get the element width and height without padding.
     * @param {HTMLElement} element - the element from whom to get the width and height off.
     * @return {Object}
     */

  }, {
    key: 'getElementSize',
    value: function getElementSize() {
      var element = arguments.length <= 0 || arguments[0] === undefined ? this.element : arguments[0];

      var computed = getComputedStyle(element);

      var width = element.offsetWidth;
      width -= parseFloat(computed.paddingLeft) + parseFloat(computed.paddingRight);

      var height = element.offsetHeight;
      height -= parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom);

      return {
        width: width,
        height: height
      };
    }
  }]);

  return Pictures;
}();

(function () {
  /**
   * Gets called after the element is created.
   */
  var elementCreatedHandler = function elementCreatedHandler() {
    this.pictures = new Pictures(this);
  };

  /**
   * Gets called when the element is attached to the dom.
   */
  var elementAttachedHandler = function elementAttachedHandler() {
    this.pictures.attached();
  };

  /**
   * Handler for detachment of the element from the dom.
   */
  var elementDetachedCallback = function elementDetachedCallback() {
    this.carousel.detached();
    delete this.carousel;
  };

  /**
   * Try to register the pictures component.
   */
  try {
    document.registerElement('as24-pictures', {
      prototype: Object.assign(Object.create(HTMLElement.prototype, {
        createdCallback: { value: elementCreatedHandler },
        attachedCallback: { value: elementAttachedHandler },
        detachedCallback: { value: elementDetachedCallback }
      }))
    });
  } catch (e) {
    if (window && window.console) {
      window.console.warn('Failed to register CustomElement "as24-pictures".', e);
    }
  }
})();

//# sourceMappingURL=showcar-pictures.js.map