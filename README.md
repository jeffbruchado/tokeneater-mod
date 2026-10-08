# tokeneater for Claude Code

Play **tokeneater**, the multiplayer cell-eating game, in a pane beside your Claude Code
conversation while a prompt runs, in the terminal or in the Code tab of the Claude desktop app.
The pane joins the same rooms as the browser game; a toast says when the agent is done, and the
pane stays until you close it. On the Claude mobile app and in VS Code, where a pane cannot play,
it links to a room to play in the browser.

This repository is the plugin's distribution: it is published automatically from the game's
sources, so changes made here are overwritten by the next release.

## Install

In Claude Code:

```text
/plugin marketplace add jeffbruchado/tokeneater-mod
/plugin install tokeneater@tokeneater
```

From a shell, the same with `claude plugin marketplace add jeffbruchado/tokeneater-mod` and
`claude plugin install tokeneater@tokeneater`.

Then type `/tokeneater` (in a terminal, switch to the fullscreen layout first: `/tui fullscreen`).

## Requirements

- Claude Code 2.1.288 or newer, with plugin hooks modules available.
- Node.js 22 or newer on your `PATH`: the game runs in a small Node process beside the pane.
- In a terminal: the fullscreen layout (`/tui fullscreen`) and at least 110 columns. The pane
  opens by itself when you send a prompt in a terminal at least 144 columns wide; `/tokeneater`
  opens and closes it at any width.
- In the Claude desktop app: the Code tab, where the pane docks beside the conversation and opens
  by itself when you send a prompt.

## Play

| Input | Does |
| --- | --- |
| Mouse over the pane | steers your cell |
| `w` `a` `s` `d` (arrows too after a click) | steer up, left, down, right; two together (or one after the other) go between them, and a key held keeps turning its way. The cell keeps going until you steer again |
| `e` (Space too after a click) | split |
| `q` | eject mass |
| `r` (Enter after a click) | play again |
| `Esc` | gives the keyboard back to the prompt |

In a terminal, the pane shows the map with the ranking (the top 5 and your own row) in its
top-right corner, a minimap in its bottom-right corner, and your mass, room and rank on its last
row. In the desktop app, the ranking and the minimap sit under the map, and the keys play once you
click the map (the buttons under it play too).

## Options

`/plugin configure tokeneater@tokeneater` (or `claude plugin configure tokeneater@tokeneater`):

- **Nickname**: the name other players see (up to 16 characters); empty lets the server pick one.
- **Open on prompt**: on by default, a prompt you send opens the game's pane by itself (in the
  desktop app, or a fullscreen terminal at least 144 columns wide). Off: only `/tokeneater` opens
  it.

## Updates

Third-party marketplaces do not update by themselves unless you turn auto-update on for them in
`/plugin` → Marketplaces. To update by hand: `/plugin marketplace update tokeneater`, then
`/plugin` → Installed → tokeneater → Update now.

## License

[MIT](LICENSE). Play in the browser at [playtokeneater.com](https://playtokeneater.com).
