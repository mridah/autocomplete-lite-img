/*
    Author : mridul ahuja
    Github : https://github.com/mridah/autocomplete-lite-img

    HOW TO USE :

    >> Load JQuery library
    >> Load autocomplete-lite-img.js library
    >> Initialize autocomplete on element and pass autocomplete list as an array
     
    EXAMPLE :

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="autocomplete-lite-img.js"></script>
    <input type="text" id="autocomplete_input">
    <script>
        var autocomplete_items = ["person1", "person2", "person3", "person4", "person5", "person6"];
        var autocomplete_images = ["person1.png", "person2.png", "person3.png", "person4.png", "person5", "person6.png"];
                   
        function callback_function(elem)
        {
            alert("Selected : " + elem.val());
        }

        // initializing
        $('#autocomplete_input').autocomplete_img_init({
            items: autocomplete_items, 
            images: autocomplete_images,
            callback: callback_function
        });
    </script>

*/

(function($) {

jQuery.fn.extend({
    autocomplete_img_init: function (params) {
        self = this;

        var defaults = {
                items: '',
                images: '',
            };

        params = $.extend(defaults, params);

        var item_data = params.items, callback = params.callback, image_data = params.images;

        if(callback === undefined)
        {
            callback = callback_dummy;
        }
        else
        {
           if(typeof callback !== 'function')
           {
                let error_item = self.attr('id') != undefined ? '#' + self.attr('id') : '.' + self.get(0).classList;
                console.error('Error : autocomplete-lite-img failed to initialize on [' + error_item + ']. ' + callback + ' is not a function');
                return;
           }
        }

        var item_data_length = item_data.length; 

        if(item_data_length === image_data.length)
        {
            var img_map = {};
            for(var i=0; i<item_data_length; i++)
            {
                img_map[item_data[i].toLowerCase() + '#' + i] = image_data[i];
            }

            mridautocomplete(self, item_data, img_map, callback);
        }
        else
        {
            let error_item = self.attr('id') != undefined ? '#' + self.attr('id') : '.' + self.get(0).classList;
            console.error('Error : autocomplete-lite-img failed to initialize on [' + error_item + ']. Item count does not match the image count');
        }

    }
});

function callback_dummy() {}

function mridautocomplete(input, item_data, image_data, callback) {

    var mridautocomplete_timer = 0, img_dimensions;

    /* not defining img dimensions in style since different initializations of the plugin can have different image sizes */
    img_dimensions = (parseInt(input.css('font-size')) - 2 ) + 'px';

    /* adding common css styling for this plugin in case it's not already defined */
    if(!$('#mridautocomplete_css').length )
    {        
        $('body').prepend('<style id="mridautocomplete_css">.mridautocomplete-list::-webkit-scrollbar{width: 12px;}.mridautocomplete-list::-webkit-scrollbar-track{-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);border-radius: 2px;}.mridautocomplete-list::-webkit-scrollbar-thumb{border-radius: 2px;-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);} </style>');
    }

    var item_dataList = [];

    if (Array.isArray(item_data)) {
        item_dataList = item_dataList.concat(item_data);
    } else {
        let error_item = input.attr('id') != undefined ? '#' + input.attr('id') : '.' + input.get(0).classList;
        console.error('Error : autocomplete-lite-img failed to initialize on [' + error_item + ']. Expected array, ' + typeof item_data + ' given');
        return;
    }

    /* 
        this function will return true even if text partially matches input

        Example : is_substring_exact('ple', 'apple') => true
                  is_substring_exact('pe', 'apple') => true
                                             ^  ^
                  is_substring_exact('banna', 'banana') => true
                                               ^^^ ^^
    */
    var is_substring_partial  = function(input, text) {
        input = input.toLowerCase();
        text = text.toLowerCase();
        var found = 0;
        var nextChar = input.charAt(found);
        for (var i=0, l=text.length; i<l; i++) {
            if (text.charAt(i) === nextChar) {
                found++;
                if (found === input.length)
                    return true;
                nextChar = input.charAt(found);
            }
        }
    };

    /* 
        this function will return true if text contains input

        Example : is_substring_exact('ple', 'apple') => true
                  is_substring_exact('pe', 'apple') => false
    */
    var is_substring_exact  = function(input, text) {
        input = input.toLowerCase();
        text = text.toLowerCase();
        if(text.includes(input)) {
            return true;
        }
        else {
            return false;
        }
    };

    var matchitem_data = function(input, item_dataList) {
        var result = item_dataList.map(function(item, index) {
            if (is_substring_exact(input, item)) {
                return [item, index];
            }
            return 0;
        });
        return result.filter(isNaN);
    };

    var changeInput = function(input, item_dataList) {
        var val = input.val().toLowerCase();
        var res = input.next(); /* res is the autocomplete div which is added immediately after the input */

        res.empty().hide();

        var autoCompleteResult = matchitem_data(val, item_dataList);
        if (val == "" || autoCompleteResult.length == 0) {
            return;
        }

        autoCompleteResult.forEach(function(e) {
            var p = $('<div />');
            var to_ins = false;

            p.css({
              'margin': '0px',
              'padding-left': parseInt(input.css('padding-left'),10) + parseInt(input.css('border-left-width'),10),
              'text-align': 'left',
              'font-size': input.css('font-size'),
              'cursor': 'default'
            });

            p.addClass('mrid-autocomplete-item');

            e[0] = e[0].toLowerCase();

            if(e[0].includes(val))
            {
                var first_part = e[0].split(val)[0];
                var second_part = e[0].split(val).splice(1).join(val);

                p.attr('_ix', e[1]);
                p.html('<img src="' + image_data[e[0]+'#'+e[1]] + '" class="mridautocomplete-item-image" style="height: ' + img_dimensions + '; width: ' + img_dimensions + ';" onerror="this.src=\'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\'; this.removeAttribute(\'onerror\'); this.removeAttribute(\'onload\');" onload="this.removeAttribute(\'onerror\'); this.removeAttribute(\'onload\');">' + first_part + '<span style="color: #4682B4; font-weight: bold;">' + val + '</span>' + second_part);
                to_ins = true;
            }

            p.click(function() {
                input.val(p.text());
                res.empty().hide(function(){
                    callback.call(this, input, p.attr('_ix'));
                });
            });

            p.mouseenter(function() {
                $('.mrid-autocomplete-item').css("background-color", "white");
                $('.mrid-autocomplete-item').removeClass('item-selected');
                $(this).addClass('item-selected');
                $(this).css("background-color", "#DCDCDC");
            }).mouseleave(function() {
                $(this).removeClass('item-selected');
                $(this).css("background-color", "white");
            });

            if(to_ins){
                res.append(p);
            }
        });

        res.css({
            'left': input.position().left,
            'width': input.css('width'),
            'position': 'absolute',
            'background-color': "white",
            'border': '1px solid #dddddd',
            'max-height': '150px',
            'overflow': 'scroll',
            'overflow-x': 'hidden',
            'font-family': input.css('font-family'),
            'font-size' : input.css('font-size'),
            'z-index' : '8888'
        }).insertAfter(input).show();
    };

    var res = $("<div class='mridautocomplete-list' style='display: none;'/>");
    res.insertAfter(input);

    input.keyup(function(e) {
        /* if key pressed is not enter or arrow keys */
        if(e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40 && e.keyCode != 13)
        {
            clearTimeout(mridautocomplete_timer);
            mridautocomplete_timer = setTimeout(function() {
               changeInput(input, item_dataList);
            }, 100); 
        }

    });

    input.keydown(function(e) {
        if(e.keyCode == 40) /* down arrow */
        {   
            e.preventDefault();
            var tmp;
            $('mrid-autocomplete-item').css("background-color", "white");
            if(input.next().find('.item-selected').length > 0)
            {
                tmp = input.next().find('.item-selected');
                tmp.css("background-color", "white");
                tmp.removeClass('item-selected');
                tmp.next().css("background-color", "#DCDCDC");
                tmp.next().addClass('item-selected');
            }
            else
            {
                first = input.next().find('.mrid-autocomplete-item').first();
                first.css("background-color", "#DCDCDC");
                first.addClass('item-selected');
                tmp = first;
            }

        }
        else if(e.keyCode == 38) /* up arrow */
        {
            e.preventDefault();
            var tmp;
            $('mrid-autocomplete-item').css("background-color", "white");
            if(input.next().find('.item-selected').length > 0)
            {
                tmp = input.next().find('.item-selected');
                tmp.css("background-color", "white");
                tmp.removeClass('item-selected');
                tmp.prev().css("background-color", "#DCDCDC");
                tmp.prev().addClass('item-selected');
            }

        }
        else if(e.keyCode == 13) /* enter key */
        {
            tmp = input.next().find('.item-selected');
            input.val(tmp.text());
            res.empty().hide(function(){
                callback.call(this, input, tmp.attr('_ix'));
            });
        }
        else
        {
            clearTimeout(mridautocomplete_timer);
        }
    });
    

    $(document).click(function(event) {
      if (!$(event.target).closest('.mridautocomplete-list').length) {
        res.removeAttr('style');
        res.empty().hide();
      }
    });
}

})(jQuery);