import PropTypes from 'prop-types';
import React, { Component } from 'react'; // eslint-disable-line
import convertHex from '../../../../util/convertHex';

/**
 * PaletteSwatch Component
 *
 * UI component to represent a swatch for
 * the color palette control.
 *
 */
class PaletteSwatch extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string,
    textColor: PropTypes.string
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
      PaletteSwatch.propTypes,
      this.props,
      'prop',
      'PaletteSwatch'
    );
  };

  /**
   * Render Component
   *
   * Renders a single swatch div.
   *
   * @description Outputs the html for the UI.
   *
   */
  render() {
    this.checkPropTypes();

    // Render the component.
    return (
      <div
        className="PaletteSwatch"
        style={{
          backgroundColor: this.props.backgroundColor,
          color: convertHex(this.props.textColor, 87)
        }}
      >
        <span className="PaletteSwatch--label">{this.props.label}</span>
        <span
          className="PaletteSwatch--icon dashicons dashicons-editor-textcolor"
          style={{ color: convertHex(this.props.textColor, 64) }}
        />
        <span
          className="PaletteSwatch--hex"
          style={{ color: convertHex(this.props.textColor, 87) }}
        >
          {this.props.backgroundColor ? this.props.backgroundColor : '\u2026'}
        </span>
      </div>
    );
  }
}

export default PaletteSwatch;
