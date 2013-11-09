/*
 * jQuery.page-scroll plugin
 * https://github.com/gladiacxtylish/jquery-page-scroll
 * Version: 1.0
 *
 * Copyright (c) 2013 Jeffrey Chen
 * http://www.thejeffreychen.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

(function ($)　{
    $.fn.pageScroll = function(options) {
        
        var properties = {
                pageCount: $(this).children().length,
                animateDuration: ( (typeof options !== 'undefined' && 
                        typeof options['animateDuration'] !== 'undefined') ?
                        options['animateDuration'] : 1000),
                isAnimate: false
                };
        
        console.log("Page count: " + properties['pageCount']);
        console.log("Animate duration: " + properties['animateDuration']);
        
        $(this).data('pageScrollPageActive', 0);// 0 based
        var pageScrollContainer = $(this);
        
        $(document).bind('touchstart', function (event){
            properties['touchstartClientY'] = event.originalEvent.touches[0].clientY;
        });
        
        // $.scroll() does not expose scroll direction
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
            
            var pageActive = pageScrollContainer.data('pageScrollPageActive');
            // Do nothing if page is first or last
            if ((pageActive <= 0 && scrollDelta > 0) || 
                    (pageActive + 1 >= properties['pageCount'] && scrollDelta < 0)) {
                console.log('First or last page ignoring');
                properties['isAnimate'] = false;
                return;
            }
            
            var destinationPageNumber;
            // Scrolled down
            if (scrollDelta < 0) {
                console.log('Scrolled down');
                destinationPageNumber = pageActive + 1;
            }
            // Scrolled up
            else {
                console.log('Scrolled up');
                destinationPageNumber = pageActive - 1;
            }
            
            pageScrollContainer.data('pageScrollPageActive', destinationPageNumber);
            console.log('Destination page: ' + destinationPageNumber);
            
            pageScrollContainer.on(
                    'transitionend webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd',
                    function () {
                        properties['isAnimate'] = false;
                        pageScrollContainer.off();
                    });
            
            var translateY = '-' + (destinationPageNumber * 100) + '%';
            pageScrollContainer.css({
                '-moz-transform': 'translate3d(0, ' + translateY + ', 0)',
                '-webkit-transform': 'translate3d(0, ' + translateY + ', 0)',
                '-ms-transform': 'translate3d(0, ' + translateY + ', 0)',
                'transform': 'translate3d(0, ' + translateY + ', 0)',
                '-moz-transition': 'all ' + properties['animateDuration'] + 'ms ease',
                '-webkit-transition': 'all ' + properties['animateDuration'] + 'ms ease',
                '-ms-transition': 'all ' + properties['animateDuration'] + 'ms ease',
                'transition': 'all ' + properties['animateDuration'] + 'ms ease'
            });
            
            return false;
        });
            
        
    };
}(jQuery));
