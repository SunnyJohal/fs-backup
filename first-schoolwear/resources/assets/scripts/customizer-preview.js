import $ from 'jquery';

const head = $('head');

// This will load the scripts for the previewer.

wp.customize('blogname', value => {
  value.bind(to => $('.brand').text(to));
});

wp.customize('tt_theme_settings[color_setting]', value => {
  value.bind(to => {
    // eslint-disable-next-line
    value;
    to;
  });
});

wp.customize('tt_theme_settings[slider_setting]', value => {
  value.bind(to => {
    $('.mdc-toolbar__row').css({ height: `${to.amount}${to.unit}` });
  });
});

// Standard color setting preview.
wp.customize('tt_theme_settings[color_palette_setting][base]', value => {
  const styleId = 'tt-primary-color';
  value.bind(to => {
    // Bail if there is no value defined.
    if (to === '' || typeof to === 'undefined') {
      $('#' + styleId).remove();
      return;
    }
    /* eslint-disable-next-line */
    // console.log('its loading');

    // Otherwise, append this style to the head.
    let style = `
      <style id="${styleId}" type="text/css">
        :root {
          --mdc-theme-primary: ${to};
        }
      </style>
    `;

    // Update previewer.
    if ($('#' + styleId).length !== 0) {
      $('#' + styleId).replaceWith(style);
    } else {
      $(style).appendTo(head);
    }
  });
});

wp.customize('tt_theme_settings[cropped_image_setting]', value => {
  const styleId = 'tt-cropped-image-test';
  value.bind(to => {
    // Bail if there is no value defined.
    if (to === '' || typeof to === 'undefined') {
      $('#' + styleId).remove();
      return;
    }
    /* eslint-disable-next-line */
    // console.log('its loading');

    // Otherwise, append this style to the head.
    let style = `
      <style id="${styleId}" type="text/css">
        .mdc-drawer__header-content {
          background: url(${to}) repeat;
        }
      </style>
    `;

    // Update previewer.
    if ($('#' + styleId).length !== 0) {
      $('#' + styleId).replaceWith(style);
    } else {
      $(style).appendTo(head);
    }
  });
});

wp.customize('tt_theme_settings[image_setting]', value => {
  const styleId = 'tt-image-test';
  value.bind(to => {
    // Bail if there is no value defined.
    if (to === '' || typeof to === 'undefined') {
      $('#' + styleId).remove();
      return;
    }
    /* eslint-disable-next-line */
    // console.log('its loading');

    // Otherwise, append this style to the head.
    let style = `
      <style id="${styleId}" type="text/css">
        .mdc-layout-grid {
          background: url(${to}) repeat;
        }
      </style>
    `;

    // Update previewer.
    if ($('#' + styleId).length !== 0) {
      $('#' + styleId).replaceWith(style);
    } else {
      $(style).appendTo(head);
    }
  });
});

wp.customize('tt_theme_settings[color_palette_setting][light]', value => {
  const styleId = 'tt-secondary-color';
  value.bind(to => {
    // Bail if there is no value defined.
    if (to === '' || typeof to === 'undefined') {
      $('#' + styleId).remove();
      return;
    }
    /* eslint-disable-next-line */
    // console.log('its loading');

    // Otherwise, append this style to the head.
    let style = `
      <style id="${styleId}" type="text/css">
        body {
          background: ${to};
        }
      </style>
    `;

    // Update previewer.
    if ($('#' + styleId).length !== 0) {
      $('#' + styleId).replaceWith(style);
    } else {
      $(style).appendTo(head);
    }
  });
});

wp.customize.bind('preview-ready', () => {
  // console.log(wp.customize.selectiveRefresh);
  // TODO: Abstract into theme partials.
  var partial = new wp.customize.selectiveRefresh.Partial(
    'tt_theme_settings[select_setting]',
    {
      selector: '.single-post .mdc-tab-bar',
      fallbackRefresh: false,
      settings: ['tt_theme_settings[select_setting]']
    }
  );
  wp.customize.selectiveRefresh.partial.add(partial);
});
