#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' })
const redis = require('redis')

const command = process.argv[2]

const client = redis.createClient({
  url: process.env.REDIS_URL
})

async function clearAll() {
  try {
    await client.connect()
    await client.del('entries')
    console.log('✅ All entries cleared')
    await client.disconnect()
  } catch (e) {
    console.error('❌ Error clearing entries:', e.message || e)
    process.exit(1)
  }
}

async function clearLast() {
  try {
    await client.connect()
    const entries = await client.lRange('entries', 0, -1)
    if (entries.length === 0) {
      console.log('No entries to clear')
      await client.disconnect()
      return
    }
    
    // Pop the last entry (which is the most recent since we LPUSH)
    await client.lPop('entries')
    console.log(`✅ Last entry cleared (${entries.length - 1} remaining)`)
    await client.disconnect()
  } catch (e) {
    console.error('❌ Error clearing last entry:', e.message || e)
    process.exit(1)
  }
}

if (command === 'all') {
  clearAll()
} else if (command === 'last') {
  clearLast()
} else {
  console.log('Usage: npm run clear -- [all|last]')
  console.log('  all  - Clear all entries')
  console.log('  last - Clear the most recent entry')
  process.exit(1)
}
