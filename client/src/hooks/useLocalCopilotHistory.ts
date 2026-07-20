import { useEffect, useState } from "react";

interface StoredMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const KEY = "vanguard_copilot_history";

export function useLocalCopilotHistory() {
  const [history, setHistory] = useState<StoredMessage[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setHistory(JSON.parse(raw));
  }, []);

  const save = (messages: StoredMessage[]) => {
    setHistory(messages);
    localStorage.setItem(KEY, JSON.stringify(messages));
  };

  const clear = () => {
    setHistory([]);
    localStorage.removeItem(KEY);
  };

  return { history, save, clear };
}