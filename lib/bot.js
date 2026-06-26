const BOT_API_URL = process.env.BOT_API_URL
const BOT_API_SECRET = process.env.BOT_API_SECRET

export async function callBotApi(path, body) {
  if (!BOT_API_URL || !BOT_API_SECRET) {
    throw new Error('BOT_API_URL atau BOT_API_SECRET belum dikonfigurasi')
  }

  const res = await fetch(`${BOT_API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BOT_API_SECRET}`,
    },
    body: JSON.stringify(body),
  })

  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { message: text }
  }

  if (!res.ok) {
    throw new Error(data?.message || text || 'Bot API gagal merespons')
  }

  return data
}
