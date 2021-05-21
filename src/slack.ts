import { Message } from "./message";

export type SlackBody = {
  channel: string;
  attachments: SlackAttachment[];
};

export type SlackAttachment = {
  title: string;
  text: string;
  color: SlackColor;
};

export type SlackColor = "good" | "warning" | "danger";

type TextLinks = {
  text: string;
  links: string[];
};

function walkForLinks(input: string): TextLinks {
  const begin = input.indexOf("<");
  const divider = input.indexOf("|");
  const end = input.indexOf(">");

  if (begin === -1 || divider === -1 || end === -1) {
    return { text: input, links: [] };
  }

  if (begin > divider || divider > end) {
    return { text: input, links: [] };
  }

  const text = input.slice(0, begin - 1);
  const link = input.slice(begin + 1, divider);
  const linkText = input.slice(divider + 1, end);
  const remaining = input.slice(end + 2);
  const next = walkForLinks(remaining);

  return {
    text: `${text} ${linkText} ${next.text}`,
    links: [link].concat(next.links),
  };
}

export function toMessages(body: SlackBody): Message[] {
  return body.attachments.map((attachment) => {
    const title = walkForLinks(attachment.title);
    const text = walkForLinks(attachment.text);

    return {
      title: title.text,
      body: text.text,
      links: title.links.concat(text.links),
    };
  });
}
