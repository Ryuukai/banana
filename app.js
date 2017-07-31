const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require("ytdl-core");
const settings = require("./settings.json");

client.login(settings.token);
client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));
client.on("ready", () => {
  console.log("Bot is up and running!");
});

const clean = text => {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
  return text;
};

client.on("message", message => {
  const args = message.content.split(" ").slice(1);
  if(message.author.bot === true) return;
  if(message.channel.type === "dm") return;
  client.channels.get("340144641879834627").send({embed:{
    title: "Log Entry",
    description: "Message Log",
    color: 25,
    fields: [
      {
        name: "Guild Name: ",
        value: message.guild.name,
        inline: true
      },
      {
        name: "Guild ID: ",
        value: message.guild.id,
        inline: true
      },
      {
        name: "Channel Name: ",
        value: message.channel.name,
        inline: true
      },
      {
        name: "Channel ID: ",
        value: message.channel.id,
        inline: true
      },
      {
        name: "Author Name: ",
        value: message.author.tag,
        inline: true
      },
      {
        name: "Author ID: ",
        value: message.author.id,
        inline: true
      },
      {
        name: "Message ID: ",
        value: message.id,
        inline: true
      },
      {
        name: "Content: ",
        value: message.content,
        inline: true
      },
    ],
    footer: {
      icon_url: message.author.avatarURL,
      name: "Avatar"
    },
    timestamp: new Date()
  }}).catch(console.error);
  if(message.content.startsWith(settings.prefix + "ping")) {
    message.channel.send(`pong! \`${Math.floor(client.ping)}\` ms `);
  }

  if (message.content.startsWith(settings.prefix + "eval")) {
    if(message.author.id !== settings.ownerID) return;
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }

  if (message.content.startsWith(settings.prefix + "honk")) {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.reply("Join a voice channel, dumbo");
    voiceChannel.join()
    .then(connection => {
      const dispatcher = connection.playFile("./honk.mp3");
      dispatcher.on("end", () => voiceChannel.leave());
    })
    .catch(console.error);
  }

  if (message.content.startsWith(settings.prefix + "allahuakbar") && message.author.id === "110076057167618048") {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.reply("Join a voice channel, dumbo");
    voiceChannel.join()
    .then(connection => {
      const dispatcher = connection.playFile("./allahuakbar.mp3");
      dispatcher.on("end", () => voiceChannel.leave());
    })
    .catch(console.error);
  }

  if(message.content.startsWith(settings.prefix + "play ")) {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.reply("Join a voice channel, dumbo");
    let url = message.content.split(" ").slice(1).join(" ");
    voiceChannel.join()
    .then(connection => {
      const stream = ytdl(url, {audioonly: true});
      const dispatcher = connection.playStream(stream);
      dispatcher.on("end", () => voiceChannel.leave());
    })
    .catch(console.error);
  }

  if(message.content.startsWith(settings.prefix + "help")) {
    message.channel.send(settings.commands);
  }

});




//login with musicbot token : MjU0NDk0ODQxMjAxNzU0MTEy.DFs5YQ.YolLxYXi7-MCoXS3uYmcmVzV8Q4
//login with banana token : MzM5ODQ1NzEwNTc5MjM2ODY1.DFp5gA.KlnF0hCkz_zVsXKShmXJzdRrN0o
//name of guilds:  +eval var a = client.guilds.array(), i; for(i = 0; i <= a.length; i++ ) {  message.channel.send(a[i].name); }
//total members: +eval var a = client.guilds.array(), i, total = 0; for(i in a) { total = total + a[i].memberCount } message.channel.send(total);
//total channels: +eval var a = client.guilds.array(); for( i in a ) { a[i] //unfinished
//send message to a general textch of a guild: +eval client.guilds.get("guild_id").defaultChannel.send("hello!")
//embed style total serverinfo : +eval message.channel.send({embed: { description : `${client.guilds.map(g => `Name:  ${g.name} || Owner: ${g.owner.user.tag} || Members: ${g.memberCount}`)}`}})
