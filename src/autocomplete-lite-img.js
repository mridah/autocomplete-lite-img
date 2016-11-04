/*
    Written by mridul ahuja
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
                   
                   // initializing
                   $('#autocomplete_input').autocomplete_img_init(autocomplete_items, autocomplete_images);
               </script>
*/


jQuery.fn.extend({
    autocomplete_img_init: function (item_data, image_data, callback) {
        me = $(this);

        if(callback === undefined)
        {
            callback = callback_dummy;
        }
        else
        {
           if(! typeof callback == 'function')
           {
                console.error('Error : autocomplete-lite ' + callback + ' is not a function.');
                return;
           }
        }

        var item_data_length = item_data.length; 

        if(item_data_length === image_data.length)
        {
            var img_map = {};
            for(var i=0; i<item_data_length; i++)
            {
                img_map[item_data[i].toLowerCase()] = image_data[i];
            }

            mridautocomplete(me, item_data, img_map, callback);
        }
        else
            console.error('Error : autocomplete-lite item count does not match the images count.');


    }
});

function callback_dummy() {}

function mridautocomplete(input, item_data, image_data, callback) {

    var mridautocomplete_timer = 0;

    if(!$('#mridautocomplete_css').length )
    {
        var img_dimensions = (parseInt(input.css('font-size')) - 2 ) + 'px';
        $('body').prepend('<style id="mridautocomplete_css">.mridautocomplete-list::-webkit-scrollbar{width: 12px;}.mridautocomplete-list::-webkit-scrollbar-track{-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);border-radius: 2px;}.mridautocomplete-list::-webkit-scrollbar-thumb{border-radius: 2px;-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);} .mridautocomplete-item-image{height: ' + img_dimensions + '; width: ' + img_dimensions + ';} </style>');
    }

    var item_dataList = [];

    if (Array.isArray(item_data)) {
        item_dataList = item_dataList.concat(item_data);
    } else {
        console.error('Error : autocomplete-lite takes an array as parameter. ' + typeof item_data + ' given');
        return;
    }

    var matchitem_data = function(input, item_dataList) {
        var reg = new RegExp(input.split('').join('\\w*').replace(/\W/, ""), 'i');
        return item_dataList.filter(function(item_data) {
            if (item_data.match(reg)) {
                return item_data;
            }
        });
    };

    var changeInput = function(input, item_dataList) {
        var val = input.val().toLowerCase();
        var inputAncestor = input.parent();
        var res = inputAncestor.find('.mridautocomplete-list');
        while(res.length == 0) {
          inputAncestor = inputAncestor.parent();
          res = inputAncestor.find('.mridautocomplete-list');
        }

        res.empty().hide();


        var autoCompleteResult = matchitem_data(val, item_dataList);
        if (val == "" || autoCompleteResult.length == 0) {
            return;
        }

        autoCompleteResult.forEach(function(e) {
            var p = $('<p />');
            p.css({
              'margin': '0px',
              'padding-left': parseInt(input.css('padding-left'),10) + parseInt(input.css('border-left-width'),10),
              'text-align': 'left',
              'font-size': input.css('font-size'),
              'cursor': 'default'
            });

            p.addClass('mrid-autocomplete-item');

            e = e.toLowerCase();

            if(e.includes(val))
            {
                var first_part = e.split(val)[0];
                var second_part = e.split(val).splice(1).join(val); 

                p.html('<img src="' + image_data[e] + '" class="mridautocomplete-item-image">' + first_part + '<span style="color: #4682B4; font-weight: bold;">' + val + '</span>' + second_part);
            }

            p.click(function() {
                input.val(p.text());
                res.empty().hide();
                callback.call(this);
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
            res.append(p);
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

    var res = $("<div class='mridautocomplete-list' />");
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
            res.empty().hide();
            callback.call(this);
        }
        else
        {
            clearTimeout(mridautocomplete_timer);
        }
    });
    

    $(document).click(function(event) {
      if (!$(event.target).closest('.mridautocomplete-list').length) {
        res.empty().hide();
      }
    });
}