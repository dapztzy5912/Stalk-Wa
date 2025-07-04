// stalker.js
const moment = require('moment-timezone');
const PhoneNum = require('awesome-phonenumber');
const { default: makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys');
const { delay } = require('@whiskeysockets/baileys');
const fs = require('fs');

const regionNames = new Intl.DisplayNames(['id'], { type: 'region' });

const { state, saveState } = useSingleFileAuthState('./auth.json');
const sock = makeWASocket({ auth: state });
sock.ev.on('creds.update', saveState);

module.exports = async function (inputNum) {
  const num = inputNum.replace(/\D/g, '') + '@s.whatsapp.net';
  const existsCheck = await sock.onWhatsApp(num).catch(() => []);
  if (!existsCheck[0]?.exists) return { error: '🚩 Pengguna tidak ditemukan.' };

  let img = await sock.profilePictureUrl(num, 'image').catch(() => 'https://i.ibb.co/Ld3Z6xV/avatar-contact.png');
  let bio = await sock.fetchStatus(num).catch(() => null);
  let business = await sock.getBusinessProfile(num).catch(() => null);

  let name = await sock.getName(num).catch(() => 'Tidak diketahui');
  let format = new PhoneNum(`+${num.split('@')[0]}`);
  let country = regionNames.of(format.getRegionCode('international')) || 'Tidak diketahui';

  let htki = '–––––––––––––––––––––––––––––––';
  let htka = '–––––––––––––––––––––––––––––––';

  let wea = `${htki} Stalking WhatsApp ${htka}\n\n` +
    `*° Negara :* ${country.toUpperCase()}\n` +
    `*° Nama :* ${name}\n` +
    `*° Format Nomor :* ${format.getNumber('international')}\n` +
    `*° Url Api :* wa.me/${num.split('@')[0]}\n` +
    `*° Sebutan :* @${num.split('@')[0]}\n` +
    `*° Status :* ${bio?.status || '-'}\n` +
    `*° Tanggal Status :* ${bio?.setAt ? moment(bio.setAt).locale('id').format('LL') : '-'}`;

  if (business) {
    wea += `\n\n${htki} Stalking Bisnis WhatsApp ${htka}\n\n` +
      `*° BusinessId :* ${business.wid}\n` +
      `*° Website :* ${business.website || '-'}\n` +
      `*° Email :* ${business.email || '-'}\n` +
      `*° Kategori :* ${business.category || '-'}\n` +
      `*° Alamat :* ${business.address || '-'}\n` +
      `*° Zona Waktu :* ${business.business_hours?.timezone || '-'}\n` +
      `*° Deskripsi :* ${business.description || '-'}`;
  } else {
    wea += `\n\n*Akun WhatsApp Standar*`;
  }

  return { text: wea, img };
};
