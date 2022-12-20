const Form = require("../model/form");
const { NotFoundError, BadRequestError } = require("../errors");
const { getExactQuestionType, QuestionTypes } = require("./form.service");

const formResponseValidation = async (formID, responseBody) => {
  // console.log(responseBody)
  const responseForm = await getForm(formID);
  const formData = responseForm.formData;

  const [formQuestions, responseBodyQuestions] = populate2Arrays(
    formData,
    responseBody
  );

  if (formQuestions.length !== responseBodyQuestions.length) {
    throw new BadRequestError("Invalid form response");
  }

  checkQuestions(formQuestions, responseBodyQuestions);

  actualResponseValidation(formData, responseBody);

  // console.log(formQuestions);
  // console.log(responseBodyQuestions);
};

const getForm = async (formID) => {
  const form = await Form.findOne({ _id: formID });

  if (!form) {
    throw new NotFoundError("Resourse not found or has been deleted");
  }

  return form;
};

// put every question in formData and responseBody into two different arrays for comparision
const populate2Arrays = (formData, responseBody) => {
  const formQuestions = [];
  const responseBodyQuestions = [];

  for (const entity in formData) {
    formQuestions.push(entity);
  }

  for (const entity in responseBody) {
    responseBodyQuestions.push(entity);
  }

  return [formQuestions, responseBodyQuestions];
};

// Check if questions in saved form and response are same.
const checkQuestions = (savedFormQuestions, responseQuestions) => {
  for (let i = 0; i < savedFormQuestions.length; i++) {
    if (savedFormQuestions[i] !== responseQuestions[i]) {
      throw new BadRequestError(
        `'${responseQuestions[i]}' is not on the saved form`
      );
    }
  }

  return;
};

const actualResponseValidation = (formData, responseBody) => {
  const [questionConstraints, answersToQuestion] = formAnswerArray(
    formData,
    responseBody
  );

  for (let i = 0; i < questionConstraints.length; i++) {
    const constraint = questionConstraints[i];
    const equivalentAnswer = answersToQuestion[i];

    let [questionType, required] = getExactQuestionType(constraint);

    let holdChoices = [];
    switch (questionType) {
      case QuestionTypes.ShortAnswer:
        validateRequiredInput(required, equivalentAnswer);
        break;

      case QuestionTypes.Paragraph:
        validateRequiredInput(required, equivalentAnswer);
        break;

      case QuestionTypes.MultipleChoice:
        multichoiceAnswerValidation(equivalentAnswer, required, constraint);
        break;

      case QuestionTypes.CheckBox:
        for (const choice of equivalentAnswer) {
          if (!equivalentAnswer.includes(choice)) {
            holdChoices.push(choice);
          }
        }

        if (holdChoices.length !== 0) {
          console.log(holdChoices);
          throw new BadRequestError("Invalid form response ** Check box");
        }

        holdChoices = [];

        break;

      case QuestionTypes.Dropdown:
        multichoiceAnswerValidation(equivalentAnswer, required, constraint);
        break;

      case QuestionTypes.FileUpload:
        break;

      case QuestionTypes.LinearScale:
        const errMsg = "Invalid form response from Linear scale question";
        if (typeof equivalentAnswer !== "number") {
          throw new BadRequestError(errMsg);
        }

        const { start, end } = constraint[1];

        if (!(equivalentAnswer >= start && equivalentAnswer <= end)) {
          throw new BadRequestError(errMsg);
        }
        break;

      case QuestionTypes.MultipleChoiceGrid:
        const MCGErrMsg = "Invalid form response ** MultiChoiceGrid";
        const equivAnswerKeyArray = [];

        const { rows, columns } = constraint[1];

        for (const key in equivalentAnswer) {
          equivAnswerKeyArray.push(key);
        }

        if (rows.length !== equivAnswerKeyArray.length) {
          if (rows[i] !== equivAnswerKeyArray[i]) {
            throw new BadRequestError(MCGErrMsg);
          }
        }

        for (let i = 0; i < rows.length; i++) {
          if (rows[i] !== equivAnswerKeyArray[i]) {
            throw new BadRequestError(MCGErrMsg);
          } 
        }

        for (const key in equivAnswerKeyArray) {
          if (!columns.includes(equivAnswerKeyArray[key])) {
            throw new BadRequestError(MCGErrMsg);
          }
        }
      
        break;

      case QuestionTypes.CheckBoxGrid:
        break;

      case QuestionTypes.Date:
        break;

      case QuestionTypes.Time:
        break;

      default:
        throw new BadRequestError("Invalid entry");
        break;
    }
  }

  function multichoiceAnswerValidation(equivalentAnswer, required, constraint) {
    if (typeof equivalentAnswer !== "string") {
      throw new BadRequestError("Invalid form response ** MultiChoices");
    }

    validateRequiredInput(required, equivalentAnswer);
    if (!constraint.includes(equivalentAnswer, 1)) {
      throw new BadRequestError("Invalid form response ** MultiChoices2");
    }
  }
};

// return an array containing question type array and 'answer in response body', for actual validation
const formAnswerArray = (formData, responseBody) => {
  const questionConstraints = [];
  const answersToQuestion = [];

  for (const entity in formData) {
    questionConstraints.push(formData[entity]);
  }

  for (const entity in responseBody) {
    answersToQuestion.push(responseBody[entity]);
  }

  return [questionConstraints, answersToQuestion];
};

// Validate required string answers
const validateRequiredInput = (required, answer) => {
  if (required) {
    if (answer === null || !(answer.length > 1))
      throw new BadRequestError("Invalid form response ** Required input");
  }
};

module.exports = { formResponseValidation };
