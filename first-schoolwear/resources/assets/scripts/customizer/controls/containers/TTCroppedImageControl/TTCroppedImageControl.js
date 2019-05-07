import PropTypes from 'prop-types';
import React, { Component } from 'react'; // eslint-disable-line
import uuidv4 from 'uuid/v4';
import ControlDescription from '../../components/ControlDescription/ControlDescription';
import CroppedImageInput from '../../components/CroppedImageInput/CroppedImageInput';
import CroppedImageTitle from '../../components/CroppedImageInput/CroppedImageTitle';

class TTImageControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      controlId: uuidv4()
    };
  }

  // Define prop types.
  static propTypes = {
    control: PropTypes.shape({
      id: PropTypes.string.isRequired,
      setting: PropTypes.func.isRequired,
      params: PropTypes.shape({
        label: PropTypes.string,
        description: PropTypes.string,
        input_attrs: PropTypes.shape({
          button_labels: PropTypes.shape({
            change: PropTypes.string,
            default: PropTypes.string,
            frame_button: PropTypes.string,
            frame_title: PropTypes.string,
            placeholder: PropTypes.string,
            remove: PropTypes.string,
            select: PropTypes.string
          })
        }).isRequired
      })
    }).isRequired,
    resetSetting: PropTypes.func.isRequired,
    openFrame: PropTypes.func.isRequired,
    removeFile: PropTypes.func.isRequired,
    updateSetting: PropTypes.func.isRequired,
    setNotificationContainer: PropTypes.func.isRequired
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
      TTImageControl.propTypes,
      this.props,
      'prop',
      'TTImageControl'
    );
  };

  /**
   * Update Setting
   *
   * @description Triggers the updateSetting() callback in
   *   the custom control type.
   *
   */
  updateSetting = value => {
    this.props.updateSetting(value);
  };

  /**
   * Reset Setting Callback
   *
   * @description Calls the updateSetting() callback in the
   *   custom control type class to revert the control
   *   back to the default.
   *
   */
  resetSetting = () => {
    this.props.updateSetting(this.props.control.setting.default);
  };

  /**
   * Render Component
   *
   * @description Outputs the html for the UI.
   *
   */
  render() {
    // Make sure props are passed down.
    this.checkPropTypes();

    const { openFrame, removeFile } = this.props;

    const {
      setting,
      params: {
        label,
        description,
        input_attrs: { button_labels }
      }
    } = this.props.control;

    return (
      <div className="TTImageControl">
        <CroppedImageTitle
          title={label}
          htmlFor={this.state.controlId}
          onClick={this.props.openFrame}
        />
        <div
          className="customize-control-notifications-container"
          ref={this.props.setNotificationContainer}
        />
        <ControlDescription description={description} />
        <CroppedImageInput
          id={this.state.controlId}
          labels={button_labels}
          openFrame={openFrame}
          removeFile={removeFile}
          reset={this.resetSetting}
          value={setting()}
        />
      </div>
    );
  }
}

export default TTImageControl;
