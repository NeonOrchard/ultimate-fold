import { describe, expect, test } from 'claude-code/testing'

const TEXT = [
  'Short answer here.',
  '',
  '::: fold Why this happened',
  'The hidden detail.',
  ':::',
].join('\n')

const MSG = {
  component: 'AssistantMessage',
  requestId: 'msg-1',
  props: { text: TEXT, isFirstOfReply: true },
} as const

describe('ultimate-fold', () => {
  test('a fold starts closed and opens on click', async $ => {
    for (const surface of ['terminal', 'desktop'] as const) {
      const ui = await $.ui.mount({ plugin: 'ultimate-fold', surface, ...MSG })
      expect((await ui.find({ key: 'fold0' }))?.text).toBe('▸ Why this happened')
      expect(await ui.find({ key: 'b1' })).toBeUndefined()

      await ui.press({ key: 'fold0' })
      expect((await ui.find({ key: 'fold0' }))?.text).toBe('▾ Why this happened')
      expect(await ui.find({ key: 'b1' })).toBeDefined()

      await ui.press({ key: 'fold0' })
      expect(await ui.find({ key: 'b1' })).toBeUndefined()
      await ui.unmount()
    }
  })
})
