# ultimate-fold

Click-to-fold sections in Claude Code replies.

Long answers stay short. The extra detail hides behind a row you can open when you want it.

<br>

## What it does

- Claude writes a fold in its reply.
- You see a closed row: `▸ Title`
- Click it (or select it and press **Enter**) and it opens: `▾ Title`, with the detail below.
- Click again to close it.
- Folds start closed.

<br>

## Syntax

```
Short answer here.

::: fold 1. Why this happened
The hidden detail. Any markdown works in here.
:::
```

<br>

## Install

At the prompt of a Claude Code terminal session, type:

```
/plugin install ultimate-fold --marketplace NeonOrchard/ultimate-fold
```

Then:

- Press `y` to add the marketplace.
- Pick a scope (user scope is first; press **Enter**).

That's it. It works right away, no restart.

<br>

## Heads-up

- **Mouse clicks need the fullscreen layout.** It's on by default in Claude Code. It's off inside tmux, so mouse clicks won't reach the fold there.
- **Early-access API.** This mod is built on Claude Code's early-access mod API, which may change.

<br>

## Tip: tell Claude to use it

Claude won't write folds unless asked. Add a line like this to your `CLAUDE.md`:

```
When there's extra detail, give the short version first, then put each extra part in a
`::: fold N. Title` ... `:::` block (numbered titles).
```

<br>

## License

MIT. See [LICENSE](LICENSE).
