import PropTypes from 'prop-types';
import React, { Component } from 'react'; // eslint-disable-line
import uuidv4 from 'uuid/v4';
import ColorInput from '../../components/ColorInput/ColorInput';
import ControlDescription from '../../components/ControlDescription/ControlDescription';
import ControlTitle from '../../components/ControlTitle/ControlTitle';

class TTColorControl extends Component {
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
        mode: PropTypes.string
      }).isRequired,
      resetSetting: PropTypes.func.isRequired,
      updateSetting: PropTypes.func.isRequired,
      setNotificationContainer: PropTypes.func.isRequired
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
      TTColorControl.propTypes,
      this.props,
      'prop',
      'TTColorControl'
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
   * Render Component
   *
   * @description Outputs the html for the UI.
   *
   */
  render() {
    // Make sure props are passed down.
    this.checkPropTypes();

    const {
      id,
      setting,
      params: { label, description, mode }
    } = this.props.control;

    return (
      <div className="TTColorControl">
        <ControlTitle title={label} htmlFor={this.state.controlId} />
        <div
          className="customize-control-notifications-container"
          ref={this.props.setNotificationContainer}
        />
        <ControlDescription description={description} />
        <ColorInput
          id={this.state.controlId}
          setting={setting}
          settingId={id}
          onChange={value => this.updateSetting(value)}
          defaultValue={setting.default}
          value={setting()}
          showPalette={mode === 'full'}
        />
      </div>
    );
  }
}

export default TTColorControl;
