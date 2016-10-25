var new_user_input;
var author_id;

$(function(){

    $('#submit-button').on('click', function(){
        var user_input = $('input').val();
        new_user_input = user_input.replace(/\s/g, '');
        console.log(new_user_input);

        $.ajax({
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
            author_id = res.GoodreadsResponse.author.id
            console.log(author_id);
        });
    })

    $('#get-books').on('click', function(){
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


    // $.ajax({
    //     url: 'http://proxy.hackeryou.com',
    //     dataType: 'json',
    //     method:'GET',
    //     data: {
    //         reqUrl: `https://www.goodreads.com/api/author_url/${new_user_input}`,
    //         params: {
    //             key: 'zaTX6u6bYmPadLvnD2VkaA',
    //         },
    //         xmlToJSON: true,
    //     }
    // }).then(function(res) {
    // console.log(res);
    // });
})