const toys = [
  "teddy bear",
  "can of food",
  "football",
  "gaming controller",
  "tea pot",
  "new phone",
  "new tablet",
  "new puppy",
];

module.exports = {
  name: "guess-the-gift",
  description: "Try to guess what's inside the gift!",
  category: "games",
  run: async (ctx) => {
    const selection = toys[Math.floor(Math.random() * toys.length)];

    const msg = await ctx.interaction.followUp({
      content: `Try to guess what's inside this gift!\n\nChoose from ${toys
        .map((x) => `\`${x}\``)
        .join(" | ")}\nYou have **30 seconds**`,
    });
    const collector = msg.channel.createMessageCollector({
      filter: (m) => m.author.id === ctx.interaction.user.id,
      time: 30000,
    });

    collector.on("collect", (message) => {
      if (message.content.toLowerCase() === selection) {
        ctx.interaction.followUp("You guessed the present good job!");
        return collector.stop();
      }

      return collector.stop("fail");
    });

    collector.on("end", (_, reason) => {
      if (reason === "fail")
        return ctx.interaction.followUp(
          `You didn't name the present correctly it was \`${selection}\`.`
        );

      return ctx.interaction.followUp(
        `You ran out of time... The correct present was \`${selection}\`.`
      );
    });
  },
};
