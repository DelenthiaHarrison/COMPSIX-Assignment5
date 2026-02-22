const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const { method, originalUrl, body } = req;
  console.log("Incoming Request");
  console.log("Timestamp : " + timestamp);
  console.log("Method    : " + method);
  console.log("URL       : " + originalUrl);
  if ((method === "POST" || method === "PUT") && Object.keys(body).length > 0) {
    console.log("Body      : " + JSON.stringify(body, null, 2));
  }
  res.on("finish", () => {
    const statusCode = res.statusCode;
    console.log("Response Status: " + statusCode);
  });
  next();
};
module.exports = requestLogger;
