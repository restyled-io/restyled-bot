import * as express from "express";
import { Bot } from "./irc-bot";
import bot from "./irc-bot";
import { Message } from "./message";

class App {
  public express: express.Express;

  private irc: Bot;

  constructor() {
    this.irc = bot;
    this.express = express();
    this.express.use(express.json());

    const router = express.Router();

    router.get("/", (_req, res) => {
      res.json({ message: "Go away, world!" });
    });

    router.post("/irc", async (req, res, next) => {
      try {
        const message: Message = req.body;
        const result = await this.irc.send(message);
        res.json({ result });
      } catch (ex) {
        next(ex);
      }
    });

    router.delete("/irc", async (_req, res, next) => {
      try {
        await this.irc.reset();
        res.json({});
      } catch (ex) {
        next(ex);
      }
    });

    this.express.use("/", router);
  }
}

export default new App().express;
