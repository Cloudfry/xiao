const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');

module.exports = class RecipeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'recipe',
			aliases: ['recipe-puppy'],
			group: 'search',
			memberName: 'recipe',
			description: 'Searches for recipes based on your query.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Recipe Puppy',
					url: 'http://www.recipepuppy.com/',
					reason: 'API',
					reasonURL: 'http://www.recipepuppy.com/about/api/'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What recipe would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { text } = await request
				.get('http://www.recipepuppy.com/api/')
				.query({ q: query });
			const body = JSON.parse(text);
			if (!body.results.length) return msg.say('Could not find any results.');
			const recipe = body.results[Math.floor(Math.random() * body.results.length)];
			const embed = new MessageEmbed()
				.setAuthor('Recipe Puppy', 'https://i.imgur.com/lT94snh.png', 'http://www.recipepuppy.com/')
				.setColor(0xC20000)
				.setURL(recipe.href)
				.setTitle(recipe.title)
				.setDescription(`**Ingredients:** ${recipe.ingredients}`)
				.setThumbnail(recipe.thumbnail);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 500) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
