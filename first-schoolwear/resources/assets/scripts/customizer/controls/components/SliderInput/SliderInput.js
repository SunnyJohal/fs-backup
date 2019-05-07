import PropTypes from 'prop-types';
import Slider, { Handle } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import React, { Component } from 'react'; // eslint-disable-line

class SliderInput extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    step: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    unit: PropTypes.string
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
      SliderInput.propTypes,
      this.props,
      'prop',
      'SliderInput'
    );
  };

  /**
   * Component Did Update
   *
   * @description Fired after the state has changed
   *   for this component.
   *
   */
  componentDidUpdate() {}

  /**
   * Get Custom Handle
   *
   * @description Gets a custom handle for the slider
   *   that shows a tooltip on drag.
   *
   */
  getCustomHandle = sliderProps => {
    const { value, dragging, index, ...restProps } = sliderProps;
    return (
      <Tooltip
        prefixCls="rc-slider-tooltip"
        overlay={`${value} ${this.props.unit}`}
        visible={dragging}
        placement="top"
        key={index}
      >
        <Handle value={value} {...restProps} />
      </Tooltip>
    );
  };

  /**
   * Handle Change Event
   *
   * Updates the controlled text input state and
   * calls any updater functions passed to the
   * component from it's parent.
   *
   */
  handleChange = amount => {
    this.props.onChange(amount);
  };

  /**
   * Render Component
   *
   * @description Outputs the html for the UI.
   *
   */
  render() {
    // Check proptypes.
    this.checkPropTypes();

    // Render the component.
    const { value, step, min, max } = this.props;
    return (
      <div className="SliderInput">
        <Slider
          railStyle={{ backgroundColor: '#dddddd' }}
          handleStyle={{
            backgroundColor: '#0085ba',
            borderColor: '#0085ba'
          }}
          trackStyle={{ backgroundColor: 'rgba(2,133,186,.5)' }}
          onChange={this.handleChange}
          handle={this.getCustomHandle}
          value={value || 0}
          step={step}
          min={min}
          max={max}
        />
      </div>
    );
  }
}

export default SliderInput;
// has(input_attrs, 'state_labels.on')
