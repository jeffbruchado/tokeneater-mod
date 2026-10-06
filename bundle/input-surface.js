// ../../packages/shared/src/legal.ts
var SPONSOR_SESSION_LIFETIME_MS = 30 * 24 * 60 * 60 * 1e3;
var ABANDONED_DRAFT_RETENTION_MS = 30 * 24 * 60 * 60 * 1e3;
var EXPIRED_BAN_RETENTION_MS = 30 * 24 * 60 * 60 * 1e3;
var AUDIT_LOG_RETENTION_MS = 365 * 24 * 60 * 60 * 1e3;
var LAPSED_HOLD_RETENTION_MS = 7 * 24 * 60 * 60 * 1e3;
var UNUSED_LOGO_RETENTION_MS = 7 * 24 * 60 * 60 * 1e3;

// ../../packages/shared/src/engine/constants.ts
var TICK_RATE_HZ = 20;
var TICK_MS = 1e3 / TICK_RATE_HZ;
var START_MASS = 10;
var RADIUS_PER_SQRT_MASS = 10;
var SLIDE_STOP_SPEED = 5;
var EJECT_BLOB_MASS = 12;
var DECAY_RATE_PER_S = 2e-3;

// ../../packages/shared/src/engine/geometry.ts
function massToRadius(mass) {
  return mass > 0 ? RADIUS_PER_SQRT_MASS * Math.sqrt(mass) : 0;
}
function toUnitsPerTick(unitsPerSecond) {
  return unitsPerSecond / TICK_RATE_HZ;
}

// ../../packages/shared/src/engine/movement.ts
var STOP_SPEED = toUnitsPerTick(SLIDE_STOP_SPEED);
var STOP_SPEED_SQUARED = STOP_SPEED * STOP_SPEED;

// ../../packages/shared/src/engine/decay.ts
var DECAY_FACTOR_PER_TICK = 1 - DECAY_RATE_PER_S / TICK_RATE_HZ;

// ../../packages/shared/src/engine/virus.ts
var FULL_TURN = 2 * Math.PI;

// ../../packages/shared/src/mod/install.ts
var MOD_INSTALL = {
  /** The public repository the mod release publishes to: the marketplace players add. */
  marketplaceRepo: "jeffbruchado/tokeneater-mod",
  /**
   * The plugin's install id, `<plugin>@<marketplace>`: the `name` of
   * `apps/mod/plugin/.claude-plugin/plugin.json` and of `apps/mod/marketplace/marketplace.json`.
   */
  pluginId: "tokeneater@tokeneater",
  /** The plugin's command, which opens and closes the pane. */
  paneCommand: "/tokeneater",
  /** The Claude Code command that switches to the fullscreen layout, where the pane docks. */
  fullscreenCommand: "/tui fullscreen",
  /** Oldest Claude Code with the function hooks the plugin is built on. */
  minClaudeCodeVersion: "2.1.288",
  /** Oldest Node.js major the bridge runs on: the first with a global `WebSocket` by default. */
  minNodeMajor: 22,
  /** Narrowest terminal (columns) whose fullscreen layout docks the pane. */
  dockMinColumns: 110,
  /** Narrowest terminal (columns) the pane opens in by itself when a prompt is sent. */
  autoOpenMinColumns: 144
};
var MOD_HOTKEYS = {
  split: "e",
  eject: "q",
  respawn: "r",
  up: "w",
  left: "a",
  down: "s",
  right: "d"
};

// ../../packages/shared/src/protocol/messages.ts
var ROOM_NAME_MAX_BYTES = 32;
var ROOM_NAME_PATTERN = new RegExp(`^[a-z0-9-]{1,${String(ROOM_NAME_MAX_BYTES)}}$`);
var RECONNECT_GRACE_SECONDS = 5;
var JOIN_REJECTIONS = ["nickname", "banned"];
var JOIN_UNAVAILABILITIES = ["capacity", "rate_limited", "unavailable"];

// ../../packages/shared/src/protocol/utf8.ts
var { TextEncoder, TextDecoder } = globalThis;
var encoder = new TextEncoder();
var decoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });

// ../../packages/shared/src/protocol/client-codec.ts
var SPLIT_FLAG = 1;
var EJECT_FLAG = 2;
var KNOWN_FLAGS = SPLIT_FLAG | EJECT_FLAG;

// ../../packages/shared/src/protocol/slots.ts
var SPONSOR_LOGO_MAX_BYTES = 512 * 1024;

// ../../packages/shared/src/protocol/view.ts
var BASE_VIEW_HALF_WIDTH = 800;
var VIEW_GROWTH = 0.1;
var MAX_VIEW_HALF_WIDTH = 2400;
var VIEW_ASPECT_RATIO = 16 / 9;
function viewForMass(totalMass) {
  const growth = totalMass > 0 ? VIEW_GROWTH * Math.sqrt(totalMass / START_MASS) : 0;
  const halfWidth = Math.min(BASE_VIEW_HALF_WIDTH * (1 + growth), MAX_VIEW_HALF_WIDTH);
  return { halfWidth, halfHeight: halfWidth / VIEW_ASPECT_RATIO };
}

// ../../packages/shared/src/client/input/intent-sender.ts
var PRESS_SPACING_MS = TICK_MS + 10;
var MAX_HEADING_ERROR_RAD = Math.PI / 90;

// ../../packages/shared/src/client/net/connection-phase.ts
var RESUME_WINDOW_MS = RECONNECT_GRACE_SECONDS * 1e3;

// ../../packages/shared/src/client/net/lobby-client.ts
var REJECTIONS = new Set(JOIN_REJECTIONS);
var UNAVAILABILITIES = new Set(JOIN_UNAVAILABILITIES);

// ../../packages/shared/src/client/net/site-links.ts
var SPONSOR_PAGE_PATH = "/sponsor";
var SPONSOR_LOGIN_PATH = `${SPONSOR_PAGE_PATH}/login`;
var SPONSOR_DASHBOARD_PATH = `${SPONSOR_PAGE_PATH}/dashboard`;
var SIGN_IN_ERROR_PARAM = "error";
var SIGN_IN_ERROR_EXPIRED = "expired";
var EXPIRED_SIGN_IN_PATH = `${SPONSOR_LOGIN_PATH}?${SIGN_IN_ERROR_PARAM}=${SIGN_IN_ERROR_EXPIRED}`;
var MAGIC_LINK_LIFETIME_MS = 15 * 60 * 1e3;

// ../../packages/shared/src/client/render/camera.ts
var BASE_VIEW = viewForMass(0);

// ../../packages/shared/src/client/render/own-cells.ts
var CORRECTION_MS = 100;
var CORRECTION_TIME_CONSTANT_MS = CORRECTION_MS / 3;

// ../../packages/shared/src/client/render/palette.ts
var BLOB_RADIUS = massToRadius(EJECT_BLOB_MASS);

// src/pane-layout.ts
var DOCK_MIN_COLUMNS = MOD_INSTALL.dockMinColumns;
var AUTO_OPEN_MIN_COLUMNS = MOD_INSTALL.autoOpenMinColumns;
var STATUS_ROWS = 1;

// src/pane-input.ts
var MAX_AIM_OFFSET = 4;
var PANE_KEYS = [
  {
    id: "split",
    hotkey: MOD_HOTKEYS.split,
    label: "split",
    input: { kind: "press", action: "split" }
  },
  {
    id: "eject",
    hotkey: MOD_HOTKEYS.eject,
    label: "eject",
    input: { kind: "press", action: "eject" }
  },
  {
    id: "respawn",
    hotkey: MOD_HOTKEYS.respawn,
    label: "play again",
    input: { kind: "press", action: "respawn" }
  },
  { id: "up", hotkey: MOD_HOTKEYS.up, label: "up", input: { kind: "keys", dx: 0, dy: -1 } },
  { id: "left", hotkey: MOD_HOTKEYS.left, label: "left", input: { kind: "keys", dx: -1, dy: 0 } },
  { id: "down", hotkey: MOD_HOTKEYS.down, label: "down", input: { kind: "keys", dx: 0, dy: 1 } },
  { id: "right", hotkey: MOD_HOTKEYS.right, label: "right", input: { kind: "keys", dx: 1, dy: 0 } }
];
var SURFACE_KEYS = /* @__PURE__ */ new Map([
  [" ", { kind: "press", action: "split" }],
  ["space", { kind: "press", action: "split" }],
  ["return", { kind: "press", action: "respawn" }],
  ["up", { kind: "keys", dx: 0, dy: -1 }],
  ["left", { kind: "keys", dx: -1, dy: 0 }],
  ["down", { kind: "keys", dx: 0, dy: 1 }],
  ["right", { kind: "keys", dx: 1, dy: 0 }]
]);
function inputForKey(key) {
  const letter = key.toLowerCase();
  const paneKey = PANE_KEYS.find((entry) => entry.hotkey === letter);
  if (paneKey !== void 0) return paneKey.input;
  return SURFACE_KEYS.get(key) ?? null;
}
function aimAtPointer(point, region) {
  const mapRows = region.rows - STATUS_ROWS;
  if (region.columns < 1 || mapRows < 1) return null;
  const column = point.fine?.x ?? point.x + 0.5;
  const row = point.fine?.y ?? point.y + 0.5;
  return {
    kind: "aim",
    x: clampOffset(column / region.columns * 2 - 1),
    y: clampOffset(row / mapRows * 2 - 1)
  };
}
function clampOffset(offset) {
  return Math.min(Math.max(offset, -MAX_AIM_OFFSET), MAX_AIM_OFFSET);
}

// src/surface-message.ts
var MAX_PRESSES_PER_MESSAGE = 8;

// src/input-queue.ts
var POST_INTERVAL_MS = 33;
var InputQueue = class {
  steer = null;
  presses = [];
  /** Queues `input`. */
  add(input) {
    if (input.kind !== "press") {
      this.steer = input;
      return;
    }
    if (this.presses.length < MAX_PRESSES_PER_MESSAGE) this.presses.push(input.action);
  }
  /** The inputs queued since the last `take`, as one message; `null` when there were none. */
  take() {
    const { steer, presses } = this;
    if (steer === null && presses.length === 0) return null;
    this.steer = null;
    this.presses = [];
    return steer === null ? { presses } : { steer, presses };
  }
};

// plugin/hooks/input-surface.tsx
var InputSurface = (_props, surface) => {
  if (surface.state === void 0) {
    const queue = new InputQueue();
    surface.onPointer((event) => {
      if (event.type !== "down" && event.type !== "move") return;
      const aim = aimAtPointer(event, { columns: surface.columns, rows: surface.rows });
      if (aim !== null) queue.add(aim);
    });
    surface.onKey((event) => {
      const input = inputForKey(event.key);
      if (input !== null) queue.add(input);
    });
    surface.every(POST_INTERVAL_MS, () => {
      const message = queue.take();
      if (message !== null) surface.post({ ...message });
    });
    surface.setState({ queue });
  }
  const { Box } = surface.elements;
  return /* @__PURE__ */ h(Box, { width: surface.columns, height: surface.rows });
};
export {
  InputSurface
};
