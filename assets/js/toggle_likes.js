class ToggleLike {
  constructor(toggleElement) {
    this.toggler = toggleElement;
    this.toggleLike();
  }

  toggleLike() {
    $(this.toggler).click(function (e) {
      e.preventDefault();
      let self = this;

      $.ajax({
        type: 'POST',
        url: $(self).attr('href'),
      })
        .done(function (data) {
          let likesCount = parseInt($(self).attr('data-likes'));
          // console.log(likesCount);
          if (data.data.deleted == true) {
            likesCount -= 1;
            // console.log('- like', likesCount);
            $(self).html(`<i class="fa-regular fa-heart"></i> ${likesCount}`);
          } else {
            likesCount += 1;
            // console.log('+ like', likesCount);
            $(self).html(
              `<i class="fas fa-heart" style="color: red;"></i> ${likesCount}`
            );
          }

          $(self).attr('data-likes', likesCount);
        })
        .fail(function (errData) {
          console.log('error in completing the request');
        });
    });
  }
}
