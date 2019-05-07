/**
 * Register Control
 *
 * Loops through the settings config json
 * object and registers the controls in
 * the customizer.
 *
 * wp.customize.Control() represents the View
 * and the Controller in the customizer.
 *
 * Controls are rendered using react using the
 * following steps:
 *  -> Register Control
 *  -> Instantiates a new control
 *  -> Control instanceRenders React Component
 *
 * @see \App\get_theme_settings_configuration()
 *
 * @return void
 *
 * @since 1.0.0
 * @version 1.0.0
 */
// TODO: Register the custom files here.
// Import registration functions.
// Register the plugins with the customize api on import.
import '../controls/plugins/background-position-control';
import '../controls/plugins/checkbox-control';
import '../controls/plugins/color-control';
import '../controls/plugins/color-palette-control';
import '../controls/plugins/color-swatch-control';
import '../controls/plugins/cropped-image-control';
import '../controls/plugins/dropdown-pages-control';
import '../controls/plugins/image-control';
import '../controls/plugins/persistence-control';
import '../controls/plugins/radio-control';
import '../controls/plugins/searchable-select-control';
import '../controls/plugins/select-control';
import '../controls/plugins/slider-control';
import '../controls/plugins/text-area-control';
import '../controls/plugins/text-control';
import '../controls/plugins/toggle-control';

// Grab the settings config from the window obj.
const {
  wp,
  ttCustomize: { settings }
} = window;

/**
 * EXPORT: registerControls
 *
 * @description Registers all of the controls that
 *   have been pre-defined in the settings with the
 *   customize api.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
export const registerControls = () => {
  const paletteColorSettingKeys = [
    'base',
    'light',
    'dark',
    'base_text_color',
    'light_text_color',
    'dark_text_color'
  ];

  wp.customize.bind('ready', () => {
    for (let setting in settings.config) {
      const settingId = `${settings.setting_key}[${setting}]`;
      const settingConfig = settings.config[setting];
      const { type } = settingConfig;

      // Add control to the customizer.
      switch (type) {
        case 'checkbox':
          wp.customize.control.add(
            new wp.customize.TTCheckboxControl(settingId, settingConfig)
          );
          break;

        case 'color':
          // Base section control.
          wp.customize.control.add(
            new wp.customize.TTColorControl(settingId, settingConfig)
          );

          // Outer section controls.
          if (
            typeof settingConfig.mode !== 'undefined' &&
            'full' === settingConfig.mode
          ) {
            wp.customize.control.add(
              new wp.customize.TTPersistenceControl(settingId + '_persist', {
                type: 'persistence',
                section: `tt_theme_settings[${settingConfig.name}]_palette`
              })
            );

            wp.customize.control.add(
              new wp.customize.TTColorSwatchControl(settingId, {
                ...settingConfig,
                section: `tt_theme_settings[${settingConfig.name}]_palette`,
                title: '',
                description: '',
                mode: 'basic',
                type: 'color-swatch',
                input_attrs: {
                  height: 'auto'
                }
              })
            );
          }
          break;

        case 'color-palette':
          wp.customize.control.add(
            new wp.customize.TTColorPaletteControl(settingId, settingConfig)
          );

          paletteColorSettingKeys.forEach(settingKey => {
            // Persistence Control
            wp.customize.control.add(
              new wp.customize.TTPersistenceControl(
                `${settingId}[${settingKey}]_persist`,
                {
                  type: 'persistence',
                  section: `tt_theme_settings[${
                    settingConfig.name
                  }][${settingKey}]_palette`
                }
              )
            );

            // Swatch Control
            wp.customize.control.add(
              new wp.customize.TTColorSwatchControl(
                `${settingId}[${settingKey}]`,
                {
                  ...settingConfig,
                  section: `tt_theme_settings[${
                    settingConfig.name
                  }][${settingKey}]_palette`,
                  title: '',
                  description: '',
                  mode: 'basic',
                  defaultValue: settingConfig.default_value[settingKey],
                  type: 'color-swatch',
                  input_attrs: {
                    height: 'auto'
                  }
                }
              )
            );
          });
          break;

        case 'color-swatch':
          wp.customize.control.add(
            new wp.customize.TTColorSwatchControl(settingId, settingConfig)
          );
          break;

        case 'dropdown-pages':
          wp.customize.control.add(
            new wp.customize.TTDropdownPagesControl(settingId, settingConfig)
          );
          break;

        case 'radio':
          wp.customize.control.add(
            new wp.customize.TTRadioControl(settingId, settingConfig)
          );
          break;

        case 'searchable-select':
          wp.customize.control.add(
            new wp.customize.TTSearchableSelectControl(settingId, settingConfig)
          );
          break;

        case 'select':
          wp.customize.control.add(
            new wp.customize.TTSelectControl(settingId, settingConfig)
          );
          break;

        case 'slider':
          wp.customize.control.add(
            new wp.customize.TTSliderControl(settingId, settingConfig)
          );
          break;

        case 'text':
          wp.customize.control.add(
            new wp.customize.TTTextControl(settingId, settingConfig)
          );
          break;

        case 'textarea':
          wp.customize.control.add(
            new wp.customize.TTTextAreaControl(settingId, settingConfig)
          );
          break;

        case 'toggle':
          wp.customize.control.add(
            new wp.customize.TTToggleControl(settingId, settingConfig)
          );
          break;

        case 'background-position':
          wp.customize.control.add(
            new wp.customize.TTBackgroundPositionControl(
              settingId,
              settingConfig
            )
          );
          break;

        case 'image':
          wp.customize.control.add(
            new wp.customize.TTImageControl(settingId, settingConfig)
          );
          break;

        case 'cropped-image':
          wp.customize.control.add(
            new wp.customize.TTCroppedImageControl(settingId, settingConfig)
          );
          break;

        default:
          break;
      }
    }
  });
};

// Notes:
// - Look at line 1544 in wp-includes/theme to see how to implement in the frontend.

// TODO: Revisit Notifications.
// wp.customize.bind('ready', () => {
// for (var settingId in settings.config) {
// Notification Test on every control.
// wp.customize.control(settingKey).notifications.add(
//   new wp.customize.Notification(`${settingKey}_notification`, {
//     message: `The text is not readable on this background.`,
//     type: 'error',
//     dismissible: true
//   })
// );

// Overlay Notification Test
// wp.customize.control(settingKey).notifications.add(
//   new wp.customize.OverlayNotification(`${settingKey}_notification`, {
//     message: `The setting is: ${settingKey}`,
//     type: 'info',
//     dismissible: true
//     // loading: false
//   })
// );
// }
// });
