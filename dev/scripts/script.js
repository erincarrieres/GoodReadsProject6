myApp = {};
myVars = {};
myEvents = {};

//global variables to be accessed
myVars.new_user_input = null;
myVars.author_id = null;
myVars.books = null;
myVars.bestAuthorArray = null;
myVars.dupedAuthorArray = [];
myVars.uniqueAuthorArray = [];
myVars.splicedArray = [];
myVars.bookCounter = 0;

/* Functions to be Used */

//gets random number in increments of 20
myApp.randomOffset = function(min, max){
    var randomNumber =  Math.floor(Math.random() * (max - min + 1) + min);
    return randomNumber * 20;
}

//retrieves user input and removes all spaces
myApp.getUserInput = function(){
    var user_input = $('#hero-form input').val(); //variable to store the value of whatever the user inputs
    myVars.new_user_input = user_input.replace(/\s/g, ''); //variable to store user_input WITHOUT any spaces
    console.log(myVars.new_user_input);
};

myApp.getUserInputNav = function(){
    var user_input = $('#magnify input').val(); //variable to store the value of whatever the user inputs
    myVars.new_user_input = user_input.replace(/\s/g, ''); //variable to store user_input WITHOUT any spaces
    console.log(myVars.new_user_input);
};

//gets author ID + prints book image to page
myApp.getAuthorID = function(new_input){ //passes in myVars.new_user_input that was created from 'getUserInput'

    $.ajax({ //ajax call through hackeryou proxy to retrieve the author ID given new_user_input
        url: 'http://proxy.hackeryou.com',
        dataType: 'json',
        method:'GET',
        data: {
            reqUrl: 'https://www.goodreads.com/api/author_url/' + new_input,
            params: {
                key: 'zaTX6u6bYmPadLvnD2VkaA',
            },
            xmlToJSON: true,
        }
    }).then(function(res) { //when data is returned.....do stuff below
        var author_id = res.GoodreadsResponse.author.id; //access and store the author ID into a global variable for later
        myApp.getBooks(author_id); //this makes and ajax call for all the books from the above authorID
    });
};

//gets all the author's books
myApp.getBooks = function(authorID){ //pass in ANY authorID (in this case, we pass in the same authorID that we converted)
    $.ajax({
        url: 'http://proxy.hackeryou.com',
        dataType: 'json',
        method:'GET',
        data: {
            reqUrl: 'https://www.goodreads.com/author/list.xml',
            params: {
                key: 'zaTX6u6bYmPadLvnD2VkaA',
                id: authorID, //make an ajax call with the given authorID
            },
            xmlToJSON: true,
        }
    }).then(function(res) { //after ajax call is complete......do stuff below
        myVars.books = res.GoodreadsResponse.author.books.book; //store all the books in their own array
        myApp.getBookInfo(); //get the book info for all the books we just stored
    });
};

//gets all book info, appends it to the array with data attributes
myApp.getBookInfo = function(){
    $('#book-list').empty();
    for (i = 0; i < myVars.books.length; i++) {
        //store all the books information into variables
        var imageUrl = myVars.books[i].image_url;
        var bookRating = parseFloat(myVars.books[i].average_rating).toFixed(1);
        var bookUrl = myVars.books[i].link;
        var bookTitle = myVars.books[i].title;
        var bookPages = myVars.books[i].num_pages;
        var bookDate = myVars.books[i].publication_month + ' / ' + myVars.books[i].publication_day + ' / ' + myVars.books[i].publication_year;

        //for each book in our array, create a list item with data attributes for all the book information in variables
        $('#book-list').append('<li ' + 'data-link=' + bookUrl + 'data-pages=' + bookPages + ' data-title="' + bookTitle + '" data-imageUrl=' + imageUrl + ' data-bookRating=' + bookRating + ' data-bookDate="' + bookDate + '"><img src=' + imageUrl + '><br><p>' + bookTitle + '</p><br></li>');
    }
};

//gets a random set of authors every time page loads
myApp.displayNYT = function(randomNumber) {
    $.ajax({ //make an ajax call to NYT API with a random offset
        dataType: 'json',
        url: "https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?api-key=test&offset=" + randomNumber,
        method: 'GET',
    }).then(function (res) { //when ajax call is complete, then do stuff below...
        myVars.bestAuthorArray = res.results; //store all the books in the list into its own array...


        for (i = 0; i < myVars.bestAuthorArray.length; i++){
            var authorName = myVars.bestAuthorArray[i].author; //this variable holds just the author names for each book
            // console.log(authorName);
            myVars.dupedAuthorArray.push(authorName); //for each book in the array, store ONLY the author names in its own array
        }
        // console.log(myVars.bestAuthorArray);

        myVars.uniqueAuthorArray = myVars.dupedAuthorArray.filter(function(item, position){ //this filter function removes all duplicate names
            return myVars.dupedAuthorArray.indexOf(item) == position; //makes the comparison between first appearance + index
        });
        console.log('Ajax call to NYT successful');
        myVars.splicedArray = myVars.uniqueAuthorArray.splice(0,5);
        $('.left-top div').html('<a href="#">' + myVars.splicedArray[0] + '</a>');
        $('.top-right .grid-filter').html('<a href="#">' + myVars.splicedArray[1] + '</a>');
        $('.left-bottom-left div').html('<a href="#">' + myVars.splicedArray[2] + '</a>');
        $('.left-bottom-small-size .grid-filter').html('<a href="#">' + myVars.splicedArray[3] + '</a>');
        $('.bottom-right .grid-filter').html('<a href="#">' + myVars.splicedArray[4] + '</a>');
        myApp.changeCenter();
        setInterval(myApp.changeCenter, 2750);
    });
};

myApp.changeCenter = function(){
    if (myVars.bookCounter > myVars.uniqueAuthorArray.length - 1) {
        myVars.bookCounter = 0;
    }
    $('.left-bottom-small .grid-title').html('<a href="#">' + myVars.uniqueAuthorArray[myVars.bookCounter] + '</a>');
    myVars.bookCounter += 1;
    // $('.left-bottom-small .grid-image').attr('src',)
}

/* event handlers for web app */

myEvents.scroll = function(){
    $('html,body').animate({
    scrollTop: $("#book-section").offset().top},
    'slow');
}

//when submitted....
myEvents.onSubmit = function(){
    $('#hero-form').submit(function(e) {
        e.preventDefault();
        myApp.getUserInput(); //grab the user input
        myApp.getAuthorID(myVars.new_user_input); //and turn it into an authorID + display the books
        $('#hero-form').trigger('reset');
        myEvents.loaderDisplay();
        setTimeout(myEvents.scroll, 2700);
    })
};

myEvents.onSubmitNav = function(){
    $('#magnify').submit(function(e) {
        e.preventDefault();
        myApp.getUserInputNav(); //grab the user input
        myApp.getAuthorID(myVars.new_user_input); //and turn it into an authorID + display the books
        $('#magnify').trigger('reset');
        myEvents.loaderDisplay();
        setTimeout(myEvents.scroll, 2700);
    })
};

//when author name is clicked, display books
myEvents.selectAuthor = function(){
    $('.grid').on('click', '.grid-filter, .blah', function(e){
        e.preventDefault();
        var authorClicked = $('.grid-title').text().replace(/\s/g, ''); //remove spaces from the author names again
        myApp.getAuthorID(authorClicked);
        myEvents.loaderDisplay();
        setTimeout(myEvents.scroll, 2700);
    })
};

//when book is clicked, UPDATE and replace text in overlay + reveal it
myEvents.selectBook = function(){
    $('#book-list').on('click', 'li',function(e){
        $('.book-overlay').removeClass('book-overlay-fix');
        
        var tag = e.target.tagName;
        console.log(tag);

        //background opacity when overlay is clicked
        $('.full-overlay').addClass('display');
        //
        // var test = $(this).attr('data-title')
        if (tag == 'IMG' || tag == 'P' || tag == 'LI') {
            $('.book-overlay').addClass('book-overlay-fix');
            $('.book-overlay .book-title').html($(this).attr('data-title'));
            $('.book-overlay .book-image').attr('src', $(this).attr('data-imageurl'));
            $('.book-overlay .book-rating').html("Rating: " + $(this).attr('data-bookrating'));
            $('.book-overlay .book-date').html("Published: " + $(this).attr('data-bookdate'));
            $('.book-overlay .book-pages').html("Pages: " + $(this).attr('data-pages'));
            $('.book-overlay .book-link').attr('href', $(this).attr('data-link'));
        };
    })

    //when close button is clicked, make the overlay disappear
    $('.book-button').on('click',function(){
        $('.book-overlay').removeClass('book-overlay-fix');
        console.log('closed overlay');
        $('.full-overlay').removeClass('display');
    })
}

myEvents.loaderDisplay = function(){
    $('.loader').addClass('loader-fixed');
    setTimeout(function(){
        $('.loader').removeClass('loader-fixed')
    }, 2900);
}

myEvents.changeNav = function(){
}

/* initialize other methods */
myApp.init = function(){
    myEvents.onSubmit();
    myEvents.onSubmitNav();
    myEvents.selectAuthor();
    myEvents.selectBook();
    myEvents.changeNav();
    myApp.displayNYT(myApp.randomOffset(0, 1000));
};

//Run on document ready
$(function(){
    $(window).scroll(function () {
        var vH = $(window).height();
        if ($(window).scrollTop() >= vH - 65) {
            $('.hero-nav').css('opacity','1');
        } else {
            $('.hero-nav').css('opacity','0');
        }
        var section = $('#suggestion-section').height();
        var scroll = $(window).scrollTop();
        if (scroll > vH + section - 20) {
            $('.hero-nav-middle').html('Your Books');
        } else {
            $('.hero-nav-middle').html('Suggestions');
        }
    });
    myApp.init();
    $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html, body').animate({
              scrollTop: target.offset().top
            }, 1000);
            return false;
          }
        }
      });
})
