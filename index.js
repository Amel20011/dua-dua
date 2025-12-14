import makeWASocket, { useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import P from 'pino';
import handler, { newMember } from './lib/handler.js';

const { state, saveState } = useSingleFileAuthState('./auth/liviacns.json');

async function startBot() {
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({
        logger: P({ level: 'silent' }),
        auth: state,
        printQRInTerminal: true,
        version
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if(connection === 'close') {
            if(lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                console.log('[INFO] Restarting bot...');
                startBot();
            }
        } else if(connection === 'open') {
            console.log('[INFO] Bot connected successfully ✅');
        }
    });

    sock.ev.on('creds.update', saveState);

    // Pesan masuk
    sock.ev.on('messages.upsert', async (m) => {
        if(!m.messages) return;
        const msg = m.messages[0];
        if(!msg.message) return;
        handler(sock, msg);
    });

    // Member baru join
    sock.ev.on('group-participants.update', async (update) => {
        for(const participant of update.participants){
            if(update.action === 'add'){
                await newMember(sock, update.id, participant);
            }
        }
    });
}

startBot();
