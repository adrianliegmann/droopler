/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {

  "use strict";

  Drupal.behaviors.droopler_theme = {
    attach: function (context, settings) {
      var $body = $('body');
      if ($body.hasClass('d-theme-preceded')) {
        return;
      }
      $(window).once('d_global_scrolled').scroll(function() {
        if ($(this).scrollTop() > 50) {
          $("body").addClass("scrolled");
        }
        else{
          $("body").removeClass("scrolled");
        }
      });

      $( window ).once('d_global_resize').resize(function() {
        clampTitle();
      });
      clampTitle();

      /**
       * Triger title to 2 lines and add ... .
       */
      function clampTitle() {
        var containers = document.querySelectorAll('.product-teaser-content .node__title');
        Array.prototype.forEach.call(containers, function (container) {
          var p = container.querySelector('span');
          var divh = container.clientHeight;
          while (p.offsetHeight > divh) {
            p.textContent = p.textContent.replace(/\W*\s(\S)*$/, '...');
          }
        });
      }

      // Enable hover on dropdowns.
      $("#header .dropdown, .language-switcher-language-url").hover(function() {
        // We don't manipulate on default "show" class here.
        // Using additional class prevents mobile bugs.
        $(this).addClass("force-show");
        $(this).find(".dropdown-menu").addClass("force-show");
      }, function() {
        // On hover out remove also default "show" class.
        $(this).removeClass("force-show").removeClass("show");
        $(this).find(".dropdown-menu").removeClass("force-show").removeClass("show");
      });

      // Prevent hover on touch devices - revert to default behavior.
      $('.menu-dropdown-icon').on({ 'touchstart' : function(){
        $(this).parent().removeClass('force-show');
        $(this).parent().find(".dropdown-menu").removeClass('force-show');
      } });
      $body.addClass("d-theme-preceded");

      // Calculate value for elemenets with dynamic offset top value.
      $(window).bind('syncDynamicOffsetElements', function () {
        $('.has-offset-sync').each(function () {
          var selector = $(this).data('offset-sync-source');
          var $sourceElement = $(selector);
          var offset = $sourceElement.offset().top - parseInt($body.css('padding-top'));

          $(this).css({ 'top': offset + 'px'});
        });
      }).trigger('syncDynamicOffsetElements');

      $(window).on('resize', Drupal.debounce(function () {
        $(window).trigger('syncDynamicOffsetElements');
      }, 100));

    }
  };

  /**
   * Adds additional div above the unpublished content.
   * @type {{attach: Drupal.behaviors.droopler_unpublished.attach}}
   */
  Drupal.behaviors.droopler_unpublished = {
    attach: function (context, settings) {
      $('<div>').addClass('unpublished-message').text(Drupal.t('Unpublished')).insertBefore($('.node--unpublished', context));
    }
  };

  /**
   * Initialize tooltip.
   * @type {{attach: Drupal.behaviors.droopler_tooltip.attach}}
   */
  Drupal.behaviors.droopler_tooltip = {
    attach: function (context, settings) {
      $('[data-toggle="tooltip"]').tooltip();
    }
  };

  /**
   * Initialize popovers.
   * @type {{attach: Drupal.behaviors.droopler_popover.attach}}
   */
  Drupal.behaviors.droopler_popover = {
    attach: function (context, settings) {
      $('[data-toggle="popover"]').popover();
    }
  };

})(jQuery, Drupal);
