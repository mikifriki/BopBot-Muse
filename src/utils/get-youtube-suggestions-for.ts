import {APIApplicationCommandOptionChoice} from 'discord-api-types/v10';
import got from 'got';

const getuggestions = async (query: string): Promise<string[]> => {
  const [_, suggestions] = await got('https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=', {
    searchParams: {
      client: 'firefox',
      ds: 'yt',
      q: query,
    },
  }).json<[string, string[]]>();

  return suggestions;
};

const getYouTubeSuggestionsFor = async (query: string, limit = 10): Promise<APIApplicationCommandOptionChoice[]> => {
  const [youtubeSuggestions] = await Promise.all([
    getuggestions(query),
  ]);

  const suggestions: APIApplicationCommandOptionChoice[] = [];

  suggestions.push(
    ...youtubeSuggestions
      .slice(0, 10)
      .map(suggestion => ({
        name: `YouTube: ${suggestion}`,
        value: suggestion,
      }),
      ));

  return suggestions;
};

export default getYouTubeSuggestionsFor;
