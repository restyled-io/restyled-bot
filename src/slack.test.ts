import * as Slack from "./slack";

test("toMessages", () => {
  const messages = Slack.toMessages({
    channel: "#channel",
    attachments: [
      {
        title:
          "Stack <https://.../cloudformation/home?region=us-east-1#/stack/detail?stackId=...|prod-services-webhooks-consumer> has entered status: UPDATE_IN_PROGRESS",
        text: "arn:aws:cloudformation:us-east-1:xxx:stack/prod-services-webhooks-consumer/yyy",
        color: "good",
      },
    ],
  });

  expect(messages.length).toBe(1);
  expect(messages[0].title).toBe(
    "Stack prod-services-webhooks-consumer has entered status: UPDATE_IN_PROGRESS"
  );
  expect(messages[0].body).toBe(
    "arn:aws:cloudformation:us-east-1:xxx:stack/prod-services-webhooks-consumer/yyy"
  );
  expect(messages[0].links.length).toBe(1);
  expect(messages[0].links[0]).toBe(
    "https://.../cloudformation/home?region=us-east-1#/stack/detail?stackId=..."
  );
});
