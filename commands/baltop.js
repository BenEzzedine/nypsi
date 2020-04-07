const { topAmount, getColor } = require("../utils.js")
const { MessageEmbed } = require("discord.js")

const cooldown = new Map()

module.exports = {
    name: "baltop",
    description: "view top users",
    category: "money",
    run: async (message, args) => {

        if (cooldown.has(message.member.id)) {
            const init = cooldown.get(message.member.id)
            const curr = new Date()
            const diff = Math.round((curr - init) / 1000)
            const time = 5 - diff

            const minutes = Math.floor(time / 60)
            const seconds = time - minutes * 60

            let remaining

            if (minutes != 0) {
                remaining = `${minutes}m${seconds}s`
            } else {
                remaining = `${seconds}s`
            }
            return message.channel.send("❌\nstill on cooldown for " + remaining );
        }

        cooldown.set(message.member.id, new Date());

        setTimeout(() => {
            cooldown.delete(message.member.id);
        }, 5000);

        let amount

        if (args.length == 0) {
            args[0] = 5
        }

        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            args[0] = 5;
        }

        amount = parseInt(args[0]);

        if (amount > 10 && message.member.user.id != "672793821850894347") amount = 10

        if (amount < 5) amount = 5

        const balTop = topAmount(message.guild, amount)

        let filtered = balTop.filter(function (el) {
            return el != null;
        });

        const color = getColor(message.member);
          
        const embed = new MessageEmbed()
            .setTitle("richest people in this server")
            .setColor(color)
            .addField("top " + filtered.length, filtered)

            .setFooter(message.member.user.tag + " | bot.tekoh.wtf")

        message.channel.send(embed).catch(() => {
            return message.channel.send("❌ \ni may be lacking permission: 'EMBED_LINKS'");
        });

    }
}