
$(document).ready(function () {
	$('.smoothLink').smoothScroll({offset: -100, speed: 1000});
	
	$('#linkedin-button').click(function () {
		window.location = 'http://www.linkedin.com/pub/jeffrey-chen/1b/62/323';
	});
	
	$(function () {
		var navbarTop = $('#navbar').offset().top;

		$(window).scroll(function () {
			/* bind to top */
			if (navbarTop - $(window).scrollTop() < 0 && !$('#navbar').is('.navbar-fixed-top')) {
				$('#navbar').addClass('navbar-fixed-top');
				$('body').addClass('navbar-fixed-top-padding');
			}
			/* unbind from top */
			else if (navbarTop - $(window).scrollTop() >= 0 && $('#navbar').is('.navbar-fixed-top')){
				$('#navbar').removeClass('navbar-fixed-top');
				$('body').removeClass('navbar-fixed-top-padding');
			}
		});
	});
	
	$(function () {
		$('.project-launch-button').each(function (index) {
			
			$(this).data('launched', false);
			switch (index) {
				case 0: 
					$(this).data('attributes', {id: 'box2d-iframe', src: 'box2d/index.html'});
					break;
				case 1: 
					$(this).data('attributes', {id: 'drum-machine-iframe', src: 'drum_machine/index.html'});
					break;
				default: 
					break;
			}
		});
		
		$('.project-launch-button').click(function () {
			
			if ($(this).data('launched')) {
				$(this).parent().next().remove();
				$(this).text('Launch');
				$(this).data('launched', false);
			}
			else {
				var box2dDiv = $('<div></div>').addClass('span12');
				var box2dIframe = $('<iframe></iframe>').attr($(this).data('attributes'));
				box2dDiv.append(box2dIframe);
				$(this).parent().after(box2dDiv);
				var thisReference = this;
				setTimeout(function () {
					console.log(thisReference);
					$.smoothScroll({
						scrollTarget: thisReference, 
						offset: -100, 
						speed: 2000
					});
				}, 1000);
				
				$(this).text('Close');
				$(this).data('launched', true);
			}
		});
	});
	/*
	$(function () {
		var drumMachineLaunched = false;
		
		$('#drum-machine-button').click(function () {
			if (drumMachineLaunched) {
				$('#drum-machine-button').parent().next().remove();
				$('#drum-machine-button').text('Launch');
				drumMachineLaunched = false;
			}
			else {
				var box2dDiv = $('<div></div>').addClass('span12');
				var box2dIframe = $('<iframe></iframe>').attr({id: 'drum-machine-iframe', src: 'drum_machine/index.html'});
				box2dDiv.append(box2dIframe);
				$('#drum-machine-button').parent().after(box2dDiv);
				setTimeout(function () {
					$.smoothScroll({
						scrollTarget: '#drum-machine-button', 
						offset: -100, 
						speed: 3000
					});
				}, 1000);
				
				$('#drum-machine-button').text('Close');
				drumMachineLaunched = true;
			}
		});
	});
	*/

});

