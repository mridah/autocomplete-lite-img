# autocomplete-lite-img
autocomplete-lite-img is a lightweight JQuery-based autocomplete plugin. It supports images and callback functions.

[DEMO](https://jsfiddle.net/pjtnpLn7/8/)

## Usage :

1. Load JQuery library
2. Load *autocomplete-lite-img.js* library
3. Initialize autocomplete on element and pass items, images ( and callback function )

######    Format :

   ```
   $('#jquery_object').autocomplete_img_init({
       items: item_data_array,
       images: image_data_array,
       callback: callback_function
   });
   ```

**NOTE : in your callback function, the first and the second arguments are `your_input_element` and `selected_item_index`**

######    Example :

```
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
   <script src="autocomplete-lite-img.js"></script>

   <input type="text" id="autocomplete_input">

   <script>
       // initializing

       $('#autocomplete_input').autocomplete_init({
           items: ["aaa", "bbb", "ccc", "ddd", "eee", "fff"],
           images: ["aaa.jpg", "bbb.jpg", "ccc.jpg", "ddd.jpg", "eee.jpg", "fff.jpg"],
           callback: callback_function // this argument is optional
       });

       function callback_function(elem, index)
       {
           alert("Selected : " + elem.val() + '. Item index : ' + index);
       }
   </script>
```

## CDNs :

[https://cdn.rawgit.com/mridah/autocomplete-lite-img/b3ec899c84ea3332eba6c42df7ef76d1db86c07a/src/autocomplete-lite-img.js](https://cdn.rawgit.com/mridah/autocomplete-lite-img/b3ec899c84ea3332eba6c42df7ef76d1db86c07a/src/autocomplete-lite-img.js)


## Report bugs and suggestions :
If you want to report a bug or want to add a sugestion, just add it in the issues. Or you can mail me at [this](mailto:mridul.ahuja@gmail.com).


## Copyright and license :

The license is available within the repository in the [LICENSE](https://github.com/mridah/autocomplete-lite-img/blob/master/LICENSE.md) file.
