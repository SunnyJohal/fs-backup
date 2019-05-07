<!doctype html>
<html @php(language_attributes())>
  @include('partials.head')
  <body @php(body_class('theme--square')) data-reveal-selectors="section:not(.masonry):not(:first-of-type):not(.parallax)">
    {{-- Nav Container --}}
    <div class="nav-container">
      @php(do_action('get_header'))
      @include('partials.header')
    </div>

    {{-- Main Container --}}
    <div class="main-container">

      {{-- Content --}}
      <div class="content-wrap" role="document">
        <div class="content">
          <main>
            @yield('content')
          </main>
          @if (App\display_sidebar())
            <aside class="sidebar">
              @include('partials.sidebar')
            </aside>
          @endif
        </div>
      </div>

      {{-- Footer --}}
      @php(do_action('get_footer'))
      @include('partials.footer')
    </div>

    {{-- Scripts --}}
    @php(wp_footer())
  </body>
</html>
