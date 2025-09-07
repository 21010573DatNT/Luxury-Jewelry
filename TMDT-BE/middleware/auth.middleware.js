const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.json({
    code: 400,
    message: "không có token"
  }); // Không có token thì trả lỗi
  

  jwt.verify(token, process.env.REFRESH_SECRET, (err, user) => {
    if (err) return res.json({
      code: 403,
      message: "Token không hợp lệ hoặc hết hạn"
    }); 
    req.user = user; // Lưu thông tin user vào request
    next(); // Tiếp tục với request kế tiếp
  });
};

module.exports = authenticateToken;