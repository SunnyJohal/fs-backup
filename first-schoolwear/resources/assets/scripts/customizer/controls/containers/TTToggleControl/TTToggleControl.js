import has from 'lodash.has';
import PropTypes from 'prop-types';
import React, { Component } from 'react'; // eslint-disable-line
import uuidv4 from 'uuid/v4';
import ControlDescription from '../../components/ControlDescription/ControlDescription';
import ControlTitle from '../../components/ControlTitle/ControlTitle';
import ToggleInput from '../../components/ToggleInput/ToggleInput';
const {
  ttCustomize: { translations }
} = window;

class TTToggleControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      controlId: uuidv4()
    };
  }

  // Define prop types.
  static propTypes = {
    control: PropTypes.shape({
      id: PropTypes.string.isRequired,
      setting: PropTypes.func.isRequired,
      params: PropTypes.shape({
        label: PropTypes.string,
        description: PropTypes.string,
        input_attrs: PropTypes.shape({
          state_labels: PropTypes.shape({
            on: PropTypes.string,
            off: PropTypes.string
          })
        })
      })
    }).isRequired,
    resetSetting: PropTypes.func.isRequired,
    updateSetting: PropTypes.func.isRequired,
    setNotificationContainer: PropTypes.func.isRequired
  };

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
      TTToggleControl.propTypes,
      this.props,
      'prop',
      'TTToggleControl'
    );
  };

  /**
   * Update Setting
   *
   * @description Triggers the updateSetting() callback in
   *   the custom control type.
   *
   */
  updateSetting = value => {
    this.props.updateSetting(value);
  };

  /**
   * Reset Setting Callback
   *
   * @description Calls the updateSetting() callback in the
   *   custom control type class to revert the control
   *   back to the default.
   *
   */
  resetSetting = () => {
    this.props.updateSetting(this.props.control.setting.default);
  };

  /**
   * Render Component
   *
   * @description Outputs the html for the UI.
   *
   */
  render() {
    // Make sure props are passed down.
    this.checkPropTypes();

    const {
      setting,
      params: { label, description, input_attrs }
    } = this.props.control;

    return (
      <div className="TTToggleControl">
        <ControlTitle
          title={label}
          htmlFor={this.state.controlId}
          onReset={() => this.resetSetting()}
        />
        <div
          className="customize-control-notifications-container"
          ref={this.props.setNotificationContainer}
        />
        <ToggleInput
          id={this.state.controlId}
          onChange={value => this.updateSetting(value)}
          value={setting()}
          onText={
            has(input_attrs, 'state_labels.on')
              ? input_attrs.state_labels.on
              : translations.controls.toggle.state_labels.on
          }
          offText={
            has(input_attrs, 'state_labels.off')
              ? input_attrs.state_labels.off
              : translations.controls.toggle.state_labels.off
          }
        />
        <div className="clear-both" />
        <ControlDescription description={description} />
      </div>
    );
  }
}

export default TTToggleControl;
