import PropTypes from 'prop-types';
import React, { Component } from 'react'; // eslint-disable-line

class ControlDescription extends Component {
  static propTypes = {
    description: PropTypes.string
  };

  checkPropTypes = () => {
    PropTypes.checkPropTypes(
      ControlDescription.propTypes,
      this.props,
      'props',
      'ControlDescription'
    );
  };

  render() {
    this.checkPropTypes();

    return this.props.description ? (
      <div className="ControlDescription">
        <span className="description customize-control-description">
          <p>{this.props.description}</p>
        </span>
      </div>
    ) : null;
  }
}

export default ControlDescription;
