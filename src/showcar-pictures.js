function addClass(className, element) {
  element.classList.add(className)
  return element;
}

function removeClass(className, element) {
  element.classList.remove(className);
  return element;
}

function containsClass(className, element) {
  return element.classList.contains(className);
}

function dispatchEvent(evtName, payload, element) {
  var evt = new CustomEvent(evtName, { detail: payload, bubbles: true });
  element.dispatchEvent(evt);
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

// ToDo: Load larger images (data-src-large?)
class Pictures {

  /** @constructor */
  constructor(element) {
    this.element = element;
    this.thumbnailsVisible = false;
    this.fullScreenState = false;

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
   * Adds all handlers for the thumbnails carousel.
   */
  initThumbnails() {
    this.thumbnailsItems = this.thumbnails.querySelectorAll('.as24-carousel__item');
    if(!this.thumbnailsItems) return;
    addClass('active', this.thumbnailsItems[0]);
    [].forEach.call(this.thumbnailsItems, (el, idx) => {
      el.addEventListener('click', e => {
        e.preventDefault();
        this.slider.goTo(idx+1);
      })
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
          this.thumbnails.goTo(index);
          break;
        case 'thumbnails':
          this.slider.goTo(index);
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
    this.fullScreenState = !this.fullScreenState;
    if(this.fullScreenState) {
      addClass('as24-pictures--fullscreen', this.element);
    } else {
      removeClass('as24-pictures--fullscreen', this.element);
    }
    dispatchEvent('as24-pictures.fullscreen', { fullscreen: this.fullScreenState }, this.element);
    if (this.thumbnails) this.thumbnails.redraw();
    if (this.slider) this.slider.redraw();
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

  /**
   * Initializes the pictures by adding all necessary bits and bolts.
   */
  attached() {
    this.addContainer();

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
   * Wraps all the pictures items in a container.
   */
  addContainer() {
    if (containsClass('as24-pictures__wrapper', this.element.children[0])){
      this.container = this.element.querySelector('.as24-pictures__container');
      return;
    }

    this.container = document.createElement('div');
    addClass('as24-pictures__container', this.container);

    [].forEach.call(this.element.children, element => {
      let item = element.cloneNode(true);
      this.container.appendChild(item);
    });

    this.element.innerHTML = '';
    this.element.appendChild(this.container);
  }

  /**
   * Removes the container.
   */
  removeContainer() {
    [].forEach.call(this.container.children, element => {
      this.container.removeChild(element);
    });
    this.wrapper.removeChild(this.container);
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
