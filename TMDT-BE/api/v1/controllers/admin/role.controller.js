const Role = require("../../models/role.model");

//[GET] api/v1/admin/roles/
module.exports.roleGet = async (req, res) => {
    try {
        const roles = await Role.find();
        if (roles) {
            res.status(200).json({
                roles,
            });
        } else {
            res.status(400).json({
                message: "Khong co role",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error,
        });
    }
};

//[GET] api/v1/admin/roles/detail/:role_id
module.exports.roleDetail = async (req, res) => {
    try {
        const { role_id } = req.params;
        const role = await Role.findById(role_id);
        if (role) {
            res.status(200).json({
                role,
            });
        } else {
            res.status(400).json({
                message: "Khong co role",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error,
        });
    }
};

//[PATCH] api/v1/admin/roles/edit/:role_id
module.exports.roleEdit = async (req, res) => {
    try {
        const { role_id } = req.params;
        const role = await Role.updateOne({ _id: role_id }, req.body);
        res.status(200).json({
            code: 200,
            role,
        });
    } catch (error) {
        res.status(500).json({
            message: error,
        });
    }
};

//[POST] api/v1/admin/roles/create
module.exports.roleCreate = async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(200).json({
            code: 200,
            role,
        });
    } catch (error) {
        res.status(500).json({
            message: error,
        });
    }
};

//[DELETE] api/v1/admin/roles/delete/:role_id
module.exports.roleDelete = async (req, res) => {
    try {
        const { role_id } = req.params;
        const role = await Role.deleteOne({ _id: role_id });
        res.status(200).json({
            code : 200,
            role,
        });
    } catch (error) {
        res.status(500).json({
            message: error,
        });
    }
};
