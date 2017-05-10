$( document ).ready(function() {

    //comment form
    var but = $("#but");
    var name = $("#name");
    var body = $("#body");
    var form = $('form');

    but.on('click', function(){
        if(name.val() <1 || body.val() < 1){
            but.prop('disabled', 'disabled');   
            form.after("<small>more than one letter required</small>");     
        }
        name.on('keypress', function(){
            but.prop('disabled', false); 
            $( "small" ).remove();
        });
        body.on('keypress', function(){
            but.prop('disabled', false);
            $( "small" ).remove(); 
        });
    });

    form.submit(function(e){
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/posts/:id',
            dataType: "json",
            data: form.serialize(),
            success: function(data){
                $( ".comments" ).append( "<h2>"+data.name+"</h2>" + "<p>"+data.text+"</p>");
            }
        });
    });

    //home page pagination
    if($(".featurette").length > 1){
        var scrollOn = true;
        window.onscroll = function(ev) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                if (scrollOn) {
                    scrollOn = false;
                    $( "body" ).append("<div id='loading'></div>");
                    var lastPost = $( ".marketing .featurette:last-child" ).data( "id" );
                    console.log($( ".marketing .featurette:last-child" ));
                    $.ajax({
                        type: 'POST',
                        url: '/',
                        dataType: "json",
                        data: {lastPost : lastPost},
                        success: function(data){
                            data.forEach(function (value, i) {
                                if(i%2===0){
                                    $( ".marketing" ).append( 
                                    "<hr class='featurette-divider'>"
                                    +"<div class='row featurette' data-id="+data[i].index+">"
                                    +"<div class='col-md-7'>"
                                    +"<h2 class='featurette-heading'>" +data[i].name+ "</h2>" 
                                    +"<p class='lead'>"+data[i].smallBody+"</p>" 
                                    +"<p>"
                                    +"<a class='btn btn-default' href='posts/"+data[i]._id+ "' role='button'>View details »</a>"
                                    +"</p>" 
                                    +"</div>"
                                    +"<div class='col-md-5'>"
                                    +"<img class='featurette-image img-responsive center-block' data-src='holder.js/500x500/auto' alt='500x500' src='"+data[i].picture+"' data-holder-rendered='true'>"
                                    +"</div>"      
                                    +"</div>");
                                } else {
                                    $( ".marketing" ).append( 
                                    "<hr class='featurette-divider'>"
                                    +"<div class='row featurette' data-id="+data[i].index+">"
                                    +"<div class='col-md-7 col-md-push-5'>"
                                    + "<h2 class='featurette-heading'>" +data[i].name+ "</h2>" 
                                    + "<p class='lead'>"+data[i].smallBody+"</p>" 
                                    + "<p>"
                                    +"<a class='btn btn-default' href='posts/"+data[i]._id+ "' role='button'>View details »</a>"
                                    +"</p>" 
                                    + "</div>"
                                    +"<div class='col-md-5 col-md-pull-7'>"
                                    +"<img class='featurette-image img-responsive center-block' data-src='holder.js/500x500/auto' alt='500x500' src='"+data[i].picture+"' data-holder-rendered='true'>"
                                    +"</div>"
                                    +"</div>");
                                }
                            });
                            $( "#loading" ).remove();
                            if (data.length === 6) {
                                scrollOn = true;
                            }
                        }
                    });
                }  
            }
        } 
    }
});
