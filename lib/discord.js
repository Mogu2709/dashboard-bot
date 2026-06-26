export async function sendToTugas(embed) {
  await kirimWebhook(process.env.DISCORD_WEBHOOK_TUGAS, embed)
}

export async function sendToJadwal(embed) {
  await kirimWebhook(process.env.DISCORD_WEBHOOK_JADWAL, embed)
}

export async function sendToAbsensi(embed) {
  await kirimWebhook(process.env.DISCORD_WEBHOOK_ABSENSI, embed)
}

async function kirimWebhook(url, embed) {
  if (!url) return
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'Dashboard Kelas',
      avatar_url: 'https://cdn-icons-png.flaticon.com/512/2541/2541988.png',
      embeds: [embed],
    }),
  })
}