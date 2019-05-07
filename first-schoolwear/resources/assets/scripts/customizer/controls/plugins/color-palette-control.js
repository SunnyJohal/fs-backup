import throttle from 'lodash.throttle';
import React from 'react'; //eslint-disable-line
import ReactDOM from 'react-dom';
import TTColorPaletteControl from '../containers/TTColorPaletteControl/TTColorPaletteControl';
const api = wp.customize;

/**
 * Class TTColorPaletteControl
 *
 * Adds the custom control type to the
 * wp.customize window object so that
 * we can register it for the settings.
 *
 * Note: The ui view logic is handled
 * using react.
 *
 * @link https://reactjs.org/docs/integrating-with-other-libraries.html#embedding-react-in-a-backbone-view
 */
api.TTColorPaletteControl = api.Control.extend({
  /**
   * Initialize.
   *
   * @param {string} id - Control ID.
   * @param {object} settingConfig - Setting config object
   */
  initialize(id, settingConfig) {
    const control = this;

    // Bind functions to this control context to
    // pass as React props.
    control.getSettingParamsFromConfig = control.getSettingParamsFromConfig.bind(
      control
    );
    control.updateSetting = control.updateSetting.bind(control);
    control.updateSettingProps = control.updateSettingProps.bind(control);
    control.setNotificationContainer = control.setNotificationContainer.bind(
      control
    );

    // Call the parent class method.
    wp.customize.Control.prototype.initialize.call(
      control,
      id,
      control.getSettingParamsFromConfig(id, settingConfig)
    );

    // The following should be eliminated with
    // <https://core.trac.wordpress.org/ticket/31334>.
    function onRemoved(removedControl) {
      if (control === removedControl) {
        control.destroy();
        control.container.remove();
        wp.customize.control.unbind('removed', onRemoved);
      }
    }
    wp.customize.control.bind('removed', onRemoved);
  },

  /**
   * Get Setting Props From Config
   *
   * @description Takes the json enqueued on the page
   *   for this control and returns the params obj
   *   used to construct a new control instance.
   *
   * @param {object} config Settings config object
   */
  getSettingParamsFromConfig(id, config) {
    // Get the props for this setting.
    const { section, title, description, type, input_attrs, mode } = config;

    const controlProps = {
      type,
      label: title,
      description,
      mode,
      section,
      capability: 'edit_theme_options',
      setting: wp.customize(id),
      input_attrs
    };

    return controlProps;
  },

  /**
   * Control Ready Event
   *
   * @description Fired after control has been first
   *   rendered, start re-rendering when setting
   *   changes. React is able to be used here instead
   *   of the wp.customize.Element abstraction.
   *
   * @return {void}
   */
  ready() {
    const control = this;
    const controlId = control.id;
    const settingKeys = [
      'base',
      'light',
      'dark',
      'base_text_color',
      'light_text_color',
      'dark_text_color'
    ];

    // Render the initial control content.
    control.renderContent();

    // Sync the subsettings when the main control
    // is updated.
    control.setting.bind(() => {
      settingKeys.forEach(key => {
        wp.customize(`${controlId}[${key}]`).set(control.setting()[key]);
      });
    });
  },

  /**
   * Throttle Render Content
   *
   * @description Wrapper around renderContent() but
   *   throttles the function call so that it doesn't
   *   affect performance in the customizer for
   *   linked controls.
   *
   * @return {void}
   */
  throttleRenderContent: throttle(control => {
    control.renderContent();
  }, 1000),

  /**
   * Render Content
   *
   * @description Renders a React component in the
   *   controls DOM node using ReactDOM.render().
   *   The react component is now responsible for
   *   handling the ui state.
   *
   * @return {void}
   */
  renderContent() {
    const control = this;
    const domNode = control.container[0];

    ReactDOM.render(
      <TTColorPaletteControl
        control={control}
        resetSetting={control.resetSetting}
        updateSetting={control.updateSetting}
        updateSettingProps={control.updateSettingProps}
        setNotificationContainer={control.setNotificationContainer}
      />,
      domNode
    );
  },

  /**
   * Reset Setting
   *
   * @description WP Color Picker handles the reset
   *   functionality for this control. This is here
   *   in the event that we swap out the color picker
   *   in the future.
   *
   */
  resetSetting() {},

  /**
   * Update Setting
   *
   * @description Update setting with new props. This
   *   will trigger the React component to update.
   *
   *
   * @param {object} props - New props to set in the setting (model).
   * @return {void}
   */
  updateSetting(value) {
    const control = this;
    control.setting.set(value);
    control.renderContent();
  },

  /**
   * Update Setting Prop
   *
   * @description Similar to update setting but used to
   *   update part of the setting. Useful for settings
   *   with multi-dimensional values.
   *
   *
   * @param {object} props - Object with a key value pair of the
   *                         setting prop that you want to update.
   * @return {void}
   */
  updateSettingProps(props) {
    const control = this;
    control.setting.set({
      ...control.setting(),
      ...props
    });
    control.renderContent();
  },

  /**
   * Set notification container and render.
   *
   * @description This is called when the React component
   *   is mounted.
   *
   * @param {Element} element - Notification container.
   * @return {void}
   */
  setNotificationContainer(element) {
    const control = this;
    control.notifications.container = jQuery(element);
    control.notifications.render();
  },

  /**
   * Destroy Control
   *
   * @description Handle removal/de-registration of
   *   the control. This is essentially the inverse
   *   of the Control#embed() method.
   *
   * @link https://core.trac.wordpress.org/ticket/31334
   *
   * @return {void}
   */
  destroy() {
    const control = this;
    const domNode = control.container[0];

    // Garbage collection: undo mounting that was done in
    // the embed/renderContent method.
    ReactDOM.unmountComponentAtNode(domNode);

    // Call destroy method in parent if it exists (as of #31334).
    if (wp.customize.Control.prototype.destroy) {
      wp.customize.Control.prototype.destroy.call(control);
    }
  }
});

wp.customize.controlConstructor.tt_color_palette = api.TTColorPaletteControl;
