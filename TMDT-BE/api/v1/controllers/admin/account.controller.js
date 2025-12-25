const Account = require("../../models/account.model");
const searchHelper = require("../../../../helpers/search.helper");
const generateHelper = require("../../../../helpers/generate");
const Role = require("../../models/role.model");
const jwtHelper = require("../../../../helpers/jwt.helper");
const md5 = require("md5");
const bcrypt = require("bcryptjs");

// [GET] /api/v1/admin/accounts
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };

    // Search
    let objectSearch = searchHelper(req.query);

    if (req.query.keyword) {
        find.fullName = objectSearch.regex;
    }
    // Search

    const accounts = await Account.find(find);


    for (const account of accounts) {
        const role = await Role.findById(account.role_id);
        account.role_name = role ? role.title : null;
        await account.save();
    }

    res.json(accounts);
};

// [POST] /api/v1/admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const account = await Account.find({
            _id: id,
            deleted: false,
        });
        res.json(account);
    } catch (error) {
        res.json({
            code: 500,
            message: error,
        });
    }
};

// [POST] /api/v1/admin/accounts/create
module.exports.create = async (req, res) => {
    try {
        const password = String(req.body.password || "");
        const hashedPassword = md5(password);

        const existEmail = await Account.findOne({
            email: req.body.email,
            deleted: false,
        });

        if (existEmail) {
            res.json({
                code: 400,
                message: "Email đã tồn tại",
            });
        } else {
            const account = new Account({
                fullName: req.body.fullName,
                email: req.body.email,
                password: hashedPassword,
                phone: req.body.phone,
                role_id: req.body.role_id,
                avatar: req.body.avatar,
                token: generateHelper.generateRandomString(30),
            });

            await account.save();

            res.json({
                code: 200,
                message: "Tạo tài khoản thành công",
                data: account,
                token: account.token,
            });
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Tạo tài khoản thất bại",
        });
    }
};

// [PATCH] /api/v1/admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        if (Object.prototype.hasOwnProperty.call(req.body, "password")) {
            req.body.password = md5(String(req.body.password || ""));
        }

        await Account.updateOne(
            {
                _id: id,
                deleted: false,
            },
            req.body
        );

        res.json({
            code: 200,
            message: "Cập nhật tài khoản thành công",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật tài khoản thất bại",
        });
    }
};

// [DELETE] /api/v1/admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        await Account.updateOne(
            {
                _id: id,
                deleted: false,
            },
            {
                deleted: true,
            }
        );

        res.json({
            code: 200,
            message: "Xóa tài khoản thành công",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa tài khoản thất bại",
        });
    }
};

//[POST] /api/v1/admin/accounts/login
module.exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const account = await Account.findOne({ email: email });

        if (!account) {
            res.status(400).json({
                code: 400,
                message: "Email hoặc mật khẩu không đúng",
            });
        } else {
            const inputPassword = String(password || "");
            const inputPasswordMd5 = md5(inputPassword);

            const isPasswordValid = account.password === inputPasswordMd5;

            if (!isPasswordValid) {
                return res.status(400).json({
                    code: 400,
                    message: "Email hoặc mật khẩu không đúng",
                });
            }

            const role = await Role.findById(account.role_id);

            const payload = {
                _id: account._id,
                fullName: account.fullName,
                permissions: role.permissions
            };

            account.token = await jwtHelper.accessToken(payload);
            await account.save();

            res.cookie("token", account.token, {
                HttpOnly: true,
                Secure: false,
                SameSite: "None",
            });

            res.status(200).json({
                code: 200,
                account,
                permissions: role.permissions
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error,
        });
    }
};
