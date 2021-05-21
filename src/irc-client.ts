const IRC = require("irc-framework");

export type Client = {
  on: (event: string, callback: (event: Event) => void) => void;
  join: (channel: string) => void;
  raw: (message: string) => void;
  say: (channel: string, message: string) => void;
  part: (channel: string) => void;
  quit: () => void;
};

export type ConnectOptions = {
  host: string;
  port: number;
  nick: string;
  password: string;
  tls: boolean;
};

type Event = {
  from_server?: boolean;
  line: string;
};

export async function connect(
  options: ConnectOptions,
  debug: boolean = false
): Promise<Client> {
  const client = new IRC.Client();

  if (debug) {
    client.on("debug", (event: Event) => {
      console.log("#", event);
    });

    client.on("raw", (event: Event) => {
      console.log(event.from_server ? "<" : ">", event.line.trim());
    });
  }

  client.connect(options);

  return new Promise((resolve, _reject) => {
    client.on("registered", () => resolve(client));
  });
}

export async function sync(client: Client): Promise<void> {
  client.raw("VERSION");

  return new Promise((resolve, _reject) => {
    client.on("raw", (raw) => {
      const msg = raw.line.split(" ");

      if (msg[1] === "351") {
        return resolve();
      }
    });
  });
}
