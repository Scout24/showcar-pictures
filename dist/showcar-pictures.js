'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Adds class to the dom element
 * @param {string} className  The class that has to be added
 * @param {Element} element   The element to add a class to
 * @return {Element}          the element to which the class has been added
 */
function addClass(className, element) {
  element.classList.add(className);
  return element;
}

/**
 * Removed class from the dom element
 * @param  {string} className class to be removed
 * @param  {Element} element   the element to remove class from
 * @return {Element}           the element from which the class has been removed
 */
function removeClass(className, element) {
  element.classList.remove(className);
  return element;
}

/**
 * checks whether an element has a class
 * @param  {string} className class to be removed
 * @param  {Element} element   the element to remove class from
 * @return {Boolean}
 */
function containsClass(className, element) {
  return element.classList.contains(className);
}

function dispatchEvent(evtName, payload, element) {
  var evt = new CustomEvent(evtName, { detail: payload, bubbles: true });
  element.dispatchEvent(evt);
  return element;
}

/**
 * Gets parent el by class name
 * @param  {string} className
 * @param  {Element} element
 * @return {Boolean}
 */
function getParentByClassName(className, element) {
  while (element && !containsClass(className, element)) {
    element = element.parentNode;
  }
  return element;
}

function merge(src1, src2) {
  var res = {};
  for (var k in src1) {
    res[k] = src1[k];
  }
  for (var k in src2) {
    res[k] = src2[k];
  }
  return res;
}

var Pictures = function () {

  /** @constructor */
  function Pictures(element) {
    _classCallCheck(this, Pictures);

    /**
     * The root element
     * @type {Element}
     */
    this.element = element;

    /**
     * Thether the thumbnail are visible on not
     * @type {Boolean}
     */
    this.thumbnailsVisible = false;

    /**
     * The current state of the screen
     * @type {Boolean}
     */
    this.fullScreenState = false;

    this.element.addEventListener('as24-carousel.slide', function (e) {
      var data = void 0;
      e.stopPropagation();
      if (e.detail.role === "slider") {
        data = merge({ fullscreen: this.fullScreenState }, e.detail);
        dispatchEvent('as24-pictures.slide', data, this.element);
      }
    }.bind(this));
  }

  /**
   * Does init for thumbnails
   */


  _createClass(Pictures, [{
    key: 'initThumbnails',
    value: function initThumbnails() {
      var _this = this;

      this.thumbnailsItems = this.thumbnails.querySelectorAll('.as24-carousel__item');

      if (!this.thumbnailsItems) return;

      addClass('active', this.thumbnailsItems[0]);

      this.thumbnails.addEventListener('click', function (evt) {
        evt.preventDefault();
        var idx = Array.from(_this.thumbnails.querySelectorAll('.as24-carousel__item')).indexOf(getParentByClassName('as24-carousel__item', evt.target));
        if (idx >= 0) _this.slider.goTo(idx + 1);
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

        switch (e.detail.role) {
          case 'slider':
            _this2.thumbnails.goTo(index, { notify: true });
            break;
          case 'thumbnails':
            _this2.slider.goTo(index, { notify: true });
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
     */

  }, {
    key: 'toggleFullScreen',
    value: function toggleFullScreen() {
      // Prevent fullscreen mode on small devices
      if (window.document.body.clientWidth < 1025) return;

      this.fullScreenState = !this.fullScreenState;

      if (this.fullScreenState) {
        addClass('as24-pictures--fullscreen', this.element);
      } else {
        removeClass('as24-pictures--fullscreen', this.element);
      }

      dispatchEvent('as24-pictures.fullscreen', { fullscreen: this.fullScreenState }, this.element);

      if (this.thumbnails) this.thumbnails.redraw(false);
      if (this.slider) this.slider.redraw(false);
    }

    /**
     * Adds all handlers for full screen view.
     * {Event} event - the click event.
     */

  }, {
    key: 'fullScreenOpenHandler',
    value: function fullScreenOpenHandler(event) {
      if (!this.fullScreenState && event.target.nodeName.toLowerCase() === 'img') {
        this.toggleFullScreen();
      }
    }
  }, {
    key: 'fullScreenCloseHandler',
    value: function fullScreenCloseHandler(event) {
      if (this.fullScreenState && containsClass('as24-pictures__fullscreen-close', event.target)) {
        this.toggleFullScreen();
      }
    }

    /**
     * Initializes the pictures by adding all necessary bits and bolts.
     */

  }, {
    key: 'attached',
    value: function attached() {
      this.container = this.element.querySelector('.as24-pictures__container');

      // Slider
      this.slider = this.element.querySelector('[role=slider]');
      if (this.slider) {
        this.addSlider();
        this.fullScreenOpenListener = this.fullScreenOpenHandler.bind(this);
        this.slider.addEventListener('click', this.fullScreenOpenListener);
      }

      // Thumbnails
      this.thumbnails = this.element.querySelector('.as24-pictures__thumbnails');
      if (this.thumbnails) this.initThumbnails();

      this.fullScreenCloseListener = this.fullScreenCloseHandler.bind(this);
      this.element.addEventListener('click', this.fullScreenCloseListener);

      this.closeButton = this.element.querySelector('.as24-pictures__fullscreen-close');
      if (this.closeButton) {
        this.closeButton.addEventListener('click', this.fullScreenCloseListener);
      }
    }

    /**
     * Cleans up the pictures component by removing listeners and dom elements.
     */

  }, {
    key: 'detached',
    value: function detached() {

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
     * Removes the container.
     */

  }, {
    key: 'removeContainer',
    value: function removeContainer() {
      var _this3 = this;

      Array.from(this.container.children).forEach(function (element) {
        return _this3.container.removeChild(element);
      });
      this.wrapper.removeChild(this.container);
    }

    /**
     * Self-explanatory
     * @param {number} slideIndex  Self-explanatory
     * @return {void}
     */

  }, {
    key: 'removeSlide',
    value: function removeSlide(slideIndex) {
      if (slideIndex > this.slider.carousel.container.children.length - 1) return;
      this.slider.removeItem(slideIndex);
      this.thumbnails.removeItem(slideIndex);
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
      }), {
        removeSlide: function removeSlide(slideIndex) {
          this.pictures.removeSlide(slideIndex);
        }
      })
    });
  } catch (e) {
    if (window && window.console) {
      window.console.warn('Failed to register CustomElement "as24-pictures".', e);
    }
  }
})();

//# sourceMappingURL=showcar-pictures.js.map