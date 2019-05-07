<nav>
  <div class="nav-bar" data-fixed-at="700">
    <div class="nav-module logo-module left">
      <a href="<?php echo site_url(); ?>">
        <img alt="logo" class="logo logo-dark" src="<?php echo get_template_directory_uri() . '/assets/images/logo.png'; ?>">
        <img alt="logo" class="logo logo-light" src="<?php echo get_template_directory_uri() . '/assets/images/logo.png'; ?>">
      </a>
    </div>
    <div class="nav-module menu-module left">
      @if (has_nav_menu('primary_navigation'))
        {!! wp_nav_menu(['theme_location' => 'primary_navigation', 'menu_class' => 'menu']) !!}
      @endif
    </div>
    <div class="nav-mobile-toggle visible-sm visible-xs">
      <i class="material-icons">menu</i>
    </div>
  </div>
</nav>
