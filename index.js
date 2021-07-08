/* ENTRY POINT */
// This file is in charge of starting the application

const server = require("./server");
const persist = require("./persist");

// define a port
const port = process.argv[2] || process.env.PORT || 8080;

persist(() => {
  server.listen(port, () => {
    console.log(`Code School 2021 Forum App`);
    console.log(`Server Running on port :${port}`);
  });
});


// more comments

//YEET OR BE YEETED