'use strict';

var keyboardAccessibility = require('./keyboardAccessibility');

var clearSelection = function (element) {
    $(element).closest('.dropdown').children('.dropdown-menu').children('.top-category')
        .detach();
    $(element).closest('.dropdown.show').children('.nav-link').attr('aria-expanded', 'false');
    $(element).closest('.dropdown.show').children('.dropdown-menu').attr('aria-hidden', 'true');
    $(element).closest('.dropdown.show').removeClass('show');
    $('div.menu-group > ul.nav.navbar-nav > li.nav-item > a').attr('aria-hidden', 'false');
    $(element).closest('li').detach();
};

module.exports = function () {
    var isDesktop = function (element) {
        return $(element).parents('.menu-toggleable-left').css('position') !== 'fixed';
    };

    var headerBannerStatus = window.sessionStorage.getItem('hide_header_banner');
    $('.header-banner .close').on('click', function () {
        $('.header-banner').addClass('d-none');
        window.sessionStorage.setItem('hide_header_banner', '1');
    });

    if (!headerBannerStatus || headerBannerStatus < 0) {
        $('.header-banner').removeClass('d-none');
    }

    keyboardAccessibility('.main-menu .nav-link, .main-menu .dropdown-link',
        {
            40: function (menuItem) { // down
                if (menuItem.hasClass('nav-item')) { // top level
                    $('.navbar-nav .show').removeClass('show')
                        .children('.dropdown-menu')
                        .removeClass('show');
                    menuItem.addClass('show').children('.dropdown-menu').addClass('show');
                    menuItem.find('ul > li > a')
                        .first()
                        .focus();
                } else {
                    menuItem.removeClass('show').children('.dropdown-menu').removeClass('show');
                    if (!(menuItem.next().length > 0)) { // if this is the last menuItem
                        menuItem.parent().parent().find('li > a') // set focus to the first menuitem
                        .first()
                        .focus();
                    } else {
                        menuItem.next().children().first().focus();
                    }
                }
            },
            39: function (menuItem) { // right
                if (menuItem.hasClass('nav-item')) { // top level
                    menuItem.removeClass('show').children('.dropdown-menu').removeClass('show');
                    $(this).attr('aria-expanded', 'false');
                    menuItem.next().children().first().focus();
                } else if (menuItem.hasClass('dropdown')) {
                    menuItem.addClass('show').children('.dropdown-menu').addClass('show');
                    $(this).attr('aria-expanded', 'true');
                    menuItem.find('ul > li > a')
                        .first()
                        .focus();
                }
            },
            38: function (menuItem) { // up
                if (menuItem.hasClass('nav-item')) { // top level
                    menuItem.removeClass('show').children('.dropdown-menu').removeClass('show');
                } else if (menuItem.prev().length === 0) { // first menuItem
                    menuItem.parent().parent().removeClass('show')
                        .children('.nav-link')
                        .attr('aria-expanded', 'false');
                    menuItem.parent().children().last().children() // set the focus to the last menuItem
                        .first()
                        .focus();
                } else {
                    menuItem.prev().children().first().focus();
                }
            },
            37: function (menuItem) { // left
                if (menuItem.hasClass('nav-item')) { // top level
                    menuItem.removeClass('show').children('.dropdown-menu').removeClass('show');
                    $(this).attr('aria-expanded', 'false');
                    menuItem.prev().children().first().focus();
                } else {
                    menuItem.closest('.show').removeClass('show')
                        .closest('li.show').removeClass('show')
                        .children()
                        .first()
                        .focus()
                        .attr('aria-expanded', 'false');
                }
            },
            27: function (menuItem) { // escape
                var parentMenu = menuItem.hasClass('show')
                    ? menuItem
                    : menuItem.closest('li.show');
                parentMenu.children('.show').removeClass('show');
                parentMenu.removeClass('show').children('.nav-link')
                    .attr('aria-expanded', 'false');
                parentMenu.children().first().focus();
            }
        },
        function () {
            return $(this).parent();
        }
    );

    $('.dropdown:not(.disabled) [data-toggle="dropdown"]')
        .on('click', function (e) {
            if (!isDesktop(this)) {
                $('.modal-background').show();
                // copy parent element into current UL
                var li = $('<li class="dropdown-item top-category" role="button"></li>');
                var link = $(this).clone().removeClass('dropdown-toggle')
                    .removeAttr('data-toggle')
                    .removeAttr('aria-expanded')
                    .attr('aria-haspopup', 'false');
                li.append(link);
                var closeMenu = $('<li class="nav-menu"></li>');
                closeMenu.append($('.close-menu').first().clone());
                $(this).parent().children('.dropdown-menu')
                    .prepend(li)
                    .prepend(closeMenu)
                    .attr('aria-hidden', 'false');
                // copy navigation menu into view
                $(this).parent().addClass('show');
                $(this).attr('aria-expanded', 'true');
                $(link).focus();
                $('div.menu-group > ul.nav.navbar-nav > li.nav-item > a').attr('aria-hidden', 'true');
                e.preventDefault();
            }
        })
        .on('mouseenter', function () {
            if (isDesktop(this)) {
                var eventElement = this;
                $('.navbar-nav > li').each(function () {
                    if (!$.contains(this, eventElement)) {
                        $(this).find('.show').each(function () {
                            clearSelection(this);
                        });
                        if ($(this).hasClass('show')) {
                            $(this).removeClass('show');
                            $(this).children('ul.dropdown-menu').removeClass('show');
                            $(this).children('.nav-link').attr('aria-expanded', 'false');
                        }
                    }
                });
                // need to close all the dropdowns that are not direct parent of current dropdown
                $(this).parent().addClass('show');
                $(this).siblings('.dropdown-menu').addClass('show');
                $(this).attr('aria-expanded', 'true');
            }
        })
        .parent()
        .on('mouseleave', function () {
            if (isDesktop(this)) {
                $(this).removeClass('show');
                $(this).children('.dropdown-menu').removeClass('show');
                $(this).children('.nav-link').attr('aria-expanded', 'false');
            }
        });

    $('.navbar>.close-menu>.close-button').on('click', function (e) {
        e.preventDefault();
        $('.menu-toggleable-left').removeClass('in');
        $('.modal-background').hide();

        $('.navbar-toggler').focus();

        $('.main-menu').attr('aria-hidden', 'true');
        $('.main-menu').siblings().attr('aria-hidden', 'false');
        $('header').siblings().attr('aria-hidden', 'false');
    });

    $('.navbar-nav').on('click', '.back', function (e) {
        e.preventDefault();
        clearSelection(this);
    });

    $('.navbar-nav').on('click', '.close-button', function (e) {
        e.preventDefault();
        $('.navbar-nav').find('.top-category').detach();
        $('.navbar-nav').find('.nav-menu').detach();
        $('.navbar-nav').find('.show').removeClass('show');
        $('.menu-toggleable-left').removeClass('in');

        $('.main-menu').siblings().attr('aria-hidden', 'false');
        $('header').siblings().attr('aria-hidden', 'false');

        $('.modal-background').hide();
    });

    $('.navbar-toggler').click(function (e) {
        e.preventDefault();
        $('.main-menu').toggleClass('in');
        $('.modal-background').show();

        $('.main-menu').removeClass('d-none');
        $('.main-menu').attr('aria-hidden', 'false');
        $('.main-menu').siblings().attr('aria-hidden', 'true');
        $('header').siblings().attr('aria-hidden', 'true');

        $('.main-menu .nav.navbar-nav .nav-link').first().focus();
    });

    keyboardAccessibility('.navbar-header .user',
        {
            40: function ($popover) { // down
                if ($popover.children('a').first().is(':focus')) {
                    $popover.next().children().first().focus();
                } else {
                    $popover.children('a').first().focus();
                }
            },
            38: function ($popover) { // up
                if ($popover.children('a').first().is(':focus')) {
                    $(this).focus();
                    $popover.removeClass('show');
                } else {
                    $popover.children('a').first().focus();
                }
            },
            27: function () { // escape
                $('.navbar-header .user .popover').removeClass('show');
                $('.user').attr('aria-expanded', 'false');
            },
            9: function () { // tab
                $('.navbar-header .user .popover').removeClass('show');
                $('.user').attr('aria-expanded', 'false');
            }
        },
        function () {
            var $popover = $('.user .popover li.nav-item');
            return $popover;
        }
    );

    $('.navbar-header .user').on('mouseenter focusin', function () {
        if ($('.navbar-header .user .popover').length > 0) {
            $('.navbar-header .user .popover').addClass('show');
            $('.user').attr('aria-expanded', 'true');
        }
    });

    $('.navbar-header .user').on('mouseleave', function () {
        $('.navbar-header .user .popover').removeClass('show');
        $('.user').attr('aria-expanded', 'false');
    });
    $('body').on('click', '#myaccount', function () {
        event.preventDefault();
    });
};
