const { MessageEmbed } = require("discord.js");
const Canvas = require("canvas");
const duration = require("humanize-duration");

const treeKits = {
  easy: {
    imageSize: 600,
    minMax: [3, 5],
    guessAmt: 6,
    normalTree: "https://discord.mx/Fs9SnNMPsy.png",
    presentTree: "https://discord.mx/uKjlwMQAIj.png",
  },
  normal: {
    imageSize: 700,
    minMax: [8, 13],
    guessAmt: 3,
    normalTree: "https://discord.mx/QpOVJ3BBKu.png",
    presentTree: "https://discord.mx/4Lma68S3Ov.png",
  },
  hard: {
    imageSize: 400,
    minMax: [14, 25],
    guessAmt: 1,
    normalTree: "https://discord.mx/RyJ8RIJ8Bq.png",
    presentTree: "https://discord.mx/Ocu2N0jTum.png",
  },
};

module.exports = {
  name: "presentfinder",
  description: "Guess which tree Santa has hidden the present behind.",
  category: "games",
  options: [
    {
      name: "difficulty",
      description: "The difficulty of the game.",
      type: "STRING",
      required: true,
      choices: [
        { name: "Easy", value: "easy" },
        { name: "Normal", value: "normal" },
        { name: "Hard", value: "hard" },
      ],
    },
  ],
  run: async (ctx) => {
    const randInt = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;
    const difficulty =
      ctx.interaction.options.getString("difficulty") || "normal";
    const { imageSize, minMax, normalTree, presentTree, guessAmt } =
      treeKits[difficulty];

    let trees = randInt(...minMax);
    if (trees > 25) trees = 25;
    if (trees < 3) trees = 3;

    const canvas = Canvas.createCanvas(
      (trees < 5 ? trees : 5) * imageSize,
      Math.ceil(trees / 5) * imageSize
    );
    const ctx2 = canvas.getContext("2d");
    const [ntree, ptree] = await Promise.all([
      Canvas.loadImage(normalTree),
      Canvas.loadImage(presentTree),
    ]);

    const presentTreeNum = Math.floor(Math.random() * trees) + 1;

    for (let i = 1, y = 0, x = 1; i <= trees; i++) {
      ctx2.drawImage(
        presentTreeNum === i ? ptree : ntree,
        x,
        y,
        imageSize,
        imageSize
      );
      if (i % 5 === 0) (y += imageSize), (x = 1);
      else x += imageSize;
    }

    const embed = new MessageEmbed()
      .setTitle("<a:Emoji_Present:920536936446316614> Find the Presents")
      .setColor("#88C9F9")
      .setDescription("Which Christmas tree is the present behind?")
      .setImage(`attachment://presentfinder.png`)
      .setFooter("You only have 2 minutes to guess.");
    const msg = await ctx.interaction.editReply({
      embeds: [embed],
      files: [{ attachment: canvas.toBuffer(), name: "presentfinder.png" }],
      components: Array.from({ length: Math.ceil(trees / 5) }, (_, ri) => ({
        type: 1,
        components: Array.from(
          {
            length:
              Math.ceil(trees / 5) === 1
                ? trees
                : Math.ceil(trees / 5) === ri + 1
                ? trees - (Math.ceil(trees / 5) - 1) * 5
                : 5,
          },
          (_, i) => ({
            type: 2,
            style: 2,
            emoji: { name: "🎄" },
            customId: `presentfinder_${ri}_${i + 1}`,
          })
        ).slice(0, 5),
      })),
    });

    const timeLeft = Date.now() + 120000;
    const collector = msg.createMessageComponentCollector({
      filter: (inter) =>
        inter.user.id === ctx.interaction.user.id &&
        inter.customId.startsWith("presentfinder_"),
      time: 120_000,
    });
    let triesLeft = guessAmt;

    collector.on("end", (_, reason) => {
      let embed2 = new MessageEmbed().setTitle("uhh???");
      if (reason === "fail")
        embed2 = new MessageEmbed()
          .setTitle("Yikes")
          .setColor("RED")
          .setDescription(
            `You ran out of attempts. The correct answer was Tree #${presentTreeNum}.\n\nWant to play again? Run the command again!`
          );
      else if (reason === "success")
        embed2 = new MessageEmbed()
          .setTitle("Nice job")
          .setColor("GREEN")
          .setDescription(
            `You successfully finished with ${triesLeft} attempt${
              triesLeft == 1 ? "" : "s"
            } left`
          );

      msg.edit({
        embeds: [embed, embed2],
        components: [],
      });
    });

    let aNumberThatIsVeryLongBecauseItIsOnlyUsedOnce = 0;
    const array = Array.from({ length: 5 }, (_, ri) =>
      Array.from(
        { length: 5 },
        (_, i) => aNumberThatIsVeryLongBecauseItIsOnlyUsedOnce++
      )
    );

    collector.on("collect", (interaction) => {
      triesLeft -= 1;
      const [ri, ti] = interaction.customId.split("_").slice(1);

      if (parseInt(array[ri][ti]) === presentTreeNum) {
        interaction.deferUpdate();
        collector.stop("success");
      } else if (triesLeft != 0) {
        interaction.deferUpdate();
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Try Again")
              .setColor("ORANGE")
              .setDescription(
                `You still have ${triesLeft} attempts and ${duration(
                  Math.floor(Date.now() - timeLeft)
                )} to guess the correct one.`
              ),
          ],
          ephemeral: true,
        });
      } else {
        interaction.deferUpdate();
        collector.stop("fail");
      }
    });
  },
};
