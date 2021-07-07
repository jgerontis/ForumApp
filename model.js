/* DATA MODEL */
const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    author: String,
    body: String,
    votes: Number,
    thread_id: { type: mongoose.Schema.Types.ObjectId, ref: "Thread" },
  },
  { timestamps: true }
);

const threadSchema = mongoose.Schema(
  {
    author: String,
    category: String,
    comments: [commentSchema],
    description: String,
    title: String,
    votes: Number,
  },
  {
    timestamps: true,
  }
);

const Thread = mongoose.model("Thread", threadSchema);

module.exports = {
  Thread,
};
