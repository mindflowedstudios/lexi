import { BaseApp } from "../base/types";
import { ChatsAppComponent } from "./components/ChatsAppComponent";

export const helpItems = [
  {
    icon: "💬",
    title: "Chat with Kassam",
    description:
      "Type your message to chat with Kassam, generate code, or get help with LexiOS.",
  },
  {
    icon: "📝",
    title: "Create & Edit Files",
    description:
      "Ask Kassam to create HTML applets, edit documents, read files, or search the Applets Store.",
  },
  {
    icon: "🚀",
    title: "Control Apps",
    description:
      "Ask Kassam to launch or close apps, switch themes, or control iPod playback.",
  },
  {
    icon: "#️⃣",
    title: "Join Chat Rooms",
    description:
      "Connect with others in public chat rooms. Mention @kassam for AI responses.",
  },
  {
    icon: "🎤",
    title: "Push to Talk",
    description:
      "Hold Space or tap the microphone button to record and send voice messages.",
  },
  {
    icon: "👋",
    title: "Nudge & DJ Mode",
    description:
      "Send 👋 nudge for sweet messages. Kassam becomes a DJ when music is playing.",
  },
];

export const appMetadata = {
  name: "Chats",
  version: "1.0",
  creator: {
    name: "Kassam",
    url: "https://kassam.dev",
  },
  github: "https://github.com/kassamkhoja",
  icon: "/icons/default/question.png",
};

export const ChatsApp: BaseApp = {
  id: "chats",
  name: "Chats",
  icon: { type: "image", src: appMetadata.icon },
  description: "Chat with Kassam, your boyfriend who built this for you 💕",
  component: ChatsAppComponent,
  helpItems,
  metadata: appMetadata,
};
