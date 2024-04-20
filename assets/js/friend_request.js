{
  let addFriend = function() {
    let newFriendLink = $('.add-friend-btn');
    newFriendLink.click(function(e) {
      e.preventDefault();
      let self = $(this);

      $.ajax({
        type: 'POST',
        url: self.attr('href')
      }).done(function(data) {
        let newFriend = newFriendDom(data.data.toUser);
        $('#user-friends ul').prepend(newFriend);
        deleteFriend($('.remove-friend', newFriend));

        new Noty({
          theme: 'relax',
          text: 'Friend Added!!!',
          type: 'success',
          layout: 'topRight',
          timeout: 1500
        }).show();
      }).fail(function(err) {
        console.log('Error adding friend:', err.responseText);
        new Noty({
          theme: 'relax',
          text: 'Failed to add friend. Please try again later.',
          type: 'error',
          layout: 'topRight',
          timeout: 1500
        }).show();
      });
    });
  };

  let newFriendDom = function(friend) {
    return $(`<li id='friend-${friend._id}'>
                    <img src='${friend.avatar}' alt='${friend.name}'>
                    <a href='/users/profile/${friend._id}' class='user-friend-name'>${friend.name}</a>
                    <a href='/friends/friendship/remove/${friend._id}' class='remove-friend remove-add-btn'>Remove</a>
                </li>`);
  };

  let deleteFriend = function(deleteLink) {
    $(deleteLink).click(function(e) {
      e.preventDefault();

      $.ajax({
        type: 'GET',
        url: $(this).prop('href'),
        success: function(data) {
          console.log('Friend removed:', data);
          $(`#friend-${data.data.to_user}`).remove();

          new Noty({
            theme: 'relax',
            text: 'Friend Removed !!!',
            type: 'success',
            layout: 'topRight',
            timeout: 1500
          }).show();
        },
        error: function(error) {
          console.log('Error removing friend:', error.responseText);
          new Noty({
            theme: 'relax',
            text: 'Failed to remove friend. Please try again later.',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
          }).show();
        }
      });
    });
  };

  let convertFriendToAjax = function() {
    $('#user-friends ul li').each(function() {
      let self = $(this);
      let deleteButton = $('.remove-friend', self);
      deleteFriend(deleteButton);
    });
  };

  addFriend();
  convertFriendToAjax();
}
