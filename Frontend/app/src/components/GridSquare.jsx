import React, { Component } from "react";
import "../App.css";

export default class GridSquare extends Component {
  render() {
    return (
      <div className="tiles">
        {this.props.params.isButton ? (
          <button
            className="button"
            onClick={this.props.onClick}
            style={{ backgroundImage: `url(${this.props.params.picture})` }}
          >
          </button>
        ) : null}
      </div>
    );
  }
}
