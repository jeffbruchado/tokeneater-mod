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
var MAP_SIZE = 7e3;
var START_MASS = 10;
var RADIUS_PER_SQRT_MASS = 10;
var SLIDE_STOP_SPEED = 5;
var EJECT_BLOB_MASS = 12;
var DECAY_RATE_PER_S = 2e-3;
var SPEED_AT_START_MASS = 450;
var SPEED_EXPONENT = 0.44;
var SPEED_FLOOR = 40;
var TARGET_DEAD_ZONE = 4;
var LEADERBOARD_SIZE = 10;

// ../../packages/shared/src/engine/geometry.ts
function massToRadius(mass) {
  return mass > 0 ? RADIUS_PER_SQRT_MASS * Math.sqrt(mass) : 0;
}
function toUnitsPerTick(unitsPerSecond) {
  return unitsPerSecond / TICK_RATE_HZ;
}
function speedForMass(mass) {
  const perSecond = Math.max(
    SPEED_FLOOR,
    SPEED_AT_START_MASS * Math.pow(START_MASS / mass, SPEED_EXPONENT)
  );
  return toUnitsPerTick(perSecond);
}

// ../../packages/shared/src/engine/movement.ts
var STOP_SPEED = toUnitsPerTick(SLIDE_STOP_SPEED);
var STOP_SPEED_SQUARED = STOP_SPEED * STOP_SPEED;

// ../../packages/shared/src/engine/decay.ts
var DECAY_FACTOR_PER_TICK = 1 - DECAY_RATE_PER_S / TICK_RATE_HZ;

// ../../packages/shared/src/engine/virus.ts
var FULL_TURN = 2 * Math.PI;

// ../../packages/shared/src/mod/pane-text.ts
var PANE_SLOT_TEXT = {
  /** Under a sponsor's name: the spot is an ad. */
  sponsored: "Sponsored",
  /** An empty slot's big line. */
  empty: "Your brand here",
  /** Shorter ones, for an empty slot too narrow on the pane for it, longest first. */
  emptyShort: ["Your brand", "Ad spot"],
  /** Under it. */
  emptyHint: "Sponsor this spot"
};

// ../../packages/shared/src/moderation/normalize.ts
var LEET_LETTERS = [
  ["0", "o"],
  ["3", "e"],
  ["4", "a"],
  ["5", "s"],
  ["7", "t"],
  ["@", "a"],
  ["$", "s"],
  ["!", "i"],
  ["|", "l"],
  ["+", "t"]
];
var INNER_ONE = new RegExp("(?<=\\p{L})1(?=\\p{L})", "gu");
var ONE_READINGS = [
  (text) => text.replaceAll("1", "i"),
  (text) => text.replace(INNER_ONE, "l").replaceAll("1", "i")
];
var CONFUSABLES = /* @__PURE__ */ new Map([
  ["\u0430", "a"],
  ["\u0432", "b"],
  ["\u0441", "c"],
  ["\u0501", "d"],
  ["\u0435", "e"],
  ["\u04BB", "h"],
  ["\u043D", "h"],
  ["\u0456", "i"],
  ["\u0458", "j"],
  ["\u043A", "k"],
  ["\u04CF", "l"],
  ["\u043C", "m"],
  ["\u043E", "o"],
  ["\u0440", "p"],
  ["\u051B", "q"],
  ["\u0455", "s"],
  ["\u0442", "t"],
  ["\u051D", "w"],
  ["\u0445", "x"],
  ["\u0443", "y"],
  ["\u03B1", "a"],
  ["\u03B2", "b"],
  ["\u03B5", "e"],
  ["\u03B7", "n"],
  ["\u03B9", "i"],
  ["\u03BA", "k"],
  ["\u03BD", "v"],
  ["\u03BF", "o"],
  ["\u03C1", "p"],
  ["\u03C4", "t"],
  ["\u03C5", "u"],
  ["\u03C7", "x"],
  ["\u0131", "i"],
  ["\u1D00", "a"],
  ["\u0299", "b"],
  ["\u1D04", "c"],
  ["\u1D05", "d"],
  ["\u1D07", "e"],
  ["\uA730", "f"],
  ["\u0262", "g"],
  ["\u029C", "h"],
  ["\u026A", "i"],
  ["\u1D0A", "j"],
  ["\u1D0B", "k"],
  ["\u029F", "l"],
  ["\u1D0D", "m"],
  ["\u0274", "n"],
  ["\u1D0F", "o"],
  ["\u1D18", "p"],
  ["\u0280", "r"],
  ["\uA731", "s"],
  ["\u1D1B", "t"],
  ["\u1D1C", "u"],
  ["\u1D20", "v"],
  ["\u1D21", "w"],
  ["\u028F", "y"],
  ["\u1D22", "z"]
]);
var INVISIBLES = /[\p{M}\p{Cf}\p{Default_Ignorable_Code_Point}]/gu;
var CASE_BOUNDARY = new RegExp("(?<=\\p{Ll})(?=\\p{Lu})", "gu");
var NON_LETTERS = /[^\p{L}]+/u;
var NON_ALPHANUMERIC = /[^\p{L}\p{N}]/gu;
var SPELLED_OUT_MAX_LETTERS = 2;
function nicknameForms(nickname) {
  const base = stripInvisibles(nickname);
  const asWritten = readingsOf(base);
  const camelSplit = readingsOf(base.replace(CASE_BOUNDARY, " "));
  const words = /* @__PURE__ */ new Set();
  const parts = /* @__PURE__ */ new Set();
  const spans = /* @__PURE__ */ new Set();
  const spelledOut = /* @__PURE__ */ new Set();
  for (const tokens of [...asWritten, ...camelSplit]) {
    for (const token of tokens) words.add(token);
    for (const span of spansOf(tokens)) {
      spans.add(span.joined);
      if (span.isSpelledOut) spelledOut.add(span.joined);
    }
  }
  for (const token of camelSplit.flat()) parts.add(token);
  return { words: [...words], parts: [...parts], spans: [...spans], spelledOut: [...spelledOut] };
}
function nicknameKey(nickname) {
  const lower = foldLetters(stripInvisibles(nickname));
  return readLeet(lower, ONE_READINGS[0]).replace(NON_ALPHANUMERIC, "");
}
function readingsOf(text) {
  const lower = foldLetters(text);
  return [...ONE_READINGS.map((one) => readLeet(lower, one)), lower].map(
    (reading) => reading.split(NON_LETTERS).filter((token) => token !== "")
  );
}
function spansOf(tokens) {
  const spans = [];
  for (const [first, head] of tokens.entries()) {
    let joined = head;
    let isSpelledOut = head.length <= SPELLED_OUT_MAX_LETTERS;
    for (const token of tokens.slice(first + 1)) {
      joined += token;
      isSpelledOut &&= token.length <= SPELLED_OUT_MAX_LETTERS;
      spans.push({ joined, isSpelledOut });
    }
  }
  return spans;
}
function stripInvisibles(text) {
  return text.normalize("NFKD").replace(INVISIBLES, "");
}
function foldLetters(text) {
  const lower = stripInvisibles(text.toLowerCase());
  return Array.from(lower, (letter) => CONFUSABLES.get(letter) ?? letter).join("");
}
function readLeet(text, readOne) {
  return readOne(
    LEET_LETTERS.reduce((all, [written, letter]) => all.replaceAll(written, letter), text)
  );
}

// ../../packages/shared/src/moderation/terms.ts
var PROFANITY_EN = {
  substring: [
    "fuck",
    "nigger",
    "nigga",
    "faggot",
    "bitch",
    "whore",
    "wanker",
    "asshole",
    "arsehole",
    "bullshit",
    "shithead",
    "shitface",
    "dickhead",
    "cocksucker",
    "jizz",
    "dildo",
    "porn",
    "blowjob",
    "handjob",
    "cumshot",
    "hitler",
    "wetback",
    "pedophile",
    "paedophile"
  ],
  word: [
    "ass",
    "arse",
    "shit",
    "shitty",
    "cunt",
    "dick",
    "cock",
    "pussy",
    "twat",
    "slut",
    "bastard",
    "piss",
    "cum",
    "tits",
    "boobs",
    "penis",
    "vagina",
    "clit",
    "anal",
    "anus",
    "rape",
    "rapist",
    "retard",
    "retarded",
    "fag",
    "nazi",
    "kike",
    "spic",
    "chink",
    "gook",
    "coon",
    "paki",
    "tranny",
    "kys"
  ]
};
var PROFANITY_PT = {
  substring: [
    "caralho",
    "buceta",
    "boceta",
    "cuz\xE3o",
    "arrombado",
    "punheta",
    "xoxota",
    "xereca",
    "piroca",
    "putaria",
    "merda",
    "fodase",
    "filhodaputa"
  ],
  word: [
    "porra",
    "puta",
    "puto",
    "cu",
    "foda",
    "foder",
    "fodido",
    "bosta",
    "cacete",
    "viado",
    "bicha",
    "traveco",
    "sapat\xE3o",
    "ot\xE1rio",
    "babaca",
    "escroto",
    "corno",
    "vadia",
    "vagabunda",
    "retardado",
    "fdp",
    "pqp",
    "vsf",
    "vtnc",
    "tnc"
  ]
};
var PROFANITY_ES = {
  substring: [
    "mierda",
    "pendejo",
    "cabr\xF3n",
    "gilipollas",
    "chinga",
    "culero",
    "maric\xF3n",
    "hijueputa",
    "hijoputa",
    "malparido",
    "mamaguevo",
    "conchatumadre",
    "pu\xF1eta"
  ],
  word: [
    "puta",
    "puto",
    "joder",
    "jodido",
    "carajo",
    "follar",
    "polla",
    "verga",
    "culo",
    "marica",
    "zorra",
    "sudaca",
    "negrata",
    "hdp",
    "ctm",
    "ptm"
  ]
};
var IMPERSONATION_TERMS = {
  substring: ["tokeneater"],
  word: [
    "anthropic",
    "admin",
    "adm",
    "administrator",
    "administrador",
    "administradora",
    "moderator",
    "moderador",
    "moderadora",
    "mod",
    "staff",
    "support",
    "suporte",
    "soporte",
    "official",
    "oficial",
    "system",
    "sistema",
    "server",
    "servidor",
    "claude"
  ]
};

// ../../packages/shared/src/moderation/check-nickname.ts
var LETTER_RUN = new RegExp("(\\p{L})\\1*", "gu");
var TERM_LETTERS = /^[a-z]+$/;
var WRITTEN_TERM = new RegExp("^\\p{L}+$", "u");
var NEVER = "(?!)";
var matchers = null;
function checkNickname(nickname) {
  matchers ??= {
    profanity: compileTerms([PROFANITY_EN, PROFANITY_PT, PROFANITY_ES]),
    impersonation: compileTerms([IMPERSONATION_TERMS])
  };
  const forms = nicknameForms(nickname);
  if (isMatched(matchers.profanity, forms)) return "profanity";
  if (isMatched(matchers.impersonation, forms)) return "impersonation";
  return "ok";
}
function termPattern(term) {
  const letters = nicknameKey(term);
  if (!WRITTEN_TERM.test(term) || !TERM_LETTERS.test(letters)) {
    throw new RangeError(`checkNickname: a word-list term is not plain letters: "${term}"`);
  }
  return Array.from(letters.matchAll(LETTER_RUN), ([run]) => {
    const letter = run.charAt(0);
    return run.length === 1 ? `${letter}+` : `${letter}{${String(run.length)},}`;
  }).join("");
}
function compileTerms(lists) {
  const alternatives = (terms) => [NEVER, ...terms.map(termPattern)].join("|");
  const substrings = alternatives(lists.flatMap((list) => list.substring));
  const words = alternatives(lists.flatMap((list) => list.word));
  return {
    insideWord: new RegExp(substrings, "u"),
    wholeSpan: new RegExp(`^(?:${substrings})$`, "u"),
    // A word may carry a plural `s` (`mods`, `putas`).
    wholeWord: new RegExp(`^(?:${words})s*$`, "u")
  };
}
function isMatched(matcher, forms) {
  return forms.words.some((word) => matcher.wholeWord.test(word)) || forms.parts.some((part) => matcher.insideWord.test(part)) || forms.spans.some((span) => matcher.wholeSpan.test(span)) || forms.spelledOut.some((span) => matcher.wholeWord.test(span));
}

// ../../packages/shared/src/protocol/bytes.ts
var LITTLE_ENDIAN = true;
var U8_MAX = 255;
var U16_MAX = 65535;
var U32_MAX = 4294967295;
var INITIAL_CAPACITY = 64;
function frameBytes(frame) {
  return frame instanceof Uint8Array ? frame : new Uint8Array(frame);
}
function checkUnsigned(value, max, width) {
  if (Number.isInteger(value) && value >= 0 && value <= max) return;
  throw new RangeError(
    `tokeneater: ByteWriter.${width} needs an integer in [0, ${String(max)}], got ${String(value)}`
  );
}
var ByteWriter = class {
  bytes = new Uint8Array(INITIAL_CAPACITY);
  view = new DataView(this.bytes.buffer);
  length = 0;
  /** Appends an unsigned 8-bit integer. */
  u8(value) {
    checkUnsigned(value, U8_MAX, "u8");
    const at = this.reserve(1);
    this.view.setUint8(at, value);
  }
  /** Appends an unsigned 16-bit integer. */
  u16(value) {
    checkUnsigned(value, U16_MAX, "u16");
    const at = this.reserve(2);
    this.view.setUint16(at, value, LITTLE_ENDIAN);
  }
  /** Appends an unsigned 32-bit integer. */
  u32(value) {
    checkUnsigned(value, U32_MAX, "u32");
    const at = this.reserve(4);
    this.view.setUint32(at, value, LITTLE_ENDIAN);
  }
  /** Appends raw bytes as they are. */
  raw(bytes) {
    const at = this.reserve(bytes.length);
    this.bytes.set(bytes, at);
  }
  /** A copy of everything written so far, sized exactly. */
  finish() {
    return this.bytes.slice(0, this.length);
  }
  /**
   * Makes room for `width` more bytes and returns the offset they start at. It may swap the buffer
   * and its view, so callers read `this.bytes`/`this.view` only after calling it.
   */
  reserve(width) {
    const start2 = this.length;
    const needed = start2 + width;
    if (needed > this.bytes.length) {
      let capacity = this.bytes.length * 2;
      while (capacity < needed) capacity *= 2;
      const grown = new Uint8Array(capacity);
      grown.set(this.bytes);
      this.bytes = grown;
      this.view = new DataView(grown.buffer);
    }
    this.length = needed;
    return start2;
  }
};
var ByteReader = class {
  bytes;
  view;
  offset = 0;
  error = null;
  constructor(bytes) {
    this.bytes = bytes;
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  }
  /** Unread bytes left in the frame. */
  get remaining() {
    return this.bytes.length - this.offset;
  }
  /** Reads an unsigned 8-bit integer (0 when truncated). */
  u8() {
    const at = this.claim(1);
    return at === null ? 0 : this.view.getUint8(at);
  }
  /** Reads an unsigned 16-bit integer (0 when truncated). */
  u16() {
    const at = this.claim(2);
    return at === null ? 0 : this.view.getUint16(at, LITTLE_ENDIAN);
  }
  /** Reads an unsigned 32-bit integer (0 when truncated). */
  u32() {
    const at = this.claim(4);
    return at === null ? 0 : this.view.getUint32(at, LITTLE_ENDIAN);
  }
  /** Reads `length` raw bytes as a copy that does not share the frame's buffer (empty when truncated). */
  raw(length) {
    const at = this.claim(length);
    return at === null ? new Uint8Array(0) : this.bytes.slice(at, at + length);
  }
  /**
   * Reads a list of `count` entries of at least `entryBytes` each with `readItem`, after checking
   * they can all be there: a count over what the frame holds reads nothing and records `truncated`,
   * so a forged count never drives a long loop. Once a problem is recorded, it reads nothing.
   */
  list(count, entryBytes, readItem) {
    const items = [];
    if (this.error !== null) return items;
    if (count * entryBytes > this.remaining) {
      this.fail("truncated");
      return items;
    }
    for (let index = 0; index < count; index++) items.push(readItem());
    return items;
  }
  /** Records `invalidValue` unless `isValid`. */
  check(isValid) {
    if (!isValid) this.fail("invalidValue");
  }
  /** The decoded message, or the first problem met; leftover bytes are `trailingBytes`. */
  result(message) {
    if (this.error !== null) return { ok: false, error: this.error };
    if (this.remaining > 0) return { ok: false, error: "trailingBytes" };
    return { ok: true, message };
  }
  /** Reserves `width` bytes and returns their offset, or `null` (recording `truncated`). */
  claim(width) {
    if (width > this.remaining) {
      this.fail("truncated");
      return null;
    }
    const start2 = this.offset;
    this.offset = start2 + width;
    return start2;
  }
  /** Keeps the first problem only. */
  fail(error) {
    this.error ??= error;
  }
};

// ../../packages/shared/src/protocol/colours.ts
var OWN_CELL_COLOUR = "#7CFFB2";
var PLAYER_COLOURS = [
  "#D2B8FF",
  // lilac
  "#FF9A5C",
  // orange
  "#FFC857",
  // amber
  "#F4F45C",
  // lemon
  "#B6FF5C",
  // lime
  "#5CFFE4",
  // aqua
  "#5AC8FF",
  // cyan
  "#5C86FF",
  // azure
  "#8F7CFF",
  // indigo
  "#B86CFF",
  // violet
  "#E35CFF",
  // orchid
  "#FF5CD6",
  // magenta
  "#FF5CA8",
  // pink
  "#FFA8C8",
  // blush
  "#A8E8FF",
  // ice
  "#FFE0A8"
  // sand
];

// ../../packages/shared/src/protocol/messages.ts
var PROTOCOL_VERSION = 2;
var MAX_PLAYERS_PER_ROOM = 50;
var NICKNAME_MAX_CHARS = 16;
var NICKNAME_MAX_BYTES = 64;
var ROOM_NAME_MAX_BYTES = 32;
var ROOM_NAME_PATTERN = new RegExp(`^[a-z0-9-]{1,${String(ROOM_NAME_MAX_BYTES)}}$`);
var MAX_JOIN_EXCLUDE = 5;
var RECONNECT_TOKEN_BYTES = 16;
var RECONNECT_GRACE_SECONDS = 5;
var CLOSE_CODES = {
  /** The client's `PROTOCOL_VERSION` differs from the server's: the client must reload. */
  versionMismatch: 4e3,
  /** The room already holds `MAX_PLAYERS_PER_ROOM` players. */
  roomFull: 4001,
  /** The client sent frames the server could not accept, repeatedly. */
  invalidInput: 4002,
  /** The reconnect token is unknown or its grace period ended: the client joins fresh. */
  tokenExpired: 4003,
  /** The room is shutting down; the client finds another room. */
  roomClosing: 4004,
  /**
   * The nickname is not allowed (the filter, or a ban on that nickname): the player picks another
   * one. Which rule refused it is never said.
   */
  nicknameRejected: 4005,
  /** The client is banned: it cannot join now. Why, and until when, is never said. */
  banned: 4006
};
var JOIN_REJECTIONS = ["nickname", "banned"];
var JOIN_UNAVAILABILITIES = ["capacity", "rate_limited", "unavailable"];
var CLIENT_OPCODES = {
  join: 1,
  intent: 2,
  respawn: 3,
  ping: 4
};
var SERVER_OPCODES = {
  welcome: 129,
  players: 130,
  playerLeft: 131,
  snapshot: 132,
  leaderboard: 133,
  death: 134,
  pong: 135,
  slots: 136
};

// ../../packages/shared/src/protocol/utf8.ts
var { TextEncoder, TextDecoder } = globalThis;
var encoder = new TextEncoder();
var decoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
function encodeUtf8(text) {
  return encoder.encode(text);
}
function decodeUtf8(bytes) {
  try {
    return decoder.decode(bytes);
  } catch {
    return null;
  }
}
function countCodePoints(text) {
  return Array.from(text).length;
}

// ../../packages/shared/src/protocol/fields.ts
function isSlot(value) {
  return Number.isInteger(value) && value >= 0 && value < MAX_PLAYERS_PER_ROOM;
}
function isColour(value) {
  return Number.isInteger(value) && value >= 0 && value < PLAYER_COLOURS.length;
}
function isEntityId(value) {
  return value >= 1;
}
function requireValid(isValid, field) {
  if (!isValid) throw new RangeError(`tokeneater: cannot encode ${field}: value out of range`);
}
function writeText(writer, text, maxBytes) {
  const bytes = encodeUtf8(text);
  requireValid(bytes.length <= maxBytes, `a string of ${String(bytes.length)} bytes`);
  writer.u8(bytes.length);
  writer.raw(bytes);
}
function readText(reader, maxBytes) {
  const length = reader.u8();
  reader.check(length <= maxBytes);
  const text = decodeUtf8(reader.raw(length));
  reader.check(text !== null);
  return text ?? "";
}
function writeNickname(writer, nickname) {
  requireValid(countCodePoints(nickname) <= NICKNAME_MAX_CHARS, "nickname");
  writeText(writer, nickname, NICKNAME_MAX_BYTES);
}
function readNickname(reader) {
  const nickname = readText(reader, NICKNAME_MAX_BYTES);
  reader.check(countCodePoints(nickname) <= NICKNAME_MAX_CHARS);
  return nickname;
}
function writeToken(writer, token) {
  requireValid(token.length === RECONNECT_TOKEN_BYTES, "reconnect token");
  writer.raw(token);
}
function readSlot(reader) {
  const slot = reader.u8();
  reader.check(isSlot(slot));
  return slot;
}
function readColour(reader) {
  const colour = reader.u8();
  reader.check(isColour(colour));
  return colour;
}
function readEntityId(reader) {
  const id = reader.u32();
  reader.check(isEntityId(id));
  return id;
}

// ../../packages/shared/src/protocol/quantize.ts
var RADIUS_STEPS_PER_UNIT = 10;
function requireFinite(value, what) {
  if (Number.isFinite(value)) return;
  throw new RangeError(`tokeneater: cannot encode a non-finite ${what}: ${String(value)}`);
}
function quantizeCoord(value, mapSize) {
  requireFinite(value, "coordinate");
  if (value <= 0) return 0;
  if (value >= mapSize) return U16_MAX;
  return Math.round(value / mapSize * U16_MAX);
}
function dequantizeCoord(quantized, mapSize) {
  return quantized / U16_MAX * mapSize;
}
function dequantizeRadius(quantized) {
  return quantized / RADIUS_STEPS_PER_UNIT;
}

// ../../packages/shared/src/protocol/client-codec.ts
var SPLIT_FLAG = 1;
var EJECT_FLAG = 2;
var KNOWN_FLAGS = SPLIT_FLAG | EJECT_FLAG;
var TOKEN_ABSENT = 0;
var TOKEN_PRESENT = 1;
function writeJoin(writer, message) {
  writer.u16(message.version);
  writeNickname(writer, message.nickname);
  if (message.reconnectToken === null) {
    writer.u8(TOKEN_ABSENT);
    return;
  }
  writer.u8(TOKEN_PRESENT);
  writeToken(writer, message.reconnectToken);
}
function writeIntent(writer, message, mapSize) {
  writer.u16(quantizeCoord(message.x, mapSize));
  writer.u16(quantizeCoord(message.y, mapSize));
  writer.u8((message.split ? SPLIT_FLAG : 0) | (message.eject ? EJECT_FLAG : 0));
}
function encodeClient(message, mapSize = MAP_SIZE) {
  const writer = new ByteWriter();
  writer.u8(CLIENT_OPCODES[message.type]);
  switch (message.type) {
    case "join":
      writeJoin(writer, message);
      break;
    case "intent":
      writeIntent(writer, message, mapSize);
      break;
    case "respawn":
      break;
    case "ping":
      writer.u32(message.nonce);
      break;
  }
  return writer.finish();
}

// ../../packages/shared/src/protocol/slots.ts
var SLOT_TIERS = ["small", "medium", "large", "xl"];
var MAX_SLOTS = 32;
var SLOT_ID_PATTERN = /^[A-Za-z0-9-]{1,16}$/;
var SLOT_ID_MAX_BYTES = 16;
var SPONSOR_NAME_MAX_CHARS = 32;
var SPONSOR_NAME_MAX_BYTES = 128;
var SPONSOR_URL_MAX_BYTES = 512;
var SPONSOR_URL_PATTERN = /^https:\/\/[\x21-\x7e]+$/;
var BRAND_COLOUR_PATTERN = /^#[0-9a-f]{6}$/;
var LOGO_KEY_PATTERN = /^[0-9a-f]{64}\.(?:png|webp|svg)$/;
var SPONSOR_LOGO_MAX_BYTES = 512 * 1024;
var LOGO_KEY_MAX_BYTES = 80;
function isSlotId(id) {
  return SLOT_ID_PATTERN.test(id);
}
function isSlotArea({ x, y, w, h }, mapSize) {
  const isWhole = [x, y, w, h].every((value) => Number.isInteger(value) && value >= 0);
  return isWhole && w > 0 && h > 0 && x + w <= mapSize && y + h <= mapSize;
}
var SPONSOR_NAME_FORBIDDEN = /[\p{Cs}\p{Cc}\u200B\u200E\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/u;
function isSponsorName(name) {
  const chars = countCodePoints(name);
  return chars >= 1 && chars <= SPONSOR_NAME_MAX_CHARS && !SPONSOR_NAME_FORBIDDEN.test(name);
}
function isSponsorUrl(url) {
  return url.length <= SPONSOR_URL_MAX_BYTES && SPONSOR_URL_PATTERN.test(url);
}
function isBrandColour(colour) {
  return BRAND_COLOUR_PATTERN.test(colour);
}
function isLogoKey(key) {
  return LOGO_KEY_PATTERN.test(key);
}

// ../../packages/shared/src/protocol/slots-codec.ts
var SLOT_MIN_BYTES = 12;
var NO_SPONSOR = 0;
var HAS_SPONSOR = 1;
var COLOUR_DIGITS = 6;
function readLongText(reader, maxBytes) {
  const length = reader.u16();
  reader.check(length <= maxBytes);
  const text = decodeUtf8(reader.raw(length));
  reader.check(text !== null);
  return text ?? "";
}
function readSponsor(reader) {
  const name = readText(reader, SPONSOR_NAME_MAX_BYTES);
  reader.check(isSponsorName(name));
  const url = readLongText(reader, SPONSOR_URL_MAX_BYTES);
  reader.check(isSponsorUrl(url));
  const colour = `#${reader.u32().toString(16).padStart(COLOUR_DIGITS, "0")}`;
  reader.check(isBrandColour(colour));
  const logo = readText(reader, LOGO_KEY_MAX_BYTES);
  reader.check(logo === "" || isLogoKey(logo));
  return { name, url, colour, logo: logo === "" ? null : logo };
}
function readSlotView(reader, mapSize) {
  const id = readText(reader, SLOT_ID_MAX_BYTES);
  reader.check(isSlotId(id));
  const tier = SLOT_TIERS[reader.u8()];
  reader.check(tier !== void 0);
  const area = { x: reader.u16(), y: reader.u16(), w: reader.u16(), h: reader.u16() };
  reader.check(isSlotArea(area, mapSize));
  const hasSponsor = reader.u8();
  reader.check(hasSponsor === NO_SPONSOR || hasSponsor === HAS_SPONSOR);
  const sponsor = hasSponsor === HAS_SPONSOR ? readSponsor(reader) : null;
  return { id, tier: tier ?? "small", ...area, sponsor };
}
function readSlots(reader, mapSize) {
  const version = reader.u32();
  const count = reader.u8();
  reader.check(count <= MAX_SLOTS);
  const slots = reader.list(count, SLOT_MIN_BYTES, () => readSlotView(reader, mapSize));
  reader.check(new Set(slots.map((slot) => slot.id)).size === slots.length);
  return { type: "slots", version, slots };
}

// ../../packages/shared/src/protocol/snapshot-codec.ts
var CELL_BYTES = 11;
var VIRUS_BYTES = 10;
var POINT_BYTES = 8;
var ID_BYTES = 4;
function readSnapshot(reader, mapSize) {
  const coord = () => dequantizeCoord(reader.u16(), mapSize);
  const point = () => ({ id: readEntityId(reader), x: coord(), y: coord() });
  const tick = reader.u32();
  const view = {
    centerX: coord(),
    centerY: coord(),
    halfWidth: coord(),
    halfHeight: coord()
  };
  const cells = reader.list(reader.u16(), CELL_BYTES, () => {
    const id = readEntityId(reader);
    const slot = readSlot(reader);
    return { id, slot, x: coord(), y: coord(), radius: dequantizeRadius(reader.u16()) };
  });
  const viruses = reader.list(reader.u8(), VIRUS_BYTES, () => {
    return { ...point(), radius: dequantizeRadius(reader.u16()) };
  });
  const blobs = reader.list(reader.u16(), POINT_BYTES, point);
  const pelletsAdded = reader.list(reader.u16(), POINT_BYTES, point);
  const pelletsRemoved = reader.list(reader.u16(), ID_BYTES, () => readEntityId(reader));
  return { type: "snapshot", tick, view, cells, viruses, blobs, pelletsAdded, pelletsRemoved };
}

// ../../packages/shared/src/protocol/server-codec.ts
var NO_KILLER_SLOT = 255;
var UNRANKED = 0;
var PLAYER_ENTRY_MIN_BYTES = 3;
var LEADERBOARD_ROW_BYTES = 5;
function readWelcome(reader) {
  const playerId = readEntityId(reader);
  const slot = readSlot(reader);
  const colour = readColour(reader);
  const token = reader.raw(RECONNECT_TOKEN_BYTES);
  const mapSize = reader.u16();
  reader.check(mapSize > 0);
  const tickRate = reader.u8();
  reader.check(tickRate > 0);
  const room = readText(reader, ROOM_NAME_MAX_BYTES);
  reader.check(room.length > 0);
  return { type: "welcome", playerId, slot, colour, token, mapSize, tickRate, room };
}
function readPlayers(reader) {
  const count = reader.u8();
  reader.check(count <= MAX_PLAYERS_PER_ROOM);
  const entries = reader.list(count, PLAYER_ENTRY_MIN_BYTES, () => {
    const slot = readSlot(reader);
    const colour = readColour(reader);
    return { slot, colour, nickname: readNickname(reader) };
  });
  return { type: "players", entries };
}
function readLeaderboard(reader) {
  const count = reader.u8();
  reader.check(count <= LEADERBOARD_SIZE);
  const entries = reader.list(count, LEADERBOARD_ROW_BYTES, () => {
    const slot = readSlot(reader);
    return { slot, mass: reader.u32() };
  });
  const ownRank = reader.u8();
  reader.check(ownRank <= MAX_PLAYERS_PER_ROOM);
  return { type: "leaderboard", entries, ownRank: ownRank === UNRANKED ? null : ownRank };
}
function readDeath(reader) {
  const killer = reader.u8();
  reader.check(killer === NO_KILLER_SLOT || isSlot(killer));
  const stats = {
    highestMass: reader.u32(),
    pelletsEaten: reader.u32(),
    cellsEaten: reader.u32(),
    ticksAlive: reader.u32()
  };
  return { type: "death", killerSlot: killer === NO_KILLER_SLOT ? null : killer, stats };
}
function decodeServer(frame, mapSize = MAP_SIZE) {
  const reader = new ByteReader(frameBytes(frame));
  if (reader.remaining === 0) return { ok: false, error: "truncated" };
  switch (reader.u8()) {
    case SERVER_OPCODES.welcome:
      return reader.result(readWelcome(reader));
    case SERVER_OPCODES.players:
      return reader.result(readPlayers(reader));
    case SERVER_OPCODES.playerLeft:
      return reader.result({ type: "playerLeft", slot: readSlot(reader) });
    case SERVER_OPCODES.snapshot:
      return reader.result(readSnapshot(reader, mapSize));
    case SERVER_OPCODES.leaderboard:
      return reader.result(readLeaderboard(reader));
    case SERVER_OPCODES.death:
      return reader.result(readDeath(reader));
    case SERVER_OPCODES.pong:
      return reader.result({ type: "pong", nonce: reader.u32() });
    case SERVER_OPCODES.slots:
      return reader.result(readSlots(reader, mapSize));
    default:
      return { ok: false, error: "unknownOpcode" };
  }
}

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
var MIN_INTENT_INTERVAL_MS = TICK_MS;
var PRESS_SPACING_MS = TICK_MS + 10;
var TIMER_SLACK_MS = 1;
var MAX_QUEUED_PRESSES = 3;
var MIN_TARGET_MOVE = 1;
var MAX_HEADING_ERROR_RAD = Math.PI / 90;
var MAX_REACH_ERROR = 0.25;
function startIntentSender(options) {
  return new ThrottledIntentSender(options);
}
var ThrottledIntentSender = class {
  constructor(options) {
    this.options = options;
    this.wake(options.now() + MIN_INTENT_INTERVAL_MS);
  }
  options;
  lastSentAt = Number.NEGATIVE_INFINITY;
  lastPressAt = Number.NEGATIVE_INFINITY;
  /** The target last sent, or `null` before the first intent. */
  sent = null;
  next = { x: 0, y: 0 };
  splits = 0;
  ejects = 0;
  timer;
  wakeAt = Number.POSITIVE_INFINITY;
  isStopped = false;
  aimAt(xPx, yPx) {
    if (this.isStopped) return;
    this.options.aim.pointAt(xPx, yPx);
    const now = this.options.now();
    if (hasElapsed(this.lastSentAt, MIN_INTENT_INTERVAL_MS, now)) this.flush(now);
    else this.wake(this.lastSentAt + MIN_INTENT_INTERVAL_MS);
  }
  press(action) {
    if (this.isStopped) return;
    if (action === "split") this.splits = Math.min(this.splits + 1, MAX_QUEUED_PRESSES);
    else this.ejects = Math.min(this.ejects + 1, MAX_QUEUED_PRESSES);
    const now = this.options.now();
    if (hasElapsed(this.lastPressAt, PRESS_SPACING_MS, now)) this.flush(now);
    else this.wake(this.lastPressAt + PRESS_SPACING_MS);
  }
  stop() {
    this.isStopped = true;
    this.options.timers.clearTimeout(this.timer);
    this.timer = void 0;
  }
  /**
   * The timer fired: sends what is due, then looks again an interval later, or when the next
   * waiting press is due if that is sooner.
   */
  poll() {
    this.timer = void 0;
    this.wakeAt = Number.POSITIVE_INFINITY;
    const now = this.options.now();
    this.flush(now);
    this.wake(now + MIN_INTENT_INTERVAL_MS);
    this.wakeForPresses();
  }
  /** Sends an intent at `now` when a press or a steering change is due. */
  flush(now) {
    const { aim, camera } = this.options;
    const aimed = aim.worldTarget(camera, this.next);
    const canPress = hasElapsed(this.lastPressAt, PRESS_SPACING_MS, now);
    const shouldSplit = canPress && this.splits > 0;
    const shouldEject = canPress && this.ejects > 0;
    const canSteer = hasElapsed(this.lastSentAt, MIN_INTENT_INTERVAL_MS, now);
    const shouldSteer = canSteer && aimed !== null && this.changesCourse(aimed);
    if (!shouldSplit && !shouldEject && !shouldSteer) return;
    const target = aimed ?? this.sent ?? { x: camera.centerX, y: camera.centerY };
    const { x, y } = target;
    this.options.connection.sendIntent({ x, y, split: shouldSplit, eject: shouldEject });
    this.sent = { x, y };
    this.lastSentAt = now;
    if (shouldSplit) this.splits -= 1;
    if (shouldEject) this.ejects -= 1;
    if (shouldSplit || shouldEject) this.lastPressAt = now;
    this.rewake(now + MIN_INTENT_INTERVAL_MS);
    this.wakeForPresses();
  }
  /** Makes the timer fire when the next waiting press is due, if one waits. */
  wakeForPresses() {
    if (this.splits > 0 || this.ejects > 0) this.wake(this.lastPressAt + PRESS_SPACING_MS);
  }
  /** Whether steering at `target` instead of the target last sent changes the cells' course. */
  changesCourse(target) {
    const { sent } = this;
    if (sent === null) return true;
    if (Math.hypot(target.x - sent.x, target.y - sent.y) < MIN_TARGET_MOVE) return false;
    const { centerX, centerY } = this.options.camera;
    const nextX = target.x - centerX;
    const nextY = target.y - centerY;
    const sentX = sent.x - centerX;
    const sentY = sent.y - centerY;
    const nextReach = Math.hypot(nextX, nextY);
    if (Math.abs(Math.hypot(sentX, sentY) - nextReach) > MAX_REACH_ERROR * nextReach) return true;
    const heading = Math.atan2(sentX * nextY - sentY * nextX, sentX * nextX + sentY * nextY);
    return Math.abs(heading) > MAX_HEADING_ERROR_RAD;
  }
  /** Makes the timer fire at `at` (ms) at the latest, keeping an earlier one. */
  wake(at) {
    if (this.isStopped || at >= this.wakeAt) return;
    this.rewake(at);
  }
  /** Makes the timer fire at `at` (ms), replacing any. */
  rewake(at) {
    const { timers } = this.options;
    timers.clearTimeout(this.timer);
    this.wakeAt = at;
    this.timer = timers.setTimeout(
      () => {
        this.poll();
      },
      // Whole ms, rounded up: a browser would cut a fractional delay down, waking too early.
      Math.max(0, Math.ceil(at - this.options.now()))
    );
  }
};
function hasElapsed(since, intervalMs, now) {
  return now - since >= intervalMs - TIMER_SLACK_MS;
}

// ../../packages/shared/src/client/input/intent-control.ts
function createIntentControl(options) {
  return new LifeBoundIntents(options);
}
var LifeBoundIntents = class {
  constructor(options) {
    this.options = options;
    this.sink = {
      aimAt: (xPx, yPx) => {
        if (this.sender === null) options.aim.pointAt(xPx, yPx);
        else this.sender.aimAt(xPx, yPx);
      },
      press: (action) => {
        this.sender?.press(action);
      }
    };
  }
  options;
  sender = null;
  sink;
  setActive(isActive) {
    if (isActive === (this.sender !== null)) return;
    if (isActive) {
      this.sender = startIntentSender(this.options);
      return;
    }
    this.stop();
  }
  stop() {
    this.sender?.stop();
    this.sender = null;
  }
};

// ../../packages/shared/src/client/input/aim.ts
var Aim = class {
  xPx = 0;
  yPx = 0;
  hasPoint = false;
  /** Steers at viewport point (`xPx`, `yPx`) (px from its top left). */
  pointAt(xPx, yPx) {
    this.xPx = xPx;
    this.yPx = yPx;
    this.hasPoint = true;
  }
  /**
   * The world point the player steers at through `camera`, written to `out`; `null` before the
   * first pointer or stick input (the player has not steered yet).
   */
  worldTarget(camera, out) {
    return this.hasPoint ? camera.screenToWorld(this.xPx, this.yPx, out) : null;
  }
};

// ../../packages/shared/src/client/net/connection-phase.ts
var RESUME_WINDOW_MS = RECONNECT_GRACE_SECONDS * 1e3;
var RESUME_RETRY_MS = 1e3;
var WELCOME_TIMEOUT_MS = 1e4;
var FAILED_ATTEMPT_RETRY_MS = 1e3;
var MAX_FAILED_ATTEMPTS = 3;

// ../../packages/shared/src/client/net/nickname.ts
var LONE_SURROGATE = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g;
var REPLACEMENT_CHARACTER = "\uFFFD";
function wireNickname(raw) {
  const wellFormed = raw.trim().replace(LONE_SURROGATE, REPLACEMENT_CHARACTER);
  return Array.from(wellFormed).slice(0, NICKNAME_MAX_CHARS).join("").trimEnd();
}

// ../../packages/shared/src/client/net/nickname-filter.ts
function isNicknameAllowed(raw) {
  return checkNickname(wireNickname(raw)) === "ok";
}

// ../../packages/shared/src/client/net/connection.ts
var NORMAL_CLOSURE = 1e3;
var ABNORMAL_CLOSURE = 1006;
var IDLE = { kind: "idle" };
function createConnection(options) {
  return new GameConnection(options);
}
var GameConnection = class {
  constructor(options) {
    this.options = options;
  }
  options;
  current = IDLE;
  phaseListeners = /* @__PURE__ */ new Set();
  messageListeners = /* @__PURE__ */ new Set();
  nickname = "";
  /** Room the next lobby join asks for: a link's room, then the room last played in. */
  targetRoom = null;
  /** The room a link named, until a welcome: a refusal of it earns the player a notice. */
  linkRoom = null;
  /** A notice the next `connecting` phase carries (a link that could not be used). */
  pendingNotice = null;
  exclude = [];
  token = null;
  mapSize = MAP_SIZE;
  socket = null;
  socketPath = "";
  /** Room of the current (or last) socket. */
  room = "";
  timer;
  failures = 0;
  /** Bumped by every lobby join and reset: a lobby answer from an older one is ignored. */
  run = 0;
  get phase() {
    return this.current;
  }
  join(request) {
    this.reset();
    this.nickname = wireNickname(request.nickname);
    const room = request.room ?? null;
    const isValidRoom = room === null || ROOM_NAME_PATTERN.test(room);
    this.targetRoom = isValidRoom ? room : null;
    this.linkRoom = this.targetRoom;
    this.pendingNotice = isValidRoom ? null : "roomGone";
    if (isNicknameAllowed(request.nickname)) this.place();
    else this.reject("nickname");
  }
  retry() {
    if (this.phase.kind !== "unavailable" && this.phase.kind !== "lost") return;
    this.failures = 0;
    this.place();
  }
  sendIntent(intent) {
    if (this.phase.kind !== "playing") return;
    if (!Number.isFinite(intent.x) || !Number.isFinite(intent.y)) return;
    this.send({ type: "intent", ...intent });
  }
  respawn() {
    if (this.phase.kind === "playing") this.send({ type: "respawn" });
  }
  leave() {
    this.reset();
    this.setPhase(IDLE);
  }
  onPhase(listener) {
    this.phaseListeners.add(listener);
    return () => this.phaseListeners.delete(listener);
  }
  onMessage(listener) {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }
  /** Forgets the current attempt: socket, timer, token, exclusions and lobby answers in flight. */
  reset() {
    this.run += 1;
    this.clearTimer();
    this.dropSocket();
    this.token = null;
    this.exclude = [];
    this.failures = 0;
    this.mapSize = MAP_SIZE;
  }
  /** Asks the lobby for a room (`joining`), then connects to the room it gives. */
  place() {
    this.clearTimer();
    this.run += 1;
    const run = this.run;
    this.setPhase({ kind: "joining", room: this.targetRoom });
    void this.askLobby(run);
  }
  async askLobby(run) {
    const room = this.targetRoom ?? void 0;
    const { exclude, nickname } = this;
    const result = await this.options.lobby.join({ room, exclude, nickname });
    if (run === this.run) this.placed(result);
  }
  placed(result) {
    if (result.ok) {
      const linkNotice = this.linkRoom === null ? null : noticeFor(result.requested);
      const notice = this.pendingNotice ?? linkNotice;
      this.pendingNotice = null;
      this.socketPath = result.socketPath;
      this.room = result.room;
      this.setPhase({ kind: "connecting", room: result.room, notice });
      this.open();
      return;
    }
    switch (result.reason) {
      case "capacity":
      case "rate_limited":
      case "unavailable": {
        const retryAt = this.options.now() + result.retryAfterMs;
        this.setPhase({ kind: "unavailable", retryAt, reason: result.reason });
        this.schedule(result.retryAfterMs, () => {
          this.place();
        });
        return;
      }
      case "nickname":
      case "banned":
        this.reject(result.reason);
        return;
      case "refused":
        this.giveUp();
        return;
      case "unreachable":
        this.fail();
    }
  }
  /**
   * Opens a socket to the current room and sends `join` (with the token, if any) once open; a
   * socket without a welcome after `welcomeTimeoutMs` is dropped as a failed attempt.
   */
  open(welcomeTimeoutMs = WELCOME_TIMEOUT_MS) {
    let socket;
    try {
      socket = this.options.openSocket(this.socketPath);
    } catch {
      this.closed(ABNORMAL_CLOSURE);
      return;
    }
    socket.binaryType = "arraybuffer";
    this.socket = socket;
    socket.addEventListener("open", () => {
      if (this.socket !== socket) return;
      const { nickname, token } = this;
      this.send({ type: "join", version: PROTOCOL_VERSION, nickname, reconnectToken: token });
    });
    socket.addEventListener("message", (event) => {
      if (this.socket === socket) this.receive(event.data);
    });
    socket.addEventListener("close", (event) => {
      if (this.socket !== socket) return;
      this.socket = null;
      this.closed(event.code);
    });
    this.schedule(welcomeTimeoutMs, () => {
      this.dropSocket();
      this.closed(ABNORMAL_CLOSURE);
    });
  }
  receive(data) {
    if (!(data instanceof ArrayBuffer)) return;
    const decoded = decodeServer(data, this.mapSize);
    if (!decoded.ok) return;
    const { message } = decoded;
    if (message.type === "welcome") this.welcomed(message);
    for (const listener of [...this.messageListeners]) listener(message);
    if (message.type === "welcome") {
      const notice = this.phase.kind === "connecting" ? this.phase.notice : null;
      this.setPhase({ kind: "playing", room: message.room, notice });
    }
  }
  welcomed(welcome) {
    this.clearTimer();
    this.token = welcome.token;
    this.mapSize = welcome.mapSize;
    this.room = welcome.room;
    this.targetRoom = welcome.room;
    this.linkRoom = null;
    this.exclude = [];
    this.failures = 0;
  }
  /** The room socket closed with `code` (or failed): the close-code table of `createConnection`. */
  closed(code) {
    this.clearTimer();
    switch (code) {
      case CLOSE_CODES.versionMismatch:
        this.token = null;
        this.setPhase({ kind: "outdated" });
        return;
      case CLOSE_CODES.invalidInput:
        this.giveUp();
        return;
      case CLOSE_CODES.roomFull:
      case CLOSE_CODES.roomClosing:
        this.placeElsewhere(code === CLOSE_CODES.roomFull ? "roomFull" : "roomGone");
        return;
      case CLOSE_CODES.tokenExpired:
        this.rejoinFresh();
        return;
      case CLOSE_CODES.nicknameRejected:
        this.reject("nickname");
        return;
      case CLOSE_CODES.banned:
        this.reject("banned");
        return;
      default:
        this.recover();
    }
  }
  /**
   * The room refused or dropped the player for good: the lobby places it in another one, at once
   * for a playing player, after `FAILED_ATTEMPT_RETRY_MS` when the room refused the join itself
   * (so rooms refusing in turn never loop at network speed).
   */
  placeElsewhere(notice) {
    const wasPlaying = this.phase.kind === "playing";
    if (this.phase.kind === "connecting" && this.room === this.linkRoom) {
      this.pendingNotice = notice;
    }
    const others = this.exclude.filter((name) => name !== this.room);
    this.exclude = [...others, this.room].slice(-MAX_JOIN_EXCLUDE);
    this.token = null;
    this.targetRoom = null;
    if (wasPlaying) {
      this.place();
      return;
    }
    this.schedule(FAILED_ATTEMPT_RETRY_MS, () => {
      this.place();
    });
  }
  /** The token no longer resumes anyone: join the same room again as a new player. */
  rejoinFresh() {
    this.token = null;
    this.targetRoom = this.room;
    this.place();
  }
  /** An unexplained drop: resume while the token can, otherwise count a failed attempt. */
  recover() {
    const { phase } = this;
    if (this.token === null || phase.kind !== "playing" && phase.kind !== "reconnecting") {
      this.fail();
      return;
    }
    if (phase.kind === "playing") {
      const since = this.options.now();
      this.setPhase({ kind: "reconnecting", room: this.room, since });
      this.resume(since);
      return;
    }
    if (this.options.now() - phase.since >= RESUME_WINDOW_MS) {
      this.rejoinFresh();
      return;
    }
    this.schedule(RESUME_RETRY_MS, () => {
      this.resume(phase.since);
    });
  }
  /**
   * Opens a resume socket that waits for its welcome only while the token can still resume (the
   * drop was at `since`); joins fresh once that is over.
   */
  resume(since) {
    const remainingMs = since + RESUME_WINDOW_MS - this.options.now();
    if (remainingMs <= 0) {
      this.rejoinFresh();
      return;
    }
    this.open(Math.min(WELCOME_TIMEOUT_MS, remainingMs));
  }
  fail() {
    this.failures += 1;
    if (this.failures >= MAX_FAILED_ATTEMPTS) {
      this.giveUp();
      return;
    }
    this.schedule(FAILED_ATTEMPT_RETRY_MS, () => {
      this.place();
    });
  }
  giveUp() {
    this.token = null;
    this.setPhase({ kind: "lost", room: this.targetRoom });
  }
  /** The player may not join as they are: stop, and let them change the nickname or leave. */
  reject(reason) {
    this.token = null;
    this.setPhase({ kind: "rejected", reason, room: this.targetRoom });
  }
  send(message) {
    this.socket?.send(encodeClient(message, this.mapSize));
  }
  /** Stops listening to the current socket, then closes it. */
  dropSocket() {
    const { socket } = this;
    this.socket = null;
    socket?.close(NORMAL_CLOSURE);
  }
  schedule(delayMs, task) {
    this.clearTimer();
    this.timer = this.options.timers.setTimeout(task, delayMs);
  }
  clearTimer() {
    this.options.timers.clearTimeout(this.timer);
    this.timer = void 0;
  }
  setPhase(phase) {
    this.current = phase;
    for (const listener of [...this.phaseListeners]) listener(phase);
  }
};
function noticeFor(requested) {
  if (requested === null) return null;
  return requested.outcome === "full" ? "roomFull" : "roomGone";
}

// ../../packages/shared/src/client/net/game-socket.ts
function socketUrl(origin, path) {
  const scheme = origin.protocol === "https:" ? "wss:" : "ws:";
  return `${scheme}//${origin.host}${path}`;
}
function originSocketFactory(origin, createSocket) {
  return (path) => createSocket(socketUrl(origin, path));
}

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
function sponsorPageLink(origin) {
  return `${origin}${SPONSOR_PAGE_PATH}`;
}

// ../../packages/shared/src/client/render/camera.ts
var BASE_VIEW = viewForMass(0);
var ZOOM_EASING_MS = 150;
var Camera = class {
  /** World point at the centre of the screen (world units). */
  centerX = 0;
  centerY = 0;
  /** Viewport px (CSS px in a browser) per world unit. */
  scale = 1;
  /** World rectangle on screen (world units). */
  minX = 0;
  maxX = 0;
  minY = 0;
  maxY = 0;
  halfWidth = 0;
  halfHeight = 0;
  updatedAt = null;
  /**
   * Points the camera at `target` (centre and half-sizes in world units) on `viewport` at `now`
   * (ms). The first update, or one after time went backwards, takes the target's size at once.
   */
  update(target, viewport, now) {
    const elapsed = this.updatedAt === null ? Number.POSITIVE_INFINITY : now - this.updatedAt;
    const follow = elapsed >= 0 ? 1 - Math.exp(-elapsed / ZOOM_EASING_MS) : 1;
    this.updatedAt = now;
    this.halfWidth += (target.halfWidth - this.halfWidth) * follow;
    this.halfHeight += (target.halfHeight - this.halfHeight) * follow;
    this.centerX = target.centerX;
    this.centerY = target.centerY;
    this.scale = Math.max(
      viewport.widthPx / (2 * this.halfWidth),
      viewport.heightPx / (2 * this.halfHeight)
    );
    const halfVisibleWidth = viewport.widthPx / 2 / this.scale;
    const halfVisibleHeight = viewport.heightPx / 2 / this.scale;
    this.minX = this.centerX - halfVisibleWidth;
    this.maxX = this.centerX + halfVisibleWidth;
    this.minY = this.centerY - halfVisibleHeight;
    this.maxY = this.centerY + halfVisibleHeight;
  }
  /** Whether a circle at (`x`, `y`) of `radius` world units touches the screen. */
  sees(x, y, radius) {
    return x + radius >= this.minX && x - radius <= this.maxX && y + radius >= this.minY && y - radius <= this.maxY;
  }
  /** The world point under viewport point (`xPx`, `yPx`) (px from its top left; CSS px in a browser). */
  screenToWorld(xPx, yPx, out) {
    out.x = this.minX + xPx / this.scale;
    out.y = this.minY + yPx / this.scale;
    return out;
  }
};
function cameraTarget(frame, mapSize, out) {
  if (!frame.hasSnapshot) {
    out.centerX = mapSize / 2;
    out.centerY = mapSize / 2;
    out.halfWidth = BASE_VIEW.halfWidth;
    out.halfHeight = BASE_VIEW.halfHeight;
    return out;
  }
  const hasOwnCells = frame.ownCount > 0;
  out.centerX = hasOwnCells ? frame.ownCenterX : frame.view.centerX;
  out.centerY = hasOwnCells ? frame.ownCenterY : frame.view.centerY;
  out.halfWidth = frame.view.halfWidth;
  out.halfHeight = frame.view.halfHeight;
  return out;
}

// ../../packages/shared/src/client/render/own-cells.ts
var CORRECTION_MS = 100;
var CORRECTION_TIME_CONSTANT_MS = CORRECTION_MS / 3;
var CORRECTION_SNAP_DISTANCE = 300;
var OwnCellSmoother = class {
  tracks = [];
  frame = 0;
  /** Starts a frame. */
  beginFrame() {
    this.frame += 1;
  }
  /**
   * Moves `cell` from its raw extrapolated position to where it is drawn at `now` (ms), and
   * remembers it with the `velocity` its raw position moves at from now on (0 when its
   * extrapolation is capped).
   */
  place(cell, velocity, now) {
    const known = this.find(cell.id);
    const track = known ?? this.start(cell.id);
    if (known !== void 0) this.correct(track, cell, { velocity, now });
    track.rawX = cell.x;
    track.rawY = cell.y;
    track.vx = velocity.vx;
    track.vy = velocity.vy;
    track.placedAt = now;
    track.frame = this.frame;
    cell.x += track.offsetX;
    cell.y += track.offsetY;
    track.drawnX = cell.x;
    track.drawnY = cell.y;
  }
  /**
   * Adds to `track`'s fading offset the gap between where its raw position would be by its last
   * velocity and where `raw` is now. A gap past `CORRECTION_SNAP_DISTANCE` is dropped instead.
   */
  correct(track, raw, at) {
    const elapsed = at.now - track.placedAt;
    const fade = Math.exp(-elapsed / CORRECTION_TIME_CONSTANT_MS);
    track.offsetX = track.offsetX * fade + track.rawX + track.vx * elapsed - raw.x;
    track.offsetY = track.offsetY * fade + track.rawY + track.vy * elapsed - raw.y;
    if (Math.hypot(track.offsetX, track.offsetY) > CORRECTION_SNAP_DISTANCE) {
      track.offsetX = 0;
      track.offsetY = 0;
      return;
    }
    this.holdInsteadOfReversing(track, raw, at.velocity);
  }
  /**
   * A correction that would draw the cell moving against the way it is heading (its raw velocity),
   * as when the server moves it in stop-go steps, holds it where it was drawn instead: the
   * correction is kept whole, and the raw position catches up with it. A cell that stops or turns
   * has a new velocity, so it is never held against it.
   */
  holdInsteadOfReversing(track, raw, velocity) {
    const stepX = raw.x + track.offsetX - track.drawnX;
    const stepY = raw.y + track.offsetY - track.drawnY;
    if (stepX * velocity.vx + stepY * velocity.vy >= 0) return;
    track.offsetX = track.drawnX - raw.x;
    track.offsetY = track.drawnY - raw.y;
  }
  /** Ends a frame: cells not placed in it (eaten, merged, the player died) are forgotten. */
  endFrame() {
    for (const track of this.tracks) {
      if (track.frame !== this.frame) track.isActive = false;
    }
  }
  find(id) {
    for (const track of this.tracks) if (track.isActive && track.id === id) return track;
    return void 0;
  }
  start(id) {
    const track = this.tracks.find((candidate) => !candidate.isActive) ?? this.grow();
    track.isActive = true;
    track.id = id;
    track.offsetX = 0;
    track.offsetY = 0;
    return track;
  }
  grow() {
    const track = {
      isActive: false,
      id: 0,
      rawX: 0,
      rawY: 0,
      vx: 0,
      vy: 0,
      placedAt: 0,
      drawnX: 0,
      drawnY: 0,
      offsetX: 0,
      offsetY: 0,
      frame: 0
    };
    this.tracks.push(track);
    return track;
  }
};

// ../../packages/shared/src/client/render/timeline.ts
var MAX_JITTER_MS = 50;
function createTimeline() {
  return { offsetMs: 0, jitterMs: 0 };
}
function measureTimeline(buffer, out) {
  out.offsetMs = 0;
  out.jitterMs = 0;
  if (buffer.size === 0) return out;
  let earliest = Number.POSITIVE_INFINITY;
  let latest = Number.NEGATIVE_INFINITY;
  let index = 0;
  let entry = buffer.get(index);
  while (entry !== void 0) {
    const lag = entry.receivedAt - entry.snapshot.tick * TICK_MS;
    earliest = Math.min(earliest, lag);
    latest = Math.max(latest, lag);
    index += 1;
    entry = buffer.get(index);
  }
  out.offsetMs = earliest;
  out.jitterMs = Math.min(latest - earliest, MAX_JITTER_MS);
  return out;
}
function tickTime(entry, timeline) {
  return entry.snapshot.tick * TICK_MS + timeline.offsetMs;
}

// ../../packages/shared/src/client/render/frame-view.ts
function createFrameView() {
  return {
    hasSnapshot: false,
    view: { centerX: 0, centerY: 0, halfWidth: 0, halfHeight: 0 },
    cells: [],
    viruses: [],
    blobs: [],
    ownCount: 0,
    ownCenterX: 0,
    ownCenterY: 0,
    scratch: {
      spareCells: [],
      spareViruses: [],
      spareBlobs: [],
      timeline: createTimeline(),
      older: emptyIndex(),
      previous: emptyIndex(),
      window: emptyIndex(),
      smoother: new OwnCellSmoother(),
      velocity: { vx: 0, vy: 0 }
    }
  };
}
function indexOf(index, snapshot) {
  if (index.snapshot === snapshot) return index;
  index.snapshot = snapshot;
  fillIndex(index.cells, snapshot?.cells ?? []);
  fillIndex(index.viruses, snapshot?.viruses ?? []);
  fillIndex(index.blobs, snapshot?.blobs ?? []);
  return index;
}
function entityById(entities, index, id) {
  return entities?.[index.get(id) ?? -1];
}
function nextCell(out) {
  const frame = out.scratch.spareCells.pop() ?? {
    id: 0,
    slot: 0,
    x: 0,
    y: 0,
    radius: 0,
    isOwn: false
  };
  out.cells.push(frame);
  return frame;
}
function lerp(from, to, amount) {
  return from + (to - from) * amount;
}
function fillIndex(index, entities) {
  index.clear();
  entities.forEach((entity, position) => index.set(entity.id, position));
}
function emptyIndex() {
  return { snapshot: null, cells: /* @__PURE__ */ new Map(), viruses: /* @__PURE__ */ new Map(), blobs: /* @__PURE__ */ new Map() };
}

// ../../packages/shared/src/client/render/own-extrapolation.ts
var MAX_EXTRAPOLATION_MS = 100;
var OWN_STEER_NUDGE = 0.5;
var VELOCITY_WINDOW_TICKS = 3;
function extrapolateOwn(buffer, at, out) {
  const { newest: newestEntry, now, own } = at;
  if (own.slot === null) return;
  const { timeline, smoother, velocity } = out.scratch;
  const newest = newestEntry.snapshot;
  const previousSnapshot = snapshotIn(buffer, buffer.size - 2, null);
  const previousTick = previousSnapshot?.tick ?? newest.tick;
  const previous = indexOf(out.scratch.previous, previousSnapshot);
  const windowStart = Math.max(buffer.size - 1 - VELOCITY_WINDOW_TICKS, 0);
  const windowSnapshot = snapshotIn(buffer, windowStart, newest);
  const window = indexOf(out.scratch.window, windowSnapshot);
  const ageMs = Math.min(Math.max(now - tickTime(newestEntry, timeline), 0), MAX_EXTRAPOLATION_MS);
  let totalMass = 0;
  let weightedX = 0;
  let weightedY = 0;
  for (const cell of newest.cells) {
    if (cell.slot !== own.slot) continue;
    const before = entityById(previousSnapshot?.cells, previous.cells, cell.id);
    const start2 = entityById(windowSnapshot.cells, window.cells, cell.id);
    const from = start2 ?? before;
    const fromTick = start2 === void 0 ? previousTick : windowSnapshot.tick;
    const spanMs = (newest.tick - fromTick) * TICK_MS;
    const isKnown = from !== void 0 && spanMs > 0;
    velocity.vx = isKnown ? (cell.x - from.x) / spanMs : 0;
    velocity.vy = isKnown ? (cell.y - from.y) / spanMs : 0;
    nudgeTowards(cell, own.target, velocity);
    const frame = nextCell(out);
    frame.id = cell.id;
    frame.slot = cell.slot;
    frame.isOwn = true;
    frame.radius = lerp(before?.radius ?? cell.radius, cell.radius, Math.min(ageMs / TICK_MS, 1));
    frame.x = cell.x + velocity.vx * ageMs;
    frame.y = cell.y + velocity.vy * ageMs;
    if (ageMs >= MAX_EXTRAPOLATION_MS) {
      velocity.vx = 0;
      velocity.vy = 0;
    }
    smoother.place(frame, velocity, now);
    const mass = frame.radius * frame.radius;
    totalMass += mass;
    weightedX += frame.x * mass;
    weightedY += frame.y * mass;
    out.ownCount += 1;
  }
  if (totalMass <= 0) return;
  out.ownCenterX = weightedX / totalMass;
  out.ownCenterY = weightedY / totalMass;
}
function snapshotIn(buffer, index, fallback) {
  return buffer.get(index)?.snapshot ?? fallback;
}
function nudgeTowards(cell, target, velocity) {
  if (target === null) return;
  const dx = target.x - cell.x;
  const dy = target.y - cell.y;
  const gap = Math.hypot(dx, dy);
  if (gap < TARGET_DEAD_ZONE) return;
  const sqrtMass = cell.radius / RADIUS_PER_SQRT_MASS;
  const speedPerMs = Math.min(speedForMass(sqrtMass * sqrtMass), gap) / TICK_MS;
  velocity.vx = lerp(velocity.vx, dx / gap * speedPerMs, OWN_STEER_NUDGE);
  velocity.vy = lerp(velocity.vy, dy / gap * speedPerMs, OWN_STEER_NUDGE);
}

// ../../packages/shared/src/client/render/interpolation.ts
var INTERP_DELAY_MS = 50;
function interpolateView(buffer, now, own, out) {
  recycle(out.cells, out.scratch.spareCells);
  recycle(out.viruses, out.scratch.spareViruses);
  recycle(out.blobs, out.scratch.spareBlobs);
  out.ownCount = 0;
  const newest = buffer.latest();
  out.hasSnapshot = newest !== void 0;
  out.scratch.smoother.beginFrame();
  if (newest !== void 0) {
    const timeline = measureTimeline(buffer, out.scratch.timeline);
    const drawnAt = now - INTERP_DELAY_MS - timeline.jitterMs;
    interpolateOthers(bracket(buffer, { newest, drawnAt, timeline }), own.slot, out);
    extrapolateOwn(buffer, { newest, now, own }, out);
  }
  out.scratch.smoother.endFrame();
  return out;
}
function bracket(buffer, at) {
  const { drawnAt, timeline } = at;
  let older = at.newest;
  let newer = at.newest;
  for (let index = buffer.size - 2; tickTime(older, timeline) > drawnAt; index -= 1) {
    const candidate = buffer.get(index);
    if (candidate === void 0) break;
    newer = older;
    older = candidate;
  }
  const olderTime = tickTime(older, timeline);
  if (olderTime > drawnAt) newer = older;
  const span = tickTime(newer, timeline) - olderTime;
  const amount = span > 0 ? (drawnAt - olderTime) / span : 0;
  return { older: older.snapshot, newer: newer.snapshot, amount };
}
function interpolateOthers(around, ownSlot, out) {
  const { older, newer, amount } = around;
  const index = indexOf(out.scratch.older, older);
  lerpView(around, out.view);
  for (const cell of newer.cells) {
    if (cell.slot === ownSlot) continue;
    const from = entityById(older.cells, index.cells, cell.id) ?? cell;
    const frame = nextCell(out);
    frame.id = cell.id;
    frame.slot = cell.slot;
    frame.isOwn = false;
    frame.x = lerp(from.x, cell.x, amount);
    frame.y = lerp(from.y, cell.y, amount);
    frame.radius = lerp(from.radius, cell.radius, amount);
  }
  for (const virus of newer.viruses) {
    const from = entityById(older.viruses, index.viruses, virus.id) ?? virus;
    const frame = out.scratch.spareViruses.pop() ?? emptyCircle();
    out.viruses.push(frame);
    frame.id = virus.id;
    frame.x = lerp(from.x, virus.x, amount);
    frame.y = lerp(from.y, virus.y, amount);
    frame.radius = lerp(from.radius, virus.radius, amount);
  }
  for (const blob of newer.blobs) {
    const from = entityById(older.blobs, index.blobs, blob.id) ?? blob;
    const frame = out.scratch.spareBlobs.pop() ?? emptyPoint();
    out.blobs.push(frame);
    frame.id = blob.id;
    frame.x = lerp(from.x, blob.x, amount);
    frame.y = lerp(from.y, blob.y, amount);
  }
}
function lerpView(around, out) {
  const from = around.older.view;
  const to = around.newer.view;
  const { amount } = around;
  out.centerX = lerp(from.centerX, to.centerX, amount);
  out.centerY = lerp(from.centerY, to.centerY, amount);
  out.halfWidth = lerp(from.halfWidth, to.halfWidth, amount);
  out.halfHeight = lerp(from.halfHeight, to.halfHeight, amount);
}
function recycle(entries, spares) {
  for (const entry of entries) spares.push(entry);
  entries.length = 0;
}
function emptyCircle() {
  return { id: 0, x: 0, y: 0, radius: 0 };
}
function emptyPoint() {
  return { id: 0, x: 0, y: 0 };
}

// ../../packages/shared/src/client/render/palette.ts
var DESIGN_COLOURS = {
  background: "#0B0F17",
  surface: "#131A26",
  border: "#1F2A3C",
  /** Mint: primary actions, the player's highlight (its own cells too), viruses. */
  primary: OWN_CELL_COLOUR,
  /** Cyan. */
  secondary: "#5AC8FF",
  /** Pink. */
  accent: "#FF5CA8",
  /** Amber: warnings, the reconnecting toast. */
  warning: "#FFC857",
  /** UI errors; no player colour comes near it (`apps/web/src/design/palette.test.ts`). */
  danger: "#FF5C5C",
  text: "#E6EDF7",
  muted: "#8A96AB"
};
var DESIGN_FONTS = {
  ui: "'Space Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace"
};
var GRID_SPACING = 50;
var BLOB_RADIUS = massToRadius(EJECT_BLOB_MASS);
function mixColours(from, to, amount) {
  let mixed = "#";
  for (const start2 of [1, 3, 5]) {
    const a = Number.parseInt(from.slice(start2, start2 + 2), 16);
    const b = Number.parseInt(to.slice(start2, start2 + 2), 16);
    mixed += Math.round(a + (b - a) * amount).toString(16).padStart(2, "0");
  }
  return mixed.toUpperCase();
}
function pelletTint(id) {
  switch (id % 4) {
    case 0:
      return DESIGN_COLOURS.primary;
    case 1:
      return DESIGN_COLOURS.secondary;
    case 2:
      return DESIGN_COLOURS.accent;
    default:
      return DESIGN_COLOURS.warning;
  }
}
function blobTint(id) {
  switch (id % 3) {
    case 0:
      return DESIGN_COLOURS.secondary;
    case 1:
      return DESIGN_COLOURS.accent;
    default:
      return DESIGN_COLOURS.warning;
  }
}
var SLOT_INK_MIN_CONTRAST = 4.5;
var SLOT_INK_SEARCH_STEPS = 12;
var BLACK = "#000000";
var WHITE = "#FFFFFF";
function relativeLuminance(colour) {
  return 0.2126 * linear(colour, 1) + 0.7152 * linear(colour, 3) + 0.0722 * linear(colour, 5);
}
function linear(colour, start2) {
  const value = Number.parseInt(colour.slice(start2, start2 + 2), 16) / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}
function contrastRatio(first, second) {
  const a = relativeLuminance(first);
  const b = relativeLuminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
function slotInk(colour, background, minContrast = SLOT_INK_MIN_CONTRAST) {
  const brand = mixColours(colour, colour, 0);
  if (contrastRatio(brand, background) >= minContrast) return brand;
  const towards = contrastRatio(WHITE, background) >= contrastRatio(BLACK, background) ? WHITE : BLACK;
  let low = 0;
  let high = 1;
  for (let step2 = 0; step2 < SLOT_INK_SEARCH_STEPS; step2 += 1) {
    const middle = (low + high) / 2;
    if (contrastRatio(mixColours(brand, towards, middle), background) >= minContrast) {
      high = middle;
    } else {
      low = middle;
    }
  }
  return mixColours(brand, towards, high);
}
var SLOT_SHADES = {
  sponsored: { fill: 0.08, border: 0.4 },
  empty: { fill: 0.04, border: 0.45 }
};
function slotColour(colour, background) {
  return colour === null ? DESIGN_COLOURS.muted : slotInk(colour, background);
}

// ../../packages/shared/src/client/state/snapshot-buffer.ts
var SNAPSHOT_BUFFER_SIZE = 8;
var SnapshotBuffer = class {
  entries = new Array(
    SNAPSHOT_BUFFER_SIZE
  ).fill(void 0);
  start = 0;
  count = 0;
  /** Snapshots held (0 to `SNAPSHOT_BUFFER_SIZE`). */
  get size() {
    return this.count;
  }
  /** Adds the newest snapshot, received at `receivedAt` (ms). */
  push(snapshot, receivedAt) {
    this.entries[(this.start + this.count) % SNAPSHOT_BUFFER_SIZE] = { snapshot, receivedAt };
    if (this.count < SNAPSHOT_BUFFER_SIZE) this.count += 1;
    else this.start = (this.start + 1) % SNAPSHOT_BUFFER_SIZE;
  }
  /** The snapshot at `index` (0 is the oldest held), or `undefined` outside `0`–`size − 1`. */
  get(index) {
    if (!Number.isInteger(index) || index < 0 || index >= this.count) return void 0;
    return this.entries[(this.start + index) % SNAPSHOT_BUFFER_SIZE];
  }
  /** The newest snapshot, or `undefined` while empty. */
  latest() {
    return this.get(this.count - 1);
  }
  /** Forgets every snapshot (a new socket starts from scratch). */
  clear() {
    this.entries.fill(void 0);
    this.start = 0;
    this.count = 0;
  }
};

// ../../packages/shared/src/client/state/client-state.ts
function createClientState() {
  return {
    phase: { kind: "idle" },
    room: null,
    ownSlot: null,
    ownPlayerId: null,
    mapSize: MAP_SIZE,
    players: emptyPlayers(),
    pellets: /* @__PURE__ */ new Map(),
    snapshots: new SnapshotBuffer(),
    leaderboard: [],
    ownRank: null,
    bestRank: null,
    ownMass: 0,
    death: null,
    notice: null,
    seatToken: null,
    slots: null
  };
}
function applyServerMessage(state, message, receivedAt) {
  switch (message.type) {
    case "welcome":
      applyWelcome(state, message);
      return;
    case "players":
      for (const entry of message.entries) state.players[entry.slot] = entry;
      return;
    case "playerLeft":
      state.players[message.slot] = void 0;
      return;
    case "snapshot":
      applySnapshot(state, message, receivedAt);
      return;
    case "leaderboard":
      applyLeaderboard(state, message);
      return;
    case "death":
      applyDeath(state, message);
      return;
    case "slots":
      state.slots = { version: message.version, slots: message.slots };
      return;
    case "pong":
      return;
  }
}
function applyPhase(state, phase) {
  state.phase = phase;
  if (phase.kind === "idle") {
    Object.assign(state, createClientState());
    return;
  }
  if (phase.kind !== "playing") return;
  state.room = phase.room;
  if (phase.notice !== null) state.notice = phase.notice;
}
function markRespawned(state) {
  state.death = null;
  state.bestRank = null;
}
function applyWelcome(state, welcome) {
  const isResumed = state.room === welcome.room && state.seatToken !== null && sameBytes(state.seatToken, welcome.token);
  if (!isResumed) {
    state.bestRank = null;
    state.leaderboard = [];
    state.ownRank = null;
    state.death = null;
  }
  state.room = welcome.room;
  state.ownSlot = welcome.slot;
  state.ownPlayerId = welcome.playerId;
  state.mapSize = welcome.mapSize;
  state.seatToken = welcome.token;
  state.ownMass = 0;
  state.players = emptyPlayers();
  state.pellets.clear();
  state.snapshots.clear();
}
function applySnapshot(state, snapshot, receivedAt) {
  for (const id of snapshot.pelletsRemoved) state.pellets.delete(id);
  for (const pellet of snapshot.pelletsAdded) state.pellets.set(pellet.id, pellet);
  state.snapshots.push(snapshot, receivedAt);
  state.ownMass = massOfSlot(snapshot.cells, state.ownSlot);
}
function applyLeaderboard(state, leaderboard2) {
  state.leaderboard = leaderboard2.entries;
  state.ownRank = leaderboard2.ownRank;
  if (leaderboard2.ownRank === null || state.death !== null) return;
  state.bestRank = Math.min(state.bestRank ?? leaderboard2.ownRank, leaderboard2.ownRank);
}
function applyDeath(state, death) {
  const { killerSlot, stats } = death;
  if (state.death !== null && isSameDeath(state.death, death)) return;
  const killerName = killerSlot === null ? null : state.players[killerSlot]?.nickname ?? null;
  const view = state.snapshots.latest()?.snapshot.view;
  const position = view === void 0 ? null : { x: view.centerX, y: view.centerY };
  state.death = { killerSlot, killerName, stats, position };
}
function massOfSlot(cells, slot) {
  let mass = 0;
  for (const cell of cells) {
    if (cell.slot !== slot) continue;
    const sqrtMass = cell.radius / RADIUS_PER_SQRT_MASS;
    mass += sqrtMass * sqrtMass;
  }
  return Math.round(mass);
}
function isSameDeath(recorded, death) {
  const { stats } = recorded;
  return recorded.killerSlot === death.killerSlot && stats.highestMass === death.stats.highestMass && stats.pelletsEaten === death.stats.pelletsEaten && stats.cellsEaten === death.stats.cellsEaten && stats.ticksAlive === death.stats.ticksAlive;
}
function emptyPlayers() {
  return new Array(MAX_PLAYERS_PER_ROOM).fill(void 0);
}
function sameBytes(left, right) {
  return left.length === right.length && left.every((byte, index) => byte === right[index]);
}

// ../../packages/shared/src/client/state/leaderboard-model.ts
function leaderboardModel(state) {
  const nameOf = (slot) => slot === null ? null : state.players[slot]?.nickname ?? null;
  const top = state.leaderboard.map((row, index) => ({
    rank: index + 1,
    name: nameOf(row.slot),
    mass: row.mass,
    isOwn: row.slot === state.ownSlot
  }));
  const isOwnInTop = top.some((line) => line.isOwn);
  const ownBelow = state.ownRank === null || isOwnInTop ? null : { rank: state.ownRank, name: nameOf(state.ownSlot), mass: state.ownMass, isOwn: true };
  return { top, ownBelow };
}

// ../../packages/shared/src/client/state/minimap-marks.ts
var PERCENT = 100;
function slotMarks(slots, mapSize) {
  if (slots === null) return [];
  const toPercent = (value) => value / mapSize * PERCENT;
  return slots.slots.map((slot) => ({
    id: slot.id,
    left: toPercent(slot.x),
    top: toPercent(slot.y),
    width: toPercent(slot.w),
    height: toPercent(slot.h),
    ink: slot.sponsor === null ? null : slotInk(slot.sponsor.colour, DESIGN_COLOURS.background)
  }));
}
function minimapMarks(state) {
  const latest = state.snapshots.latest();
  if (latest === void 0) return null;
  const { snapshot } = latest;
  const toPercent = (value) => clampPercent(value / state.mapSize * PERCENT);
  const { centerX, centerY, halfWidth, halfHeight } = snapshot.view;
  const left = toPercent(centerX - halfWidth);
  const top = toPercent(centerY - halfHeight);
  const view = {
    left,
    top,
    width: toPercent(centerX + halfWidth) - left,
    height: toPercent(centerY + halfHeight) - top
  };
  const centre = ownCentre(snapshot, state.ownSlot);
  const player = centre === null ? null : { x: toPercent(centre.x), y: toPercent(centre.y) };
  return { view, player };
}
function ownCentre(snapshot, slot) {
  let weight = 0;
  let x = 0;
  let y = 0;
  for (const cell of snapshot.cells) {
    if (cell.slot !== slot) continue;
    const cellWeight = cell.radius * cell.radius;
    weight += cellWeight;
    x += cell.x * cellWeight;
    y += cell.y * cellWeight;
  }
  return weight === 0 ? null : { x: x / weight, y: y / weight };
}
function clampPercent(value) {
  return Math.min(Math.max(value, 0), PERCENT);
}

// ../../packages/shared/src/client/state/play-again.ts
var PlayAgain = class {
  constructor(connection) {
    this.connection = connection;
  }
  connection;
  isWaiting = false;
  /** Whether a Play again waits for the new life to show. */
  get isPending() {
    return this.isWaiting;
  }
  /** The player asked to play again: asks the room now. */
  request() {
    this.isWaiting = true;
    this.connection.respawn();
  }
  /**
   * Call after each server message is applied to `state`: once the new life shows, ends the
   * request and marks `state` respawned (no death, a fresh best rank).
   */
  settle(state) {
    if (!this.isWaiting) return;
    if (state.death !== null && state.ownMass === 0) return;
    this.isWaiting = false;
    markRespawned(state);
  }
  /** Call on each phase: `idle` drops the request, `playing` asks the room again. */
  follow(phase) {
    if (phase.kind === "idle") this.isWaiting = false;
    if (phase.kind === "playing" && this.isWaiting) this.connection.respawn();
  }
};

// ../../packages/shared/src/client/state/sponsor-credit.ts
function creditedSlot(slots, at) {
  let credited = null;
  let nearest = Number.POSITIVE_INFINITY;
  for (const slot of slots) {
    const { sponsor } = slot;
    if (sponsor === null) continue;
    const distance2 = at === null ? 0 : squaredDistance(slot, at);
    if (distance2 >= nearest) continue;
    credited = { ...slot, sponsor };
    nearest = distance2;
  }
  return credited;
}
function creditedSponsor(slots, at) {
  return creditedSlot(slots, at)?.sponsor ?? null;
}
function squaredDistance(slot, at) {
  const dx = slot.x + slot.w / 2 - at.x;
  const dy = slot.y + slot.h / 2 - at.y;
  return dx * dx + dy * dy;
}

// bridge/control-server.ts
import { createServer } from "node:http";

// bridge/pane.ts
var MAX_PANE_COLUMNS = 512;
var MAX_PANE_ROWS = 256;
var PIXELS_PER_ROW = 2;
var MAX_AIM_OFFSET = 4;
var DEFAULT_PANE_SIZE = { columns: 120, rows: 40 };
var STATUS_ROWS = 1;
function mapRows(size) {
  return Math.max(size.rows - STATUS_ROWS, 0);
}
function isPaneSize(columns, rows) {
  return isCount2(columns, MAX_PANE_COLUMNS) && isCount2(rows, MAX_PANE_ROWS);
}
function paneViewport(size) {
  return { widthPx: size.columns, heightPx: mapRows(size) * PIXELS_PER_ROW, pixelRatio: 1 };
}
function panePoint(size, x, y) {
  const { widthPx, heightPx } = paneViewport(size);
  return { xPx: (x + 1) / 2 * widthPx, yPx: (y + 1) / 2 * heightPx };
}
function headingPoint(size, heading) {
  const { widthPx, heightPx } = paneViewport(size);
  const centre = { xPx: widthPx / 2, yPx: heightPx / 2 };
  if (heading === null) return centre;
  const reachPx = Math.min(reachAlong(heading.x, centre.xPx), reachAlong(heading.y, centre.yPx));
  return { xPx: centre.xPx + heading.x * reachPx, yPx: centre.yPx + heading.y * reachPx };
}
function reachAlong(component, halfPx) {
  return component === 0 ? Number.POSITIVE_INFINITY : halfPx / Math.abs(component);
}
function isCount2(value, max) {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= max;
}

// bridge/control-input.ts
var CONTROL_ROUTES = {
  input: "/input",
  press: "/press",
  resize: "/resize",
  leave: "/leave"
};
var CONTROL_STATUS = { badRequest: 400, notFound: 404 };
var PANE_ACTIONS = ["split", "eject", "respawn"];
var KEY_DIRECTIONS = [-1, 0, 1];
function parseControl(path, body) {
  switch (path) {
    case CONTROL_ROUTES.input:
      return parseInput(body);
    case CONTROL_ROUTES.press:
      return parsePress(body);
    case CONTROL_ROUTES.resize:
      return parseResize(body);
    case CONTROL_ROUTES.leave:
      return body === void 0 || hasKeys(body, []) ? accept({ kind: "leave" }) : refuse("leave");
    default:
      return { ok: false, status: CONTROL_STATUS.notFound, error: `no route ${path}` };
  }
}
function parseInput(body) {
  if (hasKeys(body, ["keys"])) {
    const { keys } = body;
    if (!hasKeys(keys, ["dx", "dy"]) || !isKeyDirection(keys.dx) || !isKeyDirection(keys.dy)) {
      return refuse("keys");
    }
    return accept({ kind: "keys", dx: keys.dx, dy: keys.dy });
  }
  if (!hasKeys(body, ["x", "y"]) || !isAimOffset(body.x) || !isAimOffset(body.y)) {
    return refuse("input");
  }
  return accept({ kind: "aim", x: body.x, y: body.y });
}
function parsePress(body) {
  if (!hasKeys(body, ["action"]) || !isPaneAction(body.action)) return refuse("press");
  return accept({ kind: "press", action: body.action });
}
function parseResize(body) {
  if (!hasKeys(body, ["columns", "rows"]) || !isPaneSize(body.columns, body.rows)) {
    return refuse("resize");
  }
  return accept({ kind: "resize", columns: Number(body.columns), rows: Number(body.rows) });
}
function accept(input) {
  return { ok: true, input };
}
function refuse(route) {
  return { ok: false, status: CONTROL_STATUS.badRequest, error: `invalid ${route} body` };
}
function hasKeys(value, keys) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const own = Object.keys(value);
  return own.length === keys.length && keys.every((key) => own.includes(key));
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

// bridge/token.ts
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
var TOKEN_BYTES = 32;
function createToken() {
  return randomBytes(TOKEN_BYTES).toString("hex");
}
function isSameToken(expected, presented) {
  if (typeof presented !== "string") return false;
  return timingSafeEqual(digest(expected), digest(presented));
}
function digest(text) {
  return createHash("sha256").update(text).digest();
}

// bridge/control-server.ts
var CONTROL_HOST = "127.0.0.1";
var TOKEN_HEADER = "x-te-token";
var MAX_BODY_BYTES = 1024;
var HTTP = {
  noContent: 204,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  methodNotAllowed: 405,
  payloadTooLarge: 413,
  internalError: 500
};
async function startControlServer(options) {
  let port = 0;
  const server = createServer((request, response) => {
    void answer(request, response, { ...options, port });
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, CONTROL_HOST, () => {
      server.off("error", reject);
      resolve();
    });
  });
  port = server.address().port;
  return {
    port,
    close: () => new Promise((resolve) => {
      server.close(() => {
        resolve();
      });
    })
  };
}
async function answer(request, response, options) {
  if (!isSameToken(options.token, request.headers[TOKEN_HEADER])) {
    end(response, HTTP.unauthorized);
    return;
  }
  if (request.headers.host !== `${CONTROL_HOST}:${String(options.port)}`) {
    end(response, HTTP.forbidden, "wrong host");
    return;
  }
  if (request.method !== "POST") {
    response.setHeader("allow", "POST");
    end(response, HTTP.methodNotAllowed);
    return;
  }
  const body = await readBody(request);
  if (body === null) {
    response.destroy();
    return;
  }
  if (!body.ok) {
    end(response, body.status, body.error);
    return;
  }
  const { pathname } = new URL(String(request.url), "http://control");
  const parsed = parseControl(pathname, body.value);
  if (!parsed.ok) {
    end(response, parsed.status, parsed.error);
    return;
  }
  if (parsed.input.kind === "leave") response.shouldKeepAlive = false;
  try {
    options.onInput(parsed.input);
  } catch (error) {
    options.onError(error);
    end(response, HTTP.internalError, "input failed");
    return;
  }
  end(response, HTTP.noContent);
}
async function readBody(request) {
  const chunks = [];
  let size = 0;
  try {
    for await (const chunk of request) {
      size += chunk.length;
      if (size <= MAX_BODY_BYTES) chunks.push(chunk);
    }
  } catch {
    return null;
  }
  if (size > MAX_BODY_BYTES) {
    return { ok: false, status: HTTP.payloadTooLarge, error: "body too large" };
  }
  const text = Buffer.concat(chunks).toString("utf8");
  if (text === "") return { ok: true, value: void 0 };
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, status: HTTP.badRequest, error: "body is not JSON" };
  }
}
function end(response, status, text) {
  if (text === void 0) {
    response.writeHead(status).end();
    return;
  }
  response.writeHead(status, { "content-type": "text/plain; charset=utf-8" }).end(text);
}

// bridge/env.ts
var DEFAULT_SERVER_URL = "https://playtokeneater.com";
var BRIDGE_SURFACES = ["terminal", "desktop"];
var BRIDGE_ENV = {
  serverUrl: "TE_SERVER_URL",
  nickname: "TE_NICKNAME",
  room: "TE_ROOM",
  columns: "TE_COLUMNS",
  rows: "TE_ROWS",
  surface: "TE_SURFACE"
};
function parseBridgeEnv(env) {
  const serverUrl = env[BRIDGE_ENV.serverUrl] ?? "";
  const server = parseServerUrl(serverUrl === "" ? DEFAULT_SERVER_URL : serverUrl);
  if (server === null) {
    return {
      ok: false,
      error: `${BRIDGE_ENV.serverUrl} must be the game server's http(s) origin (no path)`
    };
  }
  const size = parseSize(env[BRIDGE_ENV.columns], env[BRIDGE_ENV.rows]);
  if (size === null) {
    return {
      ok: false,
      error: `${BRIDGE_ENV.columns} and ${BRIDGE_ENV.rows} must be a pane size (1-512 \xD7 1-256)`
    };
  }
  const surface = parseSurface(env[BRIDGE_ENV.surface] ?? "");
  if (surface === null) {
    return {
      ok: false,
      error: `${BRIDGE_ENV.surface} must be one of: ${BRIDGE_SURFACES.join(", ")}`
    };
  }
  const room = env[BRIDGE_ENV.room] ?? "";
  return {
    ok: true,
    config: {
      origin: server.origin,
      server: { protocol: server.protocol, host: server.host },
      nickname: env[BRIDGE_ENV.nickname] ?? "",
      room: room === "" ? null : room,
      size,
      surface
    }
  };
}
function parseSurface(text) {
  if (text === "") return BRIDGE_SURFACES[0];
  return BRIDGE_SURFACES.find((surface) => surface === text) ?? null;
}
function parseServerUrl(text) {
  let url;
  try {
    url = new URL(text);
  } catch {
    return null;
  }
  const isHttp = url.protocol === "http:" || url.protocol === "https:";
  const isOrigin = url.href === `${url.origin}/`;
  return isHttp && isOrigin ? url : null;
}
function parseSize(columnsText, rowsText) {
  const columns = parseCount(columnsText, DEFAULT_PANE_SIZE.columns);
  const rows = parseCount(rowsText, DEFAULT_PANE_SIZE.rows);
  return isPaneSize(columns, rows) ? { columns, rows } : null;
}
function parseCount(text, fallback) {
  if (text === void 0) return fallback;
  return /^\d+$/.test(text) ? Number(text) : Number.NaN;
}

// bridge/cells.ts
var WORDS_PER_CELL = 3;
var SPACE = 32;
var UPPER_HALF_BLOCK = 9600;
var REPLACEMENT_GLYPH = 63;
var ASCII_FIRST = 32;
var ASCII_LAST = 126;
var LATIN_FIRST = 160;
var LATIN_LAST = 591;
var SOFT_HYPHEN = 173;
function glyphOf(codePoint) {
  const isAscii = codePoint >= ASCII_FIRST && codePoint <= ASCII_LAST;
  const isLatin = codePoint >= LATIN_FIRST && codePoint <= LATIN_LAST && codePoint !== SOFT_HYPHEN;
  return isAscii || isLatin ? codePoint : REPLACEMENT_GLYPH;
}
var LOW_SURROGATE_FIRST = 56320;
var LOW_SURROGATE_LAST = 57343;
function continuesCharacter(unit) {
  return unit >= LOW_SURROGATE_FIRST && unit <= LOW_SURROGATE_LAST;
}
function glyphsOf(text) {
  const composed = text.normalize("NFC");
  const glyphs = [];
  for (let index = 0; index < composed.length; index += 1) {
    const unit = composed.charCodeAt(index);
    if (!continuesCharacter(unit)) glyphs.push(glyphOf(unit));
  }
  return glyphs;
}
function textWidth(text) {
  const composed = text.normalize("NFC");
  let width = 0;
  for (let index = 0; index < composed.length; index += 1) {
    if (!continuesCharacter(composed.charCodeAt(index))) width += 1;
  }
  return width;
}
function runsWidth(runs) {
  let width = 0;
  for (const run of runs) width += textWidth(run.text);
  return width;
}
var CellGrid = class {
  /** The cells, as `$.ui.blit` takes them (`size.columns × size.rows × WORDS_PER_CELL` words). */
  cells = new Uint32Array(0);
  size = { columns: 0, rows: 0 };
  /** Colours of the cell being written, reused so text allocates nothing per cell. */
  pen = { foreground: 0, background: 0 };
  /** Sizes the grid to `size`; its cells are left as they were unless the size changed. */
  resize(size) {
    if (size.columns === this.size.columns && size.rows === this.size.rows) return;
    this.size = size;
    this.cells = new Uint32Array(size.columns * size.rows * WORDS_PER_CELL);
  }
  /** The index of the cell at (`column`, `row`), or −1 when it is outside the grid. */
  indexOf(column, row) {
    const { columns, rows } = this.size;
    if (column < 0 || column >= columns || row < 0 || row >= rows) return -1;
    return (row * columns + column) * WORDS_PER_CELL;
  }
  /** Sets the cell at `index` (`indexOf`; −1 is ignored) to `glyph` in `colours`. */
  paint(index, glyph, colours) {
    if (index < 0) return;
    this.cells[index] = glyph;
    this.cells[index + 1] = colours.foreground;
    this.cells[index + 2] = colours.background;
  }
  /**
   * Sets the glyph and foreground of the cell at `index` (`indexOf`; −1 is ignored), keeping its
   * background.
   */
  ink(index, glyph, foreground) {
    if (index < 0) return;
    this.cells[index] = glyph;
    this.cells[index + 1] = foreground;
  }
  /** Whether the cell at `index` (`indexOf`) is `colour` throughout (both of its colours). */
  isFilled(index, colour) {
    return index >= 0 && this.cells[index + 1] === colour && this.cells[index + 2] === colour;
  }
  /**
   * Writes `runs` one after the other from `at`, a character per cell, clipped to the grid and to
   * `at.end` (characters past them are skipped, never wrapped), accents composed (`glyphsOf`).
   * Cells keep their background where a run has none. Returns the column after the runs, clipped
   * or not.
   */
  writeRuns(at, runs) {
    const pen = this.pen;
    const end2 = Math.min(at.end ?? this.size.columns, this.size.columns);
    let column = at.column;
    for (const run of runs) {
      pen.foreground = run.colour;
      const text = run.text.normalize("NFC");
      for (let unit = 0; unit < text.length; unit += 1) {
        const code = text.charCodeAt(unit);
        if (continuesCharacter(code)) continue;
        const index = column < end2 ? this.indexOf(column, at.row) : -1;
        if (run.background === void 0) {
          this.ink(index, glyphOf(code), run.colour);
        } else {
          pen.background = run.background;
          this.paint(index, glyphOf(code), pen);
        }
        column += 1;
      }
    }
    return column;
  }
  /** Paints the cells of `row` from `column` for `width` cells blank in `background`. */
  clearRow(row, span, background) {
    const pen = this.pen;
    pen.foreground = background;
    pen.background = background;
    for (let column = span.column; column < span.column + span.width; column += 1) {
      this.paint(this.indexOf(column, row), SPACE, pen);
    }
  }
};
var LastFrame = class {
  cells = new Uint32Array(0);
  columns = 0;
  /**
   * How many cells of `next` (a `size` raster) differ from the frame kept — every one after a
   * resize — and keeps `next` in its place.
   */
  replace(size, next) {
    if (size.columns !== this.columns || next.length !== this.cells.length) {
      this.cells = next.slice();
      this.columns = size.columns;
      return next.length / WORDS_PER_CELL;
    }
    let changed = 0;
    const kept = this.cells;
    for (let index = 0; index < next.length; index += WORDS_PER_CELL) {
      const isSame = kept[index] === next[index] && kept[index + 1] === next[index + 1] && kept[index + 2] === next[index + 2];
      if (!isSame) changed += 1;
    }
    if (changed > 0) kept.set(next);
    return changed;
  }
};

// bridge/map-rows.ts
var MAP_TREE_BUDGET = { nodes: 16e3, chars: 8e4 };
var HALF = "50%";
function mapTree(rows) {
  return {
    type: "Box",
    props: {
      flexDirection: "column",
      width: rows.columns,
      height: rows.rows,
      backgroundColor: colourOf(rows.palette, 0),
      overflow: "hidden"
    },
    children: rows.lines.map((line) => lineElement(line, rows.palette))
  };
}
function lineElement(line, palette) {
  if (typeof line === "number") return { type: "Box", props: { height: line } };
  return {
    type: "Box",
    props: { flexDirection: "row", height: 1 },
    children: line.map((segment) => segmentElement(segment, palette))
  };
}
function segmentElement(segment, palette) {
  const place = placeOf(segment);
  if (segment.length === 3) {
    return { type: "Box", props: { ...place, backgroundColor: colourOf(palette, segment[2]) } };
  }
  if (segment.length === 4) {
    return {
      type: "Box",
      props: { ...place, height: 1, flexDirection: "column" },
      children: [halfElement(segment[2], palette), halfElement(segment[3], palette)]
    };
  }
  const [, , background, ink, text] = segment;
  return {
    type: "Box",
    props: { ...place, ...backgroundOf(background, palette), overflow: "hidden" },
    children: [{ type: "Text", props: { color: colourOf(palette, ink) }, children: [text] }]
  };
}
function mapTreeCost(rows) {
  const lines = rows.lines.map((line) => lineCost(line, rows.palette));
  const root = mapTree({ ...rows, lines: [] });
  let chars = JSON.stringify(root).length + Math.max(lines.length - 1, 0);
  let nodes = 1;
  for (const line of lines) {
    chars += line.chars;
    nodes += line.nodes;
  }
  return { nodes, chars };
}
function lineCost(line, palette) {
  const element = lineElement(line, palette);
  return { nodes: countNodes(element), chars: JSON.stringify(element).length };
}
function placeOf(segment) {
  const [margin, width] = segment;
  return margin > 0 ? { marginLeft: margin, width } : { width };
}
function halfElement(colour, palette) {
  return { type: "Box", props: { height: HALF, ...backgroundOf(colour, palette) } };
}
function backgroundOf(colour, palette) {
  return colour === 0 ? {} : { backgroundColor: colourOf(palette, colour) };
}
function colourOf(palette, colour) {
  const css = palette[colour];
  if (css === void 0)
    throw new Error(`tokeneater bridge: map colour ${String(colour)} is not in the palette`);
  return css;
}
function countNodes(element) {
  if (typeof element === "string") return 1;
  let nodes = 1;
  for (const child of element.children ?? []) nodes += countNodes(child);
  return nodes;
}

// bridge/terminal-colours.ts
var PARSED = /* @__PURE__ */ new Map();
function cellColour(hex) {
  const known = PARSED.get(hex);
  if (known !== void 0) return known;
  const colour = Number.parseInt(hex.slice(1), 16);
  PARSED.set(hex, colour);
  return colour;
}
var OUTLINE_MIX = 0.5;
var VIRUS_INSIDE_MIX = 0.55;
var OUTLINES = /* @__PURE__ */ new Map();
function outlineColour(tint) {
  const known = OUTLINES.get(tint);
  if (known !== void 0) return known;
  const colour = cellColour(mixColours(tint, DESIGN_COLOURS.background, OUTLINE_MIX));
  OUTLINES.set(tint, colour);
  return colour;
}
var PANE_COLOURS = {
  /** The map, and the pane around it. */
  map: cellColour(DESIGN_COLOURS.background),
  /** The grid's dots: the web's grid is `surface` lines; dots need a step brighter to be seen. */
  grid: cellColour(DESIGN_COLOURS.border),
  /** The map's edge: a step brighter than the grid, as on the web. */
  edge: cellColour(DESIGN_COLOURS.muted),
  /** Panels, the toast and the status row. */
  surface: cellColour(DESIGN_COLOURS.surface),
  border: cellColour(DESIGN_COLOURS.border),
  /** The player's own cells, and the viruses' rim. */
  mint: cellColour(DESIGN_COLOURS.primary),
  /** Inside a virus. */
  virusInside: cellColour(
    mixColours(DESIGN_COLOURS.primary, DESIGN_COLOURS.background, VIRUS_INSIDE_MIX)
  ),
  /** The room link. */
  cyan: cellColour(DESIGN_COLOURS.secondary),
  /** The killer's name. */
  pink: cellColour(DESIGN_COLOURS.accent),
  /** Reconnecting, servers full. */
  amber: cellColour(DESIGN_COLOURS.warning),
  /** Connection lost. */
  red: cellColour(DESIGN_COLOURS.danger),
  text: cellColour(DESIGN_COLOURS.text),
  muted: cellColour(DESIGN_COLOURS.muted)
};
function mixCellColours(from, to, amount) {
  let mixed = 0;
  for (let shift = 16; shift >= 0; shift -= 8) {
    const a = from >> shift & 255;
    const b = to >> shift & 255;
    mixed |= Math.round(a + (b - a) * amount) << shift;
  }
  return mixed;
}
var UNKNOWN_PLAYER_TINT = DESIGN_COLOURS.muted;
function playerTint(colour) {
  return PLAYER_COLOURS[colour] ?? UNKNOWN_PLAYER_TINT;
}
function luminance(colour) {
  return 0.2126 * linear2(colour, 16) + 0.7152 * linear2(colour, 8) + 0.0722 * linear2(colour, 0);
}
function linear2(colour, shift) {
  const value = (colour >> shift & 255) / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}
function contrast(first, second) {
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}
function inkOn(fill) {
  const fillLuminance = luminance(fill);
  const onText = contrast(fillLuminance, luminance(PANE_COLOURS.text));
  const onDark = contrast(fillLuminance, luminance(PANE_COLOURS.map));
  return onText >= onDark ? PANE_COLOURS.text : PANE_COLOURS.map;
}

// bridge/cell-rows.ts
var BOX_DRAWING_FIRST = 9472;
var BOX_DRAWING_LAST = 9599;
function cellRows(cells, size) {
  const runs = [];
  for (let row = 0; row < size.rows; row += 1) runs.push(rowRuns(cells, size.columns, row));
  const palette = new Palette();
  const whole = buildRows({ size, palette, runs }, Number.POSITIVE_INFINITY);
  if (fits(mapTreeCost(whole))) return whole;
  const frame = { size, palette, runs: runs.map(withoutDots) };
  const undotted = buildRows(frame, Number.POSITIVE_INFINITY);
  if (fits(mapTreeCost(undotted))) return undotted;
  return buildRows(frame, largestFittingCap(frame));
}
function withoutDots(row) {
  const kept = [];
  for (const run of row) {
    const last = kept.at(-1);
    const fill = isDot(run) ? { kind: "fill", width: 1, colour: underDot(run, last) } : run;
    if (fill.kind === "fill" && last?.kind === "fill" && last.colour === fill.colour) {
      last.width += fill.width;
    } else {
      kept.push(fill.kind === "fill" ? { ...fill } : fill);
    }
  }
  return kept;
}
function underDot(dot2, left) {
  const surface = surfaceOf(left);
  if (dot2.kind !== "split") return surface;
  return dot2.top === surface || dot2.bottom === surface ? surface : dot2.bottom;
}
function surfaceOf(run) {
  switch (run?.kind) {
    case "fill":
      return run.colour;
    case "split":
      return run.bottom;
    case "text":
      return run.background;
    case void 0:
      return PANE_COLOURS.map;
  }
}
function isDot(run) {
  if (run.kind === "text" || run.width > 1) return false;
  return run.kind === "split" || run.colour !== PANE_COLOURS.map;
}
function fits(cost) {
  return cost.nodes <= MAP_TREE_BUDGET.nodes && cost.chars <= MAP_TREE_BUDGET.chars;
}
function largestFittingCap(frame) {
  let fitting = 0;
  let over = Math.max(...frame.runs.map((row) => row.length));
  while (over - fitting > 1) {
    const cap = Math.floor((fitting + over) / 2);
    if (fits(mapTreeCost(buildRows(frame, cap)))) fitting = cap;
    else over = cap;
  }
  return fitting;
}
function buildRows(frame, cap) {
  const { size, palette } = frame;
  const lines = [];
  for (const row of frame.runs) {
    const segments = segmentsOf(row, palette, cap);
    const last = lines.at(-1);
    if (segments.length > 0) lines.push(segments);
    else if (typeof last === "number") lines[lines.length - 1] = last + 1;
    else lines.push(1);
  }
  return { columns: size.columns, rows: size.rows, palette: palette.colours(), lines };
}
function segmentsOf(row, palette, cap) {
  const segments = [];
  let margin = 0;
  for (const run of row) {
    if (segments.length >= cap) break;
    if (run.kind === "fill" && run.colour === PANE_COLOURS.map) {
      margin += run.width;
      continue;
    }
    segments.push(segmentOf(run, margin, palette));
    margin = 0;
  }
  return segments;
}
function segmentOf(run, margin, palette) {
  switch (run.kind) {
    case "fill":
      return [margin, run.width, palette.indexOf(run.colour)];
    case "split":
      return [margin, run.width, palette.indexOf(run.top), palette.indexOf(run.bottom)];
    case "text":
      return [
        margin,
        run.width,
        palette.indexOf(run.background),
        palette.indexOf(run.ink),
        run.text.trimEnd()
      ];
  }
}
function rowRuns(cells, columns, row) {
  const runs = [];
  const start2 = row * columns * WORDS_PER_CELL;
  const cell = { glyph: SPACE, foreground: 0 };
  let word = 0;
  for (const value of cells.subarray(start2, start2 + columns * WORDS_PER_CELL)) {
    if (word === 0) cell.glyph = value;
    else if (word === 1) cell.foreground = value;
    else addCell(runs, cell.glyph, { foreground: cell.foreground, background: value });
    word = (word + 1) % WORDS_PER_CELL;
  }
  return runs;
}
function addCell(runs, glyph, colours) {
  const { foreground, background } = colours;
  const last = runs.at(-1);
  if (glyph === UPPER_HALF_BLOCK && foreground !== background) {
    if (last?.kind === "split" && last.top === foreground && last.bottom === background) {
      last.width += 1;
    } else runs.push({ kind: "split", width: 1, top: foreground, bottom: background });
  } else if (glyph === SPACE || glyph === UPPER_HALF_BLOCK || isBoxDrawing(glyph)) {
    if (last?.kind === "text" && last.background === background) {
      last.width += 1;
      last.text += " ";
    } else if (last?.kind === "fill" && last.colour === background) last.width += 1;
    else runs.push({ kind: "fill", width: 1, colour: background });
  } else {
    const text = String.fromCharCode(glyph);
    if (last?.kind === "text" && last.background === background && last.ink === foreground) {
      last.width += 1;
      last.text += text;
    } else runs.push({ kind: "text", width: 1, background, ink: foreground, text });
  }
}
function isBoxDrawing(glyph) {
  return glyph >= BOX_DRAWING_FIRST && glyph <= BOX_DRAWING_LAST;
}
var Palette = class {
  indexes = /* @__PURE__ */ new Map([[PANE_COLOURS.map, 0]]);
  indexOf(colour) {
    const known = this.indexes.get(colour);
    if (known !== void 0) return known;
    const index = this.indexes.size;
    this.indexes.set(colour, index);
    return index;
  }
  colours() {
    return [...this.indexes.keys()].map(cssColour);
  }
};
function cssColour(colour) {
  const hex = colour.toString(16).padStart(6, "0");
  const isShort = hex.charAt(0) === hex.charAt(1) && hex.charAt(2) === hex.charAt(3) && hex.charAt(4) === hex.charAt(5);
  return isShort ? `#${hex.charAt(0)}${hex.charAt(2)}${hex.charAt(4)}` : `#${hex}`;
}

// bridge/slot-layer.ts
var SLOT_TEXT = PANE_SLOT_TEXT;
var MIN_CUT_NAME_CHARS = 4;
var CUT_MARK = 46;
var DASH_PX = 2;
var DASH_GAP_PX = 1;
var TEXT_MARGIN = 1;
var SlotLayer = class {
  set = null;
  looks = [];
  line = {
    row: 0,
    canvasWidth: 0,
    pellets: /* @__PURE__ */ new Map(),
    mapRows: 0,
    first: 0,
    last: 0,
    ink: 0,
    floor: 0,
    pen: { foreground: 0, background: 0 }
  };
  /** Paints the floors and borders of `slots` that `camera` sees onto `canvas`. */
  paint(canvas, camera, slots) {
    if (slots !== this.set) {
      this.set = slots;
      this.looks = slots === null ? [] : slots.slots.map((slot) => lookOf(slot));
    }
    for (const look of this.looks) {
      look.isShown = placeBox(look.box, camera, look.slot, canvas);
      if (look.isShown) paintSlot(canvas, look);
    }
  }
  /**
   * Writes the words of the slots last painted into `grid`, whose first `mapRows` rows hold the
   * composed map; `pellets` are the pellets painted on it (pixel index → colour).
   */
  write(grid, mapRows2, pellets) {
    const line = this.line;
    line.mapRows = mapRows2;
    line.canvasWidth = grid.size.columns;
    line.pellets = pellets;
    for (const look of this.looks) {
      if (look.isShown) this.writeLook(grid, look);
    }
  }
  /**
   * The title (`titleFor`), and the note under it when there is a row for it, centred inside the
   * border on the terminal rows the slot fills whole — or nothing when no title fits. Placed on
   * the whole slot, so its words move off the pane with it.
   */
  writeLook(grid, look) {
    const { box } = look;
    const firstRow = Math.ceil((box.fromY + 1) / 2);
    const lastRow = Math.floor((box.toY - 2) / 2);
    const rows = lastRow - firstRow + 1;
    const line = this.line;
    line.first = box.fromX + 1 + TEXT_MARGIN;
    line.last = box.toX - 1 - TEXT_MARGIN;
    const room = line.last - line.first + 1;
    const title2 = rows < 1 ? void 0 : titleFor(look, room);
    if (title2 === void 0) return;
    const hasNote = rows >= 2 && look.note.length <= room;
    line.row = firstRow + Math.floor((rows - (hasNote ? 2 : 1)) / 2);
    line.floor = look.floor;
    line.ink = look.titleInk;
    writeLine(grid, line, title2, title2.length <= room ? title2.length : cutLength(title2, room));
    if (!hasNote) return;
    line.row += 1;
    line.ink = look.noteInk;
    writeLine(grid, line, look.note, look.note.length);
  }
};
function lookOf(slot) {
  const { sponsor } = slot;
  const background = DESIGN_COLOURS.background;
  const colour = slotColour(sponsor?.colour ?? null, background);
  const shade = sponsor === null ? SLOT_SHADES.empty : SLOT_SHADES.sponsored;
  const floor = mixColours(background, colour, shade.fill);
  return {
    slot,
    isEmpty: sponsor === null,
    floor: cellColour(floor),
    border: cellColour(mixColours(background, colour, shade.border)),
    titles: (sponsor === null ? [SLOT_TEXT.empty, ...SLOT_TEXT.emptyShort] : [sponsor.name]).map(
      (text) => glyphsOf(text)
    ),
    titleInk: cellColour(slotInk(colour, floor)),
    note: glyphsOf(sponsor === null ? SLOT_TEXT.emptyHint : SLOT_TEXT.sponsored),
    noteInk: cellColour(slotInk(DESIGN_COLOURS.muted, floor)),
    box: { fromX: 0, toX: 0, fromY: 0, toY: 0 },
    isShown: false
  };
}
function placeBox(box, camera, slot, canvas) {
  const { minX, minY, scale } = camera;
  box.fromX = Math.ceil((slot.x - minX) * scale - 0.5);
  box.toX = Math.ceil((slot.x + slot.w - minX) * scale - 0.5) - 1;
  box.fromY = Math.ceil((slot.y - minY) * scale - 0.5);
  box.toY = Math.ceil((slot.y + slot.h - minY) * scale - 0.5) - 1;
  const isOnX = box.fromX <= box.toX && box.toX >= 0 && box.fromX < canvas.width;
  return isOnX && box.fromY <= box.toY && box.toY >= 0 && box.fromY < canvas.height;
}
function paintSlot(canvas, look) {
  const { box } = look;
  const fromRow = Math.max(box.fromY, 0);
  const toRow = Math.min(box.toY, canvas.height - 1);
  const fromColumn = Math.max(box.fromX + 1, 0);
  const toColumn = Math.min(box.toX - 1, canvas.width - 1);
  for (let row = fromRow; row <= toRow; row += 1) {
    if (row === box.fromY || row === box.toY) {
      for (let column = fromColumn; column <= toColumn; column += 1) {
        canvas.setPixel(column, row, edgeColour(look, column - box.fromX));
      }
      continue;
    }
    canvas.fillSpan(row, { fromX: box.fromX + 1, toX: box.toX - 1 }, look.floor);
    const edge = edgeColour(look, row - box.fromY);
    canvas.setPixel(box.fromX, row, edge);
    canvas.setPixel(box.toX, row, edge);
  }
}
function edgeColour(look, offset) {
  if (!look.isEmpty) return look.border;
  return offset % (DASH_PX + DASH_GAP_PX) < DASH_PX ? look.border : look.floor;
}
function titleFor(look, room) {
  const whole = look.titles.find((title2) => title2.length <= room);
  if (whole !== void 0) return whole;
  return look.isEmpty || room < MIN_CUT_NAME_CHARS ? void 0 : look.titles[0];
}
function cutLength(title2, room) {
  let length = room;
  while (title2[length - 2] === SPACE) length -= 1;
  return length;
}
function writeLine(grid, line, glyphs, length) {
  if (line.row >= line.mapRows) return;
  const start2 = line.first + Math.floor((line.last - line.first + 1 - length) / 2);
  let at = 0;
  for (const glyph of glyphs) {
    if (at === length) return;
    const isCut = at === length - 1 && length < glyphs.length;
    writeGlyph(grid, line, isCut ? CUT_MARK : glyph, start2 + at);
    at += 1;
  }
}
function writeGlyph(grid, line, glyph, column) {
  const index = grid.indexOf(column, line.row);
  if (index < 0) return;
  if (grid.isFilled(index, line.floor)) {
    grid.ink(index, glyph, line.ink);
    return;
  }
  const pellet = pelletUnder(grid, line, index, column);
  if (pellet < 0) return;
  line.pen.foreground = pellet;
  line.pen.background = line.floor;
  grid.paint(index, glyph, line.pen);
}
function pelletUnder(grid, line, index, column) {
  const top = line.row * 2 * line.canvasWidth + column;
  const topShown = grid.cells[index + 1];
  const bottomShown = grid.cells[index + 2];
  const topPellet = pelletAt(line, top, topShown);
  const bottomPellet = pelletAt(line, top + line.canvasWidth, bottomShown);
  const isTopClear = topPellet >= 0 || topShown === line.floor;
  const isBottomClear = bottomPellet >= 0 || bottomShown === line.floor;
  if (!isTopClear || !isBottomClear) return -1;
  return topPellet >= 0 ? topPellet : bottomPellet;
}
function pelletAt(line, pixel, shown) {
  const colour = line.pellets.get(pixel);
  return colour !== void 0 && colour === shown ? colour : -1;
}

// bridge/map-painter.ts
var GRID_DOT_SPACING = GRID_SPACING * 4;
var OUTLINE_MIN_RADIUS_PX = 4;
var VIRUS_SPIKE_DEPTH = 0.1;
var VIRUS_MIN_SPIKE_DEPTH_PX = 1;
var VIRUS_SPIKE_SPACING_PX = 4;
var VIRUS_MIN_SPIKES = 6;
var VIRUS_MAX_SPIKES = 22;
function cellTint(cell, players) {
  if (cell.isOwn) return DESIGN_COLOURS.primary;
  const player = players[cell.slot];
  return player === void 0 ? UNKNOWN_PLAYER_TINT : playerTint(player.colour);
}
var MapPainter = class {
  /** The cells of the last frame painted, smallest first (labels go on them in this order). */
  cells = [];
  /** The sponsor slots, whose words go over the floors it painted once the map is in the grid. */
  slotLayer = new SlotLayer();
  /**
   * The pellets of the last frame painted, by canvas pixel index, and their colours: a slot's
   * letter under one takes its colour instead of hiding (`SlotLayer.write`).
   */
  pelletPixels = /* @__PURE__ */ new Map();
  viruses = [];
  disc = { x: 0, y: 0, radius: 0 };
  star = { x: 0, y: 0, radius: 0, spikes: 0, depthPx: 0 };
  /** Paints `scene` onto `canvas`. */
  paint(canvas, scene) {
    canvas.fill(PANE_COLOURS.map);
    paintGrid(canvas, scene.camera, scene.mapSize);
    paintEdge(canvas, scene.camera, scene.mapSize);
    this.slotLayer.paint(canvas, scene.camera, scene.slots);
    this.cells.length = 0;
    this.pelletPixels.clear();
    if (!scene.frame.hasSnapshot) return;
    this.paintPellets(canvas, scene);
    this.paintBlobs(canvas, scene);
    this.paintBodies(canvas, scene);
  }
  paintPellets(canvas, scene) {
    const { camera } = scene;
    for (const pellet of scene.pellets.values()) {
      if (!camera.sees(pellet.x, pellet.y, 0)) continue;
      const x = Math.floor((pellet.x - camera.minX) * camera.scale);
      const y = Math.floor((pellet.y - camera.minY) * camera.scale);
      const colour = cellColour(pelletTint(pellet.id));
      canvas.setPixel(x, y, colour);
      if (x < canvas.width && y < canvas.height) {
        this.pelletPixels.set(y * canvas.width + x, colour);
      }
    }
  }
  paintBlobs(canvas, scene) {
    const { camera } = scene;
    for (const blob of scene.frame.blobs) {
      if (!camera.sees(blob.x, blob.y, BLOB_RADIUS)) continue;
      const disc = this.placeDisc(camera, blob, BLOB_RADIUS);
      canvas.fillDisc(disc, cellColour(blobTint(blob.id)));
    }
  }
  /** Cells and viruses, merged smallest first (radius, then id, so the order is stable). */
  paintBodies(canvas, scene) {
    const cells = sortedBySize(scene.frame.cells, this.cells);
    const viruses = sortedBySize(scene.frame.viruses, this.viruses);
    let index = 0;
    let virus = viruses[index];
    for (const cell of cells) {
      while (virus !== void 0 && virus.radius < cell.radius) {
        this.paintVirus(canvas, scene.camera, virus);
        index += 1;
        virus = viruses[index];
      }
      this.paintCell(canvas, scene, cell);
    }
    while (virus !== void 0) {
      this.paintVirus(canvas, scene.camera, virus);
      index += 1;
      virus = viruses[index];
    }
  }
  paintCell(canvas, scene, cell) {
    const { camera } = scene;
    if (!camera.sees(cell.x, cell.y, cell.radius)) return;
    const tint = cellTint(cell, scene.players);
    const disc = this.placeDisc(camera, cell, cell.radius);
    if (disc.radius >= OUTLINE_MIN_RADIUS_PX) {
      canvas.fillDisc(disc, outlineColour(tint));
      disc.radius -= 1;
    }
    canvas.fillDisc(disc, cellColour(tint));
  }
  /** A mint spiky rim around a darker mint inside (`PANE_COLOURS.virusInside`). */
  paintVirus(canvas, camera, virus) {
    const reach = virus.radius + Math.max(virus.radius * VIRUS_SPIKE_DEPTH, VIRUS_MIN_SPIKE_DEPTH_PX / camera.scale);
    if (!camera.sees(virus.x, virus.y, reach)) return;
    const star = this.star;
    const radius = virus.radius * camera.scale;
    star.x = (virus.x - camera.minX) * camera.scale;
    star.y = (virus.y - camera.minY) * camera.scale;
    star.radius = radius;
    star.depthPx = Math.max(radius * VIRUS_SPIKE_DEPTH, VIRUS_MIN_SPIKE_DEPTH_PX);
    const spikes = Math.round(2 * Math.PI * radius / VIRUS_SPIKE_SPACING_PX);
    star.spikes = Math.min(Math.max(spikes, VIRUS_MIN_SPIKES), VIRUS_MAX_SPIKES);
    canvas.fillStar(star, PANE_COLOURS.mint);
    const disc = this.disc;
    disc.x = star.x;
    disc.y = star.y;
    disc.radius = radius - star.depthPx - 1;
    if (disc.radius > 0) canvas.fillDisc(disc, PANE_COLOURS.virusInside);
  }
  /** The reused disc, placed over a body at `at` of `radius` world units. */
  placeDisc(camera, at, radius) {
    const disc = this.disc;
    disc.x = (at.x - camera.minX) * camera.scale;
    disc.y = (at.y - camera.minY) * camera.scale;
    disc.radius = radius * camera.scale;
    return disc;
  }
};
function paintGrid(canvas, camera, mapSize) {
  const left = Math.max(camera.minX, 0);
  const right = Math.min(camera.maxX, mapSize);
  const top = Math.max(camera.minY, 0);
  const bottom = Math.min(camera.maxY, mapSize);
  const firstX = Math.ceil(left / GRID_DOT_SPACING) * GRID_DOT_SPACING;
  const firstY = Math.ceil(top / GRID_DOT_SPACING) * GRID_DOT_SPACING;
  for (let y = firstY; y <= bottom; y += GRID_DOT_SPACING) {
    const row = Math.floor((y - camera.minY) * camera.scale);
    for (let x = firstX; x <= right; x += GRID_DOT_SPACING) {
      canvas.setPixel(Math.floor((x - camera.minX) * camera.scale), row, PANE_COLOURS.grid);
    }
  }
}
function paintEdge(canvas, camera, mapSize) {
  const toX = (x) => Math.floor((x - camera.minX) * camera.scale);
  const toY = (y) => Math.floor((y - camera.minY) * camera.scale);
  const span = { fromX: toX(0), toX: toX(mapSize) };
  canvas.fillSpan(toY(0), span, PANE_COLOURS.edge);
  canvas.fillSpan(toY(mapSize), span, PANE_COLOURS.edge);
  const fromY = Math.max(toY(0), 0);
  const toRow = Math.min(toY(mapSize), canvas.height - 1);
  for (let row = fromY; row <= toRow; row += 1) {
    canvas.setPixel(span.fromX, row, PANE_COLOURS.edge);
    canvas.setPixel(span.toX, row, PANE_COLOURS.edge);
  }
}
function sortedBySize(entries, out) {
  out.length = 0;
  for (const entry of entries) out.push(entry);
  return out.sort(bySize);
}
function bySize(a, b) {
  return a.radius - b.radius || a.id - b.id;
}

// bridge/cell-labels.ts
var LABEL_MIN_CHARS = 3;
var LABEL_MARGIN = 1;
var CellLabels = class {
  slots = new Array(MAX_PLAYERS_PER_ROOM).fill(void 0);
  /** Writes the labels of `cells` (smallest first, as painted) into `grid`. */
  write(grid, scene, cells) {
    for (const cell of cells) {
      const player = scene.players[cell.slot];
      if (player === void 0 || player.nickname === "") continue;
      this.writeLabel(grid, scene, cell, this.glyphsOf(player));
    }
  }
  writeLabel(grid, scene, cell, glyphs) {
    const { camera } = scene;
    const column = Math.floor((cell.x - camera.minX) * camera.scale);
    const row = Math.floor((cell.y - camera.minY) * camera.scale / PIXELS_PER_ROW);
    if (row < 0 || row >= scene.mapRows) return;
    const fill = cellColour(cellTint(cell, scene.players));
    if (!grid.isFilled(grid.indexOf(column, row), fill)) return;
    let first = column;
    while (grid.isFilled(grid.indexOf(first - 1, row), fill)) first -= 1;
    let last = column;
    while (grid.isFilled(grid.indexOf(last + 1, row), fill)) last += 1;
    const room = last - first + 1 - 2 * LABEL_MARGIN;
    const length = Math.min(glyphs.length, room);
    if (length < Math.min(glyphs.length, LABEL_MIN_CHARS)) return;
    const start2 = first + Math.floor((last - first + 1 - length) / 2);
    const ink = inkOn(fill);
    let at = start2;
    for (const glyph of glyphs) {
      if (at === start2 + length) return;
      grid.ink(grid.indexOf(at, row), glyph, ink);
      at += 1;
    }
  }
  glyphsOf(player) {
    const known = this.slots[player.slot];
    if (known?.nickname === player.nickname) return known.glyphs;
    const entry = { nickname: player.nickname, glyphs: glyphsOf(player.nickname) };
    this.slots[player.slot] = entry;
    return entry.glyphs;
  }
};

// bridge/half-block-canvas.ts
var HalfBlockCanvas = class {
  /** Size in pixels. */
  width = 0;
  height = 0;
  /** Pixel colours (`0x00RRGGBB`), row-major. */
  pixels = new Uint32Array(0);
  /** The row span `fillDisc` is filling, reused. */
  span = { fromX: 0, toX: 0 };
  /** Sizes the canvas to `width × height` pixels (its content is undefined until filled). */
  resize(width, height) {
    if (width === this.width && height === this.height) return;
    this.width = width;
    this.height = height;
    this.pixels = new Uint32Array(width * height);
  }
  /** Paints every pixel `colour`. */
  fill(colour) {
    this.pixels.fill(colour);
  }
  /** Paints pixel (`x`, `y`) (whole pixels); one outside the canvas is ignored. */
  setPixel(x, y, colour) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    this.pixels[y * this.width + x] = colour;
  }
  /** Paints pixels `fromX` to `toX` (inclusive) of row `y`, clipped to the canvas. */
  fillSpan(y, span, colour) {
    if (y < 0 || y >= this.height) return;
    const from = Math.max(span.fromX, 0);
    const to = Math.min(span.toX, this.width - 1);
    if (from > to) return;
    this.pixels.fill(colour, y * this.width + from, y * this.width + to + 1);
  }
  /**
   * Fills `disc`: every pixel whose centre it covers, and always the pixel under its centre, so a
   * body smaller than a pixel still shows.
   */
  fillDisc(disc, colour) {
    const { x, y, radius } = disc;
    const span = this.span;
    const firstRow = Math.max(Math.ceil(y - radius - 0.5), 0);
    const lastRow = Math.min(Math.floor(y + radius - 0.5), this.height - 1);
    for (let row = firstRow; row <= lastRow; row += 1) {
      const dy = row + 0.5 - y;
      const half = Math.sqrt(Math.max(radius * radius - dy * dy, 0));
      span.fromX = Math.ceil(x - half - 0.5);
      span.toX = Math.floor(x + half - 0.5);
      this.fillSpan(row, span, colour);
    }
    this.setPixel(Math.floor(x), Math.floor(y), colour);
  }
  /**
   * Fills `star`: the pixels whose centre lies within its edge, which swings `depthPx` past and
   * short of its radius `spikes` times around, as the web's virus swings between tips and valleys.
   */
  fillStar(star, colour) {
    const { x, y, radius, spikes, depthPx } = star;
    const reach = radius + depthPx;
    const fromY = Math.max(Math.ceil(y - reach - 0.5), 0);
    const toY = Math.min(Math.floor(y + reach - 0.5), this.height - 1);
    const fromX = Math.max(Math.ceil(x - reach - 0.5), 0);
    const toX = Math.min(Math.floor(x + reach - 0.5), this.width - 1);
    for (let row = fromY; row <= toY; row += 1) {
      for (let column = fromX; column <= toX; column += 1) {
        const dx = column + 0.5 - x;
        const dy = row + 0.5 - y;
        const edge = radius + depthPx * Math.cos(spikes * Math.atan2(dy, dx));
        if (dx * dx + dy * dy <= edge * edge) this.pixels[row * this.width + column] = colour;
      }
    }
  }
  /**
   * Writes the canvas into the first `height / 2` rows of `grid`, which is as wide as the canvas:
   * `▀` with the top pixel as foreground and the bottom one as background, or a space where both
   * are one colour (its foreground is that colour too, so equal cells stay equal words).
   */
  composeInto(grid) {
    const { cells } = grid;
    const { width } = this;
    let x = 0;
    let y = 0;
    for (const colour of this.pixels) {
      cells[((y >> 1) * width + x) * WORDS_PER_CELL + 1 + (y & 1)] = colour;
      x += 1;
      if (x === width) {
        x = 0;
        y += 1;
      }
    }
    const end2 = (this.height >> 1) * width * WORDS_PER_CELL;
    for (let index = 0; index < end2; index += WORDS_PER_CELL) {
      cells[index] = cells[index + 1] === cells[index + 2] ? SPACE : UPPER_HALF_BLOCK;
    }
  }
};

// bridge/pane-map.ts
var PaneMap = class {
  canvas = new HalfBlockCanvas();
  painter = new MapPainter();
  labels = new CellLabels();
  /** Draws the map of `scene` into `grid`, already sized to the pane's `size`. */
  draw(grid, scene, size) {
    const { canvas, painter } = this;
    const { state, camera } = scene;
    const rows = mapRows(size);
    canvas.resize(size.columns, rows * PIXELS_PER_ROW);
    painter.paint(canvas, {
      camera,
      frame: scene.frame,
      mapSize: state.mapSize,
      pellets: state.pellets,
      players: state.players,
      slots: state.slots
    });
    canvas.composeInto(grid);
    painter.slotLayer.write(grid, rows, painter.pelletPixels);
    this.labels.write(grid, { camera, players: state.players, mapRows: rows }, painter.cells);
  }
};

// bridge/death-credit.ts
var CREDIT_TEXT = {
  credit: "Map spot by ",
  invite: "Your brand here: "
};
function creditLines(state, death, origin) {
  if (state.slots === null) return [];
  const sponsor = creditedSponsor(state.slots.slots, death.position);
  if (sponsor === null) {
    return [
      [],
      [
        { text: CREDIT_TEXT.invite, colour: PANE_COLOURS.muted },
        { text: sponsorPageLink(origin), colour: PANE_COLOURS.cyan }
      ]
    ];
  }
  const ink = cellColour(slotColour(sponsor.colour, DESIGN_COLOURS.surface));
  return [
    [],
    [
      { text: CREDIT_TEXT.credit, colour: PANE_COLOURS.muted },
      { text: sponsor.name, colour: ink }
    ]
  ];
}

// bridge/status-row.ts
var NUMBER_FORMAT = new Intl.NumberFormat("en-US");
var ROW_PADDING = 1;
var ITEM_GAP = 2;
var KEYS = { split: "e", eject: "q", respawn: "r" };
var HINT_COLOURS = {
  key: PANE_COLOURS.text,
  chip: PANE_COLOURS.border,
  action: PANE_COLOURS.muted
};
function keyHint(key, action, colours = HINT_COLOURS) {
  return [
    { text: ` ${key} `, colour: colours.key, background: colours.chip },
    { text: ` ${action}`, colour: colours.action }
  ];
}
function statusItems(status) {
  const room = roomItem(status);
  const link = status.link === null ? null : { runs: [{ text: status.link, colour: PANE_COLOURS.cyan }], side: "right" };
  if (room === null)
    return [{ runs: [{ text: "tokeneater", colour: PANE_COLOURS.mint }], side: "left" }];
  if (status.phase !== "playing") return withLink([room], link);
  if (status.isDead) {
    return withLink([room, { runs: keyHint(KEYS.respawn, "play again"), side: "right" }], link);
  }
  const items = [
    { runs: labelled("Mass", NUMBER_FORMAT.format(status.mass)), side: "left" },
    room
  ];
  if (status.rank !== null) {
    items.push({
      runs: [{ text: `#${String(status.rank)}`, colour: PANE_COLOURS.mint }],
      side: "left"
    });
  }
  items.push(
    { runs: keyHint(KEYS.split, "split"), side: "right" },
    { runs: keyHint(KEYS.eject, "eject"), side: "right" }
  );
  return withLink(items, link);
}
function drawStatusRow(grid, row, status) {
  const { columns } = grid.size;
  grid.clearRow(row, { column: 0, width: columns }, PANE_COLOURS.surface);
  const items = statusItems(status);
  const room = columns - 2 * ROW_PADDING;
  let kept = 0;
  let width = 0;
  for (const item of items) {
    const next = width + (kept === 0 ? 0 : ITEM_GAP) + runsWidth(item.runs);
    if (kept > 0 && next > room) break;
    width = next;
    kept += 1;
  }
  const shown = items.slice(0, kept);
  let left = ROW_PADDING;
  for (const item of shown.filter((entry) => entry.side === "left")) {
    left = grid.writeRuns({ column: left, row, end: columns - ROW_PADDING }, item.runs) + ITEM_GAP;
  }
  const right = shown.filter((entry) => entry.side === "right");
  let column = columns - ROW_PADDING - (runsWidth(right.flatMap((entry) => entry.runs)) + ITEM_GAP * (right.length - 1));
  for (const item of right) {
    column = grid.writeRuns({ column, row }, item.runs) + ITEM_GAP;
  }
}
function roomItem(status) {
  if (status.room === null) return null;
  return {
    runs: [
      ...labelled("Room", status.room),
      {
        text: ` ${String(status.players)}/${String(MAX_PLAYERS_PER_ROOM)}`,
        colour: PANE_COLOURS.muted
      }
    ],
    side: "left"
  };
}
function labelled(label, value) {
  return [
    { text: `${label} `, colour: PANE_COLOURS.muted },
    { text: value, colour: PANE_COLOURS.text }
  ];
}
function withLink(items, link) {
  if (link !== null) items.push(link);
  return items;
}

// bridge/panels.ts
var CARD_PADDING = 2;
var TOAST_PADDING = 1;
var BOX = {
  topLeft: 9581,
  topRight: 9582,
  bottomLeft: 9584,
  bottomRight: 9583,
  horizontal: 9472,
  vertical: 9474
};
var ACTION_COLOURS = {
  key: PANE_COLOURS.map,
  chip: PANE_COLOURS.mint,
  action: PANE_COLOURS.mint
};
var BLANK = [];
var UNAVAILABLE_TEXT = {
  capacity: { title: "Servers are full", body: "Every room is packed right now." },
  unavailable: { title: "Servers are full", body: "Every room is packed right now." },
  rate_limited: { title: "Too many attempts", body: "You tried to join too many times." }
};
function paneOverlay(scene) {
  const { phase, death } = scene.state;
  switch (phase.kind) {
    case "idle":
      return null;
    case "joining":
    case "connecting":
      return card(title("tokeneater", PANE_COLOURS.mint), note(joiningText(phase.room)));
    case "playing":
      return death === null ? null : { kind: "card", lines: deathLines(scene, death) };
    case "reconnecting":
      return { kind: "toast", line: [{ text: "Reconnecting...", colour: PANE_COLOURS.amber }] };
    case "unavailable":
      return unavailableCard(phase.reason);
    case "lost":
      return card(
        title("Connection lost", PANE_COLOURS.red),
        note(
          phase.room === null ? "We lost the connection to the game." : `We lost the connection to Room ${phase.room}.`
        ),
        BLANK,
        keyHint(KEYS.respawn, "Reconnect", ACTION_COLOURS)
      );
    case "rejected":
      return phase.reason === "nickname" ? card(
        title("This nickname isn't allowed", PANE_COLOURS.red),
        note("Pick another one in /config:"),
        note("tokeneater, Nickname.")
      ) : card(
        title("You can't join right now", PANE_COLOURS.red),
        note("Please try again later.")
      );
    case "outdated":
      return card(
        title("A new version is available", PANE_COLOURS.text),
        note("Update the tokeneater plugin to keep playing.")
      );
  }
}
function drawOverlay(grid, rows, overlay) {
  if (overlay === null || rows === 0) return;
  if (overlay.kind === "toast") {
    drawToast(grid, overlay.line);
    return;
  }
  drawCard(grid, rows, overlay.lines);
}
function deathLines(scene, death) {
  const { stats } = death;
  const bestRank = scene.state.bestRank;
  const lines = [title("You were eaten", PANE_COLOURS.text)];
  if (death.killerName !== null) {
    lines.push([
      { text: "by ", colour: PANE_COLOURS.muted },
      { text: death.killerName, colour: PANE_COLOURS.pink }
    ]);
  }
  lines.push(
    BLANK,
    [
      ...stat("Top mass", NUMBER_FORMAT.format(stats.highestMass)),
      { text: "   ", colour: PANE_COLOURS.muted },
      ...stat("Time alive", timeAlive(stats.ticksAlive))
    ],
    [
      ...stat("Cells eaten", NUMBER_FORMAT.format(stats.cellsEaten)),
      { text: "   ", colour: PANE_COLOURS.muted },
      ...stat("Best rank", bestRank === null ? "-" : `#${String(bestRank)}`)
    ],
    BLANK,
    scene.isRespawning ? note("Joining...") : keyHint(KEYS.respawn, "Play again", ACTION_COLOURS),
    ...creditLines(scene.state, death, scene.origin)
  );
  return lines;
}
function timeAlive(ticks) {
  const total = Math.floor(ticks / TICK_RATE_HZ);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor(total % 3600 / 60);
  const seconds = total % 60;
  if (hours > 0) return `${String(hours)}h ${String(minutes)}m`;
  if (minutes > 0) return `${String(minutes)}m ${String(seconds)}s`;
  return `${String(seconds)}s`;
}
function unavailableCard(reason) {
  const text = UNAVAILABLE_TEXT[reason];
  return card(
    title(text.title, PANE_COLOURS.amber),
    note(text.body),
    note("We'll retry in a moment."),
    BLANK,
    keyHint(KEYS.respawn, "Try now", ACTION_COLOURS)
  );
}
function joiningText(room) {
  return room === null ? "Finding a room..." : `Joining room ${room}...`;
}
function card(...lines) {
  return { kind: "card", lines };
}
function title(text, colour) {
  return [{ text, colour }];
}
function note(text) {
  return [{ text, colour: PANE_COLOURS.muted }];
}
function stat(label, value) {
  return [
    { text: `${label} `, colour: PANE_COLOURS.muted },
    { text: value, colour: PANE_COLOURS.text }
  ];
}
function drawToast(grid, line) {
  const width = runsWidth(line) + 2 * TOAST_PADDING;
  const column = Math.max(Math.floor((grid.size.columns - width) / 2), 0);
  grid.clearRow(0, { column, width }, PANE_COLOURS.surface);
  const end2 = column + width - TOAST_PADDING;
  grid.writeRuns({ column: column + TOAST_PADDING, row: 0, end: end2 }, line);
}
function drawCard(grid, rows, lines) {
  const { columns } = grid.size;
  const widest = Math.max(...lines.map((line) => runsWidth(line)));
  const width = Math.min(widest + 2 * (CARD_PADDING + 1), columns);
  const left = Math.floor((columns - width) / 2);
  const frame = rows >= lines.length + 4 ? 2 : rows >= lines.length + 2 ? 1 : 0;
  const height = Math.min(lines.length + 2 * frame, rows);
  const top = Math.floor((rows - height) / 2);
  for (let row = top; row < top + height; row += 1) {
    grid.clearRow(row, { column: left, width }, PANE_COLOURS.surface);
  }
  if (frame > 0) drawBorder(grid, { left, top, width, height });
  const inside = frame > 0 ? 1 : 0;
  const end2 = left + width - inside;
  lines.slice(0, height - 2 * frame).forEach((line, index) => {
    const lineWidth = runsWidth(line);
    const column = Math.max(left + Math.floor((width - lineWidth) / 2), left + inside);
    grid.writeRuns({ column, row: top + frame + index, end: end2 }, line);
  });
}
function drawBorder(grid, box) {
  const colours = {
    foreground: PANE_COLOURS.border,
    background: PANE_COLOURS.surface
  };
  const right = box.left + box.width - 1;
  const bottom = box.top + box.height - 1;
  for (let column = box.left + 1; column < right; column += 1) {
    grid.paint(grid.indexOf(column, box.top), BOX.horizontal, colours);
    grid.paint(grid.indexOf(column, bottom), BOX.horizontal, colours);
  }
  for (let row = box.top + 1; row < bottom; row += 1) {
    grid.paint(grid.indexOf(box.left, row), BOX.vertical, colours);
    grid.paint(grid.indexOf(right, row), BOX.vertical, colours);
  }
  grid.paint(grid.indexOf(box.left, box.top), BOX.topLeft, colours);
  grid.paint(grid.indexOf(right, box.top), BOX.topRight, colours);
  grid.paint(grid.indexOf(box.left, bottom), BOX.bottomLeft, colours);
  grid.paint(grid.indexOf(right, bottom), BOX.bottomRight, colours);
}

// bridge/svg-parts/markup.ts
function num(value) {
  return String(Math.round(value * 100) / 100);
}
var XML_FORBIDDEN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g;
var XML_REPLACEMENT = "?";
function escapeXml(text) {
  return text.replace(XML_FORBIDDEN, XML_REPLACEMENT).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}
function svgElement(tag, attributes, content) {
  let written = `<${tag}`;
  for (const [name, value] of Object.entries(attributes)) {
    written += ` ${name}="${typeof value === "number" ? num(value) : escapeXml(value)}"`;
  }
  return content === void 0 ? `${written}/>` : `${written}>${content}</${tag}>`;
}

// bridge/svg-parts/panel.ts
var PANEL_STYLE = { radius: 12, opacity: 0.8 };
var PANEL_BORDER_PX = 1;
function panelElement(box) {
  const inset = PANEL_BORDER_PX / 2;
  return svgElement("rect", {
    x: box.x + inset,
    y: box.y + inset,
    width: box.width - PANEL_BORDER_PX,
    height: box.height - PANEL_BORDER_PX,
    rx: PANEL_STYLE.radius - inset,
    fill: DESIGN_COLOURS.surface,
    "fill-opacity": PANEL_STYLE.opacity,
    stroke: DESIGN_COLOURS.border,
    "stroke-width": PANEL_BORDER_PX
  });
}

// bridge/svg-parts/minimap.ts
var MINIMAP_STYLE = {
  side: 160,
  /** The grid's lines: the border colour at 55%. */
  gridOpacity: 0.55,
  /** A sponsor's slot in its ink at 70%; an empty slot muted at 25%; corners of 1 px. */
  slotOpacity: 0.7,
  emptySlotOpacity: 0.25,
  slotRadius: 1,
  /** The grid's lines and the view's edge (px). */
  lineWidth: 1,
  /** The view: a text-coloured edge at 55% around a 6% fill, corners of 2 px. */
  viewEdgeOpacity: 0.55,
  viewFillOpacity: 0.06,
  viewRadius: 2,
  /** The player's dot (8 px across) and its glow (`--glow-dot`: 8 px of text at 45%). */
  dotRadius: 4,
  glowBlur: 4,
  glowOpacity: 0.45
};
var GRID_STEPS = [0.25, 0.5, 0.75, 1];
var IDS = { clip: "te-minimap-clip", glow: "te-minimap-glow" };
function minimapSvg(view, at) {
  const style = MINIMAP_STYLE;
  const inner = {
    x: at.x + PANEL_BORDER_PX,
    y: at.y + PANEL_BORDER_PX,
    side: style.side - 2 * PANEL_BORDER_PX
  };
  const place = (percent, origin) => origin + percent / 100 * inner.side;
  const size = (percent) => percent / 100 * inner.side;
  let marks = "";
  for (const step2 of GRID_STEPS) {
    const offset = step2 * inner.side;
    const line = { fill: DESIGN_COLOURS.border, "fill-opacity": style.gridOpacity };
    marks += svgElement("rect", {
      x: inner.x + offset - style.lineWidth,
      y: inner.y,
      width: style.lineWidth,
      height: inner.side,
      ...line
    });
    marks += svgElement("rect", {
      x: inner.x,
      y: inner.y + offset - style.lineWidth,
      width: inner.side,
      height: style.lineWidth,
      ...line
    });
  }
  for (const slot of view.slots) {
    marks += svgElement("rect", {
      x: place(slot.left, inner.x),
      y: place(slot.top, inner.y),
      width: size(slot.width),
      height: size(slot.height),
      rx: style.slotRadius,
      fill: slot.ink ?? DESIGN_COLOURS.muted,
      "fill-opacity": slot.ink === null ? style.emptySlotOpacity : style.slotOpacity
    });
  }
  if (view.marks !== null) marks += markSvg(view.marks, { place, size, inner });
  const clip = svgElement(
    "clipPath",
    { id: IDS.clip },
    svgElement("rect", { ...squareOf(inner), rx: PANEL_STYLE.radius - PANEL_BORDER_PX })
  );
  return panelElement({ x: at.x, y: at.y, width: style.side, height: style.side }) + svgElement("defs", {}, clip + glowFilter()) + svgElement("g", { "clip-path": `url(#${IDS.clip})` }, marks);
}
function markSvg(marks, square) {
  const style = MINIMAP_STYLE;
  const { place, size, inner } = square;
  let written = svgElement("rect", {
    // The edge's stroke runs half a line in, so the whole edge lies inside the view's box.
    x: place(marks.view.left, inner.x) + style.lineWidth / 2,
    y: place(marks.view.top, inner.y) + style.lineWidth / 2,
    width: Math.max(size(marks.view.width) - style.lineWidth, 0),
    height: Math.max(size(marks.view.height) - style.lineWidth, 0),
    rx: style.viewRadius,
    fill: DESIGN_COLOURS.text,
    "fill-opacity": style.viewFillOpacity,
    stroke: DESIGN_COLOURS.text,
    "stroke-opacity": style.viewEdgeOpacity
  });
  if (marks.player === null) return written;
  const centre = { cx: place(marks.player.x, inner.x), cy: place(marks.player.y, inner.y) };
  written += svgElement("circle", {
    ...centre,
    r: style.dotRadius,
    fill: DESIGN_COLOURS.text,
    "fill-opacity": style.glowOpacity,
    filter: `url(#${IDS.glow})`
  });
  written += svgElement("circle", { ...centre, r: style.dotRadius, fill: DESIGN_COLOURS.primary });
  return written;
}
function glowFilter() {
  return svgElement(
    "filter",
    { id: IDS.glow, x: -2, y: -2, width: 5, height: 5 },
    svgElement("feGaussianBlur", { stdDeviation: MINIMAP_STYLE.glowBlur })
  );
}
function squareOf(inner) {
  return { x: inner.x, y: inner.y, width: inner.side, height: inner.side };
}

// bridge/hud-layout.ts
var HUD_MARGIN_COLUMNS = 1;
var RANKING_TOP_ROWS = 5;
var RANKING_MAX_HEIGHT = RANKING_TOP_ROWS + 3;
var RANKING_COLUMNS = 26;
var RANKING_MIN_COLUMNS = 18;
var RANKING_MAX_SHARE = 0.4;
var RANKING_MIN_MAP_ROWS = 2 * RANKING_MAX_HEIGHT;
var MINIMAP_MAX_SIDE = 24;
var MINIMAP_MIN_SIDE = 10;
var MINIMAP_MAX_SHARE = 0.25;
var BORDER = 1;
function hudLayout(size) {
  const rows = mapRows(size);
  const rankingWidth = Math.min(RANKING_COLUMNS, Math.floor(size.columns * RANKING_MAX_SHARE));
  const hasRanking = rankingWidth >= RANKING_MIN_COLUMNS && rows >= RANKING_MIN_MAP_ROWS;
  const ranking = hasRanking ? { left: size.columns - HUD_MARGIN_COLUMNS - rankingWidth, width: rankingWidth } : null;
  const freeRows = rows - (hasRanking ? RANKING_MAX_HEIGHT + 1 : 0);
  const side = evenFloor(
    Math.min(
      MINIMAP_MAX_SIDE,
      Math.floor(size.columns * MINIMAP_MAX_SHARE) - 2 * BORDER,
      (freeRows - 2 * BORDER) * 2
    )
  );
  if (side < MINIMAP_MIN_SIDE) return { ranking, minimap: null };
  const width = side + 2 * BORDER;
  const height = side / 2 + 2 * BORDER;
  return {
    ranking,
    minimap: { left: size.columns - HUD_MARGIN_COLUMNS - width, top: rows - height, width, height }
  };
}
function evenFloor(value) {
  return Math.floor(value / 2) * 2;
}

// bridge/hud-panel.ts
var PANEL_VEIL = 0.8;
function topPixelOf(grid, index) {
  const { cells } = grid;
  return (cells[index] === UPPER_HALF_BLOCK ? cells[index + 1] : cells[index + 2]) ?? 0;
}
function bottomPixelOf(grid, index) {
  return grid.cells[index + 2] ?? 0;
}
function veilCell(grid, index, tint, amount) {
  if (index < 0) return;
  const top = mixCellColours(topPixelOf(grid, index), tint, amount);
  const bottom = mixCellColours(bottomPixelOf(grid, index), tint, amount);
  const { cells } = grid;
  cells[index] = top === bottom ? SPACE : UPPER_HALF_BLOCK;
  cells[index + 1] = top;
  cells[index + 2] = bottom;
}
function drawPanel(grid, box, title2 = []) {
  const right = box.left + box.width - 1;
  const bottom = box.top + box.height - 1;
  for (let row = box.top; row <= bottom; row += 1) {
    for (let column = box.left; column <= right; column += 1) {
      veilCell(grid, grid.indexOf(column, row), PANE_COLOURS.surface, PANEL_VEIL);
    }
  }
  const { border } = PANE_COLOURS;
  for (let column = box.left + 1; column < right; column += 1) {
    grid.ink(grid.indexOf(column, box.top), BOX.horizontal, border);
    grid.ink(grid.indexOf(column, bottom), BOX.horizontal, border);
  }
  for (let row = box.top + 1; row < bottom; row += 1) {
    grid.ink(grid.indexOf(box.left, row), BOX.vertical, border);
    grid.ink(grid.indexOf(right, row), BOX.vertical, border);
  }
  grid.ink(grid.indexOf(box.left, box.top), BOX.topLeft, border);
  grid.ink(grid.indexOf(right, box.top), BOX.topRight, border);
  grid.ink(grid.indexOf(box.left, bottom), BOX.bottomLeft, border);
  grid.ink(grid.indexOf(right, bottom), BOX.bottomRight, border);
  if (title2.length === 0) return;
  const at = { column: box.left + 2, row: box.top, end: right - 1 };
  const end2 = grid.writeRuns(at, [{ text: " ", colour: border }, ...title2]);
  grid.writeRuns({ column: end2, row: box.top, end: right - 1 }, [{ text: " ", colour: border }]);
}

// bridge/ranking-box.ts
var RANKING_TEXT = {
  title: "Ranking",
  /** A row whose slot the room has not named yet, as the web's `hud.leaderboard.unnamed`. */
  unnamed: "Unnamed"
};
var RANK_COLUMNS = 3;
var GAP = 1;
var INSET = 2;
var CUT_MARK2 = ".";
var SPACE_GLYPH = 32;
var OWN_ROW_TINT = 0.12;
function rankingRows(model, width) {
  return rankingLines(model).map(({ line, rank }) => rowOf(line, rank, width));
}
function rankingLines(model) {
  const lines = model.top.slice(0, RANKING_TOP_ROWS).map((line) => ({ line, rank: `${String(line.rank)}.`, isBelowTop: false }));
  const own = model.top.find((line) => line.isOwn) ?? model.ownBelow;
  if (own !== null && own.rank > RANKING_TOP_ROWS) {
    lines.push({ line: own, rank: `#${String(own.rank)}`, isBelowTop: true });
  }
  return lines;
}
function fitName(name, room) {
  const glyphs = glyphsOf(name);
  if (glyphs.length <= room) return name;
  if (room < 2) return "";
  let length = room - 1;
  while (glyphs[length - 1] === SPACE_GLYPH) length -= 1;
  return String.fromCharCode(...glyphs.slice(0, length)) + CUT_MARK2;
}
function drawRanking(grid, place, model) {
  const rows = rankingRows(model, place.width);
  if (rows.length === 0) return;
  const { left, width } = place;
  drawPanel(grid, { left, top: 0, width, height: rows.length + 2 }, [
    { text: RANKING_TEXT.title, colour: PANE_COLOURS.text }
  ]);
  rows.forEach((row, index) => {
    writeRow(grid, { left, width, row: index + 1 }, row);
  });
}
function rowOf(line, rank, width) {
  const mass = NUMBER_FORMAT.format(line.mass);
  const room = width - 2 * INSET - RANK_COLUMNS - 2 * GAP - mass.length;
  return { rank, name: fitName(line.name ?? RANKING_TEXT.unnamed, room), mass, isOwn: line.isOwn };
}
function writeRow(grid, at, row) {
  const first = at.left + INSET;
  const end2 = at.left + at.width - INSET;
  if (row.isOwn) {
    for (let column = at.left + 1; column < at.left + at.width - 1; column += 1) {
      veilCell(grid, grid.indexOf(column, at.row), PANE_COLOURS.mint, OWN_ROW_TINT);
    }
  }
  const label = row.isOwn ? PANE_COLOURS.mint : PANE_COLOURS.muted;
  const name = row.isOwn ? PANE_COLOURS.mint : PANE_COLOURS.text;
  grid.writeRuns({ column: first, row: at.row, end: end2 }, [{ text: row.rank, colour: label }]);
  grid.writeRuns({ column: first + RANK_COLUMNS + GAP, row: at.row, end: end2 }, [
    { text: row.name, colour: name }
  ]);
  grid.writeRuns({ column: end2 - row.mass.length, row: at.row, end: end2 }, [
    { text: row.mass, colour: label }
  ]);
}

// bridge/svg-parts/ranking.ts
var RANKING_STYLE = {
  /** The card's width on the web. */
  width: 232,
  paddingX: 16,
  paddingY: 12,
  titleSize: 14,
  /** `font-size` × `line-height` 1.4. */
  titleLine: 19.6,
  titleGap: 8,
  rowSize: 13,
  /** `font-size` × `line-height` 1.55. */
  rowLine: 20.15,
  /** Above and below a row's text, inside its band (`padding: 1px …`). */
  rowPaddingY: 1,
  rowGap: 2,
  /** The rank column: 2.25 em of the row's font. */
  rankWidth: 29.25,
  columnGap: 8,
  /** How far the own row's band reaches past the text on each side, and its corners' radius. */
  bandInset: 8,
  bandRadius: 8,
  /** The share of mint in the own row's band (`color-mix` 12%). */
  bandOpacity: 0.12,
  /** Above and below the line before the player's own row, and the line's thickness. */
  belowGap: 8,
  belowLine: 1
};
var ROW_HEIGHT = RANKING_STYLE.rowLine + 2 * RANKING_STYLE.rowPaddingY;
var LEADERBOARD_TITLE = "Leaderboard";
var MONO_ADVANCE_EM = 0.6;
var ELLIPSIS = "\u2026";
function rankingHeight(topRows, hasOwnBelow) {
  const style = RANKING_STYLE;
  const top = topRows * ROW_HEIGHT + Math.max(topRows - 1, 0) * style.rowGap;
  const below = hasOwnBelow ? 2 * style.belowGap + style.belowLine + ROW_HEIGHT : 0;
  const inside = 2 * style.paddingY + style.titleLine + style.titleGap + top + below;
  return 2 * PANEL_BORDER_PX + inside;
}
var RANKING_MAX_HEIGHT2 = rankingHeight(5, true);
function rankingSvg(model, at) {
  const lines = rankingLines(model);
  if (lines.length === 0) return "";
  const style = RANKING_STYLE;
  const top = lines.filter((line) => !line.isBelowTop);
  const below = lines.find((line) => line.isBelowTop);
  const height = rankingHeight(top.length, below !== void 0);
  const left = at.x + PANEL_BORDER_PX + style.paddingX;
  const textWidth2 = at.width - 2 * (PANEL_BORDER_PX + style.paddingX);
  let y = at.y + PANEL_BORDER_PX + style.paddingY;
  let content = svgElement(
    "text",
    {
      x: left,
      y: y + style.titleLine / 2,
      "dominant-baseline": "central",
      "font-family": DESIGN_FONTS.ui,
      "font-size": style.titleSize,
      "font-weight": 600,
      fill: DESIGN_COLOURS.text
    },
    escapeXml(LEADERBOARD_TITLE)
  );
  y += style.titleLine + style.titleGap;
  for (const line of top) {
    content += rowSvg(line, { x: left, y, width: textWidth2 });
    y += ROW_HEIGHT + style.rowGap;
  }
  if (below !== void 0) {
    y += style.belowGap - style.rowGap;
    content += svgElement("rect", {
      x: left,
      y,
      width: textWidth2,
      height: style.belowLine,
      fill: DESIGN_COLOURS.border
    });
    content += rowSvg(below, {
      x: left,
      y: y + style.belowLine + style.belowGap,
      width: textWidth2
    });
  }
  return panelElement({ x: at.x, y: at.y, width: at.width, height }) + content;
}
function rowSvg({ line, rank }, at) {
  const style = RANKING_STYLE;
  const mass = NUMBER_FORMAT.format(line.mass);
  const charWidth = style.rowSize * MONO_ADVANCE_EM;
  const nameRoom = at.width - style.rankWidth - 2 * style.columnGap - mass.length * charWidth;
  const name = fitText(line.name ?? RANKING_TEXT.unnamed, Math.floor(nameRoom / charWidth));
  const label = line.isOwn ? DESIGN_COLOURS.primary : DESIGN_COLOURS.muted;
  const centre = at.y + ROW_HEIGHT / 2;
  const text = (x, fill, words, anchor = "start") => svgElement(
    "text",
    {
      x,
      y: centre,
      "dominant-baseline": "central",
      "text-anchor": anchor,
      "font-family": DESIGN_FONTS.mono,
      "font-size": style.rowSize,
      fill
    },
    escapeXml(words)
  );
  const band = line.isOwn ? svgElement("rect", {
    x: at.x - style.bandInset,
    y: at.y,
    width: at.width + 2 * style.bandInset,
    height: ROW_HEIGHT,
    rx: style.bandRadius,
    fill: DESIGN_COLOURS.primary,
    "fill-opacity": style.bandOpacity
  }) : "";
  return band + text(at.x, label, rank) + text(at.x + style.rankWidth + style.columnGap, line.isOwn ? label : DESIGN_COLOURS.text, name) + text(at.x + at.width, label, mass, "end");
}
function fitText(text, room) {
  const characters = Array.from(text);
  if (characters.length <= room) return text;
  if (room < 2) return "";
  return characters.slice(0, room - 1).join("").trimEnd() + ELLIPSIS;
}

// bridge/svg-renderer.ts
var DESKTOP_CELL_WIDTH_PX = 8;
var HUD_SPACING = { padding: 16, gap: 12 };
var RANKING_MIN_WIDTH = 160;
var HUD_HEIGHT_PX = Math.ceil(
  2 * HUD_SPACING.padding + Math.max(RANKING_MAX_HEIGHT2, MINIMAP_STYLE.side)
);
function hudPlaces(width) {
  const { padding, gap } = HUD_SPACING;
  const room = width - 2 * padding;
  const besideMinimap = room - MINIMAP_STYLE.side - gap;
  if (besideMinimap >= RANKING_MIN_WIDTH) {
    return {
      ranking: { x: padding, y: padding, width: Math.min(besideMinimap, RANKING_STYLE.width) },
      minimap: { x: width - padding - MINIMAP_STYLE.side, y: padding }
    };
  }
  const ranking = room >= RANKING_MIN_WIDTH ? { x: padding, y: padding, width: Math.min(room, RANKING_STYLE.width) } : null;
  return { ranking, minimap: null };
}
function renderSvg(scene, width) {
  const height = HUD_HEIGHT_PX;
  let content = svgElement("rect", { width, height, fill: DESIGN_COLOURS.background });
  const { state } = scene;
  if (state.phase.kind === "playing" || state.phase.kind === "reconnecting") {
    const places = hudPlaces(width);
    if (places.ranking !== null) content += rankingSvg(leaderboardModel(state), places.ranking);
    if (places.minimap !== null) {
      const view = {
        marks: minimapMarks(state),
        slots: slotMarks(state.slots, state.mapSize)
      };
      content += minimapSvg(view, places.minimap);
    }
  }
  const svg = svgElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width,
      height,
      viewBox: `0 0 ${String(width)} ${String(height)}`
    },
    content
  );
  return { svg, alt: hudAlt(scene.status), w: width, h: height };
}
function hudAlt(status) {
  if (status.room === null) return "tokeneater";
  const rank = status.rank === null ? "" : `, rank #${String(status.rank)} of ${String(status.players)}`;
  return `tokeneater \u2014 room ${status.room}, mass ${String(status.mass)}${rank}`;
}

// bridge/desktop-renderer.ts
var DesktopRenderer = class {
  grid = new CellGrid();
  map = new PaneMap();
  lastFrame = new LastFrame();
  /** Writes the map when a cell of it changed, and the HUD; returns the map's changed cells. */
  draw(scene, size, output) {
    const cells = this.render(scene, size);
    const changed = this.lastFrame.replace(size, cells);
    if (changed > 0) output.mapRows(cellRows(cells, size));
    output.hud(renderSvg(scene, size.columns * DESKTOP_CELL_WIDTH_PX));
    return changed;
  }
  /** The cells of the map `Client` for `scene` on a pane of `size` (rewritten by the next call). */
  render(scene, size) {
    const { grid } = this;
    grid.resize(size);
    this.map.draw(grid, scene, size);
    drawOverlay(grid, mapRows(size), paneOverlay(scene));
    drawStatusRow(grid, size.rows - 1, scene.status);
    return grid.cells;
  }
};

// bridge/lifecycle.ts
var PARENT_CHECK_MS = 1e3;
function watchLifecycle(host, onEnd) {
  let timer;
  const stops = [];
  const stop = () => {
    host.timers.clearTimeout(timer);
    for (const unsubscribe of stops) unsubscribe();
  };
  const end2 = (reason) => {
    stop();
    onEnd(reason);
  };
  const checkParent = () => {
    if (!host.isParentAlive()) {
      end2("parentGone");
      return;
    }
    timer = host.timers.setTimeout(checkParent, PARENT_CHECK_MS);
  };
  stops.push(
    host.onSignal(() => {
      end2("signal");
    }),
    host.onOutputError(() => {
      end2("outputClosed");
    })
  );
  timer = host.timers.setTimeout(checkParent, PARENT_CHECK_MS);
  return stop;
}

// bridge/frame-pacer.ts
var MAX_FPS = 30;
var MIN_FPS = 15;
var BYTE_BUDGET_PER_SECOND = 5e5;
var BYTES_PER_CHANGED_CELL = 25;
function frameIntervalMs(changedCells) {
  const budgetMs = changedCells * BYTES_PER_CHANGED_CELL / BYTE_BUDGET_PER_SECOND * 1e3;
  return Math.min(Math.max(budgetMs, 1e3 / MAX_FPS), 1e3 / MIN_FPS);
}
var FramePacer = class {
  constructor(options) {
    this.options = options;
  }
  options;
  nextAt = Number.NEGATIVE_INFINITY;
  timer = null;
  isStopped = false;
  /** The view may have changed: draws now, or once the interval since the last frame is over. */
  request() {
    if (this.isStopped || this.timer !== null) return;
    const wait = this.nextAt - this.options.now();
    if (wait <= 0) {
      this.draw();
      return;
    }
    this.timer = this.options.timers.setTimeout(() => {
      this.timer = null;
      this.draw();
    }, wait);
  }
  /** Draws nothing more; a frame waiting is dropped. */
  stop() {
    this.isStopped = true;
    this.options.timers.clearTimeout(this.timer);
    this.timer = null;
  }
  draw() {
    const changed = this.options.draw();
    if (changed === 0) return;
    this.nextAt = this.options.now() + frameIntervalMs(changed);
  }
};

// bridge/status.ts
function bridgeStatus(state, frame, origin) {
  const { room } = state;
  return {
    phase: state.phase.kind,
    room,
    link: room === null ? null : roomLink(origin, room),
    players: state.players.filter((player) => player !== void 0).length,
    mass: state.ownMass,
    rank: state.ownRank,
    isDead: state.death !== null,
    position: frame.ownCount > 0 ? { x: Math.round(frame.ownCenterX), y: Math.round(frame.ownCenterY) } : null
  };
}
var MOTION_REPORT_INTERVAL_MS = 500;
function isMotionOnlyChange(previous, next) {
  return previous.phase === next.phase && previous.room === next.room && previous.link === next.link && previous.players === next.players && previous.rank === next.rank && previous.isDead === next.isDead;
}

// bridge/steering-wheel.ts
var CHORD_WINDOW_MS = 150;
var SETTLE_ANGLE_DEGREES = 5;
var SETTLE_COSINE = Math.cos(SETTLE_ANGLE_DEGREES * Math.PI / 180);
var PARALLEL_TOLERANCE = 1e-9;
var SteeringWheel = class {
  heading = null;
  last = null;
  /**
   * Turns for a steering key pressed at `now` (ms) towards (`dx`, `dy`); returns the new heading,
   * or `null` for (0, 0), which stops steering (the player comes to rest) and resets the wheel.
   */
  turn(dx, dy, now) {
    const key = unitOf(dx, dy);
    if (key === null) {
      this.reset();
      return null;
    }
    const { last } = this;
    this.last = { key, at: now };
    this.heading = last !== null && isChord(last, key, now) ? bisector(last.key, key) : this.nudged(key);
    return this.heading;
  }
  /** Forgets the heading and the last key: the pointer aimed, so the next key steers exactly. */
  reset() {
    this.heading = null;
    this.last = null;
  }
  /** The heading after `key` nudges the current one (see the class). */
  nudged(key) {
    const { heading } = this;
    if (heading === null || dot(heading, key) < 0) return key;
    const blended = bisector(heading, key);
    return dot(blended, key) >= SETTLE_COSINE ? key : blended;
  }
};
function isChord(last, key, now) {
  return now - last.at <= CHORD_WINDOW_MS && Math.abs(dot(last.key, key)) < 1 - PARALLEL_TOLERANCE;
}
function dot(a, b) {
  return a.x * b.x + a.y * b.y;
}
function bisector(a, b) {
  const x = a.x + b.x;
  const y = a.y + b.y;
  const length = Math.hypot(x, y);
  return { x: x / length, y: y / length };
}
function unitOf(x, y) {
  const length = Math.hypot(x, y);
  return length === 0 ? null : { x: x / length, y: y / length };
}

// bridge/session.ts
var BridgeSession = class {
  constructor(options) {
    this.options = options;
    const { connection, now, timers } = options;
    this.size = options.size;
    this.intents = createIntentControl({
      connection,
      aim: this.aim,
      camera: this.camera,
      now,
      timers
    });
    this.playAgain = new PlayAgain(connection);
    this.pacer = new FramePacer({ now, timers, draw: () => this.draw() });
    this.stops = [
      connection.onMessage((message) => {
        this.receive(message);
      }),
      connection.onPhase((phase) => {
        this.changePhase(phase);
      })
    ];
  }
  options;
  state = createClientState();
  aim = new Aim();
  wheel = new SteeringWheel();
  camera = new Camera();
  frame = createFrameView();
  own = { slot: null, target: null };
  ownTarget = { x: 0, y: 0 };
  view = { centerX: 0, centerY: 0, halfWidth: 0, halfHeight: 0 };
  intents;
  playAgain;
  stops;
  pacer;
  size;
  isStopped = false;
  reported = null;
  reportedAt = Number.NEGATIVE_INFINITY;
  /**
   * Joins the game (`connection.join`); frames and status lines follow from its first phase. A
   * nickname the shared filter refuses never reaches the lobby: the connection is `rejected`
   * (`nickname`) at once, whose card points to the plugin's option (`/config`).
   */
  start(request) {
    this.options.connection.join(request);
  }
  /**
   * Plays one control input:
   * - `aim`: steers at that pane point, and resets the keys' `SteeringWheel`;
   * - `keys`: turns the wheel and steers its way to the map's edge (`headingPoint`), or at the
   *   centre for (0, 0) — only the aim changes: intents go out at their own rate, as for the pointer;
   * - `press` `split` / `eject`: presses it (only in play, as on the web);
   * - `press` `respawn`: Play again while dead (once until the new life shows); "try now" /
   *   "reconnect" while the lobby is full or the connection is lost; nothing otherwise;
   * - `resize`: draws at the new size from now on.
   * Each asks for a frame: an aim moves the player's predicted cells, a press may change a card.
   * Once stopped, inputs are ignored (a request already in flight when the bridge ends).
   */
  handle(input) {
    if (this.isStopped) return;
    switch (input.kind) {
      case "aim":
        this.wheel.reset();
        this.aimAt(input.x, input.y);
        break;
      case "keys":
        this.steerWith(input.dx, input.dy);
        break;
      case "press":
        this.press(input.action);
        break;
      case "resize":
        this.size = { columns: input.columns, rows: input.rows };
    }
    this.pacer.request();
  }
  /** Stops sending and drawing, leaves the room and stops listening to the connection. */
  stop() {
    this.isStopped = true;
    this.pacer.stop();
    this.intents.stop();
    for (const stop of this.stops) stop();
    this.options.connection.leave();
  }
  aimAt(x, y) {
    const point = panePoint(this.size, x, y);
    this.intents.sink.aimAt(point.xPx, point.yPx);
  }
  steerWith(dx, dy) {
    const heading = this.wheel.turn(dx, dy, this.options.now());
    const point = headingPoint(this.size, heading);
    this.intents.sink.aimAt(point.xPx, point.yPx);
  }
  press(action) {
    if (action !== "respawn") {
      this.intents.sink.press(action);
      return;
    }
    const { connection } = this.options;
    const { phase } = connection;
    if (phase.kind === "lost" || phase.kind === "unavailable") connection.retry();
    else if (this.state.death !== null && !this.playAgain.isPending) this.playAgain.request();
  }
  /** Applies `message`; every one but a pong may change what the pane shows. */
  receive(message) {
    applyServerMessage(this.state, message, this.options.now());
    this.playAgain.settle(this.state);
    this.update();
    if (message.type !== "pong") this.pacer.request();
  }
  changePhase(phase) {
    applyPhase(this.state, phase);
    this.playAgain.follow(phase);
    this.update();
    this.pacer.request();
  }
  /** Intents go out only while the player is in play (playing and alive), as on the web. */
  update() {
    this.intents.setActive(this.state.phase.kind === "playing" && this.state.death === null);
  }
  /**
   * Draws the frame of now (the pacer calls it): interpolates the view, points the camera (which
   * input maps the pane through), reports the status and has the surface's renderer draw the
   * scene, written when it changed. Returns how many cells changed.
   */
  draw() {
    const { state, frame, own, options } = this;
    const now = options.now();
    own.slot = state.ownSlot;
    own.target = this.aim.worldTarget(this.camera, this.ownTarget);
    interpolateView(state.snapshots, now, own, frame);
    this.camera.update(cameraTarget(frame, state.mapSize, this.view), paneViewport(this.size), now);
    const status = bridgeStatus(state, frame, options.origin);
    this.report(status, now);
    const scene = {
      state,
      frame,
      camera: this.camera,
      status,
      isRespawning: this.playAgain.isPending,
      origin: options.origin
    };
    return options.renderer.draw(scene, this.size, options.output);
  }
  /**
   * Writes `status`, unless it only moved the player or changed its mass since one written less
   * than the interval ago.
   */
  report(status, now) {
    const last = this.reported;
    const isTooSoon = now - this.reportedAt < MOTION_REPORT_INTERVAL_MS;
    if (last !== null && isTooSoon && isMotionOnlyChange(last, status)) return;
    this.reported = status;
    this.reportedAt = now;
    this.options.output.status(status);
  }
};

// bridge/stdout-protocol.ts
function readyLine(port, token) {
  return `READY ${String(port)} ${token}
`;
}
function frameLine(size, cells) {
  const bytes = Buffer.from(cells.buffer, cells.byteOffset, cells.byteLength);
  return `F ${String(size.columns)} ${String(size.rows)} ${bytes.toString("base64")}
`;
}
function mapLine(rows) {
  return `C ${JSON.stringify(rows)}
`;
}
function hudLine(frame) {
  return `V ${JSON.stringify(frame)}
`;
}
function statusLine(status) {
  return `S ${JSON.stringify(status)}
`;
}
function errorLine(message) {
  return `E ${message.replace(/\s*[\r\n]+\s*/g, " ")}
`;
}
function writeProtocol(stream) {
  let lastStatus = "";
  let isBlocked = false;
  const kinds = [];
  let nextKind = 0;
  const write = (line) => {
    if (stream.write(line)) return true;
    if (isBlocked) return false;
    isBlocked = true;
    stream.once("drain", () => {
      isBlocked = false;
      const inTurn = [...kinds.slice(nextKind), ...kinds.slice(0, nextKind)];
      for (const kind of inTurn) {
        const frame = kind.waiting;
        if (frame === null) continue;
        kind.waiting = null;
        nextKind = (kinds.indexOf(kind) + 1) % kinds.length;
        if (!write(frame)) break;
      }
    });
    return false;
  };
  const frameKind = () => {
    const kind = { last: "", waiting: null };
    kinds.push(kind);
    return (line) => {
      if (line === kind.last) return;
      kind.last = line;
      if (isBlocked) kind.waiting = line;
      else write(line);
    };
  };
  const writeCells = frameKind();
  const writeMap = frameKind();
  const writeHud = frameKind();
  return {
    ready: (port, token) => {
      write(readyLine(port, token));
    },
    frame: (size, cells) => {
      writeCells(frameLine(size, cells));
    },
    mapRows: (rows) => {
      writeMap(mapLine(rows));
    },
    hud: (frame) => {
      writeHud(hudLine(frame));
    },
    status: (status) => {
      const line = statusLine(status);
      if (line === lastStatus) return;
      lastStatus = line;
      write(line);
    },
    error: (message) => {
      write(errorLine(message));
    }
  };
}

// bridge/minimap.ts
var MARK_SHARES = {
  grid: 0.55,
  sponsoredSlot: 0.7,
  emptySlot: 0.25,
  viewEdge: 0.55,
  viewFill: 0.06
};
var GRID_DIVISIONS = 4;
var FLOOR = mixCellColours(PANE_COLOURS.map, PANE_COLOURS.surface, PANEL_VEIL);
var MINIMAP_COLOURS = {
  floor: FLOOR,
  grid: mixCellColours(FLOOR, PANE_COLOURS.border, MARK_SHARES.grid),
  viewEdge: mixCellColours(FLOOR, PANE_COLOURS.text, MARK_SHARES.viewEdge),
  viewFill: mixCellColours(FLOOR, PANE_COLOURS.text, MARK_SHARES.viewFill),
  /** The player's dots: mint, as its cells on the map. */
  own: PANE_COLOURS.mint
};
var Minimap = class {
  set = null;
  looks = [];
  view = { fromX: 0, toX: 0, fromY: 0, toY: 0 };
  slot = { fromX: 0, toX: 0, fromY: 0, toY: 0 };
  /** Draws the minimap of `scene` in `box` (`HudLayout.minimap`) of `grid`. */
  draw(grid, box, scene) {
    drawPanel(grid, box);
    const side = box.width - 2;
    const pen = { grid, box };
    const scale = side / scene.mapSize;
    fillRect(pen, { fromX: 0, toX: side - 1, fromY: 0, toY: side - 1 }, MINIMAP_COLOURS.floor);
    for (let line = 1; line < GRID_DIVISIONS; line += 1) {
      const at = Math.round(line * side / GRID_DIVISIONS);
      fillRect(pen, { fromX: at, toX: at, fromY: 0, toY: side - 1 }, MINIMAP_COLOURS.grid);
      fillRect(pen, { fromX: 0, toX: side - 1, fromY: at, toY: at }, MINIMAP_COLOURS.grid);
    }
    const { camera } = scene;
    const view = project(this.view, camera, scale, side);
    fillRect(pen, view, MINIMAP_COLOURS.viewFill);
    this.drawSlots(pen, scene.slots, scale, side);
    drawEdge(pen, view);
    for (const cell of scene.frame.cells) {
      if (!cell.isOwn) continue;
      const x = toPixel(cell.x, scale, side);
      const y = toPixel(cell.y, scale, side);
      fillRect(pen, { fromX: x, toX: x, fromY: y, toY: y }, MINIMAP_COLOURS.own);
    }
    settleGlyphs(grid, box);
  }
  /** Each slot of `slots` filled in its colour (`slotFill`), under the view's edge and the dots. */
  drawSlots(pen, slots, scale, side) {
    if (slots !== this.set) {
      this.set = slots;
      this.looks = slots === null ? [] : slots.slots.map((slot) => ({ slot, fill: slotFill(slot.sponsor) }));
    }
    for (const { slot, fill } of this.looks) {
      const area = { minX: slot.x, minY: slot.y, maxX: slot.x + slot.w, maxY: slot.y + slot.h };
      fillRect(pen, project(this.slot, area, scale, side), fill);
    }
  }
};
function project(out, area, scale, side) {
  out.fromX = toPixel(area.minX, scale, side);
  out.fromY = toPixel(area.minY, scale, side);
  out.toX = Math.max(out.fromX, Math.min(Math.ceil(area.maxX * scale) - 1, side - 1));
  out.toY = Math.max(out.fromY, Math.min(Math.ceil(area.maxY * scale) - 1, side - 1));
  return out;
}
function drawEdge(pen, view) {
  const colour = MINIMAP_COLOURS.viewEdge;
  fillRect(pen, { ...view, toY: view.fromY }, colour);
  fillRect(pen, { ...view, fromY: view.toY }, colour);
  fillRect(pen, { ...view, toX: view.fromX }, colour);
  fillRect(pen, { ...view, fromX: view.toX }, colour);
}
function slotFill(sponsor) {
  const colour = cellColour(slotColour(sponsor?.colour ?? null, DESIGN_COLOURS.background));
  const share = sponsor === null ? MARK_SHARES.emptySlot : MARK_SHARES.sponsoredSlot;
  return mixCellColours(FLOOR, colour, share);
}
function toPixel(value, scale, side) {
  return Math.min(Math.max(Math.floor(value * scale), 0), side - 1);
}
function fillRect(pen, rect, colour) {
  const { grid, box } = pen;
  for (let y = rect.fromY; y <= rect.toY; y += 1) {
    for (let x = rect.fromX; x <= rect.toX; x += 1) {
      const index = grid.indexOf(box.left + 1 + x, box.top + 1 + (y >> 1));
      if (index >= 0) grid.cells[index + 1 + (y & 1)] = colour;
    }
  }
}
function settleGlyphs(grid, box) {
  const { cells } = grid;
  for (let row = box.top + 1; row < box.top + box.height - 1; row += 1) {
    for (let column = box.left + 1; column < box.left + box.width - 1; column += 1) {
      const index = grid.indexOf(column, row);
      if (index < 0) continue;
      cells[index] = cells[index + 1] === cells[index + 2] ? SPACE : UPPER_HALF_BLOCK;
    }
  }
}

// bridge/hud.ts
var PaneHud = class {
  minimap = new Minimap();
  /** Draws the HUD of `scene` over the composed map of `grid`, a pane of `size`. */
  draw(grid, size, scene) {
    const { state } = scene;
    if (state.phase.kind !== "playing" && state.phase.kind !== "reconnecting") return;
    const layout = hudLayout(size);
    if (layout.ranking !== null) drawRanking(grid, layout.ranking, leaderboardModel(state));
    if (layout.minimap === null) return;
    this.minimap.draw(grid, layout.minimap, {
      camera: scene.camera,
      frame: scene.frame,
      mapSize: state.mapSize,
      slots: state.slots
    });
  }
};

// bridge/terminal-renderer.ts
var TerminalRenderer = class {
  grid = new CellGrid();
  map = new PaneMap();
  hud = new PaneHud();
  lastFrame = new LastFrame();
  /**
   * The terminal's frame (`Renderer.draw`): the cells of `scene` (`render`), written as an `F` line
   * for `$.ui.blit` when any cell differs from the last frame drawn (`LastFrame`).
   */
  draw(scene, size, output) {
    const cells = this.render(scene, size);
    const changed = this.lastFrame.replace(size, cells);
    if (changed > 0) output.frame(size, cells);
    return changed;
  }
  /**
   * The cells of `scene` on a pane of `size`. The array is the renderer's own and is rewritten by
   * the next call: copy what must outlive it.
   */
  render(scene, size) {
    const { grid } = this;
    grid.resize(size);
    this.map.draw(grid, scene, size);
    this.hud.draw(grid, size, { state: scene.state, frame: scene.frame, camera: scene.camera });
    drawOverlay(grid, mapRows(size), paneOverlay(scene));
    drawStatusRow(grid, size.rows - 1, scene.status);
    return grid.cells;
  }
};

// bridge/bridge.ts
var EXIT_CODES = {
  /** It ended as asked or as its host went away (`EndReason`). */
  ended: 0,
  /** It could not start (its control server, its token); an `E` line says what. */
  failed: 1,
  /** The environment the plugin gave it is invalid (an `E` line says what). */
  badEnvironment: 2,
  /** Node is missing what the bridge needs (an `E` line says what). */
  unsupportedRuntime: 3
};
var LEAVE_DELAY_MS = 0;
var RENDERERS = {
  terminal: () => new TerminalRenderer(),
  desktop: () => new DesktopRenderer()
};
async function runBridge(host) {
  const output = writeProtocol(host.output);
  if (host.runtimeProblem !== null) {
    return refuse2(host, output, host.runtimeProblem, EXIT_CODES.unsupportedRuntime);
  }
  const parsed = parseBridgeEnv(host.env);
  if (!parsed.ok) return refuse2(host, output, parsed.error, EXIT_CODES.badEnvironment);
  try {
    return await start(host, parsed.config, output);
  } catch (error) {
    const message = `tokeneater bridge could not start: ${String(error)}`;
    return refuse2(host, output, message, EXIT_CODES.failed);
  }
}
async function start(host, config, output) {
  const connection = createConnection({
    lobby: createLobbyClient((path, init) => host.fetch(`${config.origin}${path}`, init), "mod"),
    openSocket: originSocketFactory(config.server, (url) => host.createSocket(url)),
    now: () => host.now(),
    timers: host.timers
  });
  const session = new BridgeSession({
    connection,
    origin: config.origin,
    now: () => host.now(),
    timers: host.timers,
    output,
    size: config.size,
    renderer: RENDERERS[config.surface]()
  });
  const token = host.createToken();
  let isEnding = false;
  const end2 = async (reason) => {
    if (isEnding) return;
    isEnding = true;
    stopWatching();
    session.stop();
    host.log(`tokeneater bridge: ending (${reason})`);
    const closed = server.close();
    host.exit(EXIT_CODES.ended);
    await closed;
  };
  const server = await startControlServer({
    token,
    onInput: (input) => {
      if (input.kind !== "leave") {
        session.handle(input);
        return;
      }
      host.timers.setTimeout(() => void end2("leave"), LEAVE_DELAY_MS);
    },
    // Logged only: the failure may be stdout itself, so no `E` line is attempted.
    onError: (error) => {
      host.log(`tokeneater bridge: a control input failed: ${String(error)}`);
    }
  });
  output.ready(server.port, token);
  const stopWatching = watchLifecycle(host, (reason) => void end2(reason));
  session.start({ nickname: config.nickname, room: config.room });
  return { port: server.port, token, end: end2 };
}
function refuse2(host, output, message, code) {
  output.error(message);
  host.log(`tokeneater bridge: ${message}`);
  host.exit(code);
  return null;
}

// bridge/node-host.ts
var MIN_NODE_MAJOR = 22;
var EXIT_GRACE_MS = 1e3;
var END_SIGNALS = ["SIGTERM", "SIGINT", "SIGHUP"];
function runtimeProblem(globals, version) {
  const major = Number(/^v(\d+)\./.exec(version)?.[1] ?? 0);
  const hasGlobals = typeof globals.WebSocket === "function" && typeof globals.fetch === "function";
  if (major >= MIN_NODE_MAJOR && hasGlobals) return null;
  return `tokeneater needs Node.js ${String(MIN_NODE_MAJOR)} or newer to play (found ${version})`;
}
function processExists(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === "EPERM";
  }
}
function nodeHost(proc = process) {
  const parentPid = proc.ppid;
  return {
    env: proc.env,
    output: proc.stdout,
    log: (line) => {
      proc.stderr.write(`${line}
`);
    },
    runtimeProblem: runtimeProblem(globalThis, proc.version),
    createSocket: (url) => new WebSocket(url),
    fetch: (url, init) => fetch(url, init),
    timers: globalThis,
    now: () => performance.now(),
    createToken,
    isParentAlive: () => proc.ppid === parentPid && processExists(parentPid),
    onSignal: (listener) => {
      for (const signal of END_SIGNALS) proc.on(signal, listener);
      return () => {
        for (const signal of END_SIGNALS) proc.off(signal, listener);
      };
    },
    onOutputError: (listener) => {
      proc.stdout.on("error", listener);
      return () => {
        proc.stdout.off("error", listener);
      };
    },
    exit: (code) => {
      proc.exitCode = code;
      setTimeout(() => proc.exit(code), EXIT_GRACE_MS).unref();
    }
  };
}

// bridge/main.ts
await runBridge(nodeHost());
