# showcar-pictures

This module provides a easy to use vanilla js gallery library.
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

<as24-pictures>

    <as24-carousel class="as24-pictures-slider" 
                   mode="slider"
                   gap="0"
                   preview="true"
                   indicator="true">
                     
      <li class="as24-carousel-item">
        <div class="as24-carousel-image-container">
          <img data-src="http://placehold.it/400x300?text=1,400x300"
               src=""
               alt="">
        </div>
      <li>
      ...
  
    </as24-carousel>
  
    <!-- Optional -->
    <as24-carousel class="as24-pictures-thumbnails" 
                   gap="0">
  
      <li class="as24-carousel-item">
        <div class="as24-carousel-image-container">
          <img data-src="http://placehold.it/80x60?text=1,80x60"
               src=""
               alt="">
        </div>
      </li>
      ...
  
    </as24-carousel>
    <!-- Optional -->

</as24-pictures>
```

#### CSS Styling 

For more information on styling have a look at the [showcar-carousel](https://github.com/AutoScout24/showcar-carousel) documentation.

## Installation

#### How to install:

  To install showcar-pictures within your project use npm.

  ```
  $> npm install showcar-pictures --save
  ```

  Afterwards you need to add some css and js to your page.

  ```html
  <link rel="stylesheet" href="../dist/showcar-pictures.css">
  <link rel="stylesheet" href="../dist/showcar-carousel.css">
  ```

  ```html
  <script src="../dist/showcar-carousel.js"></script>
  <script src="../dist/showcar-pictures.js"></script>
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
