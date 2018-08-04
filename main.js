// Response for Uptime Robot
const http = require('http');
http.createServer(function(request, response)
{
	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.end('Discord bot is active now \n');
}).listen(3000);

// Discord bot implements
const discord = require('discord.js');
const client = new discord.Client();

// 諸々定数
const sovietStr = ["ソ連","soviet","タチャンカ","ﾀﾁｬﾝｶ","tachanka","国歌"];
const stopStr = ["中断","cancel","停止","stop"];

client.on('ready', message =>
{
	console.log('bot is ready!');
});

// 何らかのメッセージが送信された場合
client.on('message', message =>
{
	if(message.isMemberMentioned(client.user))
	{
		// メッセージ内にソ連国歌関連ワードが含まれていれば国歌を再生
		var isSoviet = false;
		for(var str in sovietStr){
			if(message.content.indexOf(sovietStr[str]) != -1){
				isSoviet = true;
				break;
			}
		}
		if(isSoviet){
			if(message.member.voiceChannel){
				message.member.voiceChannel.join().then( connection => {
					const dispatcher = connection.playArbitraryInput('https://upload.wikimedia.org/wikipedia/commons/d/db/Gimn_Sovetskogo_Soyuza_%281977_Vocal%29.oga');
					dispatcher.on('end', reason => {
						connection.disconnect();
					});
				})
				.catch(console.log);
			}else{
				message.reply("ソビエトロシアではリプライに入った状態でボイスチャンネルを送る！")
				return;
			}
		}

		// 中断関連ワードをリプライされた際に音声再生中の場合中断
		var isStop = false;
		for(var str in stopStr){
			if(message.content.indexOf(stopStr[str]) != -1){
				isStop = true;
				break;
			}
		}
		if(isStop == true && client.voiceConnections.size > 0){
			client.voiceConnections.first().channel.leave();
			return;
		}


		message.reply( '呼びましたか？' );
		return;		
	}
});

if(process.env.DISCORD_BOT_TOKEN == undefined)
{
	console.log('please set ENV: DISCORD_BOT_TOKEN');
	process.exit(0);
}

client.login( process.env.DISCORD_BOT_TOKEN );