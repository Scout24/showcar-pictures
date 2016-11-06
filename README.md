[![npm version](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/showcar-pictures)
[![](http://img.badgesize.io/AutoScout24/showcar-pictures/master/dist/showcar-pictures.min.js?label=js_size)

# showcar-pictures

This module provides a easy to use vanilla js gallery library with previews and full screen view.
Actually it is just a wrapper that handles the communication between two [showcar-carousel](https://github.com/AutoScout24/showcar-carousel) components.

***

## Usage

#####Live example:
Visit the [example](https://autoscout24.github.io/showcar-pictures/) on github pages.


#####Local example:
Just run the following command in the root of the carousel library.

```
$> npm start
```
This will open a small express server on your local machine where you can see the running example.

Visit: [http://localhost:8080](http://localhost:8080)

#### HTML Code

See the following example below:

```html
<div id="my-pics">
  <as24-pictures class="as24-pictures">
    <div class="as24-pictures__container">

      <!-- Header -->
      <div class="as24-pictures__header">
        <div class="as24-pictures__header-line">
          <h2 class="as24-pictures__picture-title"><!-- The main title of the gallery --></h2>
          <i class="as24-pictures__fullscreen-close"><!-- close button text --></i>
        </div>
        <div class="as24-pictures__header-line">
          <h5 class="as24-pictures__picture-subtitle"><!-- The secondary title of the gallery --></h5>
        </div>
      </div>
      <!-- / Header -->

      <div class="as24-pictures__content">
        <div class="as24-pictures__slider-container">

          <!-- Slider -->
          <as24-carousel class="as24-pictures__slider" role="slider" loop="infinite">
            <div class="as24-carousel__container" role="container">
              <div class="as24-carousel__item">
                <!-- the content of a slider item -->
              </div>
            </div>
            <a href="#" class="as24-carousel__button" role="nav-button" data-direction="left"></a>
            <a href="#" class="as24-carousel__button" role="nav-button" data-direction="right"></a>
            <div class="as24-carousel__indicator" role="indicator">2/7</div>
          </as24-carousel>
          <!-- / Slider -->

          <!-- Thumbnails -->
          <as24-carousel role="thumbnails" class="as24-pictures__thumbnails">
            <div class="as24-carousel__container" role="container">
              <div class="as24-carousel__item">
                <!-- the content of a thumb item -->
              </div>
            </div>
            <a href="#" class="as24-carousel__button as24-carousel__button--hidden" role="nav-button" data-direction="left"></a>
            <a href="#" class="as24-carousel__button" role="nav-button" data-direction="right"></a>
          </as24-carousel>
          <!-- / Thumbnails -->

        </div>

        <!-- Additional info -->
        <aside class="as24-pictures__info">
          <!-- description, ads, whatever -->
        </aside>
        <!-- / Additional info -->

      </div>
    </div>
  </as24-pictures>
</div>
```
*Note: The number of the thumbnails and the number of slides MUST be the same!*

#### CSS Styling

As to styles, you only have to specify these:

```css
#my-pics .as24-pictures__slider .as24-carousel__item {
  width: 640px;
  height: 480px;
}

#my-pics .as24-pictures--fullscreen .as24-pictures__slider .as24-carousel__item {
  height: auto;
}
```

#### Custom Events

The library triggers following custom events with `event.detail`:

 * `as24-pictures.fullscreen` - when fullscreen mode is toggled

   ```js
   {
     fullscreen: true
   }
   ```

 * `as24-pictures.slide` - when the image of the slider has been changed

   ```js
   {
     direction: "right",
     fullscreen: true,
     id: "",
     index: 6,
     role: "slider"
   }
   ```

## Installation

#### How to install:

To install showcar-pictures within your project use npm.

```
$> npm install showcar-pictures --save
```

Afterwards you need to add some css and js to your page.

```html
<link rel="stylesheet" href="../dist/showcar-pictures.css">
```

```html
<script src="../dist/showcar-carousel.js"></script>
```

*Note: The showcar-pictures depends on the [showcar-carousel](https://github.com/AutoScout24/showcar-carousel) component.*

***

## Contributing

#### How to contribute:

* Fork this repository.      
* Then install the required dependencies.
    ```
    $> npm install
    ```  
* Start the dev server.
    ```
    $> npm run dev
    ```
* Visit [http://localhost:8080](http://localhost:8080)

*Note: changes will automatically build and refresh the browser.*

##### Contribute

Save your changes and run `$> npm prod`.

Commit your code _and_ the compiled libraries in _./dist_. Then create a pull-request.

## License

MIT License
