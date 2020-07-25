// Response for Uptime Robot
const http = require('http');
http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Discord bot is active now !!!! \n');
}).listen(3000);

// Discord bot implements
const discord = require('discord.js');
const client = new discord.Client();
const ytdl = require('ytdl-core');

// 諸々定数
const sovietStr = ['ソ連', 'soviet', 'タチャンカ', 'ﾀﾁｬﾝｶ', 'tachanka', '国歌'];
const gonggyeokStr = ['コンギョ', 'ｺﾝｷﾞｮ', '攻撃', 'kongyo', 'gonggyeok'];
const gonggyeokLiveStr = ['コンギョ2', 'ｺﾝｷﾞｮ2', 'コンギョライブ', 'コンギョlive'];
const stopStr = ['中断', 'cancel', '停止', 'stop'];

const streamOption = { seek: 0, volume: 0.8 };

// 音声ストリーム
var soundStream;

client.on('ready', () => {
    console.log('bot is ready!');
});

// 何らかのメッセージが送信された場合
try {
    client.on('message', message => {
        console.log(message.member)
        console.log(message.member.voice.channel)
        console.log(message.mentions.users)
        const mentionsOptions = { ignoreEveryone: true }
        if (message.mentions.has(client.user.id, mentionsOptions)) {
            // メッセージ内にソ連国歌関連ワードが含まれていれば国歌を再生
            const isSoviet = checkMessageContainsKey(message.content, sovietStr);
            if (isSoviet) {
                if (message.member.voice.channel) {
                    message.member.voice.channel.join()
                        .then(connection => {
                            soundStream = null;
                            soundStream = connection.play('https://cdn.glitch.com/b140d1af-ee8d-4d2e-a23b-d97fefe99390%2FGimn_Sovetskogo_Soyuza_(1977_Vocal).oga?1533476649744', streamOption);
                            soundStream.on('end', () => {
                                message.reply('音声再生終了');
                                connection.disconnect();
                            });
                        })
                        .catch(console.log);
                    return;
                } else {
                    message.reply('ソビエトロシアではリプライに入った状態でボイスチャンネルを送る！');
                    return;
                }
            }

            const isGonggyeLive = checkMessageContainsKey(message.content, gonggyeokLiveStr);
            if (isGonggyeLive) {
                if (message.member.voice.channel) {
                    message.member.voice.channel.join()
                        .then(connection => {
                            message.reply('白頭山の稲妻のように再生');
                            soundStream = connection.play('https://cdn.glitch.com/b140d1af-ee8d-4d2e-a23b-d97fefe99390%2Fkongyo2.mp3?v=1595657007751', streamOption);
                            soundStream.on('end', reason => {
                                message.reply('音声再生終了');
                                connection.disconnect();
                            });
                        }).catch(console.log);
                    return;
                } else {
                    message.reply('白頭山の雷のごとくボイスチャンネルに入ってリプライを送る');
                    return;
                }
            }
            
            const isGonggyeok = checkMessageContainsKey(message.content, gonggyeokStr);
            if (isGonggyeok) {
                if (message.member.voice.channel) {
                    message.member.voice.channel.join()
                        .then(connection => {
                            message.reply('白頭山の稲妻のように再生');
                            soundStream = connection.play('https://cdn.glitch.com/b140d1af-ee8d-4d2e-a23b-d97fefe99390%2F%E3%82%B3%E3%83%B3%E3%82%AE%E3%83%A71.mp3?v=1595657219153', streamOption);
                            soundStream.on('end', reason => {
                                message.reply('音声再生終了');
                                connection.disconnect();
                            });
                        }).catch(console.log);
                    return;
                } else {
                    message.reply('白頭山の雷のごとくボイスチャンネルに入ってリプライを送る');
                    return;
                }
            }

            // 中断関連ワードをリプライされた際に音声再生中の場合中断
            let isStop = checkMessageContainsKey(message.content, stopStr);
            if (isStop == true && client.voice.connections.size > 0) {
                if (soundStream != null) {
                    message.reply('ストリーム中断');
                    soundStream.end();
                    soundStream = null;
                }
                client.voice.connections.first().channel.leave();
                return;
            }

            message.reply('コンギョ / ソ連 を指定してください');
            return;
        }
    });

    if (process.env.DISCORD_BOT_TOKEN == undefined) {
        console.log('please set ENV: DISCORD_BOT_TOKEN');
        process.exit(0);
    }

    client.login(process.env.DISCORD_BOT_TOKEN);

    // メッセージ内にキーワードが含まれているかをチェック（戻り値bool）
    function checkMessageContainsKey(message, keywords) {
        for (let str in keywords) {
            if (message.indexOf(keywords[str]) != -1) {
                return true;
            }
        }
        return false;
    }
} catch (error) {
    console.log(error)
}