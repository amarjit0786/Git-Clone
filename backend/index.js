import express from "express";
import cors from "cors";
import http from "http";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Server } from "socket.io";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import initRepo from "./controllers/init.js";
import addRepo from "./controllers/add.js";
import commitRepo from "./controllers/commit.js";
import pushRepo from "./controllers/push.js";
import pullRepo from "./controllers/pull.js";
import revertRepo from "./controllers/revert.js";
import mainRouter from "./routes/main.router.js";

dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "Initialise a new repository", {}, startServer)
  .command("init", "Initialise a new repository", {}, initRepo)
  .command(
    "add <file>",
    "add a file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "file add to the staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    }
  )
  .command(
    "commit <message>",
    "commit to staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )
  .command("push", "Push commit to S3", {}, pushRepo)
  .command("pull", "Pull commit to S3", {}, pullRepo)
  .command(
    "revert <commitID>",
    "Revert to the specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "CommitID to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    }
  )
  .demandCommand(1, "You neew at least one command")
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  // app.use(cors({ origin: "*", methods: "GET,POST" }));
  app.use(bodyParser.json());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  mongoose
    .connect(process.env.MONGOdb_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB", err);
    });

    app.use(cors({ origin: "*" }));
  app.use( mainRouter); // Add this line  

  let user = "test";
  const httpSserver = http.createServer(app);
  const io = new Server(httpSserver, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (userID) => {
      user = userID;
      console.log("=======");
      console.log("User joined room: ", user);
      console.log("========");
      socket.join(userID);
    });

    // console.log("a user connected");
  });
  const db = mongoose.connection;

  db.once("open", async () => {
    console.log("CRUD operations are ready");
  });

  httpSserver.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
