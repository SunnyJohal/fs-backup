import PropTypes from 'prop-types';
import React, { Component } from 'react'; // eslint-disable-line

class TextAreaInput extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string
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
      TextAreaInput.propTypes,
      this.props,
      'prop',
      'TextAreaInput'
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
    const { id, name, value } = this.props;
    return (
      <textarea
        name={name ? name : id}
        id={id}
        rows="5"
        onChange={this.handleChange}
        value={value}
      />
    );
  }
}

export default TextAreaInput;
