import PropTypes from 'prop-types';
import React, { Component } from 'react'; // eslint-disable-line
const {
  ttCustomize: {
    translations: {
      controls: {
        background_position: { position_labels }
      }
    }
  }
} = window;

class BackgroundPositionInput extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    posX: PropTypes.string,
    posY: PropTypes.string
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
      BackgroundPositionInput.propTypes,
      this.props,
      'prop',
      'BackgroundPositionInput'
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
    const position = event.target.value.split(' ');
    this.props.onChange({
      background_position_x: position[0],
      background_position_y: position[1]
    });
  };

  /**
   * Get Background Position Choices
   *
   * @description Returns a json obj containing the
   *  available background positions with their
   *  label and icon properties.
   *
   */
  getBackgroundPositionChoices = () => {
    const {
      center_bottom,
      center_center,
      center_top,
      left_bottom,
      left_center,
      left_top,
      right_bottom,
      right_center,
      right_top
    } = position_labels;

    return {
      'left top': {
        label: left_top,
        icon: 'dashicons dashicons-arrow-left-alt'
      },
      'center top': {
        label: center_top,
        icon: 'dashicons dashicons-arrow-up-alt'
      },
      'right top': {
        label: right_top,
        icon: 'dashicons dashicons-arrow-right-alt'
      },
      'left center': {
        label: left_center,
        icon: 'dashicons dashicons-arrow-left-alt'
      },
      'center center': {
        label: center_center,
        icon: 'background-position-center-icon'
      },
      'right center': {
        label: right_center,
        icon: 'dashicons dashicons-arrow-right-alt'
      },
      'left bottom': {
        label: left_bottom,
        icon: 'dashicons dashicons-arrow-left-alt'
      },
      'center bottom': {
        label: center_bottom,
        icon: 'dashicons dashicons-arrow-down-alt'
      },
      'right bottom': {
        label: right_bottom,
        icon: 'dashicons dashicons-arrow-right-alt'
      }
    };
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
    const { id, posX, posY } = this.props;
    const currentPos = `${posX} ${posY}`;
    const choices = this.getBackgroundPositionChoices();
    let options = [];

    Object.keys(choices).forEach((choice, index) => {
      options.push(
        <label htmlFor={`${id}_choice_${index}`} key={`${id}_${index}`}>
          <input
            id={`${id}_choice_${index}`}
            className="screen-reader-text"
            type="radio"
            value={choice}
            name={`${id}_choice`}
            onChange={this.handleChange}
            checked={choice === currentPos}
          />
          <span className="button display-options position">
            <span className={choices[choice].icon} />
            <span className="screen-reader-text">{choices[choice].label}</span>
          </span>
        </label>
      );
    });

    return (
      <div className="BackgroundPositionInput">
        <div className="background-position-control">
          <div className="button-group">
            {options[0]}
            {options[1]}
            {options[2]}
          </div>
          <div className="button-group">
            {options[3]}
            {options[4]}
            {options[5]}
          </div>
          <div className="button-group">
            {options[6]}
            {options[7]}
            {options[8]}
          </div>
        </div>
      </div>
    );
  }
}

export default BackgroundPositionInput;
