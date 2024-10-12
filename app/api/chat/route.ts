import { Groq } from 'groq-sdk';
import { Message } from 'ai';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const groqMessages = messages.map((message: Message) => {
    if (message.experimental_attachments && message.experimental_attachments.length > 0) {
      const firstAttachment = message.experimental_attachments[0];
      return {
        role: message.role,
        content: [
          { 
            type: 'text', 
            text: message.content || "Analyze this screenshot. Provide only a concise name for the file, with no additional details or description. Respond with only the name."
          },
          {
            type: 'image_url',
            image_url: { url: firstAttachment.url },
          },
        ],
      };
    }
    return {
      role: message.role,
      content: message.content,
    };
  });

  const completion = await groq.chat.completions.create({
    model: 'llama-3.2-11b-vision-preview',
    messages: groqMessages,
    temperature: 0.2,
    stream: false,
    max_tokens: 10,
  });

  return new Response(JSON.stringify(completion.choices[0].message), {
    headers: { 'Content-Type': 'application/json' },
  });
}
