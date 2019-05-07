import React from 'react'; //eslint-disable-line
import ReactDOM from 'react-dom';

const api = wp.customize;
/**
 * Class TTPersistenceControl
 *
 * An empty control to keep the outer section
 * persisted when a control is being rerendered
 * in it.
 *
 * TODO: Remove dependancy when outer section
 * api is developer further in core.
 *
 * @link https://reactjs.org/docs/integrating-with-other-libraries.html#embedding-react-in-a-backbone-view
 */
api.TTPersistenceControl = api.Control.extend({
  /**
   * Initialize.
   *
   * @param {string} id - Control ID.
   * @param {object} settingConfig - Setting config object
   */
  initialize(id, settingConfig) {
    const control = this;

    // Bind functions to this control context for
    // passing as React props.
    control.getSettingParamsFromConfig = control.getSettingParamsFromConfig.bind(
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
    const { section, title, description, type, input_attrs } = config;

    // Construct the control props.
    const controlProps = {
      type,
      label: title,
      description,
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
    // Re-render control when setting changes.
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

    ReactDOM.render(<span />, domNode);
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

wp.customize.controlConstructor.tt_persistance = api.TTPersistenceControl;
