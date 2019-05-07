/**
 * Register Customizer Panels
 *
 * Registers defined panels to use in the
 * customizer for this theme using the js
 * api.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
const {
  ttCustomize: { panels }
} = window;

export const registerPanels = () => {
  // Loop through each panel and register.
  wp.customize.bind('ready', () => {
    for (const panelId in panels) {
      const { capability, description, priority, title, transport } = panels[
        panelId
      ];

      const panel = new wp.customize.Panel(panelId, {
        capability,
        description,
        priority,
        title,
        transport
      });

      wp.customize.panel.add(panel);
    }
  });
};
