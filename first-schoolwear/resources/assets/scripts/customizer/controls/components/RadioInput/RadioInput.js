import PropTypes from 'prop-types';
import React, { Component } from 'react'; // eslint-disable-line

class RadioInput extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    choices: PropTypes.object.isRequired
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
      RadioInput.propTypes,
      this.props,
      'prop',
      'RadioInput'
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
  handleChange = event => {
    this.props.onChange(event.target.value);
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
    const { id, value, choices } = this.props;
    let options = [];
    // let currentKey = 1;

    Object.keys(choices).forEach((choice, index) => {
      options.push(
        <span className="customize-inside-control-row" key={`${id}_${index}`}>
          <input
            id={`${id}_choice_${index}`}
            type="radio"
            value={choice}
            name={`${id}_choice`}
            onChange={this.handleChange}
            checked={choice === value}
          />
          <label htmlFor={`${id}_choice_${index}`}>{choices[choice]}</label>
        </span>
      );
      // currentKey++;
    });

    return <div className="RadioInput">{options}</div>;
  }
}

export default RadioInput;
