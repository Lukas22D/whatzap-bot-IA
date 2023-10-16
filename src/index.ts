import { ChatCompletionRequestMessage } from "openai";
import { Message, Whatsapp, create } from "venom-bot";


import { openai } from "./lib/openai";


async function completion(
    messages: ChatCompletionRequestMessage[]
  ): Promise<string | undefined> {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0,
      max_tokens: 256,
      messages,
    })
  
    return completion.data.choices[0].message?.content
  }
  

create({
    session: "bot-gpt",
    disableWelcome: true,
})
    .then(async (client: Whatsapp) => await start(client))
    .catch((error) => {
        console.log(error);
    });

async function start(client: Whatsapp) {
    client.onMessage(async (message: Message) => {
        if (!message.body || message.isGroupMsg) return

        console.log(" message:", message.body)

        const response = (await completion([{role:'user', content: message.body}])) || "Descupa, não entendi"

        await client.sendText(message.from, response)
    });
}