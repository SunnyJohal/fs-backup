import PropTypes from 'prop-types';
import React, { Component } from 'react'; // eslint-disable-line

class ToggleInput extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.bool,
    onText: PropTypes.string,
    offText: PropTypes.string
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
      ToggleInput.propTypes,
      this.props,
      'prop',
      'ToggleInput'
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
   * Handle Change Event
   *
   * Updates the controlled text input state and
   * calls any updater functions passed to the
   * component from it's parent.
   *
   */
  handleChange = event => {
    this.props.onChange(event.target.checked);
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
    const { id, name, value, onText, offText } = this.props;
    return (
      <div className="ToggleInput">
        <div className="mdc-switch">
          <input
            type="checkbox"
            id={id}
            className="mdc-switch__native-control"
            name={name ? name : id}
            onChange={this.handleChange}
            checked={value}
            role="switch"
          />
          <div className="mdc-switch__background">
            <div className="mdc-switch__knob" />
          </div>
          <label htmlFor={id} className="mdc-switch__label">
            {value ? onText : offText}
          </label>
        </div>
      </div>
    );
  }
}

export default ToggleInput;
