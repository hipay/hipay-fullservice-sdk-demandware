'use strict';
var debounce = require('lodash/debounce');

/**
 * Get display information related to screen size
 * @param {jQuery} element - the current carousel that is being used
 * @returns {Object} an object with display information
 */
function screenSize(element) {
    var result = {
        itemsToDisplay: null,
        sufficientSlides: true
    };
    var viewSize = $(window).width();
    var extraSmallDisplay = element.data('xs');
    var smallDisplay = element.data('sm');
    var mediumDisplay = element.data('md');
    var numberOfSlides = element.data('number-of-slides');

    if (viewSize <= 575.98) {
        result.itemsToDisplay = extraSmallDisplay;
    } else if ((viewSize >= 576) && (viewSize <= 768.98)) {
        result.itemsToDisplay = smallDisplay;
    } else if (viewSize >= 769) {
        result.itemsToDisplay = mediumDisplay;
    }

    if (result.itemsToDisplay && numberOfSlides <= result.itemsToDisplay) {
        result.sufficientSlides = false;
    }

    return result;
}

/**
 * Makes the next element to be displayed next unreachable for screen readers and keyboard nav
 * @param {jQuery} element - the current carousel that is being used
 */
function hiddenSlides(element) {
    var carousel;

    if (element) {
        carousel = element;
    } else {
        carousel = $('.experience-commerce_layouts-carousel .carousel, .experience-einstein-einsteinCarousel .carousel, .experience-einstein-einsteinCarouselCategory .carousel, .experience-einstein-einsteinCarouselProduct .carousel');
    }

    var screenSizeInfo = screenSize(carousel);

    var lastDisplayedElement;
    var elementToBeDisplayed;

    switch (screenSizeInfo.itemsToDisplay) {
        case 2:
            lastDisplayedElement = carousel.find('.active.carousel-item + .carousel-item');
            elementToBeDisplayed = carousel.find('.active.carousel-item + .carousel-item + .carousel-item');
            break;
        case 3:
            lastDisplayedElement = carousel.find('.active.carousel-item + .carousel-item + .carousel-item');
            elementToBeDisplayed = carousel.find('.active.carousel-item + .carousel-item + .carousel-item + .carousel-item');
            break;
        case 4:
            lastDisplayedElement = carousel.find('.active.carousel-item + .carousel-item + .carousel-item + .carousel-item');
            elementToBeDisplayed = carousel.find('.active.carousel-item + .carousel-item + .carousel-item + .carousel-item + .carousel-item');
            break;
        case 6:
            lastDisplayedElement = carousel.find('.active.carousel-item + .carousel-item + .carousel-item + .carousel-item + .carousel-item + .carousel-item');
            elementToBeDisplayed = carousel.find('.active.carousel-item + .carousel-item + .carousel-item + .carousel-item + .carousel-item + .carousel-item + .carousel-item');
            break;
        default:
            break;
    }

    carousel.find('.active.carousel-item').removeAttr('tabindex').removeAttr('aria-hidden');
    carousel.find('.active.carousel-item').find('a, button, details, input, textarea, select')
        .removeAttr('tabindex')
        .removeAttr('aria-hidden');

    if (lastDisplayedElement) {
        lastDisplayedElement.removeAttr('tabindex').removeAttr('aria-hidden');
        lastDisplayedElement.find('a, button, details, input, textarea, select')
            .removeAttr('tabindex')
            .removeAttr('aria-hidden');
    }

    if (elementToBeDisplayed) {
        elementToBeDisplayed.attr('tabindex', -1).attr('aria-hidden', true);
        elementToBeDisplayed.find('a, button, details, input, textarea, select')
            .attr('tabindex', -1)
            .attr('aria-hidden', true);
    }
}

$(document).ready(function () {
    hiddenSlides();

    $(window).on('resize', debounce(function () {
        hiddenSlides();
    }, 500));

    $('body').on('carousel:setup', function () {
        hiddenSlides();
    });

    $('.experience-commerce_layouts-carousel .carousel, .experience-einstein-einsteinCarousel .carousel, .experience-einstein-einsteinCarouselCategory .carousel, .experience-einstein-einsteinCarouselProduct .carousel').on('touchstart', function (touchStartEvent) {
        var screenSizeInfo = screenSize($(this));

        if (screenSizeInfo.sufficientSlides) {
            var xClick = touchStartEvent.originalEvent.touches[0].pageX;
            $(this).one('touchmove', function (touchMoveEvent) {
                var xMove = touchMoveEvent.originalEvent.touches[0].pageX;
                if (Math.floor(xClick - xMove) > 5) {
                    $(this).carousel('next');
                } else if (Math.floor(xClick - xMove) < -5) {
                    $(this).carousel('prev');
                }
            });
            $('.experience-commerce_layouts-carousel .carousel, .experience-einstein-einsteinCarousel .carousel, .experience-einstein-einsteinCarouselCategory .carousel, .experience-einstein-einsteinCarouselProduct .carousel').on('touchend', function () {
                $(this).off('touchmove');
            });
        }
    });

    $('.experience-commerce_layouts-carousel .carousel, .experience-einstein-einsteinCarousel .carousel, .experience-einstein-einsteinCarouselCategory .carousel, .experience-einstein-einsteinCarouselProduct .carousel').on('slide.bs.carousel', function (e) {
        var activeCarouselPosition = $(e.relatedTarget).data('position');
        $(this).find('.pd-carousel-indicators .active').removeClass('active');
        $(this).find(".pd-carousel-indicators [data-position='" + activeCarouselPosition + "']").addClass('active');

        var extraSmallDisplay = $(this).data('xs');
        var smallDisplay = $(this).data('sm');
        var mediumDisplay = $(this).data('md');

        var arrayOfSlidesToDisplay = [];

        if (!$(this).hasClass('insufficient-xs-slides')) {
            arrayOfSlidesToDisplay.push(extraSmallDisplay);
        }

        if (!$(this).hasClass('insufficient-sm-slides')) {
            arrayOfSlidesToDisplay.push(smallDisplay);
        }

        if (!$(this).hasClass('insufficient-md-slides')) {
            arrayOfSlidesToDisplay.push(mediumDisplay);
        }

        var itemsToDisplay = Math.max.apply(Math, arrayOfSlidesToDisplay);

        var elementIndex = $(e.relatedTarget).index();
        var numberOfSlides = $('.carousel-item', this).length;
        var carouselInner = $(this).find('.carousel-inner');
        var carouselItem;

        if (elementIndex >= numberOfSlides - (itemsToDisplay - 1)) {
            var it = itemsToDisplay - (numberOfSlides - elementIndex);
            for (var i = 0; i < it; i++) {
                // append slides to end
                if (e.direction === 'left') {
                    carouselItem = $('.carousel-item', this).eq(i);

                    $(carouselItem).appendTo($(carouselInner));
                } else {
                    carouselItem = $('.carousel-item', this).eq(0);

                    $(carouselItem).appendTo($(carouselInner));
                }
            }
        }
    });

    $('.experience-commerce_layouts-carousel .carousel, .experience-einstein-einsteinCarousel .carousel, .experience-einstein-einsteinCarouselCategory .carousel, .experience-einstein-einsteinCarouselProduct .carousel').on('slid.bs.carousel', function () {
        hiddenSlides($(this));
    });
});
