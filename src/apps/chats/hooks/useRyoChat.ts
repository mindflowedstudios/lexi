import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/stores/useAppStore";
import { useInternetExplorerStore } from "@/stores/useInternetExplorerStore";
import { useVideoStore } from "@/stores/useVideoStore";
import { useIpodStore } from "@/stores/useIpodStore";
import { useChatsStore } from "@/stores/useChatsStore";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { getApiUrl } from "@/utils/platform";

// Helper function to get system state for AI chat
const getSystemState = () => {
  const appStore = useAppStore.getState();
  const ieStore = useInternetExplorerStore.getState();
  const videoStore = useVideoStore.getState();
  const ipodStore = useIpodStore.getState();
  const chatsStore = useChatsStore.getState();
  const languageStore = useLanguageStore.getState();

  const currentVideo = videoStore.getCurrentVideo();
  const currentTrack = ipodStore.currentSongId
    ? ipodStore.tracks.find((t) => t.id === ipodStore.currentSongId)
    : ipodStore.tracks[0] ?? null;

  // Use new instance-based model
  const openInstances = Object.values(appStore.instances).filter(
    (inst) => inst.isOpen
  );

  const foregroundInstanceId =
    appStore.instanceOrder.length > 0
      ? appStore.instanceOrder[appStore.instanceOrder.length - 1]
      : null;

  const foregroundInstance = foregroundInstanceId
    ? appStore.instances[foregroundInstanceId]
    : null;

  const foregroundApp = foregroundInstance?.appId || null;

  const backgroundApps = openInstances
    .filter((inst) => inst.instanceId !== foregroundInstanceId)
    .map((inst) => inst.appId);

  return {
    // Keep legacy apps for backward compatibility; include instances
    apps: appStore.apps,
    instances: appStore.instances,
    username: chatsStore.username,
    locale: languageStore.current,
    runningApps: {
      foreground: foregroundApp,
      background: backgroundApps,
      instanceWindowOrder: appStore.instanceOrder,
    },
    internetExplorer: {
      url: ieStore.url,
      year: ieStore.year,
      status: ieStore.status,
      currentPageTitle: ieStore.currentPageTitle,
      aiGeneratedHtml: ieStore.aiGeneratedHtml,
    },
    video: {
      currentVideo: currentVideo
        ? {
            id: currentVideo.id,
            url: currentVideo.url,
            title: currentVideo.title,
            artist: currentVideo.artist,
          }
        : null,
      isPlaying: videoStore.isPlaying,
      loopAll: videoStore.loopAll,
      loopCurrent: videoStore.loopCurrent,
      isShuffled: videoStore.isShuffled,
    },
    ipod: {
      currentTrack: currentTrack
        ? {
            id: currentTrack.id,
            url: currentTrack.url,
            title: currentTrack.title,
            artist: currentTrack.artist,
          }
        : null,
      isPlaying: ipodStore.isPlaying,
      loopAll: ipodStore.loopAll,
      loopCurrent: ipodStore.loopCurrent,
      isShuffled: ipodStore.isShuffled,
    },
  };
};

interface UseKassamChatProps {
  currentRoomId: string | null;
  onScrollToBottom: () => void;
  roomMessages?: Array<{
    username: string;
    content: string;
    userId?: string;
    timestamp?: string;
  }>;
}

export function useKassamChat({
  currentRoomId,
  onScrollToBottom,
  roomMessages = [],
}: UseKassamChatProps) {
  const { t } = useTranslation();
  // Pull current auth credentials from store (reactive)
  const { authToken, username } = useChatsStore();

  // Build auth headers once per render (updates when authToken/username change)
  const authHeaders: Record<string, string> = {};
  if (authToken && username) {
    authHeaders["Authorization"] = `Bearer ${authToken}`;
    authHeaders["X-Username"] = username;
  }

  // Create a separate AI chat hook for @kassam mentions in chat rooms
  const {
    messages: kassamMessages,
    status,
    stop: stopKassam,
  } = useChat({
    transport: new DefaultChatTransport({
      api: getApiUrl("/api/chat"),
      body: {
        systemState: getSystemState(),
      },
      headers: authHeaders,
    }),
    // We no longer stream client-side AI to avoid spoofing. onFinish unused.
  });

  const isKassamLoading = status === "streaming" || status === "submitted";

  const handleKassamMention = useCallback(
    async (messageContent: string) => {
      // Get recent chat room messages as context (last 20 messages)
      const recentMessages = roomMessages
        .slice(-20)
        .map((msg) => `${msg.username}: ${msg.content}`)
        .join("\n");

      // Include chat room context in the system state
      const systemStateWithChat = {
        ...getSystemState(),
        chatRoomContext: {
          roomId: currentRoomId,
          recentMessages: recentMessages,
          mentionedMessage: messageContent,
        },
      };

      // Call server to generate and insert a @kassam reply using authenticated request
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (authToken && username) {
        headers["Authorization"] = `Bearer ${authToken}`;
        headers["X-Username"] = username;
      }

      await fetch(getApiUrl(`/api/chat-rooms?action=generateKassamReply`), {
        method: "POST",
        headers,
        body: JSON.stringify({
          roomId: currentRoomId,
          prompt: messageContent,
          systemState: systemStateWithChat,
        }),
      });

      onScrollToBottom();
    },
    [roomMessages, currentRoomId, authToken, username, onScrollToBottom]
  );

  const detectAndProcessMention = useCallback(
    (input: string): { isMention: boolean; messageContent: string } => {
      if (input.startsWith("@kassam ")) {
        // Extract the message content after @kassam
        const messageContent = input.substring(7).trim();
        return { isMention: true, messageContent };
      } else if (input === "@kassam") {
        // If they just typed @kassam without a message, treat it as a nudge
        return { isMention: true, messageContent: t("apps.chats.status.nudgeSent") };
      }
      return { isMention: false, messageContent: "" };
    },
    [t]
  );

  return {
    kassamMessages,
    isKassamLoading,
    stopKassam,
    handleKassamMention,
    detectAndProcessMention,
  };
}
