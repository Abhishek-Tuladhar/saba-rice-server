const sanitizeObject = (obj) => {
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (/^\$/.test(key) || key.includes(".")) {
        delete obj[key];
      } else if (typeof obj[key] === "object") {
        sanitizeObject(obj[key]);
      }
    }
  }
  return obj;
};

const sanitize = (req, res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.params) sanitizeObject(req.params);
  // req.query intentionally skipped — read-only getter in Express 5
  next();
};

module.exports = sanitize;
