$(document).ready(function() {
    var user;
    var commands = [];
    var commandIndex = 0;
    $('#submitName').focus();

    $('#submitName').click(function() {
        $.ajax({
            method: 'POST',
            url: '/signup/' + $('#user').val()}).done(function(data){
            user = $('#user').val();
            $('#console').append('<p>' + JSON.stringify(data) + '</p>');
            $('#signup').hide();
            $('#type').show();
            $('#type').focus();
        });
    });

    $('#type').on('keyup', function(e) {
       if (e.keyCode == 38 && commands[commandIndex]) {
           $('#command').val(commands[commandIndex]);
           commandIndex++;
       }

       if (e.keyCode == 40 && commands[commandIndex]) {
           $('#command').val(commands[commandIndex]);
           commandIndex--;
       }

       if (e.keyCode == 40 && commandIndex <= 0) {
           $('command').val('');
           commandIndex = 0;
       }
       
       if (e.keyCode == 38 && commandIndex >= commands.length) {
           commandIndex = commands.length;
       }
    });

    $('#type').on('submit', function() {
        var command = $('#command').val();
        $('#console').append('<p> $ ' + command +'</p>');
        if (command.substr(0,2) != 'cd') {
            if (command == "exit") {
                window.location.assign("about:home");
                location.reload();
                return;
            }
            $.ajax({
                method: 'POST',
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
                url: '/bash/' + user + '/cd/' + command.replace(/cd/g, '')}).done(function(data){
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
