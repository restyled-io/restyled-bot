import * as express from "express";
import { Bot } from "./irc-bot";
import bot from "./irc-bot";
import { SlackBody } from "./slack";
import * as Slack from "./slack";

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
        const result = await this.irc.send(req.body.message);
        res.json({ result });
      } catch (ex) {
        next(ex);
      }
    });

    router.delete("/irc", async (_req, res) => {
      await this.irc.reset();
      res.json({});
    });

    router.post("/slack", async (req, res) => {
      const body: SlackBody = req.body;
      const messages = Slack.toMessages(body);
      const result = await this.irc.send(messages[0]); // TODO
      res.json({ result });
    });

    this.express.use("/", router);
  }
}

export default new App().express;
