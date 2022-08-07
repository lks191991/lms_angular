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
            //$('.next-btn').hide();
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


    /***************STEPS FORM JQUERY*********************/

    var current_fs, next_fs, previous_fs; //fieldsets
    var opacity;
    var current = 1;
    var steps = $("fieldset").length;
    //setProgressBar(current);
    $(".next_step_quiz").click(function () {
        current_fs = $(this).parent().parent();
        next_fs = $(this).parent().parent().next();
        //Add Class Active
        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
        //show the next fieldset
        next_fs.show();
        //hide the current fieldset with style
        current_fs.animate({ opacity: 0 }, {
            step: function (now) {
                // for making fielset appear animation
                opacity = 1 - now;
                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                next_fs.css({ 'opacity': opacity });
            },
            duration: 500
        });
        let feildsetIndexNo = $(this).parent().parent().next().attr("id");
        let feildsetIndexNoVal = feildsetIndexNo.split("--")[1];
        //setProgressBar(feildsetIndexNoVal);
    });
    $(".prev_step_quiz").click(function () {
        current_fs = $(this).parent().parent();
        previous_fs = $(this).parent().parent().prev();
        //Remove class active
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
        //show the previous fieldset
        previous_fs.show();
        //hide the current fieldset with style
        current_fs.animate({ opacity: 0 }, {
            step: function (now) {
                // for making fielset appear animation
                opacity = 1 - now;
                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                previous_fs.css({ 'opacity': opacity });
            },
            duration: 500
        });
        let feildsetIndexNo = $(this).parent().parent().prev().attr("id");
        let feildsetIndexNoVal = feildsetIndexNo.split("--")[1];
        //setProgressBar(feildsetIndexNoVal);
    });
    function setProgressBar(curStep) {
        var percent = parseFloat(100 / steps) * curStep;
        console.log(curStep, percent);
        percent = percent.toFixed();
        $(".progress-bar")
            .css("width", percent + "%");
        return percent;
    }
    $(".submit").click(function () {
        return false;
    });

    /***************STEPS FORM JQUERY ENDS****************/

    /********************Counter JS***********************/

   

    /********************Counter JS ENDS*****************/

    /********************EDIT QUESTION*******************/

    $(".go_to_question_edit").click(function () {
        let findFieldSet = $(this).attr("href");
        let findFieldSetVal = findFieldSet.split("--")[1];
        $(`fieldset${findFieldSet}`).show().css({
            opacity: 1
        });
        $(".review_answers_fieldset").hide();
        //setProgressBar(findFieldSetVal);
    });

    /********************EDIT QUESTION ENDS**************/

});