// src/mod-options.ts
function readOptions(options) {
  const nickname = options["nickname"];
  return {
    nickname: typeof nickname === "string" ? nickname.trim() : "",
    isAutoOpenOn: options["autoOpen"] !== false
  };
}
function bridgeEnv(options, target) {
  const env = { TE_NICKNAME: options.nickname };
  const { size, surface } = target;
  if (size !== null) {
    env["TE_COLUMNS"] = String(size.columns);
    env["TE_ROWS"] = String(size.rows);
  }
  if (surface !== "terminal") env["TE_SURFACE"] = surface;
  return env;
}

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
var MAX_PLAYERS_PER_ROOM = 50;
var ROOM_NAME_MAX_BYTES = 32;
var ROOM_NAME_PATTERN = new RegExp(`^[a-z0-9-]{1,${String(ROOM_NAME_MAX_BYTES)}}$`);
var MAX_JOIN_EXCLUDE = 5;
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
var ROOMS_PATH = "/api/rooms";
var JOIN_PATH = "/api/join";
var DEFAULT_RETRY_AFTER_MS = 5e3;
var MIN_RETRY_AFTER_MS = 1e3;
var MAX_RETRY_AFTER_MS = 3e4;
var MS_PER_SECOND = 1e3;
var HTTP_FORBIDDEN = 403;
var HTTP_SERVICE_UNAVAILABLE = 503;
var HTTP_CLIENT_ERRORS_FROM = 400;
var HTTP_SERVER_ERRORS_FROM = 500;
function createLobbyClient(fetchFn, client = "web") {
  return {
    async rooms() {
      try {
        const response = await fetchFn(ROOMS_PATH, { headers: { accept: "application/json" } });
        if (!response.ok) return { ok: false };
        const body = await response.json();
        return isRoomsStatus(body) ? { ok: true, value: body } : { ok: false };
      } catch {
        return { ok: false };
      }
    },
    async join(request) {
      try {
        const response = await fetchFn(JOIN_PATH, {
          method: "POST",
          headers: { accept: "application/json", "content-type": "application/json" },
          body: JSON.stringify(joinBody(request, client)),
          cache: "no-store"
        });
        return await joinResult(response);
      } catch {
        return { ok: false, reason: "unreachable" };
      }
    }
  };
}
function joinBody(request, client) {
  const exclude = request.exclude?.slice(-MAX_JOIN_EXCLUDE) ?? [];
  const nickname = request.nickname ?? "";
  return {
    ...request.room === void 0 ? {} : { room: request.room },
    ...exclude.length === 0 ? {} : { exclude },
    ...nickname === "" ? {} : { nickname },
    ...client === "web" ? {} : { client }
  };
}
async function joinResult(response) {
  if (response.status === HTTP_SERVICE_UNAVAILABLE) {
    const reason = refusalReason(await bodyOf(response), isJoinUnavailability) ?? "unavailable";
    return { ok: false, reason, retryAfterMs: retryAfterMs(response.headers) };
  }
  if (response.status === HTTP_FORBIDDEN) {
    const reason = refusalReason(await bodyOf(response), isJoinRejection);
    return reason === null ? { ok: false, reason: "refused" } : { ok: false, reason };
  }
  if (response.status >= HTTP_CLIENT_ERRORS_FROM && response.status < HTTP_SERVER_ERRORS_FROM) {
    return { ok: false, reason: "refused" };
  }
  if (!response.ok) return { ok: false, reason: "unreachable" };
  const body = await response.json();
  if (!isPlacement(body)) return { ok: false, reason: "unreachable" };
  const { room, socketPath, requested } = body;
  return { ok: true, room, socketPath, requested: isRequestedRoom(requested) ? requested : null };
}
var REJECTIONS = new Set(JOIN_REJECTIONS);
var UNAVAILABILITIES = new Set(JOIN_UNAVAILABILITIES);
function isJoinRejection(value) {
  return REJECTIONS.has(value);
}
function isJoinUnavailability(value) {
  return UNAVAILABILITIES.has(value);
}
async function bodyOf(response) {
  try {
    return await response.json();
  } catch {
    return void 0;
  }
}
function refusalReason(body, isKnown) {
  if (!isRecord(body) || body["ok"] !== false) return null;
  const reason = body["reason"];
  return isKnown(reason) ? reason : null;
}
function retryAfterMs(headers) {
  const value = headers.get("retry-after")?.trim() ?? "";
  if (!/^\d+$/.test(value)) return DEFAULT_RETRY_AFTER_MS;
  const waitMs = Number(value) * MS_PER_SECOND;
  return Math.min(MAX_RETRY_AFTER_MS, Math.max(MIN_RETRY_AFTER_MS, waitMs));
}
function isPlacement(value) {
  return isRecord(value) && value["ok"] === true && isRoomName(value["room"]) && isSameOriginPath(value["socketPath"]);
}
function isRequestedRoom(value) {
  return isRecord(value) && isRoomName(value["room"]) && (value["outcome"] === "full" || value["outcome"] === "gone");
}
function isRoomName(value) {
  return typeof value === "string" && ROOM_NAME_PATTERN.test(value);
}
function isSameOriginPath(value) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//");
}
function isRoomsStatus(value) {
  if (!isRecord(value)) return false;
  const rooms = value["rooms"];
  const totals = value["totals"];
  return Array.isArray(rooms) && rooms.every(isRoomSummary) && isRecord(totals) && isCount(totals["rooms"]) && isCount(totals["players"]);
}
function isRoomSummary(value) {
  return isRecord(value) && typeof value["name"] === "string" && isCount(value["players"]);
}
function isRecord(value) {
  return typeof value === "object" && value !== null;
}
function isCount(value) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

// ../../packages/shared/src/client/net/room-link.ts
var ROOM_LINK_PREFIX = "/r/";
function roomPath(room) {
  return `${ROOM_LINK_PREFIX}${encodeURIComponent(room)}`;
}
function roomLink(origin, room) {
  return `${origin}${roomPath(room)}`;
}

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
var PANE_ID = "tokeneater";
var PANE_TITLE = "tokeneater";
var PANE_COLUMNS = 120;
var DOCK_MIN_COLUMNS = MOD_INSTALL.dockMinColumns;
var AUTO_OPEN_MIN_COLUMNS = MOD_INSTALL.autoOpenMinColumns;
var CONTROL_ROWS = 1;
var STATUS_ROWS = 1;
var MAX_RASTER_COLUMNS = 512;
var MAX_RASTER_ROWS = 256;
var PLAY_SURFACES = ["terminal", "desktop"];
var HUD_HEIGHT_PX = 244;
var DESKTOP_ROW_PX = 18.9;
var DESKTOP_HUD_ROWS = Math.ceil(HUD_HEIGHT_PX / DESKTOP_ROW_PX);
var HUD_REDRAW_INTERVAL_MS = 100;
function rasterSize(bodyColumns, bodyRows) {
  return gameSize(bodyColumns, Math.floor(bodyRows) - CONTROL_ROWS);
}
function desktopMapSize(bodyColumns, bodyRows, controlRows) {
  return gameSize(bodyColumns, Math.floor(bodyRows) - DESKTOP_HUD_ROWS - controlRows);
}
function gameSize(columns, rows) {
  const size = {
    columns: Math.min(Math.floor(columns), MAX_RASTER_COLUMNS),
    rows: Math.min(rows, MAX_RASTER_ROWS)
  };
  return size.columns < 1 || size.rows <= STATUS_ROWS ? null : size;
}
function isSameSize(a, b) {
  return a?.columns === b?.columns && a?.rows === b?.rows;
}
function isDockable(screen) {
  return screen !== null && screen.isFullscreen && screen.columns >= DOCK_MIN_COLUMNS;
}
function playSurfaceOf(surface) {
  return PLAY_SURFACES.find((play) => play === surface) ?? null;
}
function playSurface(surfaces, desktopDocks) {
  if (surfaces.includes("terminal")) return "terminal";
  return surfaces.includes("desktop") || desktopDocks !== null ? "desktop" : null;
}
function shouldAutoOpen(facts) {
  if (!facts.isAutoOpenOn) return false;
  if (facts.originKind !== "composer" || facts.isOpen) return false;
  if (facts.isMidTurn && facts.wasClosedThisTurn) return false;
  if (facts.surface === "desktop") return facts.desktopDocks === true;
  const { screen } = facts;
  return facts.surface === "terminal" && screen !== null && screen.isFullscreen && screen.columns >= AUTO_OPEN_MIN_COLUMNS;
}
var BLANK_CELL_BASE64 = "IAAAAAAAAAEAAAAB";
function blankCells(size) {
  return BLANK_CELL_BASE64.repeat(size.columns * size.rows);
}

// src/pane-text.ts
function withThousands(value) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
var DOCK_NOTICE = `tokeneater needs the fullscreen layout (${MOD_INSTALL.fullscreenCommand}) and a terminal at least ${String(DOCK_MIN_COLUMNS)} columns wide. Then run ${MOD_INSTALL.paneCommand} again.`;
var FALLBACK_NOTICE = "tokeneater cannot be played in this pane.";
var FALLBACK_READING = "Finding a room to play\u2026";
var FALLBACK_HOME_LABEL = "Play tokeneater in the browser";
function fallbackRoomLabel(room, seats) {
  return `Play room ${room} (${String(seats.players)}/${String(seats.max)}) in the browser`;
}
var FALLBACK_OPENED_TEXT = "tokeneater is open: it cannot be played here, so it links to a room to play in the browser.";
var IDLE_NOTICE = "Press r to play.";
var RESTARTING_NOTICE = "The game stopped: starting it again\u2026";
var TOO_SMALL_NOTICE = "The pane is too small to play in: make it taller.";
var RETRY_HINT = "Press r to try again.";
var OPENED_TEXT = `tokeneater is open: steer with the pointer or ${MOD_HOTKEYS.up} ${MOD_HOTKEYS.left} ${MOD_HOTKEYS.down} ${MOD_HOTKEYS.right}, ${MOD_HOTKEYS.split} splits, ${MOD_HOTKEYS.eject} ejects (after a click on the map, the arrows and Space too). Esc returns to the prompt.`;
var DESKTOP_KEY_HINT = `Click the map, then ${[MOD_HOTKEYS.up, MOD_HOTKEYS.left, MOD_HOTKEYS.down, MOD_HOTKEYS.right].join(" ").toUpperCase()} or the arrows steer.`;
function playingElsewhereNotice(surface) {
  return `tokeneater is playing in ${surface === "desktop" ? "the desktop app" : "the terminal"} now.`;
}
var HIDDEN_GAME_NOTICE = "tokeneater is still playing, out of view here: dock the pane again to see it, or close it to leave the game.";
var CLOSED_TEXT = "tokeneater closed.";
var COMMAND_DESCRIPTION = "Play tokeneater in a side pane (run again to close it)";
function turnToast(status) {
  const done = "Claude is done: back to your prompt whenever you like.";
  if (status === null || status.phase !== "playing" || status.isDead || status.room === null) {
    return done;
  }
  return `${done} You are at mass ${withThousands(status.mass)} in room ${status.room}.`;
}

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

// src/surface-message.ts
var MAX_PRESSES_PER_MESSAGE = 8;
var MAX_STEERS_PER_MESSAGE = 8;
var PANE_ACTIONS = ["split", "eject", "respawn"];
var KEY_DIRECTIONS = [-1, 0, 1];
function messageInputs(message) {
  const presses = message.presses.map((action) => ({ kind: "press", action }));
  return [...message.steers ?? [], ...presses];
}
function parseSurfaceMessage(data) {
  if (!isRecord2(data) || !hasOnly(data, ["steers", "presses"])) return null;
  const { steers, presses } = data;
  if (!Array.isArray(presses) || presses.length > MAX_PRESSES_PER_MESSAGE) return null;
  if (!presses.every(isPaneAction)) return null;
  if (steers === void 0) return { presses };
  if (!Array.isArray(steers) || steers.length > MAX_STEERS_PER_MESSAGE) return null;
  const parsed = steers.map(parseSteer);
  return parsed.every(isSteer) ? { steers: parsed, presses } : null;
}
function isSteer(value) {
  return value !== null;
}
function parseSteer(value) {
  if (!isRecord2(value)) return null;
  if (value["kind"] === "aim" && hasOnly(value, ["kind", "x", "y"])) {
    const { x, y } = value;
    return isAimOffset(x) && isAimOffset(y) ? { kind: "aim", x, y } : null;
  }
  if (value["kind"] === "keys" && hasOnly(value, ["kind", "dx", "dy"])) {
    const { dx, dy } = value;
    return isKeyDirection(dx) && isKeyDirection(dy) ? { kind: "keys", dx, dy } : null;
  }
  return null;
}
function isRecord2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function hasOnly(value, keys) {
  return Object.keys(value).every((key) => keys.includes(key));
}
function isAimOffset(value) {
  return typeof value === "number" && Number.isFinite(value) && Math.abs(value) <= MAX_AIM_OFFSET;
}
function isKeyDirection(value) {
  return KEY_DIRECTIONS.some((direction) => direction === value);
}
function isPaneAction(value) {
  return PANE_ACTIONS.some((action) => action === value);
}

// src/map-rows.ts
var HEX_COLOUR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
function readMapRows(value) {
  if (!isRecord3(value)) return null;
  const { columns, rows } = value;
  const palette = listOf(value["palette"]);
  const lines = listOf(value["lines"]);
  if (!isCount2(columns) || !isCount2(rows) || lines === null) return null;
  if (palette === null || palette.length === 0 || !palette.every(isHexColour)) return null;
  const read = [];
  let rowCount = 0;
  for (const line of lines) {
    const mapLine = readLine(line, { columns, colours: palette.length });
    if (mapLine === null) return null;
    rowCount += typeof mapLine === "number" ? mapLine : 1;
    read.push(mapLine);
  }
  if (rowCount !== rows) return null;
  return { columns, rows, palette, lines: read };
}
function readLine(value, bounds) {
  if (isCount2(value)) return value;
  const items = listOf(value);
  if (items === null) return null;
  const segments = [];
  let end = 0;
  for (const item of items) {
    const segment = readSegment(item, bounds.colours);
    if (segment === null) return null;
    end += segment[0] + segment[1];
    segments.push(segment);
  }
  return end <= bounds.columns ? segments : null;
}
function readSegment(value, colours) {
  const fields = listOf(value);
  if (fields === null) return null;
  const [margin, width, ...rest] = fields;
  if (!isWhole(margin) || !isCount2(width)) return null;
  const isColour = (colour) => isWhole(colour) && colour < colours;
  if (rest.length === 1) {
    const [colour] = rest;
    return isColour(colour) && colour > 0 ? [margin, width, colour] : null;
  }
  if (rest.length === 2) {
    const [top, bottom] = rest;
    return isColour(top) && isColour(bottom) ? [margin, width, top, bottom] : null;
  }
  const [background, ink, text] = rest;
  const isText = rest.length === 3 && typeof text === "string";
  return isText && isColour(background) && isColour(ink) ? [margin, width, background, ink, text] : null;
}
function isHexColour(value) {
  return typeof value === "string" && HEX_COLOUR.test(value);
}
function listOf(value) {
  return Array.isArray(value) ? value : null;
}
function isRecord3(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isWhole(value) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
function isCount2(value) {
  return isWhole(value) && value > 0;
}

// src/bridge-lines.ts
var SVG_SOURCE_MAX_CHARS = 131072;
var SVG_ALT_MAX_CHARS = 200;
var LineReader = class {
  pending = "";
  /** Takes the next piece of stdout; what the lines it completed said. */
  push(text) {
    const read = this.pending + text;
    const end = read.lastIndexOf("\n");
    this.pending = read.slice(end + 1);
    let batch = { events: [], frame: null, map: null, hud: null };
    if (end < 0) return batch;
    for (const line of read.slice(0, end).split("\n")) batch = takeLine(batch, readLine2(line));
    return batch;
  }
};
function takeLine(batch, line) {
  if (line === null) return batch;
  if ("cells" in line) return { ...batch, frame: line };
  switch (line.kind) {
    case "map":
      return { ...batch, map: line.rows };
    case "hud":
      return { ...batch, hud: line.hud };
    default:
      batch.events.push(line);
      return batch;
  }
}
function readLine2(line) {
  const space = line.indexOf(" ");
  if (space < 0) return null;
  const rest = line.slice(space + 1);
  switch (line.slice(0, space)) {
    case "READY":
      return readReady(rest);
    case "F":
      return readFrame(rest);
    case "C":
      return readMap(rest);
    case "V":
      return readHud(rest);
    case "S":
      return readStatus(rest);
    case "E":
      return { kind: "problem", message: rest };
    default:
      return null;
  }
}
function readReady(text) {
  const [port, token, ...extra] = text.split(" ");
  if (extra.length > 0 || token === void 0 || token === "") return null;
  const number = wholeNumber(port);
  return number === null ? null : { kind: "ready", port: number, token };
}
function readFrame(text) {
  const [columnsText, rowsText, cells, ...extra] = text.split(" ");
  const columns = wholeNumber(columnsText);
  const rows = wholeNumber(rowsText);
  if (extra.length > 0 || columns === null || rows === null || cells === void 0) return null;
  return { size: { columns, rows }, cells };
}
function readMap(text) {
  const rows = readMapRows(parseJson(text));
  return rows === null ? null : { kind: "map", rows };
}
function readHud(text) {
  const value = parseJson(text);
  if (!isRecord4(value)) return null;
  const { svg, alt, w, h: h2 } = value;
  const isHud = typeof svg === "string" && svg.length <= SVG_SOURCE_MAX_CHARS && typeof alt === "string" && alt.length <= SVG_ALT_MAX_CHARS && isLength(w) && isLength(h2);
  return isHud ? { kind: "hud", hud: { svg, alt, w, h: h2 } } : null;
}
function readStatus(text) {
  const value = parseJson(text);
  if (!isRecord4(value)) return null;
  const { phase, room, mass, isDead } = value;
  const isStatus = typeof phase === "string" && (typeof room === "string" || room === null) && typeof mass === "number" && typeof isDead === "boolean";
  return isStatus ? { kind: "status", status: { phase, room, mass, isDead } } : null;
}
function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return void 0;
  }
}
function isLength(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function isRecord4(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function wholeNumber(text) {
  return text !== void 0 && /^\d+$/.test(text) ? Number(text) : null;
}

// src/bridge-run.ts
var MIN_NODE_MAJOR = MOD_INSTALL.minNodeMajor;
var NODE_VERSION_ARGV = ["node", "--version"];
var NODE_CHECK_TIMEOUT_MS = 1e4;
function nodeProblem(exitCode, stdout) {
  const needs = `tokeneater needs Node.js ${String(MIN_NODE_MAJOR)} or newer to play`;
  if (stdout === null || exitCode !== 0) return `${needs} (Node.js was not found).`;
  const version = stdout.trim();
  const major = Number(/^v(\d+)\./.exec(version)?.[1] ?? 0);
  return major >= MIN_NODE_MAJOR ? null : `${needs} (found ${version}).`;
}
var FATAL_EXIT_CODES = [2, 3];
var MAX_RESTARTS = 2;
var RESTART_DELAY_MS = 1e3;
function shouldRestart(end, restartsSoFar) {
  if (end.code !== null && FATAL_EXIT_CODES.includes(end.code)) return false;
  return restartsSoFar < MAX_RESTARTS;
}
function endProblem(end, lastProblem) {
  if (lastProblem !== null) return lastProblem;
  if (end.signal !== null) return `The game stopped (${end.signal}).`;
  return `The game stopped (exit code ${String(end.code)}).`;
}

// src/control-requests.ts
var CONTROL_PATHS = {
  input: "/input",
  press: "/press",
  resize: "/resize",
  leave: "/leave"
};
var TOKEN_HEADER = "x-te-token";
function inputRequest(input) {
  switch (input.kind) {
    case "aim":
      return { path: CONTROL_PATHS.input, body: { x: input.x, y: input.y } };
    case "keys":
      return { path: CONTROL_PATHS.input, body: { keys: { dx: input.dx, dy: input.dy } } };
    case "press":
      return { path: CONTROL_PATHS.press, body: { action: input.action } };
  }
}
function resizeRequest(size) {
  return { path: CONTROL_PATHS.resize, body: { columns: size.columns, rows: size.rows } };
}
var LEAVE_REQUEST = { path: CONTROL_PATHS.leave, body: {} };
function controlUrl(port, path) {
  return `http://127.0.0.1:${String(port)}${path}`;
}

// plugin/hooks/bridge-control.ts
async function requestControl($, run, request) {
  if (run.control === null) return false;
  const { port, token } = run.control;
  try {
    const response = await $.http.fetch(controlUrl(port, request.path), {
      method: "POST",
      headers: { "content-type": "application/json", [TOKEN_HEADER]: token },
      body: JSON.stringify(request.body)
    });
    if (!response.ok) {
      $.ui.log(`tokeneater bridge: ${request.path} answered ${String(response.status)}`, {
        to: "debug"
      });
    }
    return response.ok;
  } catch (error) {
    $.ui.log(`tokeneater bridge: ${request.path} failed: ${String(error)}`, { to: "debug" });
    return false;
  }
}
async function checkNode($) {
  try {
    const { exitCode, stdout } = await $.process.run(NODE_VERSION_ARGV, {
      timeoutMs: NODE_CHECK_TIMEOUT_MS
    });
    return nodeProblem(exitCode, stdout);
  } catch {
    return nodeProblem(1, null);
  }
}

// plugin/hooks/desktop-frames.ts
function keepMap(host, rows) {
  host.lastMap = rows;
}
function handOutMap(host) {
  const rows = host.lastMap;
  if (rows === null || rows === host.answeredMap) return void 0;
  host.answeredMap = rows;
  return rows;
}
async function keepHud($, host, hud) {
  host.lastHud = hud;
  host.hud.isOwed = true;
  if (host.hud.isPacing) return;
  host.hud.isPacing = true;
  while (host.hud.isOwed) {
    host.hud.isOwed = false;
    $.ui.invalidate("ui.render");
    await $.clock.sleep(HUD_REDRAW_INTERVAL_MS);
  }
  host.hud.isPacing = false;
}
function forgetDesktopFrames(host) {
  host.lastMap = null;
  host.answeredMap = null;
  host.lastHud = null;
}

// plugin/hooks/host-state.ts
var RASTER_KEY = "game";
function createBridgeHost(options) {
  return {
    options,
    run: null,
    starting: null,
    isWanted: false,
    isRestarting: false,
    restarts: 0,
    hasNode: false,
    problem: null,
    lastFrame: null,
    mountedSize: null,
    lastStatus: null,
    surface: "terminal",
    lastMap: null,
    answeredMap: null,
    lastHud: null,
    hud: { isPacing: false, isOwed: false },
    fallback: null
  };
}
function hostPhase(host) {
  if (host.isRestarting) return "restarting";
  if (host.run !== null || host.starting !== null) return "running";
  return host.problem === null ? "idle" : "failed";
}
function hostStatus(host) {
  return host.run === null ? null : host.lastStatus;
}
function cellsFor(host, size) {
  const frame = host.lastFrame;
  return frame !== null && isSameSize(frame.size, size) ? frame.cells : blankCells(size);
}

// plugin/hooks/bridge-host.ts
var BRIDGE_ENTRY = "bundle/bridge.mjs";
async function startBridge($, host, surface) {
  host.isWanted = true;
  host.surface = surface;
  if (host.run !== null) return;
  host.starting ??= spawnBridge($, host).finally(() => {
    host.starting = null;
    $.ui.invalidate("ui.render");
  });
  await host.starting;
}
async function stopBridge($, host) {
  host.isWanted = false;
  const { run } = host;
  if (run === null) return;
  run.isEnding = true;
  await leaveBridge($, run);
}
async function sendInput($, host, { input, surface }) {
  const isPlayAgain = input.kind === "press" && input.action === "respawn";
  if (isPlayAgain && hostPhase(host) !== "running") {
    host.restarts = 0;
    await startBridge($, host, surface);
    return;
  }
  if (host.run !== null) await requestControl($, host.run, inputRequest(input));
}
async function forwardMessage($, host, { input: message, surface }) {
  for (const input of messageInputs(message)) await sendInput($, host, { input, surface });
}
function mountPane($, host, size) {
  host.mountedSize = size;
  const { run } = host;
  if (run === null || run.control === null || isSameSize(run.size, size)) return;
  run.size = size;
  void requestControl($, run, resizeRequest(size));
}
async function spawnBridge($, host) {
  host.problem = null;
  host.lastStatus = null;
  $.ui.invalidate("ui.render");
  const problem = host.hasNode ? null : await checkNode($);
  if (problem !== null) {
    failBridge($, host, problem);
    return;
  }
  host.hasNode = true;
  if (!host.isWanted) return;
  const { mountedSize: size, surface } = host;
  const run = {
    stream: $.process.spawn({
      argv: ["node", `${$.plugin.root}/${BRIDGE_ENTRY}`],
      env: bridgeEnv(host.options, { size, surface })
    }),
    control: null,
    size,
    surface,
    lastProblem: null,
    isEnding: false
  };
  host.run = run;
  void readBridge($, { host, run });
}
async function readBridge($, running) {
  const { stream } = running.run;
  const reader = new LineReader();
  let end = { code: null, signal: null };
  try {
    for await (const piece of stream) {
      if (piece.stream === "stderr") {
        $.ui.log(piece.text.trimEnd(), { to: "debug" });
        continue;
      }
      const batch = reader.push(piece.text);
      for (const event of batch.events) takeEvent($, running, event);
      if (batch.frame !== null) await paintFrame($, running.host, batch.frame);
      if (batch.map !== null) keepMap(running.host, batch.map);
      if (batch.hud !== null) void keepHud($, running.host, batch.hud);
    }
    end = await stream.result;
  } catch (error) {
    $.ui.log(`tokeneater bridge: ${String(error)}`, { to: "debug" });
  }
  await bridgeEnded($, running, end);
}
function takeEvent($, { host, run }, event) {
  switch (event.kind) {
    case "ready":
      run.control = { port: event.port, token: event.token };
      if (run.isEnding) void leaveBridge($, run);
      else if (host.mountedSize !== null) mountPane($, host, host.mountedSize);
      break;
    case "status":
      host.lastStatus = event.status;
      if (event.status.phase === "playing") host.restarts = 0;
      break;
    case "problem":
      run.lastProblem = event.message;
      $.ui.log(`tokeneater bridge: ${event.message}`, { to: "debug" });
  }
}
async function paintFrame($, host, frame) {
  host.lastFrame = frame;
  if (!isSameSize(frame.size, host.mountedSize)) return;
  await $.ui.blit({
    requestId: PANE_ID,
    key: RASTER_KEY,
    cells: frame.cells,
    columns: frame.size.columns,
    rows: frame.size.rows
  });
}
async function bridgeEnded($, running, end) {
  const { host, run } = running;
  host.run = null;
  host.lastFrame = null;
  forgetDesktopFrames(host);
  if (!host.isWanted) {
    $.ui.invalidate("ui.render");
    return;
  }
  if (run.isEnding) {
    await startBridge($, host, host.surface);
    return;
  }
  if (!shouldRestart(end, host.restarts)) {
    failBridge($, host, endProblem(end, run.lastProblem));
    return;
  }
  host.restarts += 1;
  host.isRestarting = true;
  $.ui.invalidate("ui.render");
  await $.clock.sleep(RESTART_DELAY_MS);
  host.isRestarting = false;
  if (host.isWanted) await startBridge($, host, run.surface);
  else $.ui.invalidate("ui.render");
}
function failBridge($, host, problem) {
  host.problem = problem;
  $.ui.log(`tokeneater: ${problem}`, { to: "debug" });
  $.ui.invalidate("ui.render");
}
async function leaveBridge($, run) {
  if (run.control === null) return;
  if (!await requestControl($, run, LEAVE_REQUEST)) killBridge($, run);
}
function killBridge($, run) {
  $.ui.log("tokeneater bridge: /leave was not taken, ending the bridge", { to: "debug" });
  void run.stream.return({ code: null, signal: null }).catch((error) => {
    $.ui.log(`tokeneater bridge: could not end it: ${String(error)}`, { to: "debug" });
  });
}

// src/desktop-controls.ts
var KEY_CHROME_COLUMNS = 5;
var KEY_GAP_COLUMNS = 1;
function desktopControlRows(columns) {
  const width = Math.max(1, Math.floor(columns));
  const buttons = PANE_KEYS.map((key) => key.label.length + KEY_CHROME_COLUMNS);
  const words = DESKTOP_KEY_HINT.split(" ").map((word) => word.length);
  return wrappedRows(buttons, KEY_GAP_COLUMNS, width) + wrappedRows(words, 1, width);
}
function wrappedRows(widths, gap, width) {
  let rows = 1;
  let used = 0;
  for (const piece of widths) {
    const next = used === 0 ? piece : used + gap + piece;
    if (next > width && used > 0) {
      rows += 1;
      used = piece;
    } else {
      used = next;
    }
  }
  return rows;
}

// src/fallback.ts
var GAME_SITE_ORIGIN = "https://playtokeneater.com";
var ROOMS_URL = `${GAME_SITE_ORIGIN}${ROOMS_PATH}`;
var ROOMS_READ_TIMEOUT_MS = 3e3;
async function roomsOf(answer) {
  const response = lobbyResponseOf(answer);
  const lobby = createLobbyClient(() => Promise.resolve(response));
  const read = await lobby.rooms();
  return read.ok ? read.value : null;
}
function fallbackTarget(rooms) {
  const open = (rooms?.rooms ?? []).filter(
    (room) => room.players < MAX_PLAYERS_PER_ROOM && ROOM_NAME_PATTERN.test(room.name)
  );
  const fullest = open.reduce(
    (best, room) => best === null || room.players > best.players ? room : best,
    null
  );
  if (fullest === null) return { href: `${GAME_SITE_ORIGIN}/`, label: FALLBACK_HOME_LABEL };
  return {
    href: roomLink(GAME_SITE_ORIGIN, fullest.name),
    label: fallbackRoomLabel(fullest.name, { players: fullest.players, max: MAX_PLAYERS_PER_ROOM })
  };
}
function lobbyResponseOf(answer) {
  return {
    ok: answer.ok,
    status: answer.status,
    headers: { get: (name) => answer.headers[name.toLowerCase()] ?? null },
    // Parsed inside the promise: a body that is not JSON rejects, as a `fetch` response's does.
    json: () => Promise.resolve(answer.text).then((text) => JSON.parse(text))
  };
}

// plugin/hooks/fallback-pane.tsx
var LINK_KEY = "play-in-browser";
function drawFallback($, e, host) {
  const { Box, Text, Link } = $.ui.resolve(e);
  if (host.run !== null) {
    const isHere = host.run.surface === e.surface;
    return /* @__PURE__ */ h(Text, null, isHere ? HIDDEN_GAME_NOTICE : playingElsewhereNotice(host.run.surface));
  }
  if (host.fallback === null) void readFallback($, host);
  const target = host.fallback?.target ?? null;
  return /* @__PURE__ */ h(Box, { key: "pane", flexDirection: "column" }, /* @__PURE__ */ h(Text, null, FALLBACK_NOTICE), target === null ? /* @__PURE__ */ h(Text, { dimColor: true }, FALLBACK_READING) : /* @__PURE__ */ h(Link, { key: LINK_KEY, href: target.href, label: target.label }));
}
async function readFallback($, host) {
  const read = { target: null };
  host.fallback = read;
  read.target = fallbackTarget(await readRooms($));
  if (host.fallback === read) $.ui.invalidate("ui.render");
}
function forgetFallback(host) {
  host.fallback = null;
}
async function readRooms($) {
  let endWait = () => void 0;
  const waited = new Promise((resolve) => {
    endWait = resolve;
  });
  const timer = $.clock.after(ROOMS_READ_TIMEOUT_MS, () => {
    endWait(null);
  });
  try {
    return await Promise.race([fetchRooms($), waited]);
  } finally {
    timer.cancel();
  }
}
async function fetchRooms($) {
  try {
    const answer = await $.http.fetch(ROOMS_URL, { headers: { accept: "application/json" } });
    return await roomsOf(answer);
  } catch (error) {
    $.ui.log(`tokeneater fallback: the rooms read failed: ${String(error)}`, { to: "debug" });
    return null;
  }
}

// plugin/hooks/pane-parts.tsx
var BUTTON_GAP = 2;
function drawKeys($, e, host) {
  const { Box, Button } = $.ui.resolve(e);
  return /* @__PURE__ */ h(Box, { key: "keys", flexDirection: "row", flexWrap: "wrap", columnGap: BUTTON_GAP }, PANE_KEYS.map((key) => /* @__PURE__ */ h(
    Button,
    {
      key: key.id,
      label: key.label,
      hotkey: key.hotkey,
      plain: true,
      onPress: () => {
        void sendInput($, host, { input: key.input, surface: e.surface });
      }
    }
  )));
}
function noticeOf(host, isTooSmall) {
  switch (hostPhase(host)) {
    case "idle":
      return IDLE_NOTICE;
    case "failed":
      return `${host.problem ?? ""} ${RETRY_HINT}`;
    case "restarting":
      return RESTARTING_NOTICE;
    case "running":
      return isTooSmall ? TOO_SMALL_NOTICE : null;
  }
}

// plugin/hooks/desktop-pane.tsx
var MAP_KEY = "map";
function drawDesktopPane($, e, host) {
  const isDocked = e.props.placement === "dock" && e.viewport?.isFullscreen === true;
  if (!isDocked) return drawFallback($, e, host);
  const { Box, Text } = $.ui.resolve(e);
  if (host.run !== null && host.run.surface !== "desktop") {
    return /* @__PURE__ */ h(Text, null, playingElsewhereNotice(host.run.surface));
  }
  const { bodyColumns } = e.props;
  const size = desktopMapSize(
    bodyColumns,
    e.props.scroll.bodyRows,
    desktopControlRows(bodyColumns)
  );
  const notice = noticeOf(host, size === null);
  if (size === null || notice !== null) {
    return /* @__PURE__ */ h(Box, { key: "pane", flexDirection: "column" }, /* @__PURE__ */ h(Text, null, notice ?? TOO_SMALL_NOTICE), drawKeys($, e, host));
  }
  mountPane($, host, size);
  return drawDesktopGame($, e, { host, size });
}
function drawDesktopGame($, e, { host, size }) {
  const { Box, Text, Svg, Client } = $.ui.resolve(e);
  const hud = host.lastHud;
  return /* @__PURE__ */ h(Box, { key: "pane", flexDirection: "column" }, /* @__PURE__ */ h(
    Client,
    {
      key: MAP_KEY,
      module: "./map-surface.js",
      width: size.columns,
      height: size.rows,
      props: host.lastMap
    }
  ), /* @__PURE__ */ h(Box, { key: "hud", height: DESKTOP_HUD_ROWS, flexShrink: 0 }, hud !== null && /* @__PURE__ */ h(Svg, { source: hud.svg, alt: hud.alt, width: hud.w, height: hud.h })), drawKeys($, e, host), /* @__PURE__ */ h(Text, { dimColor: true }, DESKTOP_KEY_HINT));
}

// plugin/hooks/pane.tsx
var INPUT_KEY = "input";
function drawPane($, e, host) {
  if (e.surface === "desktop") return drawDesktopPane($, e, host);
  if (e.surface !== "terminal") return drawFallback($, e, host);
  const { Box, Text } = $.ui.resolve(e);
  if (e.props.placement === "inline") return /* @__PURE__ */ h(Text, null, DOCK_NOTICE);
  if (host.run !== null && host.run.surface !== "terminal") {
    return /* @__PURE__ */ h(Text, null, playingElsewhereNotice(host.run.surface));
  }
  const size = rasterSize(e.props.bodyColumns, e.props.scroll.bodyRows);
  const notice = noticeOf(host, size === null);
  if (size === null || notice !== null) {
    return /* @__PURE__ */ h(Box, { key: "pane", flexDirection: "column" }, /* @__PURE__ */ h(Text, null, notice ?? TOO_SMALL_NOTICE), drawKeys($, e, host));
  }
  mountPane($, host, size);
  return drawGame($, e, { host, size });
}
function drawGame($, e, { host, size }) {
  const { Box, Raster, Client } = $.ui.resolve(e);
  return /* @__PURE__ */ h(Box, { key: "pane", flexDirection: "column" }, /* @__PURE__ */ h(Box, { key: "game", width: size.columns, height: size.rows }, /* @__PURE__ */ h(
    Raster,
    {
      key: RASTER_KEY,
      columns: size.columns,
      rows: size.rows,
      cells: cellsFor(host, size)
    }
  ), /* @__PURE__ */ h(Box, { key: "overlay", position: "absolute", top: 0, left: 0 }, /* @__PURE__ */ h(
    Client,
    {
      key: INPUT_KEY,
      module: "./input-surface.js",
      width: size.columns,
      height: size.rows
    }
  ))), drawKeys($, e, host));
}

// src/mod-log.ts
function surfaceLog(surface, isDocked) {
  return `tokeneater.surface ${surface ?? "none"} ${isDocked ? "dock" : "inline"}`;
}

// plugin/hooks/pane-hooks.ts
var CLOSED_THIS_TURN = { plugin: "tokeneater", key: "closedThisTurn" };
function measureScreen(mod, viewport) {
  if (viewport?.isFullscreen === void 0) return;
  mod.screen = { columns: viewport.columns, isFullscreen: viewport.isFullscreen };
}
function measureDesktop(mod, viewport) {
  if (viewport?.isFullscreen === void 0) return;
  mod.desktopDocks = viewport.isFullscreen;
}
function forgetDesktop(mod) {
  mod.desktopDocks = null;
}
async function openOnSubmit($, mod, e) {
  const isMidTurn = e.turnId !== void 0;
  if (!isMidTurn) await $.state.set(CLOSED_THIS_TURN, false);
  if (!mod.host.options.isAutoOpenOn) return;
  const { value: wasClosedThisTurn = false } = await $.state.get(CLOSED_THIS_TURN);
  const surface = await surfaceOf($, mod);
  const facts = {
    isAutoOpenOn: mod.host.options.isAutoOpenOn,
    originKind: e.origin.kind,
    isMidTurn,
    wasClosedThisTurn,
    surface,
    screen: mod.screen,
    desktopDocks: mod.desktopDocks
  };
  if (surface === null || !shouldAutoOpen({ ...facts, isOpen: await isPaneOpen($) })) return;
  const opened = await $.ui.open({ id: PANE_ID, title: PANE_TITLE, columns: PANE_COLUMNS });
  $.ui.log(surfaceLog(surface, opened.isPlaced), { to: "debug" });
  if (opened.isPlaced) void startBridge($, mod.host, surface);
}
async function togglePane($, mod, e) {
  const { host } = mod;
  if (await isPaneOpen($)) {
    await $.state.set(CLOSED_THIS_TURN, true);
    await $.ui.close({ id: PANE_ID });
    return { text: CLOSED_TEXT };
  }
  const surface = await surfaceOf($, mod);
  const isDocked = isDockedOn(mod, surface, e);
  await $.ui.open({
    id: PANE_ID,
    title: PANE_TITLE,
    columns: PANE_COLUMNS,
    ...isDocked ? { focus: true } : {}
  });
  $.ui.log(surfaceLog(surface, isDocked), { to: "debug" });
  if (surface === null || !isDocked) {
    return { text: surface === "terminal" ? DOCK_NOTICE : FALLBACK_OPENED_TEXT };
  }
  await startBridge($, host, surface);
  return { text: OPENED_TEXT };
}
function isDockedOn(mod, surface, e) {
  if (surface === "desktop") return mod.desktopDocks === true;
  return surface === "terminal" && isDockable(e.presentation);
}
async function paneClosed($, host, e) {
  forgetFallback(host);
  if (e.origin.kind === "person") await $.state.set(CLOSED_THIS_TURN, true);
  await stopBridge($, host);
}
async function turnEnded($, host, e) {
  await $.state.set(CLOSED_THIS_TURN, false);
  if (!e.isAborted && await isPaneOpen($)) $.ui.toast(turnToast(hostStatus(host)));
}
async function surfaceOf($, mod) {
  return playSurface(await $.session.surfaces(), mod.desktopDocks);
}
async function isPaneOpen($) {
  return (await $.ui.panes()).some((pane) => pane.id === PANE_ID);
}

// plugin/hooks/register.tsx
function register(on, options) {
  const mod = {
    host: createBridgeHost(readOptions(options)),
    screen: null,
    desktopDocks: null
  };
  const { host } = mod;
  on("session.start", async ($, e, next) => {
    await $.command.register({ name: PANE_ID, description: COMMAND_DESCRIPTION, immediate: true });
    return next(e);
  });
  on("session.attach", { surface: "desktop" }, ($, e, next) => {
    measureDesktop(mod, e.viewport);
    return next(e);
  });
  on("session.detach", { surface: "desktop" }, ($, e, next) => {
    forgetDesktop(mod);
    return next(e);
  });
  on("ui.render", { component: "PromptHint" }, ($, e, next) => {
    if (e.surface === "terminal") measureScreen(mod, e.viewport);
    if (e.surface === "desktop") measureDesktop(mod, e.viewport);
    return next(e);
  });
  on("prompt.submit", async ($, e, next) => {
    const entered = await next(e);
    if (entered.drop === void 0) await openOnSubmit($, mod, e);
    return entered;
  });
  on("command.run", { command: "tokeneater" }, ($, e) => togglePane($, mod, e));
  on("ui.close", async ($, e, next) => {
    if (e.id === PANE_ID) await paneClosed($, host, e);
    return next(e);
  });
  on("ui.render", { component: "Pane", requestId: "tokeneater" }, ($, e) => {
    if (e.surface === "terminal") measureScreen(mod, e.viewport);
    if (e.surface === "desktop") measureDesktop(mod, e.viewport);
    return drawPane($, e, host);
  });
  on("ui.message", async ($, e, next) => {
    const isPane = e.requestId === PANE_ID;
    const message = isPane ? parseSurfaceMessage(e.data) : null;
    const surface = playSurfaceOf(e.surface);
    if (message !== null && surface !== null) {
      await forwardMessage($, host, { input: message, surface });
    }
    const answer = await next(e);
    const props = isPane && e.element === MAP_KEY ? handOutMap(host) : void 0;
    return props === void 0 ? answer : { ...answer, props };
  });
  on("turn.complete", async ($, e, next) => {
    if (e.agentId === void 0) await turnEnded($, host, e);
    return next(e);
  });
  on("session.end", async ($, e, next) => {
    if (e.reason !== "clear") await stopBridge($, host);
    return next(e);
  });
}
export {
  register
};
