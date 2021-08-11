const Adventure = require("./../model/adventuresModel");
//const Test = require("./../model/test");

exports.getAllAdventures = async (req, res) => {
  try {
    // location: { $regex: new RegExp("bellevue", "i") },
    const allAdventures = await Adventure.find().limit(5000).sort({ _id: -1 });
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

exports.searchAdventure = async (req, res) => {
  try {
    //$all $in

    const queryString = req.query.search;
    const querySearchArray = queryString.split("-");
    console.log(querySearchArray);

    //const searchQuery = ["Restaurant"];
    const searchQuery = querySearchArray;
    const location = req.query.location;
    let searchResult;

    const regex = searchQuery.map(function (e) {
      return new RegExp(e, "i");
    });

    //Search without location. Used for home products
    if (location == null || location.trimEnd() == "") {
      searchResult = await Adventure.find({
        $or: [{ title: { $all: regex } }, { tag: { $in: regex } }],
      }).limit(5000);
    } else {
      searchResult = await Adventure.find({
        $and: [
          { $or: [{ title: { $in: regex } }, { tag: { $in: regex } }] },
          {
            $or: [
              {
                location: {
                  $regex: new RegExp("^" + location.toLowerCase(), "i"),
                },
              },
            ],
          },
          //TODO: Still needs to ignore caseSensitive for location
        ],
      }).limit(1500);
    }

    res.status(200).json({
      result: searchResult.length,
      status: "Success",
      data: searchResult,
    });
  } catch (err) {
    res.status(404).json({
      status: 404,
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
