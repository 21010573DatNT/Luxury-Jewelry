const User = require("../../models/user.model");
const md5 = require("md5");
const generateHelper = require("../../../../helpers/generate");
const ForgotPassword = require("../../models/forgot-password.model");
const jwtHelper = require("../../../../helpers/jwt.helper");
const jwt = require("jsonwebtoken");

//[GET] api/v1/user
module.exports.userGet = async (req, res) => {
    try {
        const users = await User.find();
        if (users) {
            res.status(200).json({
                users,
            });
        } else {
            res.status(400).json({
                message: "Khong co user",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error,
        });
    }
};

//[GET] api/v1/user/detail/:user_id
module.exports.detail = async (req, res) => {
    try {
        const { user_id } = req.params;
        const user = await User.findById(user_id);
        if (user) {
            res.status(200).json({
                user,
            });
        } else {
            res.status(400).json({
                message: "Khong co user",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error,
        });
    }
};

//[PATCH] api/v1/user/edit/:user_id
module.exports.edit = async (req, res) => {
    try {
        const { user_id } = req.params;
        const user = await User.updateOne({ _id: user_id }, req.body);
        res.status(200).json({
            code: 200,
            message: "Cập nhật thành công",
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: error,
        });
    }
};

//[DELETE] api/v1/user/delete/user_id
module.exports.delete = async (req, res) => {
    try {
        const { user_id } = req.params;
        await User.deleteOne({ _id: user_id });

        res.status(200).json({
            code: 200,
            message: "Xóa user thành công",
        });
    } catch (error) {
        res.status(500).json({
            message: error,
        });
    }
};

// [POST] api/v1/user/register
module.exports.register = async (req, res) => {
    req.body.password = req.body.password;

    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false,
    });

    if (existEmail) {
        res.json({
            code: 400,
            message: "Email đã tồn tại",
        });
    } else {
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            token: "",
        });

        await user.save();
        user.token = await jwtHelper.accessToken({
            id: user.id,
        });

        await user.save();
        res.json({
            code: 200,
            message: "Đăng ký thành công",
        });
    }
};

//[GET] /api/v1/client/user/search
module.exports.search = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const regex = new RegExp(keyword, "i");

        const users = await User.find({
            fullName: { $regex: regex },
        })

        res.status(200).json({
            users: users,
        });
    } catch (error) {
        console.log(error);
    }
};

// [POST] api/v1/user/login
module.exports.login = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        deleted: false,
    });

    if (!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại",
        });
        return;
    }

    if (req.body.password !== user.password) {
        res.json({
            code: 400,
            message: "Sai mật khẩu",
        });
        return;
    }

    user.token = await jwtHelper.accessToken({
        id: user._id,
    });

    user.refreshToken = await jwtHelper.refreshToken({
        id: user._id,
    });

    await user.save();

    res.cookie("refreshToken", user.refreshToken, {
        HttpOnly: true,
        Secure: false,
        SameSite: "None", // Cần thiết khi gửi cookie cross-origin
        maxAge: 3600000,
    });

    res.json({
        code: 200,
        message: "Đăng nhập thành công",
        token: user.token,
        refreshToken: user.refreshToken,
    });
};

//[PATCH] api/v1/user/update/:id
module.exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, address, phone, email } = req.body;

        const user = await User.findOne({ _id: id });
        await User.updateOne(
            { _id: id },
            { fullName: name, address: address, phone: phone, email: email }
        );

        res.status(200).json({
            code: 200,
            user: user,
            message: "Cập nhật user thành công",
        });
    } catch (error) {
        return res.status(404).json({
            message: "error",
        });
    }
};

//[POST] api/v1/user/logout
module.exports.logout = async (req, res) => {
    try {
        res.clearCookie("refreshToken");
        return res.status(200).json({
            status: "OK",
            message: "Đăng xuất thành công",
        });
    } catch (error) {
        return res.status(404).json({
            message: error,
        });
    }
};

//[POST] api/v1/user/refresh_token
module.exports.refreshToken = async (req, res) => {
    const refresh_token = req.cookies.refreshToken;

    if (!refresh_token)
        return res.json({
            code: 400,
            message: "Không có refresh_token1",
        });

    jwt.verify(refresh_token, process.env.REFRESH_SECRET, (err, user) => {
        if (err) return res.sendStatus(400);

        const newAccessToken = jwt.sign(
            {
                id: user.id,
            },
            process.env.REFRESH_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            token: newAccessToken,
        });
    });
};

//[GET] api/v1/user/profile/:id
module.exports.profile = async (req, res) => {
    // Lấy userId từ request (đã được xác thực qua JWT)
    const userId = req.params.id;

    // Lấy thông tin người dùng từ DB (bạn có thể thay đổi theo model của mình)
    const user = await User.findOne({
        _id: userId,
    });
    if (!user)
        return res.status(404).json({ error: "Tài khoản không tồn tại" });

    // Trả về thông tin profile
    res.json({
        fullName: user.fullName,
        address: user.address,
        phone: user.phone,
        email: user.email,
        createdAt: user.createdAt,
    });
};

//[POST] api/v1/user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        deleted: false,
    });

    if (!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại",
        });
        return;
    }

    const otp = generateHelper.generateRandomNumber(6);

    const objForgotPassword = {
        email: user.email,
        otp: otp,
        expireAt: Date.now() + 5 * 60 * 1000, // 5 phút
    };

    const forgotPassword = new ForgotPassword(objForgotPassword);
    await forgotPassword.save();

    //Gửi OTP qua email
    const subject = "Mã OTP xác minh lấy lại mật khẩu";

    const html = `
        Mã OTP để lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 3 phút
    `;

    sendMail.sendMail(user.email, subject, html);
    //Gửi OTP qua email

    res.json({
        code: 200,
        message: "Đã gửi mã OTP qua email",
    });
};

//[POST] api/v1/user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const forgotPassword = await ForgotPassword.findOne({
        email: email,
        otp: otp,
    });

    if (!forgotPassword) {
        res.json({
            code: 400,
            message: "Mã OTP không tồn tại",
        });
        return;
    }

    const user = await User.findOne({
        email: email,
    });

    const tokenUser = user.tokenUser;

    res.json({
        code: 200,
        message: "Mã OTP hợp lệ",
        tokenUser: tokenUser,
    });
};

//[POST] api/v1/user/password/reset
module.exports.resetPassword = async (req, res) => {
    const user_id = req.params.user_id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findOne({
        _id: user_id,
    });


    if (currentPassword !== user.password) {
        res.json({
            code: 400,
            message: "Mật khẩu cũ không chính xác",
        });
        return;
    }

    if (newPassword === user.password) {
        res.json({
            code: 401,
            message: "Mật khẩu mới không được giống mật khẩu cũ",
        });
        return;
    }

    await User.updateOne(
        {
            _id: user_id,
        },
        {
            password: newPassword,
        }
    );

    res.json({
        code: 200,
        message: "Đổi mật khẩu thành công",
    });
};
