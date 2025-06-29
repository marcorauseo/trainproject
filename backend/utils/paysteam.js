/**
 * Mock PaySteam gateway.
 * In produzione sostituire con chiamata HTTP fetch().
 */
async function charge({ userId, amount }) {
  console.log(`[PaySteam] Addebitati €${amount} all'utente ${userId}`);
  return true;               // sempre successo
}

module.exports = { charge };
