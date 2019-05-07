import PropTypes from 'prop-types';
import React, { Component } from 'react'; // eslint-disable-line

class ImageInput extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    openFrame: PropTypes.func.isRequired,
    removeFile: PropTypes.func.isRequired,
    value: PropTypes.string,
    reset: PropTypes.func,
    labels: PropTypes.shape({
      change: PropTypes.string.isRequired,
      default: PropTypes.string.isRequired,
      frame_button: PropTypes.string.isRequired,
      frame_title: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      remove: PropTypes.string.isRequired,
      select: PropTypes.string.isRequired
    })
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
      ImageInput.propTypes,
      this.props,
      'prop',
      'ImageInput'
    );
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

    const { labels, openFrame, removeFile, reset, value } = this.props;

    // Render the component.
    return value ? (
      <div className="attachment-media-view attachment-media-view-image">
        <div className="thumbnail thumbnail-image">
          <img src={value} />
        </div>
        <div className="actions">
          <button
            type="button"
            className="button remove-button"
            onClick={removeFile}
          >
            {labels.remove}
          </button>
          <button
            type="button"
            className="button upload-button"
            onClick={openFrame}
          >
            {labels.change}
          </button>
        </div>
      </div>
    ) : (
      <div className="attachment-media-view">
        <div className="placeholder">{labels.placeholder}</div>
        <div className="actions">
          {reset ? (
            <button
              type="button"
              className="button default-button"
              onClick={reset}
            >
              {labels.default}
            </button>
          ) : null}
          <button
            type="button"
            className="button upload-button"
            onClick={openFrame}
          >
            {labels.select}
          </button>
        </div>
      </div>
    );
  }
}

export default ImageInput;
