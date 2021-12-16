const { MessageEmbed } = require("discord.js");
const Canvas = require('canvas');

const accessories = {
  hats: [
    '920528133449478174', '920528133361397892', '920528133441064980',
    '920528133474627594', '920528133445287946', '920528133449470002',
    '920528133353005088', '920529792766455828'
  ],
  faces: [
    "920939466313596928", "920939466368118784", "920939466623975455", 
    "920939466296815626", "920939466347118652"
  ],
  arms: [
    "920950461274665000", "920950461358559232", 
    "920950461283061831", "920950461316620318",
    "920950461316620308", "920950461656358962",
  ],
}
accessories['left-arm'] = accessories.arms;
accessories['right-arm'] = accessories.arms;

const generateComponents = (type) => {
  if(!accessories.hasOwnProperty(type)) throw new Error('Invalid accessory type');
  const accessory = accessories[type];
  const row = (ri) => Math.ceil(accessory.length / 5) === 1 ? accessory.length 
    : (Math.ceil(accessory.length / 5) === ri + 1) ? accessory.length - (Math.ceil(accessory.length / 5) - 1) * 5 : 5;
  let itemId = -1;


  return Array.from({ length: Math.ceil(accessory.length / 5) }, (_, ri) => ({
    type: 1,
    components: Array.from({ length: row(ri) }, (_, i) => {
      itemId++;
      return { type: 2, style: 2, emoji: { id: accessory[itemId] }, customId: `snowman_${type}_${itemId}` }
    })
  }))
}

module.exports = {
  name: "snowman",
  description: "Play a quick game of match up using buttons.",
  category: "games",
  options: [],
  run: async (ctx) => {
    let snowmanCode = {};
    const embed = (type) => new MessageEmbed()
      .setTitle(':snowman: Decorate Your Own Snowman').setColor('#88C9F9')
      .setDescription(`${type == 'finish' ? "This is your completed snowman" : `Currently Editing: ${type.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())}`}`)
      .setImage(`https://dev.japi.rest/snowman/v1/generate?selections=${Object.values(snowmanCode).join('-')}`)
      .setFooter('Powered by JAPI.rest by DanPlayz#7757');
    const msg = await ctx.interaction.editReply({
      embeds: [embed('face')], components: generateComponents('faces')
    })

    const collector = msg.createMessageComponentCollector({
      filter: (inter) => inter.user.id === ctx.interaction.user.id && inter.customId.startsWith('snowman_'),
      time: 120_000
    });

    collector.on('end', (_, reason) => {
      if(reason === 'completed') return;
      msg.edit({
        embeds: [new MessageEmbed()
          .setTitle('Time\'s up!')
          .setColor('RED')
          .setDescription('You didn\'t finish the decorating in time.\n\nYou can try again by using the command again.')
        ],
        components: [],
      })
    });

    const types = ['faces', 'hats', 'left-arm', 'right-arm', 'scarf',];
    let currentType = 0;
    collector.on('collect', (interaction) => {
      collector.resetTimer();
      const [type, id] = interaction.customId.split('_').slice(1);
      snowmanCode[type] = id;
      currentType++;
      if(currentType === types.length - 1) {
        interaction.update({ embeds: [embed('finish')], components: [] })
        collector.stop('completed');
        return;
      }
      interaction.update({
        embeds: [embed(types[currentType])],
        components: generateComponents(types[currentType]),
      })
    })

    
  },
};
