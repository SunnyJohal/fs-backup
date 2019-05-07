import PropTypes from 'prop-types';
import React, { Component } from 'react'; // eslint-disable-line
const {
  ttCustomize: { translations }
} = window;

class SliderTitle extends Component {
  // Define SliderTitle prop types.
  static propTypes = {
    title: PropTypes.string,
    displayText: PropTypes.string,
    htmlFor: PropTypes.string,
    onReset: PropTypes.func
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
      SliderTitle.propTypes,
      this.props,
      'prop',
      'SliderTitle'
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
      <div className="SliderTitle">
        <label
          className="customize-control-title"
          htmlFor={this.props.htmlFor ? this.props.htmlFor : ''}
        >
          {this.props.title}
        </label>
        {this.props.onReset && (
          <div className="tt-customize-control-reset">
            {this.props.displayText && (
              <span>
                <span className="SliderTitle--display">
                  {this.props.displayText}
                </span>
                <span className="SliderTitle--separator">|</span>
              </span>
            )}
            <a onClick={this.props.onReset}>
              {translations.controls.common.reset_label}
            </a>
          </div>
        )}
      </div>
    ) : null;
  }
}

export default SliderTitle;
