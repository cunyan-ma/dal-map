// Each beat defines what the map shows and what text appears in StoryPanel.
// nodeFilter: 'red' | 'white' | 'all'
// highlightCountries: array of country names to highlight (others dimmed). null = highlight all.
// autoFly: null | { center: [lat, lng], zoom, delayMs } — triggers animated flyTo after delayMs

const STORY_BEATS = [
  {
    id: 'kenya',
    nodeFilter: 'red',
    highlightCountries: ['Kenya'],
    autoFly: null,
    text: `Alex is a data worker in Nairobi, Kenya. Paid at a rate of $1.5 to $3.75 an hour, Alex, along with other folks on the team–Mofat, Bill, and more–review paragraphs of children having intercourse with their father, animals, and even rape, and label them into severities of violence.
They did not know who this work was done for, or where these paragraphs came from. All they know is they work to label data at a company called Sama.
`,
    citation: `https://www.wsj.com/podcasts/the-journal/the-hidden-workforce-that-helped-filter-violence-and-abuse-out-of-chatgpt/ffc2427f-bdd8-47b7-9a4b-27e7267cf413
`,
  },
  {
    id: 'colombia-venezuela',
    nodeFilter: 'red',
    highlightCountries: ['Colombia', 'Venezuela'],
    autoFly: null,
    text: `This is not a single occasion. In Colombia, the political refuge to the recently turmoil Venezuela, teams of data workers are assembled by companies like xxx and xxx. (cite other high-profile reporting)`,
    citation: null,
  },
  {
    id: 'origins',
    nodeFilter: 'all',
    highlightCountries: null,
    autoFly: null,
    text: `The story of data workers dates as far back as the development of machine learning. To make data legible to machines, they need to be hand-annotated by human labor, so that a machine knows what is a car, a tree, a human, child porn, or egregious violence. These tasks could be done by the company itself. However, as companies scale up and the data demand grows exponentially, this mundane manual labor is being sourced to places with cheaper labor.`,
    citation: null,
  },
  {
    id: 'southeast-asia',
    nodeFilter: 'red',
    highlightCountries: ['Philippines', 'Indonesia', 'Vietnam', 'Malaysia', 'Thailand', 'Singapore'],
    autoFly: null,
    text: `Traditionally, Southeast Asia is the biggest hub of digital outsourcing. The Philippines, for instance, has a huge IT BPO industry. The interconnectedness of the world, as a result of neoliberalism, weaved together the labor markets in the Philippines with the data demand in the West. Data annotation is a source of stable employment for Filipinos at their country's rate, while the AI companies are able to find labor at a much lower rate than normally needed.`,
    citation: null,
  },
  {
    id: 'ai-hype',
    nodeFilter: 'white',
    highlightCountries: null,
    autoFly: { center: [37.4, -122.0], zoom: 9, delayMs: 1200 },
    text: `In recent years, the AI hype has developed the industry in unprecedented levels.`,
    citation: null,
  },
]

export default STORY_BEATS
