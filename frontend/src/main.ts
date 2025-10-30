import './styles.css'
import { initApp } from './app'

// run a quick self-test and initialize UI
import crypto from './crypto'

(async () => {
  try {
    const res = await crypto.selfTest()
    // eslint-disable-next-line no-console
    console.log('crypto selfTest:', res)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('crypto selfTest failed', e)
  }
  initApp()
})()
