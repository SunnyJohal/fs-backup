import chroma from 'chroma-js';
import has from 'lodash.has';
import PropTypes from 'prop-types';
import React, { Component } from 'react'; // eslint-disable-line
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import uuidv4 from 'uuid/v4';
import ColorInput from '../../components/ColorInput/ColorInput';
import ControlDescription from '../../components/ControlDescription/ControlDescription';
import ControlTitle from '../../components/ControlTitle/ControlTitle';
import PaletteSwatch from '../../components/PaletteSwatch/PaletteSwatch';
import PaletteSwatchContainer from '../../components/PaletteSwatch/PaletteSwatchContainer';
import ToggleInput from '../../components/ToggleInput/ToggleInput';

const {
  ttCustomize: { translations }
} = window;

class TTColorPaletteControl extends Component {
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
      updateSettingProps: PropTypes.func.isRequired,
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
      TTColorPaletteControl.propTypes,
      this.props,
      'prop',
      'TTColorPaletteControl'
    );
  };

  /**
   * Update Setting
   *
   * @description Takes an object with the setting
   *   props to update. This is then merged with
   *   the exisiting settings.
   *
   */
  updateSetting = settings => {
    this.props.updateSettingProps(settings);
  };

  /**
   * Update Setting with Theme Assist
   *
   * @description Takes the base hex color as the value
   *   and dynamically calculates accent colors and
   *   text colors using googles material guidelines.
   *
   */

  updateSettingWithThemeAssist = value => {
    // Bail if theme assist is disabled.
    if (!this.props.control.setting().theme_assist) {
      return;
    }

    const setting = {
      base: value,
      light: chroma(value)
        .brighten()
        .hex(),
      dark: chroma(value)
        .darken()
        .hex()
    };

    // Calculate text colors.
    setting.base_text_color =
      chroma.contrast(setting.base, 'white') >
      chroma.contrast(setting.base, 'black')
        ? '#ffffff'
        : '#000000';
    setting.light_text_color =
      chroma.contrast(setting.light, 'white') >
      chroma.contrast(setting.light, 'black')
        ? '#ffffff'
        : '#000000';
    setting.dark_text_color =
      chroma.contrast(setting.dark, 'white') >
      chroma.contrast(setting.dark, 'black')
        ? '#ffffff'
        : '#000000';

    this.props.updateSettingProps(setting);
  };

  /**
   * Toggle Theme Assist
   *
   * @description Toggles the theme assist feature for
   *   this component.
   *
   */
  toggleThemeAssist = value => {
    this.props.updateSettingProps({ theme_assist: value });
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
      id,
      setting,
      params: { label, description, input_attrs }
    } = this.props.control;

    return (
      <div className="TTColorPaletteControl">
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

        {/* Theme Assist Switch */}
        <ToggleInput
          id={`${this.state.controlId}_theme_assist`}
          settingId={`${id}[theme_assist]`}
          value={setting().theme_assist}
          onChange={value => this.toggleThemeAssist(value)}
          onText={
            has(input_attrs, 'labels.theme_assist_labels.on')
              ? input_attrs.labels.theme_assist_labels.on
              : translations.controls.color_palette.theme_assist_labels.on
          }
          offText={
            has(input_attrs, 'labels.theme_assist_labels.off')
              ? input_attrs.labels.theme_assist_labels.off
              : translations.controls.color_palette.theme_assist_labels.off
          }
        />
        <div style={{ marginBottom: 20 }} />

        {/* Visual Feedback Palette */}
        <PaletteSwatchContainer>
          <PaletteSwatch
            label={
              has(input_attrs, 'labels.swatch_labels.light')
                ? input_attrs.labels.swatch_labels.light
                : translations.controls.color_palette.swatch_labels.light
            }
            backgroundColor={setting().light}
            textColor={setting().light_text_color}
          />
          <PaletteSwatch
            label={
              has(input_attrs, 'labels.swatch_labels.base')
                ? input_attrs.labels.swatch_labels.base
                : translations.controls.color_palette.swatch_labels.base
            }
            backgroundColor={setting().base}
            textColor={setting().base_text_color}
          />
          <PaletteSwatch
            label={
              has(input_attrs, 'labels.swatch_labels.dark')
                ? input_attrs.labels.swatch_labels.dark
                : translations.controls.color_palette.swatch_labels.dark
            }
            backgroundColor={setting().dark}
            textColor={setting().dark_text_color}
          />
        </PaletteSwatchContainer>

        {this.props.control.setting().theme_assist ? (
          <ColorInput
            id={`${this.state.controlId}_base`}
            settingId={`${id}[base]`}
            onChange={value => this.updateSettingWithThemeAssist(value)}
            defaultValue={setting.default.base}
            value={setting().base}
            showPalette={true}
          />
        ) : (
          <Tabs>
            <TabList>
              <Tab>
                {has(input_attrs, 'labels.swatch_labels.light')
                  ? input_attrs.labels.swatch_labels.light
                  : translations.controls.color_palette.swatch_labels.light}
              </Tab>
              <Tab>
                {has(input_attrs, 'labels.swatch_labels.base')
                  ? input_attrs.labels.swatch_labels.base
                  : translations.controls.color_palette.swatch_labels.base}
              </Tab>
              <Tab>
                {has(input_attrs, 'labels.swatch_labels.dark')
                  ? input_attrs.labels.swatch_labels.dark
                  : translations.controls.color_palette.swatch_labels.dark}
              </Tab>
            </TabList>

            {/* Light */}
            <TabPanel>
              <ControlTitle
                title={
                  has(input_attrs, 'labels.control_labels.light')
                    ? input_attrs.labels.control_labels.light
                    : translations.controls.color_palette.control_labels.light
                }
              />
              <ColorInput
                id={`${this.state.controlId}_light`}
                settingId={`${id}[light]`}
                onChange={value => this.updateSetting({ light: value })}
                defaultValue={setting.default.light}
                value={setting().light}
                showPalette={true}
              />
              <ControlTitle
                title={
                  has(input_attrs, 'labels.control_labels.light_text_color')
                    ? input_attrs.labels.control_labels.light_text_color
                    : translations.controls.color_palette.control_labels
                        .light_text_color
                }
              />
              <ColorInput
                id={`${this.state.controlId}_light_text_color`}
                settingId={`${id}[light_text_color]`}
                onChange={value =>
                  this.updateSetting({ light_text_color: value })
                }
                defaultValue={setting.default.light_text_color}
                value={setting().light_text_color}
                showPalette={true}
              />
            </TabPanel>

            {/* Base */}
            <TabPanel>
              <ControlTitle
                title={
                  has(input_attrs, 'labels.control_labels.base')
                    ? input_attrs.labels.control_labels.base
                    : translations.controls.color_palette.control_labels.base
                }
              />
              <ColorInput
                id={`${this.state.controlId}_base`}
                settingId={`${id}[base]`}
                onChange={value => this.updateSetting({ base: value })}
                defaultValue={setting.default.base}
                value={setting().base}
                showPalette={true}
              />
              <ControlTitle
                title={
                  has(input_attrs, 'labels.control_labels.base_text_color')
                    ? input_attrs.labels.control_labels.base_text_color
                    : translations.controls.color_palette.control_labels
                        .base_text_color
                }
              />
              <ColorInput
                id={`${this.state.controlId}_base_text_color`}
                settingId={`${id}[base_text_color]`}
                onChange={value =>
                  this.updateSetting({ base_text_color: value })
                }
                defaultValue={setting.default.base_text_color}
                value={setting().base_text_color}
                showPalette={true}
              />
            </TabPanel>

            {/* Dark */}
            <TabPanel>
              <ControlTitle
                title={
                  has(input_attrs, 'labels.control_labels.dark')
                    ? input_attrs.labels.control_labels.dark
                    : translations.controls.color_palette.control_labels.dark
                }
              />
              <ColorInput
                id={`${this.state.controlId}_dark`}
                settingId={`${id}[dark]`}
                onChange={value => this.updateSetting({ dark: value })}
                defaultValue={setting.default.dark}
                value={setting().dark}
                showPalette={true}
              />
              <ControlTitle
                title={
                  has(input_attrs, 'labels.control_labels.dark_text_color')
                    ? input_attrs.labels.control_labels.dark_text_color
                    : translations.controls.color_palette.control_labels
                        .dark_text_color
                }
              />
              <ColorInput
                id={`${this.state.controlId}_dark_text_color`}
                settingId={`${id}[dark_text_color]`}
                onChange={value =>
                  this.updateSetting({ dark_text_color: value })
                }
                defaultValue={setting.default.dark_text_color}
                value={setting().dark_text_color}
                showPalette={true}
              />
            </TabPanel>
          </Tabs>
        )}
      </div>
    );
  }
}

export default TTColorPaletteControl;
