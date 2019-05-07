<footer class="footer-3 bg--white text-center-xs">
  <div class="col-sm-3">
    <img alt="logo" class="logo" src="<?php echo get_template_directory_uri() . '/assets/images/logo.png'; ?>">
    <a class="type--underline" href="mailto:orders@firstschoolwear.co.uk">orders@firstschoolwear.co.uk</a>
  </div>
  <div class="col-sm-6 text-center">
    @if (has_nav_menu('footer_navigation'))
      {!! wp_nav_menu(['theme_location' => 'footer_navigation', 'menu_class' => 'footer__navigation']) !!}
    @endif
  </div>
  <div class="col-sm-3 text-right text-center-xs">
    <span class="type--fine-print">© Copyright
      <span class="update-year"><?php echo Date('Y'); ?></span> First Schoolwear ltd.</span>
  </div>
</footer>
