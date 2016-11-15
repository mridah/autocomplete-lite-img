# autocomplete-lite-img
autocomplete-lite-img is a lightweight JQuery-based autocomplete plugin. It supports images and callback functions.

[DEMO](https://jsfiddle.net/pjtnpLn7/5/)

## Usage :

1. Load JQuery library
2. Load *autocomplete-lite-img.js* library
3. Initialize autocomplete on element and pass autocomplete list as an array
   ```
   $('#jquery_object').autocomplete_img_init(item_data_array, image_data_array, callback_function);
   ```

######    Example :
```
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
   <script src="autocomplete-lite-img.js"></script>

   <input type="text" id="autocomplete_input">

   <script>
       // initializing

       $('#autocomplete_input').autocomplete_init(["aaa", "bbb", "ccc", "ddd", "eee", "fff"], ["aaa.jpg", "bbb.jpg", "ccc.jpg", "ddd.jpg", "eee.jpg", "fff.jpg"]);
   </script>
```

## CDNs :

1. [https://rawgit.com/mridah/autocomplete-lite-img/master/src/autocomplete-lite-img.js](https://rawgit.com/mridah/autocomplete-lite-img/master/src/autocomplete-lite-img.js)
2. [https://cdn.rawgit.com/mridah/autocomplete-lite-img/master/src/autocomplete-lite-img.js](https://cdn.rawgit.com/mridah/autocomplete-lite-img/master/src/autocomplete-lite-img.js)

## Copyright and license :

The license is available within the repository in the [LICENSE](https://github.com/mridah/autocomplete-lite-img/blob/master/LICENSE.md) file.
