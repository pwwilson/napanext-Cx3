#!/usr/bin/env node
import { kv } from '@vercel/kv'

const command = process.argv[2]

async function clearAll() {
  try {
    await kv.del('entries')
    console.log('✅ All entries cleared')
  } catch (e) {
    console.error('❌ Error clearing entries:', e.message)
    process.exit(1)
  }
}

async function clearLast() {
  try {
    const entries = await kv.lrange('entries', 0, -1)
    if (entries.length === 0) {
      console.log('No entries to clear')
      return
    }
    
    // Pop the last entry (which is the most recent since we LPUSH)
    await kv.lpop('entries')
    console.log(`✅ Last entry cleared (${entries.length - 1} remaining)`)
  } catch (e) {
    console.error('❌ Error clearing last entry:', e.message)
    process.exit(1)
  }
}

if (command === 'all') {
  clearAll()
} else if (command === 'last') {
  clearLast()
} else {
  console.log('Usage: node scripts/clear-entries.js [all|last]')
  console.log('  all  - Clear all entries')
  console.log('  last - Clear the most recent entry')
  process.exit(1)
}
