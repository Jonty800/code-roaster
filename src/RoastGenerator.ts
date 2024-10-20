import axios from "axios";
import { getConfig } from "./config";

interface Message {
  role: string;
  content: string;
}

export class RoastGenerator {
  private useOpenAI: boolean;

  constructor(useOpenAI: boolean = true) {
    this.useOpenAI = useOpenAI;
  }

  async generateRoast(code: string): Promise<string> {
    const messages = [
      {
        role: "system",
        content: `It's your mission to review to the following code with the most scathing, soul-crushing, and merciless roast imaginable, in the style of comedian Frankie Boyle.\n\n
        Be as vicious, as cruel, and as brutally honest as possible. Review parts of the input code and explain why they are so mind-boggling and cringe-worthy.\n\n
        Blocklist: "toddler", "olympic sport", "train-wreck".\n\n
        Desired Output: Produce a single short sentence that will leave the user in tears and emotionally scarred.`,
      },
      { role: "user", content: "Input code:\n\n ```" + code + "```" },
    ];

    if (this.useOpenAI) {
      return this.generateOpenAIRoast(messages);
    } else {
      return this.generateAnthropicRoast(messages);
    }
  }

  private async generateOpenAIRoast(messages: Message[]): Promise<string> {
    try {
      const config = getConfig();

      const textResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages,
        },
        {
          headers: {
            Authorization: `Bearer ${config["OPENAI_API_KEY"]}`,
            "Content-Type": "application/json",
          },
        }
      );

      return textResponse.data.choices[0].message.content;
    } catch (error) {
      console.error("Error generating OpenAI roast:", error);
      throw new Error("Failed to generate roast from OpenAI");
    }
  }

  private async generateAnthropicRoast(messages: Message[]): Promise<string> {
    try {
      const config = getConfig();

      const system = messages[0].content;

      const data = {
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        messages: [{ role: "user", content: messages[1].content }],
        system,
      };

      const response = await axios.post(
        "https://api.anthropic.com/v1/messages",
        data,
        {
          headers: {
            "x-api-key": config["ANTHROPIC_API_KEY"],
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
        }
      );

      return response.data.content[0].text;
    } catch (error) {
      console.error("Error generating Anthropic roast:", error);
      throw new Error("Failed to generate roast from Anthropic");
    }
  }
}
