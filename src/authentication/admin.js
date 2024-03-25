function adminAuthentication(req, res, next) {
//     const {type}=req.body;
//   if (type!== 'admin') {
//     return res.status(401).send('Unauthorized');
//   }
  next();
}
module.exports = adminAuthentication;