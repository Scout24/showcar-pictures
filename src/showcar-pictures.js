/**
 * Add a class to the given DOM element.
 * @param {string} className
 * @param {HTMLElement} element
 * @returns {HTMLElement}
 * ToDo: v3 -> Move to ui utils library.
 */
function addClass(className, element) {
  if (!element.getAttribute) return element;

  let classList = [], classesString = element.getAttribute('class');
  if (classesString) {
    classList = classesString.split(' ');
    if (classList.indexOf(className) === -1) {
      classesString = classList.concat(className).join(' ');
    }
  } else {
    classesString = className
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

  let classList = [], classesString = element.getAttribute('class');
  if (classesString) {
    classList = classesString.split(' ');
    if(classList.indexOf(className) !== -1){
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

  let classList = [], classesString = element.getAttribute('class');
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
class Pictures {

  /** @constructor */
  constructor(element) {
    this.element = element;
    this.resizeListener = null;
    this.thumbnailsVisible = false;
    this.fullScreenState = false;
  }

  /**
   * Adds all handlers for the thumbnails carousel.
   */
  addThumbnails() {
    this.thumbnailsItems = this.thumbnails.querySelectorAll('.as24-carousel-item');
    if(!this.thumbnailsItems) return;
    addClass('active', this.thumbnailsItems[0]);
    [].forEach.call(this.thumbnailsItems, (element, index) => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        this.slider.goTo(index);
      })
    });
  }

  /**
   * Adds all handlers for the slider carousel.
   */
  addSlider() {
    this.slider.addEventListener('slide', (e) => {
      let index = e.detail.index;
      if(!this.thumbnails) return;
      let goTo = index > this.thumbnails.getStepLength() ? this.thumbnails.getStepLength() : index;
      this.thumbnails.goTo(goTo);
      [].forEach.call(this.thumbnailsItems, element => removeClass('active', element));
      addClass('active', this.thumbnailsItems[index]);
    });
  }


  /**
   * Set the full screen state.
   * @param {Boolean} state - the full screen state.
   */
  setFullScreenState(state){
    if(this.fullScreenState === state) return;
    this.fullScreenState = state;
    let index = parseInt(this.slider.getIndex());
    if(this.fullScreenState){
      addClass('fullScreen', this.element);
    } else {
      removeClass('fullScreen', this.element);
    }

    this.slider.setAttribute('preview',String(!this.fullScreenState));
    this.setThumbnailMouseListeners(!this.fullScreenState);

    [].forEach.call(this.container, element => addClass('no-transition', element));
    this.slider.redraw();
    this.slider.goTo(index);
    this.thumbnails.redraw();
    this.thumbnails.goTo(index);
    [].forEach.call(this.container, element => removeClass('no-transition', element));

    this.redraw();
  }

  /**
   * Adds all handlers for full screen view.
   * {Event} event - the click event.
   */
  fullScreenOpenHandler(event) {
    event.preventDefault();
    const target = event.target || event.srcElement;
    if(!this.fullScreenState && target.nodeName.toLowerCase() === 'img') {
      this.setFullScreenState(true);
    }
  }

  fullScreenCloseHandler(event) {
    event.preventDefault();
    const target = event.target || event.srcElement;

    if(this.fullScreenState) {
      if(target.nodeName.toLowerCase() === 'as24-pictures' || target.classList.contains('as24-pictures-fullScreen-close')) {
        this.setFullScreenState(false);
      }
    }
  }

  /**
   * Initializes the pictures by adding all necessary bits and bolts.
   */
  attached() {
    this.addContainer();

    // Slider
    this.slider = this.element.querySelector('.as24-pictures-slider');
    if(this.slider) {
      this.addSlider();
      if(this.element.querySelector('.video-container')) {
        this.slider.addEventListener('slide', function(event) {
          if(event.detail.index !== 0) {
            var videoFrame = document.querySelector('as24-pictures .video-container iframe');
            videoFrame.contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
          }
        });
      }
    }

    if(window.innerWidth > 1023) {
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
  detached(){
    window.removeEventListener('resize', this.resizeListener, true);
    this.setThumbnailMouseListeners(false);

    this.fullScreen = this.element.querySelector('as24-pictures as24-carousel');
    if(this.fullScreen) {
      this.fullScreen.removeEventListener('click', this.fullScreenOpenListener);
    }

    this.closeButton = this.element.querySelector('as24-pictures-fullScreen-close');
    if(this.closeButton) {
      this.closeButton.addEventListener('click', this.fullScreenCloseListener);
    }

    this.element.removeEventListener('click', this.fullScreenCloseListener);

    this.removeContainer();
  }

  /**
   * Add or remove thumbnail mouse listeners
   * @param {Boolean} state - the state of the listeners
   */
  setThumbnailMouseListeners(state){
    this.sliderContainer = this.element.querySelector('.as24-pictures-slider-container');
    if(state){
      this.setThumbnailMouseListeners(false);
      this.mouseEnterListener = this.mouseEnterHandler.bind(this);
      this.mouseLeaveListener = this.mouseLeaveHandler.bind(this);
      this.sliderContainer.addEventListener('mouseover', this.mouseEnterListener, true);
      this.sliderContainer.addEventListener('mouseleave', this.mouseLeaveListener, true);
    } else {
      this.sliderContainer.removeEventListener('mouseover', this.mouseEnterListener,  true);
      this.sliderContainer.removeEventListener('mouseleave', this.mouseLeaveListener, true);
      this.setThumbnailVisibility(false);
    }
  }

  /**
   * Wraps all the pictures items in a container.
   */
  addContainer() {

    if (containsClass('as24-pictures-wrapper', this.element.firstChild)){
      this.wrapper = this.element.querySelector('.as24-pictures-wrapper');
      this.container = this.element.querySelector('.as24-pictures-container');
      return;
    }

    this.wrapper = document.createElement('div');
    addClass('as24-pictures-wrapper', this.wrapper);

    this.container = document.createElement('div');
    addClass('as24-pictures-container', this.container);

    [].forEach.call(this.element.children, element => {
      let item = element.cloneNode(true);
      this.container.appendChild(item);
    });

    this.wrapper.appendChild(this.container);
    this.element.innerHTML = '';
    this.element.appendChild(this.wrapper);
  }

  /**
   * Removes the container.
   */
  removeContainer() {
    [].forEach.call(this.container.children, element => {
      this.container.removeChild(element);
    });
    this.wrapper.removeChild(this.container);
    this.element.removeChild(this.wrapper);
  }

  /**
   * Mouse move handler for the thumbnail visibility state.
   */
  mouseEnterHandler(event){
    const target = event.target || event.srcElement;
    const paginationButtons = this.slider.querySelectorAll('.as24-pagination-button');
    if(paginationButtons && (target == paginationButtons[0] || target == paginationButtons[1])) {
      event.stopPropagation();
      this.setThumbnailVisibility(false);
      return;
    }
    this.setThumbnailVisibility(true);
  }

  /**
   * Mouse leave handler for the thumbnail visibility state.
   */
  mouseLeaveHandler(){
    this.setThumbnailVisibility(false);
  }

  /**
   * Animates the thumbnail view position according its state.
   * {Boolean} state - the thumbnail component visibility state.
   */
  setThumbnailVisibility(state = false){
    if(!this.thumbnails || this.thumbnailsVisible === state) return;

    this.thumbnailsVisible = state;
    let thumbnailHeight = this.thumbnails.offsetHeight;
    let distance = state ? thumbnailHeight : 0;

    distance = ~distance + 1;
    this.move({
      element: this.thumbnails,
      y: distance
    });

    let indicator = this.element.querySelector('.as24-pagination-indicator');
    if(indicator){
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
  redraw() {
    let isFullScreen = containsClass('fullScreen', this.element);
    if(isFullScreen) return;
    let sliderSize = this.getElementSize(this.slider);
    // avoids the thumbnail view on small sizes
    if(sliderSize.width <= 480){
      this.setThumbnailMouseListeners(false);
    } else {
      this.setThumbnailMouseListeners(true);
    }
  }

  /**
   * Moves the element by the given distance.
   * @param {Object} options - the values for moving an element.
   */
  move(options = {element: this.element, x: 0, y: 0}){
    let {element: element = this.element, x: x = 0, y: y = 0} = options;
    element.style.transform =       `translate3d(${x}px, ${y}px, 0)`;
    element.style.webkitTransform = `translate3d(${x}px, ${y}px. 0)`;
  }

  /**
   * Checks if the window width has changed and starts the redraw process.
   */
  resizeHandler() {
    let currentWindowWidth = this.getWindowWidth();
    if (this.windowWidth !== currentWindowWidth) {
      this.windowWidth = currentWindowWidth;
      this.redraw();
    }
  }

  /**
   * Resize timeout call blocker.
   */
  resizeTimeoutHandler(){
    // ToDo: v3 -> Uncomment the following two lines and remove the last one if there is a need for an resize maniac execution blocker.
    // clearTimeout(this.resizeTimeout);
    // this.resizeTimeout = setTimeout(this.resizeHandler.bind(this), 300);
    this.resizeHandler();
  }

  /**
   * gets the current client height.
   * @returns {Number} the width.
   */
  getWindowWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }

  /**
   * Get the element width and height without padding.
   * @param {HTMLElement} element - the element from whom to get the width and height off.
   * @return {Object}
   */
  getElementSize(element = this.element) {
    let computed = getComputedStyle(element);

    let width = element.offsetWidth;
    width -= parseFloat(computed.paddingLeft) + parseFloat(computed.paddingRight);

    let height = element.offsetHeight;
    height -= parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom);

    return {
      width: width,
      height: height
    };
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
        Object.create( HTMLElement.prototype, {
          createdCallback:  { value: elementCreatedHandler },
          attachedCallback: { value: elementAttachedHandler },
          detachedCallback: { value: elementDetachedCallback },
        })
      )
    });
  } catch (e) {
    if (window && window.console) {
      window.console.warn('Failed to register CustomElement "as24-pictures".', e);
    }
  }
})();
