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

client.on('ready', message =>
{
	console.log('bot is ready!');
});

// 何らかのメッセージが送受された場合
client.on('message', message =>
{
	if(message.isMemberMentioned(client.user))
	{
		if(message.member.voiceChannel){
			message.member.voiceChannel.join().then( connection => {
				const dispatcher = connection.playArbitraryInput('https://upload.wikimedia.org/wikipedia/commons/d/db/Gimn_Sovetskogo_Soyuza_%281977_Vocal%29.oga');
				dispatcher.on('end', reason => {
					connection.disconnect();
				});
			})
			.catch(console.log);
		}else{
			message.reply( '呼びましたか？' );
			return;
		}
	}

});

if(process.env.DISCORD_BOT_TOKEN == undefined)
{
	console.log('please set ENV: DISCORD_BOT_TOKEN');
	process.exit(0);
}

client.login( process.env.DISCORD_BOT_TOKEN );