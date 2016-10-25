var new_user_input;
var author_id;

$(function(){

    $('#submit-button').on('click', function(){
        var user_input = $('input').val(); //variable to store the value of whatever the user inputs
        new_user_input = user_input.replace(/\s/g, ''); //variable to store user_input WITHOUT any spaces
        console.log(new_user_input);

        $.ajax({ //ajax call through hackeryou proxy to retrieve the author ID given new_user_input
            url: 'http://proxy.hackeryou.com',
            dataType: 'json',
            method:'GET',
            data: {
                reqUrl: `https://www.goodreads.com/api/author_url/${new_user_input}`,
                params: {
                    key: 'zaTX6u6bYmPadLvnD2VkaA',
                },
                xmlToJSON: true,
            }
        }).then(function(res) {
            console.log(res);
            author_id = res.GoodreadsResponse.author.id //store the author ID into a global variable to be accessed later
            console.log(author_id);
        });
    })

    $('#get-books').on('click', function(){ //when get-books is clicked, retrieve all books from author ID
        $.ajax({
            url: 'http://proxy.hackeryou.com',
            dataType: 'json',
            method:'GET',
            data: {
                reqUrl: `https://www.goodreads.com/author/list.xml`,
                params: {
                    key: 'zaTX6u6bYmPadLvnD2VkaA',
                    id: `${author_id}`,
                },
                xmlToJSON: true,
            }
        }).then(function(res) {
            console.log(res);
        });
    })
})