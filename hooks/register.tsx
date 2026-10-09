import { atom, memberOf, read, update } from 'claude-code'
import type { Register } from 'claude-code'

// A reply marks a foldable section like this:
//
//   ::: fold Why this happened
//   the hidden detail, any markdown
//   :::
//
// Each fold draws as a "▸ Title" row; a click (or Enter on it) opens it to
// "▾ Title" and its body, and another closes it. Folds start closed.

const open = atom({ plugin: 'ultimate-fold', key: 'open' } as const, [] as number[])

type Part = { kind: 'text'; text: string } | { kind: 'fold'; title: string; body: string }

const START = /^:::\s*fold\s+(.+?)\s*$/
const END = /^:::\s*$/

export function parse(text: string): Part[] {
  const parts: Part[] = []
  let plain: string[] = []
  let fold: { title: string; body: string[] } | null = null

  for (const line of text.split('\n')) {
    if (fold) {
      if (END.test(line)) {
        parts.push({ kind: 'fold', title: fold.title, body: fold.body.join('\n') })
        fold = null
      } else {
        fold.body.push(line)
      }
      continue
    }
    const m = START.exec(line)
    if (m) {
      if (plain.join('').trim()) parts.push({ kind: 'text', text: plain.join('\n') })
      plain = []
      fold = { title: m[1], body: [] }
    } else {
      plain.push(line)
    }
  }
  // An unclosed fold (a reply still streaming) holds the rest.
  if (fold) parts.push({ kind: 'fold', title: fold.title, body: fold.body.join('\n') })
  if (plain.join('').trim()) parts.push({ kind: 'text', text: plain.join('\n') })
  return parts
}

export const register: Register = on => {
  on('ui.render', { component: 'AssistantMessage' }, async ($, e, next) => {
    if (e.props.isSummary || !/^:::\s*fold\s/m.test(e.props.text)) {
      return next(e)
    }

    const parts = parse(e.props.text)
    const mine = memberOf(open, e)
    const opened = await read($, mine)
    const { Box, Button, Markdown } = $.ui.resolve(e)

    let n = -1
    return (
      <Box flexDirection="column">
        {parts.map((p, i) => {
          if (p.kind === 'text') {
            return <Markdown key={`t${i}`} text={p.text} />
          }
          n += 1
          const idx = n
          const isOpen = opened.includes(idx)
          const toggle = () =>
            update($, mine, list =>
              list.includes(idx) ? list.filter(x => x !== idx) : [...list, idx],
            )
          return (
            <Box key={`f${i}`} flexDirection="column">
              <Button key={`fold${idx}`} plain onPress={toggle}>
                {`${isOpen ? '▾' : '▸'} ${p.title}`}
              </Button>
              {isOpen && (
                <Box paddingLeft={2}>
                  <Markdown key={`b${i}`} text={p.body} />
                </Box>
              )}
            </Box>
          )
        })}
      </Box>
    )
  })
}
