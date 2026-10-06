// The plugin's state contract: the `$.state` values it owns. They survive a reload of the hooks
// module; the bridge, its frames and its problem do not (a reload ends the child with its loop),
// so they live in the bridge host instead.
declare module 'claude-code' {
  interface PluginState {
    tokeneater: {
      /**
       * Whether the person closed the pane during the running turn: a prompt typed into that turn
       * does not open it again (FR-4.1). Cleared when the turn ends or a new one starts.
       */
      closedThisTurn: boolean;
    };
  }
}
