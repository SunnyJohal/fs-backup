/**
 * Register Customizer Sections
 *
 * Registers the sections in the customizer
 * and defines which panel it should be
 * displayed in. Sections can have multiple
 * controls within it.
 *
 * Note: Controls that register an outer section
 * manage it themselves in the related control
 * file in the customizer/controls/plugins folder.
 *
 * {@link https://developer.wordpress.org/themes/customize-api/customizer-objects/#sections}
 *
 * @uses window.ttCustomize
 *
 * @since 1.0.0
 * @version 1.0.0
 */
const {
  ttCustomize: { sections }
} = window;

export const registerSections = () => {
  // Loop through each section and register.
  wp.customize.bind('ready', () => {
    for (const sectionId in sections) {
      const {
        title,
        panel,
        description,
        redirect_url,
        customize_action
      } = sections[sectionId];

      // Register a new section.
      const section = new wp.customize.Section(sectionId, {
        customizeAction: customize_action,
        title,
        description,
        panel
      });

      wp.customize.section.add(section);

      // Add customizer redirect on section if applicable.
      if (redirect_url) {
        wp.customize.section(sectionId, section => {
          section.expanded.bind(isExpanded => {
            if (isExpanded) {
              wp.customize.previewer.previewUrl.set(redirect_url);
            }
          });
        });
      }
    }
  });
};
