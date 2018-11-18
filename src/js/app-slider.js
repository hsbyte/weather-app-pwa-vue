(function() {

	var	$slider = document.querySelector(".slider"),
			$slideBar = document.querySelector(".slider--svg"),
			fillOpacity = $slideBar.getAttribute('opacity');
			slideBarOrigWidth = 30,
			sliderOrigWidth = parseInt(getComputedStyle($slider).width),
			slideWidth = window.innerWidth*.8;
			exitWidthArea = slideWidth;
			slideHeight = window.innerHeight,
			dispX = 0,
			grabStart = false,
			$aside = document.querySelector(".aside"),
			asideActive = false;

	$slideBar.setAttribute('d', updateSlideBar(0, slideBarOrigWidth));

	function updateSlideBar(dispX, dispWidth) {
		if (dispX > 0) {
			slideWidth = parseInt(getComputedStyle($slider).width);
		}
		slideHeight = window.innerHeight;
		return 'M0,0 ' + dispWidth + ',0 c' + dispX + ',0 ' + dispX + ',' + slideHeight + ' 0,' + slideHeight + ' L0,' + slideHeight;
	}

  function easeOutElastic(t, b, c, d) {
    var s = 1.70158, p=-0, a=c;
    if (t == 0) return b;
    if ( (t = t/d) == 1) return b+c;
    if (!p) p = d*.3;
    if (a < Math.abs(c)) { a = c; var s = p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a); 
    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
  } 

	function animateSlideBar() {
    var duration = 1000,
    		frameRate = 60/1000,
    		totalFrames = duration * frameRate,
    		currentFrame = 0,
    		newDispX, newDispWidth;

    function animate() { 
      currentFrame++;  
      if (asideActive) {
	      newDispWidth = easeOutElastic(currentFrame, totalFrames, slideWidth - totalFrames, totalFrames);
	      newDispX = easeOutElastic(currentFrame, slideWidth, 0 - slideWidth, totalFrames);
	    } else {
	      newDispWidth = slideBarOrigWidth;
	      newDispX = easeOutElastic(currentFrame, totalFrames, 0 - totalFrames, totalFrames);
	    }
			$slideBar.setAttribute('d', updateSlideBar(newDispX, newDispWidth)); 
      if (currentFrame > totalFrames) return;
			requestAnimationFrame(animate);
		}
		animate();
	}

	addEventListeners($slideBar, 'mousedown touchstart', function() {
		if (asideActive || grabStart) return;
		grabStart = true;
		slideWidth = window.innerWidth*.8;
		addEventListeners(document, 'mousemove touchmove', function(e) {
			if (!grabStart) return;
			$slideBar.style.opacity = 1;
			$slider.style.width = slideWidth+'px';
			dispX = e.pageX || e.touches[0].pageX;
			if (dispX > slideWidth) dispX = slideWidth;
			if (dispX < 0 || !dispX) dispX = 0;
			$slideBar.setAttribute('d', updateSlideBar(dispX, slideBarOrigWidth));
		});
	});

	addEventListeners(document, 'mouseup touchend', function() {
		if (!grabStart) return;
		if (asideActive) return;
		animateSlideBar();
		asideActive = true;
		grabStart = false;
		$aside.classList.add('aside--active');
		$slideBar.style.opacity = 0;
	});

	addEventListeners(window, 'resize mousedown touchstart', function() {
		var e = window.event;
		if (!asideActive) return;

		if (vaside.settings) return; /* vue.js checking for settings */

		if (e.type === 'touchstart')
			if (e.touches[0].clientX < exitWidthArea) return;	
		if (e.clientX < exitWidthArea) return;

		$aside.classList.remove('aside--active');
		animateSlideBar();
		asideActive = false;
		btnaddPressed = false;

		$slideBar.style.opacity = fillOpacity;
		$slideBar.style.width = slideBarOrigWidth+'px';
		$slider.style.width = sliderOrigWidth+'px';
	});

	window.addEventListener('resize', function() {
		$slideBar.setAttribute('d', updateSlideBar(0, slideBarOrigWidth));
	})

	function addEventListeners(element, eventNames, listenerFunction) {
		var events = eventNames.split(' ');
		events.forEach( function(item, index) {
			element.addEventListener(item, listenerFunction, false);
		});
	}
	
})();