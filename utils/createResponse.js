/* eslint-disable linebreak-style */
module.exports = {
  success: (res, data) => {
    const {
      code, payload, message, pagination = false, token = false,
    } = data;

    const responseData = {
      code,
      status: 'success',
      message,
      data: payload,
    };

    // jika terdapat pagination
    if (pagination) {
      responseData.pagination = pagination;
    }

    // jika terdapat token
    if (token) {
      responseData.token = token;
      delete responseData.data;
    }

    res.status(code).json(responseData);
  },
  failed: (res, data) => {
    const {
      code, payload, message,
    } = data;

    const responseData = {
      code,
      status: 'failed',
      message,
      error: payload,
    };

    res.status(code).json(responseData);
  },
};
