

$(document).ready(function () {
    
    var animateDuration = 1500;
    
    $('#page-scroll-container').pageScroll({animateDuration: animateDuration});
    
    /*
    $('#start-exploring-button').click(function () {
        var pageOffsetTop = $('.page-scroll-page').eq(1).offset().top;
        $(element).css({
                bottom: backgroundOffsetBottom + '%',
                '-moz-transition': 'all ' + properties['animateDuration'] + 'ms ease',
                '-webkit-transition': 'all ' + properties['animateDuration'] + 'ms ease',
                '-ms-transition': 'all ' + properties['animateDuration'] + 'ms ease',
                'transition': 'all ' + properties['animateDuration'] + 'ms ease'
                });
    });
    */
    
    /*
     * Show image load progress
     */
    $(function () {
        var loadImages = ['images/cloud_tiny.jpg',
                'images/warm_day_tiny.jpg',
                'images/cosmos_reflection_tiny.jpg',
                'images/icewind_dale_tiny.jpg',
                'images/twilight_leaves_tiny.jpg',
                'images/baltic_sea_tiny.jpg',
                'images/grassence_tiny.jpg'];
        var loadedImagesCount = 0;
        $.each(loadImages, function (index, value) {
            $('<img />').attr('src', value).on('load', function (e) {
                loadedImagesCount++;
                var loadPercentage = Math.ceil(loadedImagesCount / loadImages.length * 100);
                console.log('Loading percentage: ' + loadPercentage + '%');
                $('#load-progress-bar').children().css({
                        width: loadPercentage + '%'
                        }).attr({
                        'aria-valuenow': loadPercentage
                        });
                $('#load-progress-bar').children().children().text(loadPercentage + '% Complete');
                
                // If loaded 100%
                if (loadPercentage >= 100) {
                    $('#load-progress-bar').fadeOut({duration: 500, queue: false});
                    $('#page-one-content-bottom').fadeIn({duration: 1000, queue: false});
                }
            });
        });
        
    });
    
    $('#start-exploring-button').popover({
            content: 'Scroll your mouse wheel to begin',
            placement: 'auto top'
            });
    
    $('#email-button').click(function () {
        window.location = 'mailto:gladiacxtylish@gmail.com';
    });
    
    $('.linkedin-button').click(function () {
        window.location = 'http://www.linkedin.com/pub/jeffrey-chen/1b/62/323';
    });
    
    $('#jquery-page-scroll-git-hub-button').click(function () {
        window.location = 'https://github.com/gladiacxtylish/jquery-page-scroll';
    });
    
    $('#box2d-launch-button').fancybox({width: "800px", height: "600px"});
    $('#drum-machine-launch-button').fancybox({width: "800px", height: "600px"});
    
    /*
     * Animate page backgrounds
     */
    $(function () {
        
        var properties = {
                pageCount: $('#page-scroll-container').children().length,
                animateDuration: animateDuration,
                isAnimate: false,
                pageScrollPageActive: 0// 0 based
                };
        
        $(document).bind('touchstart', function (event){
            properties['touchstartClientY'] = event.originalEvent.touches[0].clientY;
            console.log('Touchstart clientY: ' + properties['touchstartClientY']);
        });
        
        
        $(document).on('mousewheel DOMMouseScroll touchmove', function (event, delta) {
            
            event.preventDefault();
            
            var touchmoveClientY;
            var scrollDelta;
            if (event.type == 'touchmove') {
                touchmoveClientY = event.originalEvent.touches[0].clientY;
                console.log('Touchmove clientY: ' + touchmoveClientY);
                scrollDelta = touchmoveClientY - properties['touchstartClientY'];
                console.log(properties['touchstartClientY'] - touchmoveClientY);
                if (scrollDelta < 50 && scrollDelta > -50)
                    return;
            }
            
            // Do nothing if animation in progress
            if (properties['isAnimate'] == true) {
                console.log('Animation in progress');
                return;
            }
            
            properties['isAnimate'] = true;
            
            
            if (event.type == 'mousewheel' || event.type == 'DOMMouseScroll') {
                scrollDelta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
            }
            
            var pageActive = properties['pageScrollPageActive'];
            /* Do nothing if page is first or last */
            if ((pageActive <= 0 && scrollDelta > 0) || 
                    (pageActive + 1 >= properties['pageCount'] && scrollDelta < 0)) {
                console.log('First or last page ignoring');
                properties['isAnimate'] = false;
                return;
            }
            
            // Scrolled down
            if (scrollDelta < 0) {
                properties['pageScrollPageActive']++;
            }
            // Scrolled up
            else {
                properties['pageScrollPageActive']--;
            }
            console.log('Destination page: ' + properties['pageScrollPageActive']);
            
            $('.page-background').eq(0).on(
                    'transitionend webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd',
                    function () {
                        properties['isAnimate'] = false;
                        $(this).off();
                    });
            
            $('.page-background').each(function (index, element) {
                
                var backgroundOffsetBottom = -40 + (index - properties['pageScrollPageActive']) * 40;
                
                $(element).css({
                        bottom: backgroundOffsetBottom + '%',
                        '-moz-transition': 'all ' + properties['animateDuration'] + 'ms ease',
                        '-webkit-transition': 'all ' + properties['animateDuration'] + 'ms ease',
                        '-ms-transition': 'all ' + properties['animateDuration'] + 'ms ease',
                        'transition': 'all ' + properties['animateDuration'] + 'ms ease'
                        });
                
            });
            
            return false;
            
        });
        
        // Turn background into visible
        $('.page-background').css({visibility: 'visible'});
        //$(document).trigger('DOMMouseScroll');
        $('.page-background').each(function (index, element) {
            var windowHeight = $(window).height();
            var pageOffsetTop = $(element).parent().offset().top;
            var pageIndex = Math.round(pageOffsetTop / windowHeight);
            
            var backgroundOffsetBottom = -40 + 40 * pageIndex;
            $(element).animate({
                bottom: backgroundOffsetBottom + "%"}, {
                duration: animateDuration - 500});
        });
        
    });
});

