import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react'; // eslint-disable-line
const {
  wp,
  $,
  ttCustomize: {
    translations,
    data: { brand_colors }
  }
} = window;

/**
 * ColorInput Component
 *
 * A wrapper around the wpColorPicker wordpress
 * library. It checks the DOM once it is mounted
 * to instantiate the color picker.
 *
 */
class ColorInput extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    settingId: PropTypes.string.isRequired,
    defaultValue: PropTypes.string,
    value: PropTypes.string,
    showPalette: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      panelExpanded: false
    };

    this.syncPanelStateWithSection.bind(this);
  }

  /**
   * Check Prop Types
   *
   * @description Ensures that the appropriate values
   *   are passed to this component to render properly.
   *   Only used in production: it is swapped out for
   *   an empty function on the production build.
   *
   */
  checkPropTypes = () => {
    PropTypes.checkPropTypes(
      ColorInput.propTypes,
      this.props,
      'prop',
      'ColorInput'
    );
  };

  /**
   * Component Did Mount
   *
   * @description Fired when the component has been
   *   mounted to the DOM.
   *
   */
  componentDidMount() {
    const component = this;

    /**
     * Instantiate Color Picker
     *
     * Creates a new wpColorPicker instance as
     * an uncontrolled component.
     *
     */
    const { onChange, settingId } = this.props;
    component.picker = $('#' + this.props.id);

    // Create a wpColorPicker instance.
    component.picker.wpColorPicker({
      palettes: ['#000000', '#ffffff', ...brand_colors],
      change() {
        onChange(component.picker.wpColorPicker('color'));
        $('body').trigger(
          `${settingId}_change`,
          component.picker.wpColorPicker('color')
        );
      },
      clear() {
        onChange('');
        $('body').trigger(`${settingId}_change`, '');
      }
    });

    // Add class to outer section so that we can listen
    // to events
    const settingIdEscaped = settingId.replace('[', `\\[`).replace(']', `\\]`);

    $(`#sub-accordion-section-${settingIdEscaped}_palette`).addClass(
      `${component.props.id}-outer-section`
    );

    /**
     * Redefine the Close Function
     *
     * Overrides the native wpcolorpicker close
     * function to account for outer sections.
     *
     */
    const closePicker = component.picker.data('wp-wpColorPicker').close;

    component.picker.data('wp-wpColorPicker').close = function(e) {
      if (typeof e !== 'undefined') {
        // Bail if any wp/component specific ui elements
        // are triggered.
        if (
          $(e.target).hasClass('tt-color-input--palette-trigger') ||
          $(e.target).hasClass('publish-settings') ||
          $(e.target).hasClass('collapse-sidebar') ||
          $(e.target).hasClass('collapse-sidebar-arrow') ||
          $(e.target).hasClass('collapse-sidebar-label')
        ) {
          // The footer event
          return;
        }

        if (
          $.contains(
            document.getElementById(
              `sub-accordion-section-${settingId}_palette`
            ),
            e.target
          ) ||
          $(e.target).hasClass(`${component.props.id}-outer-section`)
        ) {
          return;
        }
      }

      // Otherwise call the original close function
      // and collapse the panel.
      closePicker();
      wp.customize.section(`${settingId}_palette`).collapse();
    };

    // Manual dom rerender event listener. Toggles the
    // color picker open when an extenal control changes
    // the setting linked to this control.
    $('body').on(`${settingId}_update`, (e, newValue) => {
      component.picker.wpColorPicker('color', newValue);
    });

    // Prevent the color picker from collapsing when
    // the section is expanded/collapsed.
    wp.customize.section(`${settingId}_palette`, section => {
      section.expanded.bind(component.syncPanelStateWithSection);
    });

    // Sync component state when the publish settings
    // panel is expanded.
    wp.customize.section('publish_settings', section => {
      section.expanded.bind(component.syncPanelStateWithPublishSettings);
    });
  }

  /**
   * Component Will Unmount
   *
   * Lifecycle hook is used to clean up any custom
   * event listeners attached to this component.
   *
   */
  componentWillUnmount() {
    const component = this;
    const { settingId } = component.props;

    wp.customize.section(`${settingId}_palette`, section => {
      section.expanded.unbind(component.syncPanelStateWithSection);
    });

    wp.customize.section('publish_settings', section => {
      section.expanded.unbind(component.syncPanelStateWithPublishSettings);
    });
  }

  /**
   * Sync Panel State With Section
   *
   * Sync the component state with the external
   * WordPress section api to enable/disable the
   * color palette.
   *
   */
  syncPanelStateWithSection = expanded => {
    this.setState({ panelExpanded: expanded });

    if (expanded) {
      $('body').addClass('tt-palette-section-expanded');
    } else {
      $('body').removeClass('tt-palette-section-expanded');
    }
  };

  /**
   * Sync Panel State With Publish Settings
   *
   * Sync the component state with the external
   * WordPress publish settings.
   *
   */
  syncPanelStateWithPublishSettings = expanded => {
    if (expanded) {
      this.setState({ panelExpanded: false });
      $('body').removeClass('tt-palette-section-expanded');
    }
  };

  /**
   * Handle Change Event
   *
   * Updates the controlled text input state and
   * calls any updater functions passed to the
   * component from it's parent.
   *
   */
  handleChange = event => {
    this.props.onChange(event.target.value);
  };

  /**
   * Toggle Outer Section
   *
   * Callback to expand/collapse the outer section
   * containing the color swatches.
   *
   */
  toggleOuterSection = event => {
    event.stopPropagation();
    const { settingId } = this.props;

    // Collapse the publish outer section if it
    // is open.
    wp.customize.section('publish_settings').collapse();

    // Expand/Collapse the outer section.
    if (this.state.panelExpanded) {
      wp.customize.section(`${settingId}_palette`).collapse();
    } else {
      wp.customize.section(`${settingId}_palette`).expand();
      $('body').addClass('tt-palette-section-expanded');
    }

    // Update component state.
    this.setState({ panelExpanded: !this.state.panelExpanded });
  };

  /**
   * Render Component
   *
   * The color picker is now an uncontrolled component
   * to allow users to type in a hex code.
   *
   * @description Outputs the html for the UI.
   *
   */
  render() {
    // Check proptypes.
    this.checkPropTypes();

    // Render the component.
    // const component = this;
    const { id, defaultValue, value, showPalette } = this.props;

    return (
      <div
        className={classNames({
          ColorInput: true,
          [this.props.id]: true
        })}
      >
        <input
          id={id}
          type="text"
          className="color-picker-hex"
          maxLength="7"
          data-default-color={defaultValue ? defaultValue : ''}
          defaultValue={value}
        />
        {showPalette ? (
          <button
            type="button"
            className={classNames(
              'button',
              'button-small',
              'tt-color-input--palette-trigger',
              {
                'tt-color-input--palette-expanded': this.state.panelExpanded
              }
            )}
            onClick={e => this.toggleOuterSection(e)}
          >
            {this.state.panelExpanded
              ? translations.controls.color.button_labels.close_palette
              : translations.controls.color.button_labels.open_palette}
          </button>
        ) : null}
      </div>
    );
  }
}

export default ColorInput;
