import PropTypes from 'prop-types';
import React, { Component } from 'react'; // eslint-disable-line
import uuidv4 from 'uuid/v4';
import ControlDescription from '../../components/ControlDescription/ControlDescription';
import ControlTitle from '../../components/ControlTitle/ControlTitle';
import SearchableSelectInput from '../../components/SearchableSelectInput/SearchableSelectInput';

class TTDropdownPagesControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      controlId: uuidv4()
    };
  }

  static propTypes = {
    control: PropTypes.shape({
      id: PropTypes.string.isRequired,
      setting: PropTypes.func.isRequired,
      params: PropTypes.shape({
        label: PropTypes.string,
        description: PropTypes.string,
        choices: PropTypes.object.isRequired
      })
    }).isRequired,
    resetSetting: PropTypes.func.isRequired,
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
      TTDropdownPagesControl.propTypes,
      this.props,
      'prop',
      'TTDropdownPagesControl'
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

    const {
      setting,
      params: { label, description, choices }
    } = this.props.control;

    // Bail if no choices exist.
    if (!choices) {
      return null;
    }

    return (
      <div className="TTDropdownPagesControl">
        <ControlTitle
          title={label}
          htmlFor={this.state.controlId}
          onReset={() => this.resetSetting()}
        />
        <div
          className="customize-control-notifications-container"
          ref={this.props.setNotificationContainer}
        />
        <ControlDescription description={description} />
        <SearchableSelectInput
          id={this.state.controlId}
          onChange={value => this.updateSetting(parseInt(value))}
          value={setting()}
          choices={choices}
        />
      </div>
    );
  }
}

export default TTDropdownPagesControl;
