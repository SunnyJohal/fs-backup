/**
 * Register Settings
 *
 * Registers the static settings we have defined
 * solely in the customizer and the setting is
 * dynamically saved upon submission.
 *
 * wp.customize.Setting() represents the Model in
 * the customizer.
 *
 * @see \App\get_theme_settings_configuration()
 *
 * @return void
 *
 * @since 1.0.0
 * @version 1.0.0
 */
// Example code.
const {
  ttCustomize: { settings }
} = window;

export const registerSettings = () => {
  // Loop through each setting and register.
  wp.customize.bind('ready', () => {
    /**
     * Register Base Settings.
     */
    for (const settingId in settings.config) {
      // Settings are saved in the database as a single array.
      const settingKey = `${settings.setting_key}[${settingId}]`;

      // Get the setting props and current value.
      const { default_value, transport } = settings.config[settingId];
      const value = settings.saved[settingId];

      // Create a new setting using the api.
      const setting = new wp.customize.Setting(settingKey, value, {
        transport,
        default: default_value,
        type: 'theme_mod'
      });

      // Register the setting with the customizer.
      wp.customize.add(setting);
    }

    /**
     * Register Color Palette Specific Settings.
     */
    for (const settingId in settings.config) {
      if (settings.config[settingId].type === 'color-palette') {
        const settingKeys = [
          'base',
          'light',
          'dark',
          'base_text_color',
          'light_text_color',
          'dark_text_color',
          'theme_assist'
        ];

        // Get the setting props and current value.
        const { default_value, transport } = settings.config[settingId];
        const value = settings.saved[settingId];

        settingKeys.forEach(key => {
          // Settings are saved in the database as a multidimensional array.
          const settingKey = `${settings.setting_key}[${settingId}][${key}]`;

          // Create a new setting using the api.
          const setting = new wp.customize.Setting(settingKey, value[key], {
            transport,
            default: default_value[key],
            type: 'theme_mod'
          });

          // Register the setting with the customizer.
          wp.customize.add(setting);
        });
      }
    }
  });
};
