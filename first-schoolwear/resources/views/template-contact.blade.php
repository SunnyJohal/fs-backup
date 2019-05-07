{{--
  Template Name: Contact Template
--}}

@extends('layouts.app-toolbar')

@section('content')
  @while(have_posts()) @php(the_post())
    @include('partials.page-header')
    <section>
      <div class="container">
        <div class="row">
          <div class="col-sm-8 col-sm-offset-2">
          @php(the_content())
          </div>
        </div>
      </div>
    </section>
    {{-- Contact Boxes --}}
    <section class="features features-10">
      <div class="feature bg--white col-md-4 text-center">
        <i class="icon icon--lg material-icons">business</i>
        <h4>Head Office</h4>
        <p>
          Workspace House, Unit 71,<br />
          28/29 Maxwell Road,<br />
          Peterborough, PE2 7JE
        </p>
      </div>
      <div class="feature bg--secondary col-md-4 text-center">
        <i class="icon icon--lg material-icons">send</i>
        <h4>Get in Touch</h4>
        <p>
          <a href="mailto:orders@firstschoolwear.co.uk">orders@firstschoolwear.co.uk</a><br/>
          Phone: +44 (0)1733 396 593
        </p>
      </div>
      <div class="feature bg--primary col-md-4 text-center">
        <i class="icon icon--lg material-icons">live_help</i>
        <h4>Need Assistance?</h4>
        <p>
          Please use the contact form above to contact our team. Please note: school uniform order enquiries should be directed towards your school.
        </p>
      </div>
    </section>

    {{-- Map --}}
    <section class="map-1">
      <div class="map-container">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2425.6758958618784!2d-0.26308168460526044!3d52.55738724121086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4877f1b969b7eb27%3A0x2c6a1a37e918f184!2sPeterborough+Workspace!5e0!3m2!1sen!2suk!4v1531838728145"></iframe>
      </div>
    </section>
  @endwhile
@endsection
