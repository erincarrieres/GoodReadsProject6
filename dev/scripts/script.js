myApp = {};
myVars = {};
myEvents = {};

myVars.new_user_input = null;
myVars.author_id = null;
myVars.books = null;

myApp.getUserInput = function(){
    var user_input = $('input').val(); //variable to store the value of whatever the user inputs
    myVars.new_user_input = user_input.replace(/\s/g, ''); //variable to store user_input WITHOUT any spaces
    console.log(myVars.new_user_input);
};
myApp.getAuthorID = function(){

    $.ajax({ //ajax call through hackeryou proxy to retrieve the author ID given new_user_input
        url: 'http://proxy.hackeryou.com',
        dataType: 'json',
        method:'GET',
        data: {
            reqUrl: `https://www.goodreads.com/api/author_url/${myVars.new_user_input}`,
            params: {
                key: 'zaTX6u6bYmPadLvnD2VkaA',
            },
            xmlToJSON: true,
        }
    }).then(function(res) {
        console.log(res);
        myVars.author_id = res.GoodreadsResponse.author.id //store the author ID into a global variable to be accessed later
        myApp.getBooks();
    });
};
myApp.getBooks = function(){
    $.ajax({
        url: 'http://proxy.hackeryou.com',
        dataType: 'json',
        method:'GET',
        data: {
            reqUrl: `https://www.goodreads.com/author/list.xml`,
            params: {
                key: 'zaTX6u6bYmPadLvnD2VkaA',
                id: `${myVars.author_id}`,
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
};

myApp.getBookImage = function(){
    $('#book-list').empty();
    for (i = 0; i < myVars.books.length; i++) {
        var imageUrl = myVars.books[i].image_url;
        var bookTitle = myVars.books[i].title;
        $('#book-list').append('<li><img src=' + imageUrl + '><br><p>' + bookTitle + '</p></li>');
    }
}








myEvents.onSubmit = function(){
    $('#submit-button').on('click', function(){
        myApp.getUserInput();
        myApp.getAuthorID();
    })
}

myApp.init = function(){
    myEvents.onSubmit();
    // myEvents.onViewBooks();
}

//This stuff runs on document ready
$(function(){
    myApp.init();
})

