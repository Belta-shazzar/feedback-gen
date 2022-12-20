const { BadRequestError } = require("../errors");

const QuestionTypes = {
  ShortAnswer: "shortAnswer",
  Paragraph: "paragraph",
  MultipleChoice: "multipleChoice",
  CheckBox: "checkBoxes",
  Dropdown: "dropdown",
  FileUpload: "fileUpload",
  LinearScale: "linearScale",
  MultipleChoiceGrid: "multipleChoiceGrid",
  CheckBoxGrid: "checkBoxGrid",
  Date: "date",
  Time: "time",
};

const validateFormBody = async (formData) => {

  for (const question in formData) {
    let [ questionType ] = getExactQuestionType(formData[question]);

    switch (questionType) {
      case QuestionTypes.ShortAnswer:
        break;
      case QuestionTypes.Paragraph:
        break;
      case QuestionTypes.MultipleChoice:
        const checkMPDataType = formData[question];
        if (checkMPDataType !== "object" && !(checkMPDataType.length > 0)) {
          throw new BadRequestError("Error from Multiple choice question type");
        }
        break;
      case QuestionTypes.CheckBox:
        break;

      // Validation for drop down question type
      case QuestionTypes.Dropdown:
        const checkDataType = formData[question];
        if (checkDataType !== "object" && !(checkDataType.length > 0)) {
          throw new BadRequestError("Error from Drop Down question type");
        }
        break;
      case QuestionTypes.FileUpload:
        // Come back
        break;

      // Validation for linear scale question type
      case QuestionTypes.LinearScale:
        const scaleConstraints = formData[question][1];
        linearScaleValidation(scaleConstraints);

        break;

      // Multiple choice grid question type validation
      case QuestionTypes.MultipleChoiceGrid:
        const MCgridOptions = formData[question][1];
        gridQuestionTypeValidation(MCgridOptions);

        break;

      // Check box grid question type validation
      case QuestionTypes.CheckBoxGrid:
        const gridOptions = formData[question][1];
        gridQuestionTypeValidation(gridOptions);

        break;
      case QuestionTypes.Date:
        break;
      case QuestionTypes.Time:
        break;
      default:
        throw new BadRequestError("Invalid question type");
        break;
    }
  }

  return;
};

const getExactQuestionType = (constraint) => {
  let questionType = constraint;
  let required = false

  if (typeof questionType === "object") {
    questionType = constraint[0];
  }

  if (questionType.startsWith("*")) {
    required = true
    questionType = questionType.split(" ")[1];
  }

  return [questionType, required];
};

const linearScaleValidation = (scaleConstraints) => {
  let holdStartValue;
  for (const constraint in scaleConstraints) {
    switch (constraint) {
      case "start":
        const startValue = scaleConstraints[constraint];

        checkIntegerType(startValue);

        // Ensure scale starts from either 0 or 1
        if (startValue !== 0 && startValue !== 1) {
          throw new BadRequestError(
            "Error from linear scale question. scale should start from either 0 or 1"
          );
        }
        holdStartValue = startValue;
        break;
      case "end":
        const endValue = scaleConstraints[constraint];
        checkIntegerType(endValue);

        // Ensure end scale is between start scale and 10
        if (endValue > holdStartValue && endValue <= 10) {
        } else {
          throw new BadRequestError(
            "Error from linear scale question. scale should have an end value between start value and 10"
          );
        }
        break;
      case "startLabel":
        break;
      case "endLabel":
        break;
      default:
        throw new BadRequestError("Invalid linear scale constraint");
        break;
    }
  }
};

const gridQuestionTypeValidation = (gridOptions) => {
  for (const option in gridOptions) {
    if (option !== "rows" && option !== "columns") {
      throw new BadRequestError("Bad resquest. Check grid question type");
    }
  }
  return;
};

const checkIntegerType = (variable) => {
  if (typeof variable !== "number") {
    throw new BadRequestError(
      "Error from linear scale question. start and end must be an integer"
    );
  }
};

module.exports = { validateFormBody, getExactQuestionType, QuestionTypes };
