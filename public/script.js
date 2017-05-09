$( document ).ready(function() {
    console.log('hi');
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

    window.onscroll = function(ev) {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            console.log('jyguh');
        }
    };   
});