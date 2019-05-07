import PropTypes from 'prop-types';
import React, { Component } from 'react'; // eslint-disable-line
/**
 * PaletteSwatchContainer Component
 *
 * A container <div> to wrap around palette
 * swatches.
 *
 */
class PaletteSwatchContainer extends Component {
  static propTypes = {
    children: PropTypes.node
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
      PaletteSwatchContainer.propTypes,
      this.props,
      'prop',
      'PaletteSwatchContainer'
    );
  };

  /**
   * Render Component
   *
   * Renders a parent div designed to house
   * the individual palette swatches.
   *
   * @description Outputs the html for the UI.
   *
   */
  render() {
    // Check proptypes.
    this.checkPropTypes();
    return <div className="PaletteSwatchContainer">{this.props.children}</div>;
  }
}

export default PaletteSwatchContainer;
