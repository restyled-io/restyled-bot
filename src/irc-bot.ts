import * as IRC from "./irc-client";
import { Message } from "./message";

type Options = {
  nick: string;
  password: string;
  channel: string;
  debug: boolean;
};

export class Bot {
  constructor() {
    this.options = {
      nick: process.env.RESTYLED_BOT_IRC_NICK || "restyled-bot",
      password: process.env.RESTYLED_BOT_IRC_PASSWORD,
      channel: process.env.RESTYLED_BOT_IRC_CHANNEL || "#restyled-internal",
      debug: JSON.parse(process.env.RESTYLED_BOT_DEBUG || "false"),
    };

    this.client = null;
    this.reset();
  }

  public async send(message: Message): Promise<boolean> {
    if (this.client) {
      console.log("Sending message");
      this.client.say(
        this.options.channel,
        [message.title || "", message.body]
          .concat(message.links || [])
          .join("\n")
      );
      await IRC.sync(this.client);
      return true;
    } else {
      console.error("IRC Bot: client not ready");
      return false;
    }
  }

  public async reset(): Promise<void> {
    if (this.client) {
      this.disconnect();
      this.client = null;
    }

    this.client = await this.connect();
    this.client.join(this.options.channel);
    console.log("IRC Bot connected");
    console.log(`${this.options.channel} as ${this.options.nick}`);
  }

  public disconnect(): void {
    this.client.part(this.options.channel);
    this.client.quit();
  }

  private options: Options;
  private client: IRC.Client | null;

  private async connect(): Promise<IRC.Client> {
    return IRC.connect(
      {
        host: "irc.libera.chat",
        port: 6697,
        nick: this.options.nick,
        password: this.options.password,
        tls: true,
      },
      this.options.debug
    );
  }
}

export default new Bot();
