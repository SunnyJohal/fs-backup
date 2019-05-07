@extends('layouts.app-toolbar')

@section('content')
  <section class="height-100 bg--primary page-error">
    <div class="container pos-vertical-center">
      <div class="row">
        <div class="col-sm-12 text-center">
          <i class="icon icon--lg icon-Compass-4 material-icons">not_listed_location</i>
          <h1>Error 404 - Page Not Found</h1>
          <p>{{ __('Sorry, but the page you were trying to view does not exist. Please use the navigation menu above to get back on track.', 'sage') }}</p>
        </div>
      </div>
    </div>
  </section>
@endsection
