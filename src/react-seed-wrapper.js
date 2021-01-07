import React, { Component } from "react";

export default WrappedComponent => {
  class SeededComponent extends Component {
    constructor(props) {
      super(props);
      this.state = { seed: Math.random() };
    }

    handleReseed = () => {
      this.setState({ seed: Math.random() });
    };

    render() {
      const { seed } = this.state;
      return <WrappedComponent seed={seed} reseed={this.handleReseed} />;
    }
  }

  return SeededComponent;
};
