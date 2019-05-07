{{--
  Template Name: Homepage Template
--}}

@extends('layouts.app-toolbar')

@section('content')
  {{-- Homepage CTA --}}
  <section class="cover cover-12 form--dark imagebg height-100 parallax" data-overlay="4">
    <div class="background-image-holder">
      <img alt="image" src="<?php echo get_template_directory_uri() . '/assets/images/school.jpg' ?>">
    </div>
    <div class="container pos-vertical-center text-center-xs">
      <div class="row pos-vertical-align-columns">
        <div class="col-md-7 col-sm-8 col-sm-offset-2">
          <h2>Order your school uniform online.</h2>
          <p class="lead">Use our online form to select the items that you wish to purchase. Start by selecting your school.</p>
        </div>

        <div class="col-md-5 col-sm-8 col-sm-offset-2">
          <div class="form-subscribe-1 boxed boxed--lg bg--white text-center box-shadow-wide">
            <h4>Select Your School</h4>
            <form action="" method="get" id="subForm" data-error="Please fill all fields correctly."
              data-success="Thanks for signing up! Please check your inbox for confirmation email.">
              <div class="input-with-icon">
                <?php wp_dropdown_pages([
                  'show_option_none' => '&dash; Please select your school &dash;',
                  'post_type'        => 'fs_school'
                ]); ?>
              </div>
              <button type="submit" class="btn btn-block">Order Uniform</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>

  {{-- How it works title --}}
  <section class="height-40 bg--dark">
    <div class="container pos-vertical-center">
      <div class="row">
        <div class="col-sm-12 text-center">
          <h2>How it works</h2>
          <span>
            <em>A simple three step online process.</em>
          </span>
        </div>
      </div>
    </div>
  </section>
  
  {{-- Instructions --}}
  <section class="features features-10">
    <div class="feature bg--white col-md-4 text-center">
      <i class="icon icon--lg material-icons">search</i>
      <h4>Find your school</h4>
      <p>Find your school order page by visiting the link provided by your school or by using our school finder on the homepage.
      </p>
    </div>
    <div class="feature bg--primary col-md-4 text-center">
      <i class="icon icon--lg material-icons">ballot</i>
      <h4>Order your uniform</h4>
      <p>
        Use the online form to select the items that you wish to purchase. Complete your order securely online using a credit/debit card.
      </p>
    </div>
    <div class="feature bg--secondary col-md-4 text-center">
      <i class="icon icon--lg material-icons">event_available</i>
      <h4>Collect your order</h4>
      <p>
        You will receive a written or e-mail notification from the school when your order is available to collect on site.
      </p>
    </div>
  </section>
@endsection
