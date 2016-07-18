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

/**
 * Toggles the class for the dom element
 * @param {string} className
 * @param {Element} domElement
 * @returns {Element}
 * ToDo: Move to ui utils library
 */
function toggleClass(className, domElement) {
  if (containsClass(className, domElement)) {
    return removeClass(className, domElement);
  } else {
    return addClass(className, domElement);
  }
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

      this.slider.addEventListener('slide', function (e) {
        var index = e.detail.index;
        if (!_this2.thumbnails) return;
        var goTo = index > _this2.thumbnails.getStepLength() ? _this2.thumbnails.getStepLength() : index;
        _this2.thumbnails.goTo(goTo);
        [].forEach.call(_this2.thumbnailsItems, function (element) {
          return removeClass('active', element);
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
        addClass('fullScreen', this.element);
      } else {
        removeClass('fullScreen', this.element);
      }

      this.slider.setAttribute('preview', String(!this.fullScreenState));
      this.setThumbnailMouseListeners(!this.fullScreenState);

      [].forEach.call(this.container, function (element) {
        return addClass('no-transition', element);
      });
      this.slider.redraw();
      this.slider.goTo(index);
      this.thumbnails.redraw();
      this.thumbnails.goTo(index);
      [].forEach.call(this.container, function (element) {
        return removeClass('no-transition', element);
      });

      this.redraw();
    }

    /**
     * Adds all handlers for full screen view.
     * {Event} event - the click event.
     */

  }, {
    key: 'fullScreenOpenHandler',
    value: function fullScreenOpenHandler(event) {
      event.preventDefault();
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
        if (target.nodeName.toLowerCase() === 'as24-pictures' || target.classList.contains('as24-pictures-fullScreen-close')) {
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
      this.slider = this.element.querySelector('.as24-pictures-slider');
      if (this.slider) this.addSlider();

      // Thumbnails
      this.thumbnails = this.element.querySelector('.as24-pictures-thumbnails');
      if (this.thumbnails) this.addThumbnails();

      // FullScreen
      this.fullScreen = this.element.querySelector('as24-pictures as24-carousel');
      if (this.fullScreen) {
        this.fullScreenOpenListener = this.fullScreenOpenHandler.bind(this);
        this.fullScreen.addEventListener('click', this.fullScreenOpenListener);
      }

      this.fullScreenCloseListener = this.fullScreenCloseHandler.bind(this);
      this.element.addEventListener('click', this.fullScreenCloseListener);

      this.closeButton = this.element.querySelector('as24-pictures-fullScreen-close');
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

      this.closeButton = this.element.querySelector('as24-pictures-fullScreen-close');
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
      this.slider = this.element.querySelector('.as24-pictures-container');
      if (state) {
        this.setThumbnailMouseListeners(false);
        this.mouseEnterListener = this.mouseEnterHandler.bind(this);
        this.mouseLeaveListener = this.mouseLeaveHandler.bind(this);
        this.slider.addEventListener('mouseover', this.mouseEnterListener, true);
        this.slider.addEventListener('mouseleave', this.mouseLeaveListener, true);
      } else {
        this.slider.removeEventListener('mouseover', this.mouseEnterListener, true);
        this.slider.removeEventListener('mouseleave', this.mouseLeaveListener, true);
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

      if (containsClass('as24-pictures-wrapper', this.element.firstChild)) {
        this.wrapper = this.element.querySelector('.as24-pictures-wrapper');
        this.container = this.element.querySelector('.as24-pictures-container');
        return;
      }

      this.wrapper = document.createElement('div');
      addClass('as24-pictures-wrapper', this.wrapper);

      this.container = document.createElement('div');
      addClass('as24-pictures-container', this.container);

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

      if (this.thumbnailsVisible === state) return;

      this.thumbnailsVisible = state;
      var thumbnailHeight = this.thumbnails.offsetHeight;
      var distance = state ? thumbnailHeight : 0;

      distance = ~distance + 1;
      this.move({
        element: this.thumbnails,
        y: distance
      });

      var indicator = this.element.querySelector('.as24-pagination-indicator');
      if (indicator) {
        this.move({
          element: indicator,
          y: distance
        });
      }
    }

    /**
     * Takes care of the pictures sizing.
     * @public
     */

  }, {
    key: 'redraw',
    value: function redraw() {
      var isFullScreen = containsClass('fullScreen', this.element);
      if (isFullScreen) return;
      var sliderSize = this.getElementSize(this.slider);
      // avoids the thumbnail view on small sizes
      if (sliderSize.width <= 480) {
        this.setThumbnailMouseListeners(false);
      } else {
        this.setThumbnailMouseListeners(true);
      }
    }

    /**
     * Moves the element by the given distance.
     * @param {Object} options - the values for moving an element.
     */

  }, {
    key: 'move',
    value: function move() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? { element: this.element, x: 0, y: 0 } : arguments[0];
      var _options$element = options.element;
      var element = _options$element === undefined ? this.element : _options$element;
      var _options$x = options.x;
      var x = _options$x === undefined ? 0 : _options$x;
      var _options$y = options.y;
      var y = _options$y === undefined ? 0 : _options$y;

      element.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
      element.style.webkitTransform = 'translate3d(' + x + 'px, ' + y + 'px. 0)';
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