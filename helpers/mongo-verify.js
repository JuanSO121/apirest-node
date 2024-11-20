const ObjectId = require("mongoose").Types.ObjectId;


// Validator function para ver si es un MongoBDId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

  module.exports = {
    isValidObjectId,
  };
