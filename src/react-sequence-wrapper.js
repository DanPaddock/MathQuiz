import React, { Component } from "react";

export default ({ steps }) => WrappedComponent => {
  //TODO: immute decorator options
  const isStepFn = typeof steps === 'function'
  
  class SequencedComponent extends Component {
    constructor(props) {
      super(props);
      this.state = { currentIndex: 0, farthestIndex: 0 };
    }

    updateFarthestStep = () => {
      this.setState(prevState => ({
        farthestIndex: Math.max(prevState.currentIndex, prevState.farthestIndex)
      }));
    };

    goToNext = () => {
      if (!isStepFn && this.state.currentIndex === steps.length - 1) {
        throw new Error("no next step!");
      }

      this.setState(prevState => ({
        currentIndex: prevState.currentIndex + 1
      }));

      this.updateFarthestStep();
    };

    goToPrev = () => {
      if (this.state.currentIndex === 0) {
        throw new Error("no prev step!");
      }

      this.setState(prevState => ({
        currentIndex: prevState.currentIndex - 1
      }));
    };

    goToIndex = index => {
      this.setState({ currentIndex: index });
      this.updateFarthestStep();
    };

    goToStep = step => {
      if(isStepFn) {
        throw new Error('not supported with function type assigned to steps option!')
      }
      this.setState({ currentIndex: steps.indexOf(step) });
      this.updateFarthestStep();
    };

    resequence = () => {
      this.setState({ currentIndex: 0, farthestIndex: 0 });
    };

    render() {
      const { currentIndex, farthestIndex } = this.state;
      const bound = {
        //lastIndex
        steps,
        currentIndex,
        farthestIndex,
        currentStep: isStepFn ? steps(currentIndex,this.props) : steps[currentIndex],
        farthestStep: isStepFn ? steps(farthestIndex,this.props) : steps[farthestIndex],
        goToNext: this.goToNext,
        goToPrev: this.goToPrev,
        goToIndex: this.goToIndex,
        goToStep: this.goToStep,
        resequence: this.resequence,
        isFirstStep: currentIndex === 0,
        isLastStep: isStepFn ? false : currentIndex === steps.length - 1
      };

      return <WrappedComponent {...bound} {...this.props} />;
    }
  }

  return SequencedComponent;
};
