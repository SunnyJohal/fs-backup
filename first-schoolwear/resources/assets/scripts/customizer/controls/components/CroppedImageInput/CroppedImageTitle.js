import PropTypes from 'prop-types';
import React, { Component } from 'react'; // eslint-disable-line

class CroppedImageTitle extends Component {
  // Define CroppedImageTitle prop types.
  static propTypes = {
    title: PropTypes.string,
    displayText: PropTypes.string,
    htmlFor: PropTypes.string,
    onClick: PropTypes.func.isRequired
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
      CroppedImageTitle.propTypes,
      this.props,
      'prop',
      'CroppedImageTitle'
    );
  };

  /**
   * Render Component
   *
   * @description Outputs the html for the UI.
   *
   */
  render() {
    this.checkPropTypes();

    return this.props.title ? (
      <div className="CroppedImageTitle">
        <label
          className="customize-control-title"
          htmlFor={this.props.htmlFor ? this.props.htmlFor : ''}
          onClick={this.props.onClick}
        >
          {this.props.title}
        </label>
      </div>
    ) : null;
  }
}

export default CroppedImageTitle;
