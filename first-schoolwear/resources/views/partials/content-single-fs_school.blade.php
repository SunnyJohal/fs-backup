{{-- Page title --}}
<section class="height-30 bg--dark">
  <div class="container pos-vertical-center">
    <div class="row">
      <div class="col-sm-12 text-center">
        <h2>{!! App::title() !!}</h2>
        @php(do_action('fs_page_subtitle'))
      </div>
    </div>
  </div>
</section>

{{-- Content --}}
<section class="bg--secondary">
  <div class="container">
    <div class="row">
      <div class="col-sm-8 col-sm-offset-2">
        @if (has_post_thumbnail())
          <div class='fs-school-logo'>
            @php(the_post_thumbnail())
          </div>
        @endif
        @php(the_content())
        {!! wp_link_pages(['echo' => 0, 'before' => '<nav class="page-nav"><p>' . __('Pages:', 'sage'), 'after' => '</p></nav>']) !!}
      </div>
    </div>
  </div>
</section>

{{-- Instructions --}}
<section class="features features-10" style="border-top: 1px solid rgba(0,0,0,0.1)">
  <div class="feature bg--white col-md-4 text-center">
    <i class="icon icon--lg material-icons">school</i>
    <h4>{!! App::title() !!}</h4>
    <p>@php(do_action('fs_page_subtitle'))</p>
  </div>

  <div class="feature bg--secondary col-md-4 text-center">
    <i class="icon icon--lg material-icons">event_available</i>
    <h4>Next Steps</h4>
    <p>
      {!! App::title() !!} will notify you when your order is available to collect at the school.
    </p>
  </div>

  <div class="feature bg--primary col-md-4 text-center">
    <i class="icon icon--lg material-icons">verified_user</i>
    <h4>Secure Online Payments</h4>
    <p>
      Full SSL encryption. All major credit/debit cards accepted. Payments are processed by Stripe.
    </p>
  </div>
</section>
