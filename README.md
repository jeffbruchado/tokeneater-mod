# tokeneater for Claude Code

Play **tokeneater**, the multiplayer cell-eating game, in a pane beside your Claude Code
conversation while a prompt runs. The pane joins the same rooms as the browser game; a toast says
when the agent is done, and the pane stays until you close it.

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

Then switch to the fullscreen layout (`/tui fullscreen`) and type `/tokeneater`.

## Requirements

- Claude Code 2.1.288 or newer, with plugin hooks modules available.
- Node.js 22 or newer on your `PATH`: the game runs in a small Node process beside the pane.
- The fullscreen layout (`/tui fullscreen`) and a terminal at least 110 columns wide. The pane
  opens by itself when you send a prompt in a terminal at least 144 columns wide; `/tokeneater`
  opens and closes it at any width.

## Play

| Input | Does |
| --- | --- |
| Mouse over the pane | steers your cell |
| `w` `a` `s` `d` (arrows too after a click) | steer up, left, down, right: the cell keeps going that way until you steer again |
| `e` (Space too after a click) | split |
| `q` | eject mass |
| `r` (Enter after a click) | play again |
| `Esc` | gives the keyboard back to the prompt |

The pane shows the map with the ranking (the top 5 and your own row) in its top-right corner, a
minimap in its bottom-right corner, and your mass, room and rank on its last row.

## Options

`/plugin configure tokeneater@tokeneater` (or `claude plugin configure tokeneater@tokeneater`):

- **Nickname**: the name other players see (up to 16 characters); empty lets the server pick one.
- **Open on prompt**: on by default, a prompt you send opens the game's pane by itself (in a
  fullscreen terminal at least 144 columns wide). Off: only `/tokeneater` opens it.

## Updates

Third-party marketplaces do not update by themselves unless you turn auto-update on for them in
`/plugin` → Marketplaces. To update by hand: `/plugin marketplace update tokeneater`, then
`/plugin` → Installed → tokeneater → Update now.
