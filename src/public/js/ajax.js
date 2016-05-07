const UP_ARROW = 38;
const DOWN_ARROW = 40;

$(document).ready(function() {
    var user;
    var commands = [];
    var commandIndex = 0;
    $('#submitName').focus();

    $('#submitName').click(function() {
        $.ajax({
            method: 'POST',
            contentType: 'multipart/form-data',
            url: '/signup/' + $('#user').val()}).done(function(data){
            user = $('#user').val();
            $('#signup').hide();
            $('#type').show();
            $('#type').focus();
        });
    });

    $('#type').on('keyup', function(e) {
       if (e.keyCode == UP_ARROW && commands[commandIndex] && commandIndex < commands.length) {
           $('#command').val(commands[commandIndex]);
           commandIndex++;
           e.preventDefault();
       }

       if (e.keyCode == DOWN_ARROW && commands[commandIndex]) {
           $('#command').val(commands[commandIndex]);
           commandIndex--;
           e.preventDefault();
       }

       if (e.keyCode == DOWN_ARROW && commandIndex <= 0) {
           $('#command').val('');
           commandIndex = 0;
           e.preventDefault();
       }
       
       if (e.keyCode == UP_ARROW && commandIndex >= commands.length) {
           commandIndex = commands.length - 1;
           e.preventDefault();
       }
    });

    $('#type').on('submit', function() {
        var command = $('#command').val();
        $('#console').append('<p> $ ' + command +'</p>');
        if (command.substr(0,2) != 'cd') {
            if (command == "exit" || command == "quit") {
                window.location.assign("about:home");
                location.reload();
                return;
            }
            $.ajax({
                method: 'POST',
                contentType: 'multipart/form-data',
                url: '/bash/' + user + '/' + command}).done(function(data){
                var display = data.replace(/\n/g, '<br />');
                $('#console').append('<p>' + display + '</p>');
                // nice hack from http://stackoverflow.com/questions/11715646/scroll-automatically-to-the-bottom-of-the-page, thanks
                window.scrollTo(0, document.body.scrollHeight);
            });
        }

        else {
            $.ajax({
                method: 'POST',
                url: '/bash/' + user + '/cd' + encodeURI(command.replace(/cd/g, ''))}).done(function(data){
                var display = data.replace(/\n/g, '<br />');
                $('#wd').html('$' + display);
                window.scrollTo(0, document.body.scrollHeight);
            });
        }

        commands.unshift(command);
        $('#command').val('');
        commandIndex = 0;
    });
});
