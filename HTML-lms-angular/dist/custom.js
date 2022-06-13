$(document).ready(function () {
    var $radioButtons = $('.questions-block .choices input[type="radio"]');
    $radioButtons.click(function () {
        $radioButtons.each(function () {
            $(this).parent().toggleClass('checked', this.checked);
        });
    });

    $(".next-btn").click(function (e) {
        e.preventDefault();
        let displayedItem = $("div.questions-block[class*='show']");
        let lastElement = displayedItem.next(".questions-block.last").length > 0;
        displayedItem.removeClass("show");
        displayedItem.next(".questions-block").addClass("show");
        $(".prev-btn").removeAttr("disable");

        if (lastElement) {
            $('.next-btn').hide();
            $('.next-prev-submit button[type="submit"]').show();
            return;
        }
    });

    $(".prev-btn").click(function (e) {
        e.preventDefault();
        let displayedItem = $("div.questions-block[class*='show']");
        displayedItem.removeClass("show");
        displayedItem.prev(".questions-block").addClass("show");

        if ($(".questions-block.first.show").length > 0) {
            $(".prev-btn").attr("disable", "disable");
            return;
        }

        if ($(".questions-block.last.show").length === 0) {
            $('.next-btn').show();
            $('.next-prev-submit button[type="submit"]').hide();
        }
    });

});