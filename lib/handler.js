import menu from './menu.js';

// Handler pesan masuk
export default async function handler(sock, msg) {
    const from = msg.key.remoteJid;
    const type = Object.keys(msg.message)[0];
    const userNumber = msg.key.participant || msg.key.remoteJid;

    // Command .menu
    if(type === 'conversation' && msg.message.conversation.startsWith('.menu')) {
        const buttons = [
            { buttonId: 'owner', buttonText: { displayText: 'Owner 💫' }, type: 1 },
            { buttonId: 'daftar', buttonText: { displayText: 'Daftar 🌸' }, type: 1 },
            { buttonId: 'donasi', buttonText: { displayText: 'Donasi 💗' }, type: 1 }
        ];

        await sock.sendMessage(from, {
            text: menu.allMenu('@'+userNumber.split('@')[0]),
            footer: 'Astheric Bot 🌷',
            buttons,
            headerType: 1
        });
    }

    // Handle tombol klik
    if(type === 'buttonsResponseMessage') {
        const buttonId = msg.message.buttonsResponseMessage.selectedButtonId;
        if(buttonId === 'daftar') {
            await sock.sendMessage(from, { text: '🌸 Kamu berhasil mendaftar di sistem LIVIACNS 💗' });
        } else if(buttonId === 'owner') {
            await sock.sendMessage(from, { text: '💫 Owner: Liviaa 🌷' });
        } else if(buttonId === 'donasi') {
            await sock.sendMessage(from, { text: '💖 Support bot via donasi 🌸' });
        }
    }
}

// Event member baru join
export async function newMember(sock, groupId, userNumber) {
    await sock.sendMessage(groupId, {
        text: `✨ Hello @${userNumber.split('@')[0]} 💖\nAku Liviaa 🌷 yang akan menyambutmu sekarang 💗\nKlik salah satu tombol di bawah untuk daftar atau hubungi owner 🌸`,
        mentions: [userNumber],
        footer: 'Liviacns Bot 🌷',
        buttons: [
            { buttonId: 'daftar', buttonText: { displayText: 'Daftar 🌸' }, type: 1 },
            { buttonId: 'owner', buttonText: { displayText: 'Owner 💫' }, type: 1 }
        ],
        headerType: 1
    });
}
