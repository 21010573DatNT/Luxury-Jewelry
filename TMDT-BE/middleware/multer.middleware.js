const multer = require('multer');

// Cấu hình lưu trữ file upload (ở đây chỉ lưu vào bộ nhớ, bạn có thể sửa lại để lưu vào disk hoặc cloud)
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;