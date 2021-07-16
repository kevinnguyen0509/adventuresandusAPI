const Board = require("./../model/boardModel");

exports.createBoard = async (req, res) => {
  try {
    const newBoard = Board.create(req.body);

    res.status(200).json({
      status: "success",
      data: { data: newBoard },
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err,
    });
  }
};
