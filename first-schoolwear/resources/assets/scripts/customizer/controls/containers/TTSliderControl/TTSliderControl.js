import has from 'lodash.has';
import PropTypes from 'prop-types';
import React, { Component } from 'react'; // eslint-disable-line
import uuidv4 from 'uuid/v4';
import ControlDescription from '../../components/ControlDescription/ControlDescription';
import SliderInput from '../../components/SliderInput/SliderInput';
import SliderTitle from '../../components/SliderInput/SliderTitle';

class TTSliderControl extends Component {
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
          step: PropTypes.number,
          min: PropTypes.number,
          max: PropTypes.max
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
      TTSliderControl.propTypes,
      this.props,
      'prop',
      'TTSliderControl'
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
    this.props.updateSetting({
      amount: value,
      unit: this.props.control.setting.default.unit
    });
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
    this.props.updateSetting({
      amount: this.props.control.setting.default.amount,
      unit: this.props.control.setting.default.unit
    });
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
      <div className="TTSliderControl">
        <SliderTitle
          title={label}
          displayText={`${setting().amount}${setting().unit}`}
          htmlFor={this.state.controlId}
          onReset={() => this.resetSetting()}
        />
        <div
          className="customize-control-notifications-container"
          ref={this.props.setNotificationContainer}
        />
        <SliderInput
          id={this.state.controlId}
          onChange={value => this.updateSetting(value)}
          value={setting().amount}
          unit={setting().unit}
          step={has(input_attrs, 'step') ? input_attrs.step : 0.5}
          min={has(input_attrs, 'min') ? input_attrs.min : 0}
          max={has(input_attrs, 'max') ? input_attrs.max : 100}
        />
        <ControlDescription description={description} />
      </div>
    );
  }
}

export default TTSliderControl;
