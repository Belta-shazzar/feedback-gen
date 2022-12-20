const FormResponse = require("../model/form.response");
const { formResponseValidation } = require("../service/response.service");
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, NotFoundError } = require("../errors");

const addAResponse = async (req, res) => {
    const { formID, responseData } = req.body
    await formResponseValidation(formID, responseData)

    res.status(StatusCodes.CREATED).json({ success: true })
}


module.exports = { addAResponse }

