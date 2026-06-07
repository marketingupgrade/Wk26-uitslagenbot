// ────────────────────────────────────────────────────────────────────────────
//  Activity bus — maakt de waanzin zichtbaar.
//  Dit is bewust een losgekoppelde mini event-bus zodat jouw latere code
//  (live user-activity, "de bit", backend-stream, websockets, etc.) hier
//  zonder gedoe op kan aansluiten.
//
//  Plug-in voorbeeld (later):
//    activity.subscribe((event) => myWebsocket.send(event))
//    activity.push({ kind: "custom", text: "..." })
// ────────────────────────────────────────────────────────────────────────────

export type ActivityKind =
  | "system"
  | "user"
  | "bot"
  | "result"
  | "chaos"
  | "custom";

export type ActivityEvent = {
  id: string;
  kind: ActivityKind;
  text: string;
  ts: number;
};

type Listener = (event: ActivityEvent) => void;

class ActivityBus {
  private listeners = new Set<Listener>();
  private log: ActivityEvent[] = [];

  push(e: { kind: ActivityKind; text: string }): ActivityEvent {
    const event: ActivityEvent = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ts: Date.now(),
      ...e,
    };
    this.log.push(event);
    this.listeners.forEach((l) => l(event));
    return event;
  }

  subscribe(l: Listener): () => void {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  history(): ActivityEvent[] {
    return [...this.log];
  }
}

export const activity = new ActivityBus();
