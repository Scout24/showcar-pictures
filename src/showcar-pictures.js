/**
 * Adds class to the dom element
 * @param {string} className  The class that has to be added
 * @param {Element} element   The element to add a class to
 * @return {Element}          the element to which the class has been added
 */
function addClass(className, element) {
  element.classList.add(className)
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
  while(element && !containsClass(className, element)) {
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

class Pictures {

  /** @constructor */
  constructor(element) {
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

    this.leftArrow = this.element.querySelector('.as24-carousel__button[data-direction=left]');
    this.rightArrow = this.element.querySelector('.as24-carousel__button[data-direction=right]');

    this.element.addEventListener('as24-carousel.slide', function(e) {
      let data;
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
  initThumbnails() {
    this.thumbnailsItems = this.thumbnails.querySelectorAll('.as24-carousel__item');

    if(!this.thumbnailsItems) return;

    addClass('active', this.thumbnailsItems[0]);

    this.thumbnails.addEventListener('click', (evt) => {
      evt.preventDefault();
      const idx = Array.from(this.thumbnails.querySelectorAll('.as24-carousel__item')).indexOf(getParentByClassName('as24-carousel__item', evt.target));
      if (idx >= 0) this.slider.goTo(idx + 1);
    });
  }

  /**
   * Adds all handlers for the slider carousel.
   */
  addSlider() {
    this.slider.addEventListener('as24-carousel.slide', e => {
      let index = e.detail.index;

      switch(e.detail.role) {
        case 'slider':
          this.thumbnails.goTo(index, { notify: true });
          break;
        case 'thumbnails':
          this.slider.goTo(index, { notify: true });
          break;
      }

      [].forEach.call(this.thumbnailsItems, el => removeClass('active', el));
      addClass('active', this.thumbnailsItems[index]);
    });
  }

  /**
   * Set the full screen state.
   */
  toggleFullScreen() {
    // Prevent fullscreen mode on small devices
    if (window.document.body.clientWidth < 1025) return;

    this.fullScreenState = !this.fullScreenState;

    if(this.fullScreenState) {
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
  fullScreenOpenHandler(event) {
    if(!this.fullScreenState && event.target.nodeName.toLowerCase() === 'img') {
      this.toggleFullScreen();
    }
  }

  fullScreenCloseHandler(event) {
    if(this.fullScreenState && containsClass('as24-pictures__fullscreen-close', event.target)) {
      this.toggleFullScreen();
    }
  }

  fullScreenKeyboardHandler(event) {
    if (this.fullScreenState) {
      if (event.keyCode === 27) {
        this.toggleFullScreen();
      } else if (event.keyCode === 37 && this.leftArrow) {
        this.leftArrow.click();
      } else if (event.keyCode === 39 && this.rightArrow) {
        this.rightArrow.click();
      }
    }
  }

  /**
   * Initializes the pictures by adding all necessary bits and bolts.
   */
  attached() {
    this.container = this.element.querySelector('.as24-pictures__container');
    document.addEventListener('keydown', e => this.fullScreenKeyboardHandler(e));

    // Slider
    this.slider = this.element.querySelector('[role=slider]');
    if(this.slider) {
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
  detached(){

    this.fullScreen = this.element.querySelector('as24-pictures as24-carousel');
    if(this.fullScreen) {
      this.fullScreen.removeEventListener('click', this.fullScreenOpenListener);
    }

    this.closeButton = this.element.querySelector('.as24-pictures__fullscreen-close');
    if(this.closeButton) {
      this.closeButton.addEventListener('click', this.fullScreenCloseListener);
    }

    this.element.removeEventListener('click', this.fullScreenCloseListener);

    this.removeContainer();
  }

  /**
   * Removes the container.
   */
  removeContainer() {
    Array.from(this.container.children).forEach(element => this.container.removeChild(element));
    this.wrapper.removeChild(this.container);
  }

  /**
   * Self-explanatory
   * @param {number} slideIndex  Self-explanatory
   * @return {void}
   */
  removeSlide(slideIndex) {
    if (slideIndex > this.slider.carousel.container.children.length - 1) return;
    this.slider.removeItem(slideIndex);
    this.thumbnails.removeItem(slideIndex);
  }

}


(function(){
  /**
   * Gets called after the element is created.
   */
  let elementCreatedHandler = function() {
    this.pictures = new Pictures(this);
  };

  /**
   * Gets called when the element is attached to the dom.
   */
  let elementAttachedHandler = function() {
    this.pictures.attached();
  };

  /**
   * Handler for detachment of the element from the dom.
   */
  let elementDetachedCallback = function() {
    this.carousel.detached();
    delete this.carousel;
  };

  /**
   * Try to register the pictures component.
   */
  try {
    document.registerElement('as24-pictures', {
      prototype: Object.assign(
        Object.create(HTMLElement.prototype, {
          createdCallback:  { value: elementCreatedHandler },
          attachedCallback: { value: elementAttachedHandler },
          detachedCallback: { value: elementDetachedCallback },
        }), {
          removeSlide(slideIndex) {
            this.pictures.removeSlide(slideIndex);
          }
        }
      )
    });
  } catch (e) {
    if (window && window.console) {
      window.console.warn('Failed to register CustomElement "as24-pictures".', e);
    }
  }
})();
