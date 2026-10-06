// src/mod-options.ts
var DEFAULT_SERVER_URL = "https://playtokeneater.com";
function readOptions(options) {
  const nickname = textOf(options["nickname"]);
  const serverUrl = textOf(options["serverUrl"]);
  return {
    nickname,
    serverUrl: serverUrl === "" ? DEFAULT_SERVER_URL : serverUrl,
    isAutoOpenOn: options["autoOpen"] !== false
  };
}
function bridgeEnv(options, size) {
  const env = {
    TE_SERVER_URL: options.serverUrl,
    TE_NICKNAME: options.nickname
  };
  if (size !== null) {
    env["TE_COLUMNS"] = String(size.columns);
    env["TE_ROWS"] = String(size.rows);
  }
  return env;
}
function textOf(value) {
  return typeof value === "string" ? value.trim() : "";
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
  split: "s",
  eject: "w",
  respawn: "r",
  left: "h",
  down: "j",
  up: "k",
  right: "l"
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
var PANE_ID = "tokeneater";
var PANE_TITLE = "tokeneater";
var PANE_COLUMNS = 120;
var DOCK_MIN_COLUMNS = MOD_INSTALL.dockMinColumns;
var AUTO_OPEN_MIN_COLUMNS = MOD_INSTALL.autoOpenMinColumns;
var CONTROL_ROWS = 1;
var STATUS_ROWS = 1;
var MAX_RASTER_COLUMNS = 512;
var MAX_RASTER_ROWS = 256;
function rasterSize(bodyColumns, bodyRows) {
  const columns = Math.min(Math.floor(bodyColumns), MAX_RASTER_COLUMNS);
  const rows = Math.min(Math.floor(bodyRows) - CONTROL_ROWS, MAX_RASTER_ROWS);
  if (columns < 1 || rows <= STATUS_ROWS) return null;
  return { columns, rows };
}
function isSameSize(a, b) {
  return a?.columns === b?.columns && a?.rows === b?.rows;
}
function isDockable(screen) {
  return screen !== null && screen.isFullscreen && screen.columns >= DOCK_MIN_COLUMNS;
}
function shouldAutoOpen(facts) {
  if (!facts.isAutoOpenOn) return false;
  if (facts.originKind !== "composer" || facts.isOpen) return false;
  if (facts.isMidTurn && facts.wasClosedThisTurn) return false;
  const { screen } = facts;
  return screen !== null && screen.isFullscreen && screen.columns >= AUTO_OPEN_MIN_COLUMNS;
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
var SURFACE_NOTICE = "tokeneater plays in the terminal, in its fullscreen layout.";
var IDLE_NOTICE = "Press r to play.";
var RESTARTING_NOTICE = "The game stopped: starting it again\u2026";
var TOO_SMALL_NOTICE = "The pane is too small to play in: make it taller.";
var RETRY_HINT = "Press r to try again.";
var OPENED_TEXT = "tokeneater is open: steer with the pointer, or the letter keys shown under the game. Esc returns to the prompt.";
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
  { id: "left", hotkey: MOD_HOTKEYS.left, label: "left", input: { kind: "keys", dx: -1, dy: 0 } },
  { id: "down", hotkey: MOD_HOTKEYS.down, label: "down", input: { kind: "keys", dx: 0, dy: 1 } },
  { id: "up", hotkey: MOD_HOTKEYS.up, label: "up", input: { kind: "keys", dx: 0, dy: -1 } },
  { id: "right", hotkey: MOD_HOTKEYS.right, label: "right", input: { kind: "keys", dx: 1, dy: 0 } }
];

// src/surface-message.ts
var MAX_PRESSES_PER_MESSAGE = 8;
var PANE_ACTIONS = ["split", "eject", "respawn"];
var KEY_DIRECTIONS = [-1, 0, 1];
function messageInputs(message) {
  const presses = message.presses.map((action) => ({ kind: "press", action }));
  return message.steer === void 0 ? presses : [message.steer, ...presses];
}
function parseSurfaceMessage(data) {
  if (!isRecord(data) || !hasOnly(data, ["steer", "presses"])) return null;
  const { steer, presses } = data;
  if (!Array.isArray(presses) || presses.length > MAX_PRESSES_PER_MESSAGE) return null;
  if (!presses.every(isPaneAction)) return null;
  if (steer === void 0) return { presses };
  const parsed = parseSteer(steer);
  return parsed === null ? null : { steer: parsed, presses };
}
function parseSteer(value) {
  if (!isRecord(value)) return null;
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
function isRecord(value) {
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

// src/bridge-lines.ts
var LineReader = class {
  pending = "";
  /** Takes the next piece of stdout; what the lines it completed said. */
  push(text) {
    const read = this.pending + text;
    const end = read.lastIndexOf("\n");
    this.pending = read.slice(end + 1);
    const events = [];
    let frame = null;
    if (end < 0) return { events, frame };
    for (const line of read.slice(0, end).split("\n")) {
      const message = readLine(line);
      if (message === null) continue;
      if ("cells" in message) frame = message;
      else events.push(message);
    }
    return { events, frame };
  }
};
function readLine(line) {
  const space = line.indexOf(" ");
  if (space < 0) return null;
  const rest = line.slice(space + 1);
  switch (line.slice(0, space)) {
    case "READY":
      return readReady(rest);
    case "F":
      return readFrame(rest);
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
function readStatus(text) {
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    return null;
  }
  if (!isRecord2(value)) return null;
  const { phase, room, mass, isDead } = value;
  const isStatus = typeof phase === "string" && (typeof room === "string" || room === null) && typeof mass === "number" && typeof isDead === "boolean";
  return isStatus ? { kind: "status", status: { phase, room, mass, isDead } } : null;
}
function isRecord2(value) {
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
    lastStatus: null
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
async function startBridge($, host) {
  host.isWanted = true;
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
async function sendInput($, host, input) {
  const isPlayAgain = input.kind === "press" && input.action === "respawn";
  if (isPlayAgain && hostPhase(host) !== "running") {
    host.restarts = 0;
    await startBridge($, host);
    return;
  }
  if (host.run !== null) await requestControl($, host.run, inputRequest(input));
}
async function forwardMessage($, host, message) {
  for (const input of messageInputs(message)) await sendInput($, host, input);
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
  const run = {
    stream: $.process.spawn({
      argv: ["node", `${$.plugin.root}/${BRIDGE_ENTRY}`],
      env: bridgeEnv(host.options, host.mountedSize)
    }),
    control: null,
    size: host.mountedSize,
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
  if (!host.isWanted) {
    $.ui.invalidate("ui.render");
    return;
  }
  if (run.isEnding) {
    await startBridge($, host);
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
  if (host.isWanted) await startBridge($, host);
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

// plugin/hooks/pane.tsx
var INPUT_KEY = "input";
var BUTTON_GAP = 2;
function drawPane($, e, host) {
  if (e.surface !== "terminal") {
    const { Text: Text2 } = $.ui.resolve(e);
    return /* @__PURE__ */ h(Text2, null, SURFACE_NOTICE);
  }
  const { Box, Text } = $.ui.resolve(e);
  if (e.props.placement === "inline") return /* @__PURE__ */ h(Text, null, DOCK_NOTICE);
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
        void sendInput($, host, key.input);
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

// plugin/hooks/pane-hooks.ts
var CLOSED_THIS_TURN = { plugin: "tokeneater", key: "closedThisTurn" };
function measureScreen(mod, viewport) {
  if (viewport?.isFullscreen === void 0) return;
  mod.screen = { columns: viewport.columns, isFullscreen: viewport.isFullscreen };
}
async function openOnSubmit($, mod, e) {
  const isMidTurn = e.turnId !== void 0;
  if (!isMidTurn) await $.state.set(CLOSED_THIS_TURN, false);
  if (!mod.host.options.isAutoOpenOn) return;
  const { value: wasClosedThisTurn = false } = await $.state.get(CLOSED_THIS_TURN);
  const facts = {
    isAutoOpenOn: mod.host.options.isAutoOpenOn,
    originKind: e.origin.kind,
    isMidTurn,
    wasClosedThisTurn,
    screen: mod.screen
  };
  if (!shouldAutoOpen({ ...facts, isOpen: await isPaneOpen($) })) return;
  const opened = await $.ui.open({ id: PANE_ID, title: PANE_TITLE, columns: PANE_COLUMNS });
  if (opened.isPlaced) void startBridge($, mod.host);
}
async function togglePane($, host, e) {
  if (await isPaneOpen($)) {
    await $.state.set(CLOSED_THIS_TURN, true);
    await $.ui.close({ id: PANE_ID });
    return { text: CLOSED_TEXT };
  }
  const isDocked = isDockable(e.presentation);
  await $.ui.open({
    id: PANE_ID,
    title: PANE_TITLE,
    columns: PANE_COLUMNS,
    ...isDocked ? { focus: true } : {}
  });
  if (!isDocked) return { text: DOCK_NOTICE };
  await startBridge($, host);
  return { text: OPENED_TEXT };
}
async function paneClosed($, host, e) {
  if (e.origin.kind === "person") await $.state.set(CLOSED_THIS_TURN, true);
  await stopBridge($, host);
}
async function turnEnded($, host, e) {
  await $.state.set(CLOSED_THIS_TURN, false);
  if (!e.isAborted && await isPaneOpen($)) $.ui.toast(turnToast(hostStatus(host)));
}
async function isPaneOpen($) {
  return (await $.ui.panes()).some((pane) => pane.id === PANE_ID);
}

// plugin/hooks/register.tsx
function register(on, options) {
  const mod = { host: createBridgeHost(readOptions(options)), screen: null };
  const { host } = mod;
  on("session.start", async ($, e, next) => {
    await $.command.register({ name: PANE_ID, description: COMMAND_DESCRIPTION, immediate: true });
    return next(e);
  });
  on("ui.render", { component: "PromptHint" }, ($, e, next) => {
    if (e.surface === "terminal") measureScreen(mod, e.viewport);
    return next(e);
  });
  on("prompt.submit", async ($, e, next) => {
    const entered = await next(e);
    if (entered.drop === void 0) await openOnSubmit($, mod, e);
    return entered;
  });
  on("command.run", { command: "tokeneater" }, ($, e) => togglePane($, host, e));
  on("ui.close", async ($, e, next) => {
    if (e.id === PANE_ID) await paneClosed($, host, e);
    return next(e);
  });
  on("ui.render", { component: "Pane", requestId: "tokeneater" }, ($, e) => {
    if (e.surface === "terminal") measureScreen(mod, e.viewport);
    return drawPane($, e, host);
  });
  on("ui.message", async ($, e, next) => {
    const message = e.requestId === PANE_ID ? parseSurfaceMessage(e.data) : null;
    if (message !== null) await forwardMessage($, host, message);
    return next(e);
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
