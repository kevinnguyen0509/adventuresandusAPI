const Adventure = require("./../model/adventuresModel");
//const Test = require("./../model/test");

exports.getAllAdventures = async (req, res) => {
  try {
    let testing = "#homeDecor";
    const allAdventures = await Adventure.find();
    res.status(200).json({
      result: allAdventures.length,
      status: "Success",
      adventures: allAdventures,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err,
    });
  }
};

exports.getAdventureCategory = async (req, res) => {
  try {
    const adventureCategory = await Adventure.find({
      tag: { $regex: `${req.params.tag}`, $options: "i" },
    });
    res.status(200).json({
      result: adventureCategory.length,
      status: "Success",
      adventures: adventureCategory,
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: "err",
    });
  }
};

exports.createAdventure = async (req, res) => {
  try {
    const newAdventurePost = await Adventure.create(req.body);
    res.status(200).json({
      status: "Success",
      data: { data: newAdventurePost },
    });
  } catch (err) {
    res.json({
      status: "Failed",
      message: err,
    });
  }
};

exports.deleteAdventure = async (req, res) => {
  try {
    const deleteSpecific = await Adventure.deleteMany({
      location: "Tacoma Foods",
    });
    res.status(200).json({
      status: "Success",
      data: null,
    });
  } catch (err) {
    res.json({
      status: "Failed",
      message: err,
    });
  }
};
