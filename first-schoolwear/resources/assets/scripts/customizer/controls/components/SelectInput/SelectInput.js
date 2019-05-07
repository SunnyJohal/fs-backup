import PropTypes from 'prop-types';
import React, { Component } from 'react'; // eslint-disable-line

class SelectInput extends Component {
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
      SelectInput.propTypes,
      this.props,
      'prop',
      'SelectInput'
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

    Object.keys(choices).forEach((choice, index) => {
      options.push(
        <option key={`${id}_${index}`} value={choice}>
          {choices[choice]}
        </option>
      );
    });

    return (
      <select
        id={id}
        value={value}
        onChange={this.handleChange}
        className="SelectInput"
      >
        {options}
      </select>
    );
  }
}

export default SelectInput;
