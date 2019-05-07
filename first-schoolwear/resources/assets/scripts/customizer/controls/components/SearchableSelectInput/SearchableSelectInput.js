/* eslint-disable */
import PropTypes from 'prop-types';
import React, { Component } from 'react'; // eslint-disable-line
import Select from 'react-select';

const customStyles = {
  container: styles => {
    return {
      ...styles,
      color: '#555'
    };
  },
  control: styles => ({
    ...styles,
    borderColor: '#dddddd',
    borderRadius: '3px',
    boxShadow:
      '0 1px 0 rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
    ':hover': {
      borderColor: '#dddddd',
      boxShadow:
        '0 1px 0 rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
    }
  }),
  indicatorSeparator: styles => ({
    ...styles,
    backgroundColor: '#e0e0e0'
  }),
  option: (styles, { isFocused, isSelected }) => {
    if (isFocused && !isSelected) {
      return {
        ...styles,
        backgroundColor: '#00a0d2',
        color: '#ffffff',
        ':active': {
          backgroundColor: '#1b8aba'
        }
        // color: '#FFFFFF'
      };
    }

    if (isSelected) {
      return {
        ...styles,
        backgroundColor: '#0073aa',
        ':active': {
          backgroundColor: '#1b8aba'
        }
      };
    }

    // Fallback to the predefined styles.
    return {
      ...styles,
      ':active': {
        backgroundColor: '#00578a',
        color: '#ffffff'
      }
    };
  },
  menu: styles => ({
    ...styles,
    borderRadius: '3px',
    border: '1px solid #ddd',
    boxShadow: '0 1px 0 rgba(0, 0, 0, 0.05)',
    marginTop: 4,
    zIndex: 40
  }),
  singleValue: styles => ({
    ...styles,
    color: '#555'
  })
};

class SearchableSelectInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    choices: PropTypes.object.isRequired
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
      SearchableSelectInput.propTypes,
      this.props,
      'prop',
      'SearchableSelectInput'
    );
  };

  /**
   * Component Did Mount
   *
   * @description Fired when the component has been
   *   mounted to the DOM.
   *
   */
  componentDidMount() {}

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
   * Updates the select input only if the choice
   * exists for this control.
   *
   */
  handleChange = selected => {
    if (typeof this.props.choices[selected.value] !== 'undefined') {
      this.props.onChange(selected.value);
    }
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
    const { id, value, choices } = this.props;

    // Bail if there are no choices
    if (!choices) {
      return null;
    }

    let options = [];
    let count = 0;
    let selectedIndex;

    Object.keys(choices).forEach(choice => {
      // Add the choice
      options.push({
        value: choice,
        label: choices[choice]
      });

      // Determine the selected option.
      if (value.toString() === choice) {
        selectedIndex = count;
      }

      count++;
    });

    return (
      <div className="SearchableSelectInput">
        <Select
          inputId={id}
          options={options}
          onChange={this.handleChange}
          defaultValue={options[selectedIndex] ? options[selectedIndex] : {}}
          isClearable={false}
          value={options[selectedIndex] ? options[selectedIndex] : {}}
          styles={customStyles}
        />
      </div>
    );
  }
}

export default SearchableSelectInput;
