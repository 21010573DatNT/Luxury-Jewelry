const cloudinary = require("../config/cloudinary");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage }).array("image", 5);

const uploadToCloudinary = async (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Lỗi khi tải ảnh lên." });
        }

        // Kiểm tra đúng: nếu không có file nào
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Vui lòng chọn ảnh sản phẩm." });
        }

        try {
            const urls = [];
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "products",
                    use_filename: true,
                    unique_filename: false,
                });
                urls.push(result.secure_url);
            }
            req.body.images = urls; // lưu mảng url vào req.body
            next();
        } catch (error) {
            return res.status(500).json({ message: "Lỗi khi tải ảnh lên Cloudinary." });
        }
    });
};

module.exports = uploadToCloudinary;
