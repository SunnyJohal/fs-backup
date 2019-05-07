import bindAll from 'lodash.bindall';
import React from 'react'; //eslint-disable-line
import ReactDOM from 'react-dom';
import TTImageControl from '../containers/TTImageControl/TTImageControl';
const api = wp.customize;
const {
  ttCustomize: { translations, permissions }
} = window;

/**
 * Class TTImageControl
 *
 * Adds the custom control type to the
 * wp.customize window object so that
 * we can register it for the settings.
 *
 * Note: The ui view is handled using the
 *   native wp.customizeImageControl
 *   instead of react.
 *
 * @link https://reactjs.org/docs/integrating-with-other-libraries.html#embedding-react-in-a-backbone-view
 */
api.TTImageControl = api.ImageControl.extend({
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
    bindAll(control, [
      'restoreDefault',
      'removeFile',
      'openFrame',
      'select',
      'pausePlayer',
      'getSettingParamsFromConfig',
      'updateSetting',
      'setNotificationContainer'
    ]);

    // Call the parent class method.
    wp.customize.ImageControl.prototype.initialize.call(
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
    const {
      section,
      title: label,
      description,
      type,
      input_attrs,
      default_value
    } = config;

    const currentSettingVal = wp.customize(id)();

    // Get default translations for this control and merge with
    // any custom control specific translations if appropriate.
    let button_labels = translations.controls.image.button_labels;

    if (typeof input_attrs.button_labels === 'object') {
      button_labels = Object.assign(
        {},
        button_labels,
        input_attrs.button_labels
      );
    }

    // Fake an attachment model: needs all fields used by template.
    // Note that the default value must be a URL, NOT an attachment ID.
    const defaultAttachment = {
      id: 1,
      url: default_value,
      type: 'image',
      image: {},
      sizes: {
        full: {
          url: default_value
        }
      },
      title: label
    };

    const attachment = {
      id: 1,
      url: currentSettingVal,
      type: 'image',
      image: {},
      sizes: {
        full: {
          url: currentSettingVal
        }
      },
      title: label
    };

    // Construct the control props.
    const controlProps = {
      type,
      label,
      description,
      section,
      mime_type: 'image',
      capability: 'edit_theme_options',
      attachment,
      defaultAttachment,
      input_attrs,
      setting: wp.customize(id),
      canUpload: permissions.upload_files,
      button_labels
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
    control.setting.bind(() => {
      control.renderContent();
    });
  },

  /**
   * Reset Setting
   *
   * @description Resets the control back to it's
   *   default setting.
   *
   * @return {void}
   */
  resetSetting() {
    const control = this;
    control.setting.set(control.setting.default);
  },

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
  },

  /**
   * Set notification container and render.
   *
   * This is called when the React component is mounted.
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
      <TTImageControl
        control={control}
        resetSetting={control.resetSetting}
        openFrame={control.openFrame}
        removeFile={control.removeFile}
        updateSetting={control.updateSetting}
        setNotificationContainer={control.setNotificationContainer}
      />,
      domNode
    );
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
    if (wp.customize.ImageControl.prototype.destroy) {
      wp.customize.ImageControl.prototype.destroy.call(control);
    }
  }
});

wp.customize.controlConstructor.tt_image = api.TTImageControl;
