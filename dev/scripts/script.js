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
myApp.getUserInput = function(){
    var user_input = $('input').val(); //variable to store the value of whatever the user inputs
    myVars.new_user_input = user_input.replace(/\s/g, ''); //variable to store user_input WITHOUT any spaces
    console.log(myVars.new_user_input);
}; //retrieves user input and removes all spaces

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
        myApp.getBooks(author_id);
    });
}; //gets author ID + prints book image to page
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
        myVars.books = res.GoodreadsResponse.author.books.book
        console.log(myVars.books);
        myApp.getBookImage();
    });
    console.log('This should come before goodreads object');
}; //gets all the author's books
myApp.getBookImage = function(){
    $('#book-list').empty();
    for (i = 0; i < myVars.books.length; i++) {
        var imageUrl = myVars.books[i].image_url;
        var bookTitle = myVars.books[i].title;
        $('#book-list').append('<li><img src=' + imageUrl + '><br><p>' + bookTitle + '</p></li>');
    }
}; //gets book image URL
myApp.displayNYT = function() {
    $.ajax({
        dataType: 'json',
        url: "https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?api-key=test&offset=60",
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
    });
}; //gets authors from NYT api
myApp.printAuthors = function(array){
    for (i = 0; i < array.length; i++) {
        $('#author-list').append('<li class="author-list-item"><a href="#">' + array[i] + '</a></li>');
    }
}; //prints best-selling authors to page

//event handlers for web app
myEvents.onSubmit = function(){
    $('#submit-button').on('click', function(){
        myApp.getUserInput();
        myApp.getAuthorID(myVars.new_user_input);
    })
}; //when submitted, grab user input + display books
myEvents.showAuthor = function(){
    $('#show-authors').on('click', function(e){
        e.preventDefault();
        myApp.printAuthors(myVars.uniqueAuthorArray);
    })
}; //**TEMP** click to show author names
myEvents.selectAuthor = function(){
    $('#author-list').on('click', 'a', function(){
        var authorClicked = $(this).text().replace(/\s/g, '');
        console.log(authorClicked);
        myApp.getAuthorID(authorClicked);
    })
}; //when author name is clicked, display books

//initiatize other methods
myApp.init = function(){
    myEvents.onSubmit();
    myEvents.showAuthor();
    myEvents.selectAuthor();
    myApp.displayNYT();
};

//Run on document ready
$(function(){
    myApp.init();
})

