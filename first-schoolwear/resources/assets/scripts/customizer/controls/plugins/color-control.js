import React from 'react'; //eslint-disable-line
import ReactDOM from 'react-dom';
import TTColorControl from '../containers/TTColorControl/TTColorControl';
const api = wp.customize;

/**
 * Class TTColorControl
 *
 * Adds the custom control type to the
 * wp.customize window object so that
 * we can register it for the settings.
 *
 * Note: The ui view logic is handled
 * using react.
 *
 * Note:
 * This color control does not rerender
 * when the setting model updates as it
 * impacts the performance of the color
 * picker. Instead, the change event is
 * synced manually and ReactDOM.render()
 * is only called on init.
 *
 * @link https://reactjs.org/docs/integrating-with-other-libraries.html#embedding-react-in-a-backbone-view
 */
api.TTColorControl = api.Control.extend({
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
    control.renderContent();
  },

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
      <TTColorControl
        control={control}
        resetSetting={control.resetSetting}
        updateSetting={control.updateSetting}
        setNotificationContainer={control.setNotificationContainer}
      />,
      domNode
    );

    // Add in the outer section mounted code here. I still
    // need to figure out how to make a section active/not active.
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

wp.customize.controlConstructor.tt_color = api.TTColorControl;
