// Response for Uptime Robot
const http = require('http');
http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Discord bot is active now \n');
}).listen(3000);

// Discord bot implements
const discord = require('discord.js');
const client = new discord.Client();
const ytdl = require('ytdl-core');

// 諸々定数
const sovietStr = ['ソ連', 'soviet', 'タチャンカ', 'ﾀﾁｬﾝｶ', 'tachanka', '国歌'];
const gonggyeokStr = ['コンギョ','ｺﾝｷﾞｮ','攻撃','kongyo','gonggyeok'];
const stopStr = ['中断', 'cancel', '停止', 'stop'];

const streamOption = {seek:2};

// 音声ストリーム
var soundStream;

client.on('ready', message => {
    console.log('bot is ready!');
});

// 何らかのメッセージが送信された場合
client.on('message', message => {
    if (message.isMemberMentioned(client.user)) {
        // メッセージ内にソ連国歌関連ワードが含まれていれば国歌を再生
        const isSoviet = checkMessageContainsKey(message.content, sovietStr);
        if (isSoviet) {
            if (message.member.voiceChannel) {
                message.member.voiceChannel.join().then(connection => {
                    soundStream = null;
                    soundStream = connection.playArbitraryInput('https://cdn.glitch.com/b140d1af-ee8d-4d2e-a23b-d97fefe99390%2FGimn_Sovetskogo_Soyuza_(1977_Vocal).oga?1533476649744',streamOption);
                    soundStream.on('end', reason => {
                        message.reply('音声再生終了');
                        connection.disconnect();
                    });
                })
                    .catch(console.log);
            } else {
                message.reply('ソビエトロシアではリプライに入った状態でボイスチャンネルを送る！');
                return;
            }
        }

        const isGonggyeok = checkMessageContainsKey(message.content, gonggyeokStr);
        if (isGonggyeok) {
            if (message.member.voiceChannel) {
                message.member.voiceChannel.join().then(connection => {
                    message.reply('コンギョ');
                    const soundData = ytdl('https://www.youtube.com/watch?v=Xa47yIVUaMo', {filter: 'audioonly'});
                    soundStream = connection.playStream(soundData);
                    soundStream.on('end', reason => {
                        message.reply('音声再生終了');
                        connection.disconnect();
                    });
                })
                    .catch(console.log);
            } else {
                message.reply('白頭山の雷のごとくボイスチャンネルに入ってリプライを送る');
                return;
            }
        }

        // 中断関連ワードをリプライされた際に音声再生中の場合中断
        let isStop = checkMessageContainsKey(message.content, stopStr);
        message.reply(client.voiceConnections.size);
        if (isStop == true && client.voiceConnections.size > 0) {
            if(soundStream != null){
                soundStream.end();
            }
            client.voiceConnections.first().channel.leave();
            return;
        }


        message.reply('呼びましたか？');
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