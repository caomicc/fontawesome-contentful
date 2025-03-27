require('dotenv').config();
const yaml = require('js-yaml');
const fs = require('fs').promises;
const path = require('path');

/**
 * @typedef {Object} Icon
 * @property {string[]} changes - Version history of the icon
 * @property {string} label - Display name of the icon
 * @property {{terms: string[]}} search - Search terms for the icon
 * @property {string[]} styles - Available styles for the icon
 * @property {string} unicode - Unicode value of the icon
 * @property {boolean} [voted] - Whether the icon has been voted on
 * @property {boolean} [private] - Whether the icon is private
 * @property {string[]} [ligatures] - Ligature combinations for the icon
 */

/**
 * Creates a TypeScript file containing FontAwesome icon data
 * @param {Object.<string, Icon>} doc - The FontAwesome icon data
 * @returns {Promise<void>}
 */
const createFontawesomeTs = async (doc) => {
	const content = `
interface Icon {
	changes: string[];
	label: string;
	search: {
		terms: string[];
	};
	styles: string[];
	unicode: string;
	voted?: boolean;
	private?: boolean;
	ligatures?: string[];
}

const faData: { [key: string]: Icon } = ${JSON.stringify(doc)};

export default faData`;

	await fs.writeFile(path.join(process.cwd(), 'src', 'fontawesome.ts'), content);
};

/**
 * Main function to fetch and process FontAwesome data
 */
const main = async () => {
	try {
		const iconDataPath = path.join(process.cwd(), 'node_modules', '@fortawesome/fontawesome-pro', 'metadata', 'icons.yml');
		const yamlContent = await fs.readFile(iconDataPath, 'utf8');
		const doc = yaml.load(yamlContent);

		await createFontawesomeTs(doc);
		console.log('Successfully generated fontawesome.ts');
	} catch (error) {
		console.error('Error processing FontAwesome data:', error);
		process.exit(1);
	}
};

main();
