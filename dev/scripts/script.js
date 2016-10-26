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

/* Functions to be Used */

//retrieves user input and removes all spaces
myApp.getUserInput = function(){
    var user_input = $('input').val(); //variable to store the value of whatever the user inputs
    myVars.new_user_input = user_input.replace(/\s/g, ''); //variable to store user_input WITHOUT any spaces
    console.log(myVars.new_user_input);
};

//gets author ID + prints book image to page
myApp.getAuthorID = function(new_input){

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
    }).then(function(res) {
        console.log(res);
        var author_id = res.GoodreadsResponse.author.id; //store the author ID into a global variable to be accessed later
        console.log(author_id);
        myApp.getBooks(author_id);
    });
};

//gets all the author's books
myApp.getBooks = function(authorID){
    $.ajax({
        url: 'http://proxy.hackeryou.com',
        dataType: 'json',
        method:'GET',
        data: {
            reqUrl: `https://www.goodreads.com/author/list.xml`,
            params: {
                key: 'zaTX6u6bYmPadLvnD2VkaA',
                id: authorID,
            },
            xmlToJSON: true,
        }
    }).then(function(res) {
        console.log(res);
        myVars.books = res.GoodreadsResponse.author.books.book;
        console.log(myVars.books);
        myApp.getBookInfo();
    });
    console.log('This should come before goodreads object');
};

//gets book image URL
myApp.getBookInfo = function(){
    $('#book-list').empty();
    for (i = 0; i < myVars.books.length; i++) {
        // var bookDescript = myVars.books[i].description;
        var imageUrl = myVars.books[i].image_url;
        var bookRating = parseFloat(myVars.books[i].average_rating).toFixed(1);
        var bookTitle = myVars.books[i].title;
        var bookDate = myVars.books[i].publication_month + ' / ' + myVars.books[i].publication_day + ' / ' + myVars.books[i].publication_year;
        console.log(bookDate);

        $('#book-list').append('<li><img src=' + imageUrl + '><br><p>' + bookTitle + '</p><br><div class="book-overlay"><p>' + bookTitle + '</p><br><img src=' + imageUrl + '><br><p>Rating: ' + bookRating + ' / 5</p><br><p>Published: ' + bookDate + '</p><br><button id="close-overlay" type="button">close</button></div></li>');
    }
};

//gets authors from NYT api
myApp.displayNYT = function(randomNumber) {
    $.ajax({
        dataType: 'json',
        url: "https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?api-key=test&offset=" + randomNumber,
        method: 'GET',
    }).then(function (res) {
        myVars.bestAuthorArray = res.results;

        for (i = 0; i < myVars.bestAuthorArray.length; i++){
            var authorName = myVars.bestAuthorArray[i].author;
            // console.log(authorName);
            myVars.dupedAuthorArray.push(authorName);
        }

        console.log(myVars.dupedAuthorArray);
        myVars.uniqueAuthorArray = myVars.dupedAuthorArray.filter(function(item, position){
            return myVars.dupedAuthorArray.indexOf(item) == position;
        });
        console.log(myVars.uniqueAuthorArray);
        myVars.splicedAuthorArray = myVars.uniqueAuthorArray.splice(0,5);
        console.log(myVars.splicedAuthorArray);
    });
};


//prints best-selling authors to page
myApp.printAuthors = function(array){
    for (i = 0; i < array.length; i++) {
        $('#author-list').append('<li class="author-list-item"><a href="#">' + array[i] + '</a></li>');
    }
};

//gets random number in increments of 20
myApp.randomOffset = function(min, max){
    var minimum = Math.ceil(min);
    var maximum = Math.floor(max);
    var randomNumber =  Math.floor(Math.random() * (maximum - minimum + 1) + min);
    return randomNumber * 20;
}

/* event handlers for web app */

//when submitted, grab user input + display books
myEvents.onSubmit = function(){
    $('#submit-button').on('click', function(){
        myApp.getUserInput();
        myApp.getAuthorID(myVars.new_user_input);
    })
};

//**TEMP** click to show author names
myEvents.showAuthor = function(){
    $('#show-authors').on('click', function(e){
        $('#author-list').empty();
        e.preventDefault();
        myApp.printAuthors(myVars.splicedAuthorArray);
    })
};

//when author name is clicked, display books
myEvents.selectAuthor = function(){
    $('#author-list').on('click', 'a', function(){
        var authorClicked = $(this).text().replace(/\s/g, '');
        console.log(authorClicked);
        myApp.getAuthorID(authorClicked);
    })
};

//when book is clicked, display overlay + on close, remove overlay
myEvents.selectBook = function(){
    $('#book-list').on('click', 'li',function(e){
        $('.book-overlay').removeClass('book-overlay-fix');
        var tag = e.target.tagName;
        console.log(tag);
        if (tag == 'IMG' || tag == 'P') {
            $(this).find('.book-overlay').addClass('book-overlay-fix');
        } else if (tag == 'BUTTON') {
            $(this).find('.book-overlay').removeClass('book-overlay-fix');
        }
    })
}

/* initialize other methods */
myApp.init = function(){
    myEvents.onSubmit();
    myEvents.showAuthor();
    myEvents.selectAuthor();
    myEvents.selectBook();
    myApp.displayNYT(myApp.randomOffset(0, 1000));
};

//Run on document ready
$(function(){
    myApp.init();
})

