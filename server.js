/* API END POINTS */
const express = require("express");
const cors = require("cors");
const { Thread } = require("./model");

const server = express();

server.use(cors());
server.use(express.json({}));
server.use(express.static("static"));

// this is where we will do our own middleware
server.use((req, res, next) => {
  console.log(
    "Time: ",
    Date.now(),
    " - Method: ",
    req.method,
    " - Path: ",
    req.originalUrl,
    " - Body: ",
    req.body
  );
  next();
});

// get all threads (filter by category if present)
server.get(`/thread`, (req, res) => {
  // impliment filtering
  findQuery = {};
  Thread.find(findQuery, (err, threads) => {
    // check if there was an error
    if (err) {
      console.log(`there was an error fetching threads`, err);
      // send back the error
      res.status(500).json({ message: `unable to fetch threads`, error: err });
      return;
    }
    // success!!! return all the todos
    res.status(200).json(threads);
  });
});

// get specific thread and its comments
server.get(`/thread/:thread_id`, (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`getting thread with id: ${req.params.id}`);
  Thread.findById(req.params.thread_id, (err, thread) => {
    // check if there was an error
    if (err) {
      console.log(
        `there was an error finding a thread with id ${req.params.thread_id}`,
        err
      );
      // send back the error
      res.status(500).json({
        message: `unable to find thread with id ${req.params.thread_id}`,
        error: err,
      });
    } else if (thread === null) {
      console.log(`unable to find thread with id ${req.params.therad_id}`);
      res.status(404).json({
        message: `thread with id ${req.params.thread_id} not found`,
        error: err,
      });
    } else {
      // success!!!! return the thread
      res.status(200).json(thread);
    }
  });
});

// post a thread
server.post("/thread", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`creating a thread with body`, req.body);

  let newThread = {
    author: req.body.author || "Anonymous",
    category: req.body.category || "all",
    comments: [],
    description: req.body.description || "",
    title: req.body.title || "",
    votes: 0,
  };

  Thread.create(newThread, (err, thread) => {
    // check if there is an error
    if (err) {
      console.log(`unable to create thread`);
      res.status(500).json({
        message: "unable to create thread",
        error: err,
      });
      return;
    }
    // success!!! return the thread
    res.status(201).json(thread);
  });
});

// post a comment on a thread
server.post(`/comment/:thread_id/`, (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`creating a comment with body`, req.body);

  let newComment = {
    author: req.body.author || "",
    body: req.body.body || "",
    votes: 0,
    thread_id: req.params.thread_id,
  };

  Thread.findByIdAndUpdate(
    req.params.thread_id,
    {
      $push: { comments: newComment },
    },
    {
      new: true,
    },
    (err, thread) => {
      if (err != null) {
        res.status(500).json(err);
      } else if (thread === null) {
        res.status(404).json(thread);
      }
      res
        .status(201)
        .json(
          thread.comments.filter((comment) => comment.body === req.body.body)
        );
      // success
    }
  );
});

// delete a thread
server.delete(`/thread/:thread_id`, (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`Deleting thread: ${req.params.thread_id}`);
  Thread.findByIdAndDelete(req.params.thread_id, function (err, thread) {
    if (err) {
      console.log(`unable to delete thread`);
      res.status(500).json({
        message: "unable to delete thread",
        error: err,
      });
      return;
    } else if (thread === null) {
      console.log(`unable to delete thread with id ${req.params.thread_id}`);
      res.status(404).json({
        message: `thread with id ${req.params.thread_id} not found`,
        error: err,
      });
    } else {
      res.status(200).json(thread);
    }
  });
});

// delete a comment
server.delete("/comment/:thread_id/:comment_id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(
    `deleting comment with id ${req.params.comment_id} on thread with id ${req.params.thread_id}`
  );
  Thread.findByIdAndUpdate(
    req.params.thread_id,
    {
      $pull: {
        comments: {
          _id: req.params.comment_id,
        },
      },
    },
    {
      new: false,
    },
    (err, thread) => {
      if (err != null) {
        // return error
      } else if (thread === null) {
        // return 404
      }
      res
        .status(200)
        .json(
          thread.comments.filter(
            (comment) => comment._id === req.params.comment_id
          )
        );
    }
  );
});

server.post("/replies",(req,res)=>{
  res.setHeader("Content-Type", "application/json");
  console.log(`creating a reply to a comment with body`, req.body);

  let newReply = {
    author: req.body.author || "",
    body: req.body.body || "",
    votes: 0,
    thread_id: req.params.thread_id,
    post_id:req.params.post_id
  };
  Thread.findByIdAndUpdate(
    req.body.post_id, 
    { $push: { replies: newReply } },
    { new: true },
    (err, comment) =>{
      if (err != null) {
        res.status(500).json({
          error: err,
          message: "Unable to add a reply to Comment",
        });
      } else if (thread === null) {
        res.status(404);
        console.log(
          "Comment does not exist. Can't Reply a nonexistent comment"
        );
      } else {
        res.status(201).json(comment.replies[comment.replies.length - 1]);
      }
    }

  )
  
});

module.exports = server;
