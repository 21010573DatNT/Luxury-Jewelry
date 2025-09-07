const UserAction = require("../../models/userAction.model");

module.exports.create = async (req, res) => {
    try {
        const action = new UserAction(req.body);
        await action.save();
        res.json({ code: 200, message: "Lưu hành vi thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi lưu hành vi" });
    }
};