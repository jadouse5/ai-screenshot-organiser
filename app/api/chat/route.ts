import { Groq } from 'groq-sdk';
import { Message } from 'ai';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Allow streaming responses up to 30 seconds

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const groqMessages = messages.map((message: Message) => {
    if (message.experimental_attachments && message.experimental_attachments.length > 0) {
      // Only process the first image
      const firstAttachment = message.experimental_attachments[0];
      return {
        role: message.role,
        content: [
          { type: 'text', text: message.content },
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
    temperature: 0.5,
    stream: false,
  });

  return new Response(JSON.stringify(completion.choices[0].message), {
    headers: { 'Content-Type': 'application/json' },
  });
}
