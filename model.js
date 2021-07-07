/* DATA MODEL */
const mongoose = require("mongoose");

const repliesSchema = mongoose.Schema(
  {
    author: String,
    body: String,
    thread_id: { type: mongoose.Schema.Types.ObjectId, ref: "Thread" },
    comment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  },
  { timestamps: true }
);
//Test comment
const commentSchema = mongoose.Schema(
  {
    author: String,
    body: String,
    votes: Number,
    replies: [repliesSchema],
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
