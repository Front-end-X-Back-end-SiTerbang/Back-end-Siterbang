const { Notification } = require("../models");

module.exports = {
  updateNotif: async (req, res, next) => {
    const { transaction_id } = req.params;

    const updateNotif = await Notification.update(
      {
        read: true,
      },
      { where: { transaction_id } }
    );

    return res.status(200).json({
      status: true,
      message: "Success",
      data: updateNotif,
    });
  },
  getUserNotif: async (req, res, next) => {
    const { user_id } = req.body;
    const token = req.headers["authorization"];
    const user = jwt.verify(token, JWT_SECRET);

    const findAll = await Notification.findAll({
      where: { user_id },
      order: [["read"], ["id", "DESC"]],
    });

    const count = await Notification.count({
      where: { user_id: user.id, read: false },
    });

    return res.status(200).json({
      status: true,
      message: "success",
      data: {
        notification: findAll,
        unread: count,
      },
    });
  },
};
