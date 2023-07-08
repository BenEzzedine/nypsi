import { getInfo } from "discord-hybrid-sharding";
import { GatewayIntentBits, Options, Partials } from "discord.js";
import { NypsiClient } from "./models/Client";

const client = new NypsiClient({
  allowedMentions: {
    parse: ["users", "roles"],
  },
  sweepers: {
    messages: {
      interval: 3600,
      lifetime: 1800,
      filter: () => (msg) =>
        msg.author.id === msg.client.user.id &&
        msg.createdTimestamp > Date.now() - ms("30 minutes"),
    },
    guildMembers: {
      interval: 3600,
      filter: () => (member) => member.id !== member.client.user.id,
    },
  },
  makeCache: Options.cacheWithLimits({
    ApplicationCommandManager: 0,
    BaseGuildEmojiManager: 0,
    GuildBanManager: 0,
    GuildInviteManager: 0,
    GuildStickerManager: 0,
    GuildScheduledEventManager: 0,
    MessageManager: {
      maxSize: 50,
      keepOverLimit: (msg) =>
        msg.author.id === msg.client.user.id &&
        msg.createdTimestamp > Date.now() - ms("30 minutes"),
    },
    PresenceManager: 0,
    ReactionManager: 0,
    ReactionUserManager: 0,
    StageInstanceManager: 0,
    ThreadManager: 0,
    ThreadMemberManager: 0,
    VoiceStateManager: 0,
    GuildEmojiManager: 0,
    AutoModerationRuleManager: 0,
    GuildForumThreadManager: 0,
    GuildTextThreadManager: 0,
    UserManager: {
      maxSize: 10000,
      keepOverLimit: (user) => {
        logger.debug(`aaaa ${user.id}`);
        return user.id === user.client.user.id;
      },
    },
    GuildMemberManager: {
      maxSize: 69_420,
      keepOverLimit: (user) => user.id === user.client.user.id,
    },
  }),
  presence: {
    status: "dnd",
    activities: [
      {
        name: "loading..",
      },
    ],
  },
  rest: {
    offset: 0,
  },
  shards: getInfo().SHARD_LIST,
  shardCount: getInfo().TOTAL_SHARDS,
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Channel], // for direct messages
});

import { loadCommands } from "./utils/handlers/commandhandler";
import { loadInteractions } from "./utils/handlers/interactions";
import { logger } from "./utils/logger";
import ms = require("ms");

loadCommands();
loadInteractions();
client.loadEvents();

setTimeout(() => {
  logger.info("logging in...");
  client.login(process.env.BOT_TOKEN);
}, 500);

process.on("uncaughtException", (error) => {
  logger.error(error.message, { type: error.name, stack: error.stack });
});

process.on("unhandledRejection", (error: any) => {
  logger.error(error.message, { type: error.name, stack: error.stack });
});
