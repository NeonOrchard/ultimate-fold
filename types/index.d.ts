declare module 'claude-code' {
  interface PluginState {
    // Per reply: the indexes of its folds that are open.
    'ultimate-fold': { open: StateFamily<number[]> }
  }
}
