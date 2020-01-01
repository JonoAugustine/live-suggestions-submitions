const mongoose = require("mongoose");
const moment = require("moment");

const dbConnect = async () => {
  const MONGO_URI = process.env.MONGODB_URI || process.argv[2];
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const IdeaSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: [2],
    maxlength: [30]
  },
  text: {
    type: String,
    minlength: [10],
    maxlength: [240]
  }
});

// Timestamp pre-save
IdeaSchema.pre("save", function(next) {
  this.createdAt = moment();
  next();
});

module.exports = {
  Idea: mongoose.model("Idea", IdeaSchema),
  dbConnect
};
