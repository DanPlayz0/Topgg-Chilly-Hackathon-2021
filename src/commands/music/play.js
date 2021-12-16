const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const ytdl = require("ytdl-core");

module.exports = {
  name: "play",
  description: "Play some Xmas music!",
  category: "music",
  options: [
    {
      name: "type",
      description: "The type of Xmas music. Pop or classic its up to you!",
      type: "STRING",
      required: true,
      choices: [
        { name: "Pop", value: "pop" },
        { name: "Classic", value: "classic" },
      ],
    },
  ],
  run: async (ctx) => {
    if (!ctx.interaction.member.voice.channel)
      return ctx.interaction.followUp("Please join a voice channel.");

    const channel = ctx.interaction.member.voice.channel;

    try {
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: ctx.interaction.guild.id,
        adapterCreator: ctx.interaction.guild.voiceAdapterCreator,
      });

      const player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause,
        },
      });

      player.on(AudioPlayerStatus.Idle, () => connection.destroy());

      const resource = createAudioResource(
        ytdl(
          ctx.args[0].value === "pop"
            ? "https://www.youtube.com/watch?v=dXItrIerZdU&t=53s"
            : "https://www.youtube.com/watch?v=dfTCObc5BuE&t=5373s",
          {
            highWaterMark: 1 << 25,
            filter: "audio",
            quality: "highestaudio",
          }
        )
      );

      player.play(resource);
      connection.subscribe(player);

      ctx.client.player = connection;

      ctx.interaction.followUp("Jingle bells, jingle bells rock!");
    } catch {
      return ctx.interaction.followUp(
        "Sorry there was an error please try again later."
      );
    }
  },
};
