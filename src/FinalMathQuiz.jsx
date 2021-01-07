import React, { PureComponent } from "react";
import { Label, Button, ProgressBar } from "react-bootstrap";
import sequence from "./react-sequence-wrapper";
import seed from "./react-seed-wrapper";
import seedRandom from "seed-random";

import { reduxForm, Field } from "redux-form";

const isRequired = value => {
  return value !== undefined ? undefined : "Answer is required";
};

const isCorrect = (value, allValues, props) => {
  const { currentStep } = props;
  const answer = currentStep.a + currentStep.b;
  return parseInt(value, 10) === answer ? undefined : "incorrect";
};

const int100 = decimal => Math.floor(decimal * 100); // ex. transforms .25 to 25

@seed
@sequence({
  steps: (index, props) => {
    const rng = seedRandom(index + props.seed);

    const a = int100(rng());
    const b = int100(rng());
    return { a, b };
  }
})
@reduxForm({
  form: "question"
})
export default class FinalMathQuiz extends PureComponent {
  sumbit = () => {
    const { reset, goToNext } = this.props;
    reset();
    goToNext();
  };

  restart = () => {
    const { reseed, resequence } = this.props;
    reseed();
    resequence();
  };

  render() {
    const {
      handleSubmit,
      invalid,
      anyTouched, //from @reduxForm mixin

      currentIndex,
      farthestIndex,
      currentStep,
      goToNext,
      goToPrev,
      goToIndex,
      goToStep,
      isFirstStep
      // isLastStep, //from @sequence mixin
    } = this.props;

    const progress =
      farthestIndex == 0
        ? 0
        : ((1 - 1 / Math.pow(2, farthestIndex)) * 100).toFixed(2); //a little xeno's paradox :grinning:

    return (
      <div>
        <div id="header">
          <h1>Final Math Quiz</h1>
          <h5>Math10101 - Professor Zeno - Section 0</h5>

          <h2>
            <Label bsStyle="success">Question #{currentIndex + 1}</Label>
          </h2>
        </div>

        {currentIndex === farthestIndex ? (
          <form onSubmit={handleSubmit(this.sumbit)}>
            <div id="step">
              {`${currentStep.a} + ${currentStep.b} =`}

              <Field
                name="answer"
                validate={[isRequired, isCorrect]}
                component={AnswerField}
              />
            </div>

            <div id="basic-navigation">
              <Button onClick={goToPrev} disabled={isFirstStep}>
                Back
              </Button>
              <Button
                type="submit"
                bsStyle="primary"
                disabled={
                  currentIndex === farthestIndex && (anyTouched && invalid)
                }
              >
                Next
              </Button>
            </div>
          </form>
        ) : (
          <div>
            <div id="step">
              {`${currentStep.a} + ${currentStep.b} = `}

              <span id="answer-field">
                {`${currentStep.a + currentStep.b}`}
                <div id="msg" />
              </span>
            </div>
            <div id="basic-navigation">
              <Button onClick={goToPrev} disabled={isFirstStep}>
                Back
              </Button>
              <Button bsStyle="primary" onClick={goToNext}>
                Next
              </Button>
            </div>
          </div>
        )}

        <div id="progress-bar">
          <h5>Current Progress</h5>

          {progress < 100 ? (
            <ProgressBar
              active
              bsStyle="warning"
              now={progress}
              label={`${progress}%`}
            />
          ) : (
            <ProgressBar bsStyle="success" now={100} label={`${100}%`} />
          )}
        </div>

        <div id="steps-navigation">
          <h5>Questions</h5>

          {Array(farthestIndex + 1)
            .fill()
            .map((step, index) => (
              <Button
                key={index}
                onClick={() => goToIndex(index)}
                bsStyle={currentIndex === index ? "success" : "default"}
              >
                #{index + 1}
              </Button>
            ))}
        </div>

        <div id="step-navigation">
          <Button
            onClick={this.restart}
            disabled={farthestIndex === 0}
            bsStyle="danger"
          >
            Restart
          </Button>
        </div>
      </div>
    );
  }
}

const AnswerField = ({ input, meta: { touched, error, warning } }) => (
  <span id="answer-field">
    <input
      {...input}
      className="answer"
      placeholder="?"
      type="text"
      maxlength="3"
    />
    <div id="msg" className={error ? "error" : "success"}>
      {touched && (error ? error : "correct!")}
    </div>
  </span>
);
