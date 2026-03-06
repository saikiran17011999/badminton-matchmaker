const success = (res, data, statusCode = 200) => {
  return res.status(statusCode).json(data);
};

const error = (res, message, code = 'ERROR', statusCode = 400) => {
  return res.status(statusCode).json({ error: message, code });
};

const notFound = (res, resource = 'Resource') => {
  return error(res, `${resource} not found`, `${resource.toUpperCase()}_NOT_FOUND`, 404);
};

module.exports = { success, error, notFound };
