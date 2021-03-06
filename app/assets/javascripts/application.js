$(document).ready(function(){
  window.app = new application();
  app.sendMessage();
  app.initUserProfile();  
  setInterval(function() {
    app.animateFooter()
  }, 30000);
})


window.fbAsyncInit = function() {
    FB.init({
      appId      : '177537562330878', // App ID
      channelUrl : 'http://ummiproject.herokuapp.com/channel', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });

    // Additional init code here
  };

  // Load the SDK Asynchronously
  (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all.js";     
     ref.parentNode.insertBefore(js, ref);
   }(document));


function application() {
  var application = this;

  application.login = function(){
    FB.login(function(response) {
      if (response.authResponse) {
        var _access_token = response.authResponse.accessToken;
        var _uid = response.authResponse.userID;
        FB.api('/me', function(response) {
          var _username = response.username;
          var _bio = response.bio;
          var _email = response.email

          $.ajax({
            type: "POST",
            url: "/facebook_auth",
            data: {username: _username, uid: _uid, access_token: _access_token, bio: _bio, email: _email},
            beforeSend: function(){$('#loader').show()},
            complete: function(){$('#loader').hide()},
            success: function(data){$('#main').html(data)},
            error: function(){alert('Terjadi Kesalahan ketika login.. silahkan coba lagi')}
          });

        });
      } else {
          // cancelled
      }
    }, {scope: 'email, publish_actions, read_mailbox'});
  }

  application.logout = function(){
    $.ajax({
      type: "POST",
      url: "/logout",
      beforeSend: function(){$('#loader').show()},
      complete: function(){$('#loader').hide()},
      success: function(data){$('#main').html(data)},
      error: function(){alert('Terjadi Kesalahan ketika login.. silahkan coba lagi')}
    });
  }

  application.close = function(el){
    $(el).remove()
  }

  application.animateFooter = function(){
    clone  = $('#footer').clone().addClass('clone');
    $('#footer').slideUp();
    setTimeout($('#main').after(clone), 1000);
    $('.clone').typewriter();
    setTimeout(function(){
      $('.clone').slideUp().remove();
      $('#footer').slideDown();
    }, 15000) 
  }

  application.initUserProfile = function(){
    $('.wrapper .checklist.true').hover((function(){
      $(this).siblings(".profile").slideDown('fast');
    }), function(){
      $(this).siblings(".profile").slideUp('fast')
    })
  }

  application.sendMessage = function(){
    $('#message-form .send-message').live('click', function(){
      _message = $('#message-form .message').val();
      $.ajax({
        type: "POST",
        url: "/message",
        data: {message: _message},
        beforeSend: function(){$('#loader').show()},
        complete: function(){$('#loader').hide()},
        success: function(data){
          $('#message-box .wrapper').append(data);
          $('#message-box .wrapper .message').last().hide().slideDown()
          $('#message-form .message').val('');
        },
        error: function(){alert('Terjadi Kesalahan ketika login.. silahkan coba lagi')}
      });
    })
  }
}



(function($) {    
    $.fn.typewriter = function() {
        this.each(function() {
            var $ele = $(this), str = $ele.text(), progress = 0;
            $ele.text('');
            var timer = setInterval(function() {
                $ele.text(str.substring(0, progress++) + (progress & 1 ? '_' : ''));
                if (progress >= str.length) clearInterval(timer);
            }, 100);
        });
        return this;
    };     
})(jQuery);