// src/main.js
// src/main.js

// import Vue from "vue";
// import vuetify from "@/plugins/vuetify"; // path to vuetify export

// src/main.js
var app = new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data: {
    page: "blog",
    drawer: false,
    selected_category: "all",
    categories: [
      "all",
      "clothing",
      "hunting",
      "books",
      "cards",
      "coins",
      "keychains",
      "comic books",
      "misc.",
    ],
    threads: [],

    active_thread: {},

    active_comment: {},

    //for a new thread
    new_title: "",
    new_author: "",
    new_description: "",
    new_category: "all",

    //for a new comment on a thread
    new_comment_body: "",
    new_comment_author: "",

    // for new reply to comment
    new_reply_body: "",
    new_reply_author: "",

    server_url: "http://localhost:8080",
   
  },
  created: function () {
    this.getThreads();
  },
  methods: {
    getThreads: function () {
      fetch(this.server_url + "/thread").then(function (res) {
        res.json().then(function (data) {
          app.threads = data;
          console.log(data);
        });
      });
    },

    createThread: function () {
      var new_thread = {
        title: this.new_title,
        author: this.new_author,
        description: this.new_description,
        category: this.new_category,
      };
      fetch(this.server_url + "/thread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(new_thread),
      }).then(function () {
        app.getThreads();
        app.new_title = "";
        app.new_author = "";
        app.category = "all";
        app.new_description = "";
        app.page = "blog";
      });
    },
    deleteThread: function (thread_id) {
      fetch(this.server_url + "/thread/" + thread_id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function () {
        app.getThreads();
      });
    },
    upvoteThread: function (thread) {
      fetch(this.server_url + "/tvote/" + thread._id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1 }),
      }).then((res) => {
        res.json().then((data) => {
          app.getComments(thread._id);
        });
      });
    },
    downvoteThread: function (thread) {
      fetch(this.server_url + "/tvote/" + thread._id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: -1 }),
      }).then((res) => {
        res.json().then((data) => {
          console.log("you did a vote");
          app.getComments(thread._id);
        });
      });
    },

    getComments: function (thread_id) {
      console.log("You clicked:", thread_id);
      fetch(this.server_url + "/thread/" + thread_id).then((res) => {
        res.json().then((data) => {
          app.active_thread = data;
          app.page = "thread";
          console.log(data);
        });
      });
    },

    createComment: function () {
      var new_comment = {
        thread_id: this.active_thread._id,
        author: this.new_comment_author,
        body: this.new_comment_body,
      };
      fetch(this.server_url + "/comment/" + this.active_thread._id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(new_comment),
      }).then(function () {
        app.getComments(app.active_thread._id);
        app.new_comment_author = "";
        app.new_comment_body = "";
      });
    },
    deleteComment: function (comment) {
      fetch(
        this.server_url + "/comment/" + comment.thread_id + "/" + comment._id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then(function () {
        app.getComments(comment.thread_id);
      });
    },
    getReply: function (comment_id) {
      console.log("You clicked:", comment_id);
      fetch(this.server_url + "/thread/" + thread_id).then((res) => {
        res.json().then((data) => {
          app.active_comment = data;
          app.page = "thread";
          console.log(data);
        });
      });
    },

    createReply: function (comment) {
      var new_reply = {
        comment_id: this.active_comment._id,
        author: this.new_reply_author,
        body: this.new_reply_body,
      };
      fetch(this.server_url + "/replies/" + this.active_comment._id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(new_reply),
      }).then(function () {
        app.getReply(app.active_comment._id);
        app.new_reply_author = "";
        app.new_reply_body = "";
      });
    },
    
    deleteReply: function (reply) {
      fetch(
        this.server_url + "/reply/" + reply.comment_id + "/" + reply._id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then(function () {
        app.getReply(reply.comment_id);
      });
    },

  computed: {
    sorted_threads: function () {
      if (this.selected_category == "all") {
        return this.threads;
      } else {
        var sorted_threads = this.threads.filter(function (thread) {
          return thread.category == app.selected_category;
        });
        return sorted_threads;
      }
    },
  },
});

export { app };

//I SEE DEAD PEOPLE!!!

// export { app };

// here is a comment!!!

//This is KALICIA
