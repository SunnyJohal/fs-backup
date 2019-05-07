/**
 * Register Outer Sections
 *
 * Registers any control specific outer
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
  wp,
  ttCustomize: { settings, translations }
} = window;

/**
 * Register Outer Sections
 *
 * @description Registers any outer sections with the
 *   customizer. The ui to expand/collapse these
 *   sections need to be handled manually.
 *
 */
export const registerOuterSections = () => {
  const paletteColorSettingKeys = [
    'base',
    'light',
    'dark',
    'base_text_color',
    'light_text_color',
    'dark_text_color'
  ];

  wp.customize.bind('ready', () => {
    // Control Specific Outer Sections:
    // Loop through the settings and register the
    // required outer sections.
    for (let setting in settings.config) {
      const settingId = `${settings.setting_key}[${setting}]`;
      const settingConfig = settings.config[setting];
      const { type, title } = settingConfig;

      // Find any sections to register
      switch (type) {
        case 'color':
          wp.customize.section.add(
            new wp.customize.OuterSection(`${settingId}_palette`, {
              customizeAction: title,
              title: translations.controls.common.palette_label
            })
          );
          break;

        case 'color-palette':
          paletteColorSettingKeys.forEach(settingKey => {
            wp.customize.section.add(
              new wp.customize.OuterSection(
                `${settingId}[${settingKey}]_palette`,
                {
                  customizeAction: title,
                  title: translations.controls.common.palette_label
                }
              )
            );
          });

          // wp.customize.section.add(
          //   new wp.customize.OuterSection(`${settingId}[base]_palette`, {
          //     customizeAction: title,
          //     title: translations.controls.common.palette_label
          //   })
          // );

          // wp.customize.section.add(
          //   new wp.customize.OuterSection(
          //     `${settingId}[base_text_color]_palette`,
          //     {
          //       customizeAction: title,
          //       title: translations.controls.common.palette_label
          //     }
          //   )
          // );
          break;
      }
    }
  });
};
