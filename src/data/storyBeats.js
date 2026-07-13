// Each beat defines what the map shows and what text appears in StoryPanel.
// nodeFilter: 'red' | 'white' | 'white+orange' | 'all'
// highlightCountries: array of country names to highlight (others dimmed). null = highlight all.
// autoFly: null | { center: [lat, lng], zoom, delayMs } — triggers animated flyTo after delayMs
// focusPlatform: null | platform name — highlights that platform's node plus its
//   connected worker and customer nodes (everything else dimmed) and draws its edges
// citations: array of URLs, numbered [1], [2], ... in the order listed. Write [1]
//   anywhere in the text to render an in-text superscript link to citations[0];
//   the full numbered list also appears under the beat text.
// image: null | { src, alt, caption, position, width, rotate } — a photo that
//   floats over the map (outside the story panel) while the beat is shown.
//   src:      path under public/, e.g. 'story/alex.jpg' for public/story/alex.jpg
//   position: CSS offsets placing it on a node-free part of the map,
//             e.g. { bottom: '10%', right: '6%' } (the default) or
//             { top: '12%', left: '45%' }. Percentages are of the map area.
//   width:    px, default 240
//   rotate:   degrees of tilt, default -2 (set 0 for straight)

const STORY_BEATS = [
  // Beat 1: red nodes in Kenya, worldview
  {
    id: 'kenya',
    nodeFilter: 'red',
    highlightCountries: ['Kenya'],
    autoFly: null,
    focusPlatform: null,
    image: null,
    text: `Alex is a data worker in Nairobi, Kenya. Paid at a rate of $1.5 to $3.75 an hour, Alex and his team would review paragraphs of incestual intercourse and child rape, and label them into severities of violence. They did not know who this work was done for, or where these paragraphs came from. All they know is that they work to label data at a company called Sama.`,
    citations: [
      'https://www.wsj.com/podcasts/the-journal/the-hidden-workforce-that-helped-filter-violence-and-abuse-out-of-chatgpt/ffc2427f-bdd8-47b7-9a4b-27e7267cf413',
    ],
  },
  // Beat 3: all nodes, worldview
  {
    id: 'origins',
    nodeFilter: 'all',
    highlightCountries: null,
    autoFly: null,
    focusPlatform: null,
    image: null,
    text: `The story of data workers dates as far back as the development of machine learning. Data annotation and labeling (DAL) is the process of making data legible to machines–that this is a tree, this is a car, this is a dog, and this is graphically violent content. This work is often repetitive and demanded in large quantities. As a result, data labeling becomes outsourced labor.`,
    citations: [],
  },
  // Beat 4: zoom into South + Southeast Asia
  {
    id: 'south-southeast-asia',
    nodeFilter: 'red',
    highlightCountries: ['India', 'Nepal', 'Philippines', 'Cambodia', 'Laos', 'Malaysia', 'Thailand', 'Singapore'],
    autoFly: { center: [15, 98], zoom: 4, delayMs: 1200 },
    focusPlatform: null,
    image: null,
    text: `The history of outsourcing business parallels the rise of neoliberalism in the 1980s. As global capitalism grew, companies needed to cut down costs by seeking out cheaper labor. This labor is often from the global south. These countries just earned their independence from decades of colonial or semi-colonial rule and welcomed economic opportunities for development. They are the perfect demographic for data work.

India and the Philippines are the two largest IT BPO markets in the world. These countries share a colonial history that fostered a large English-speaking population. Whereas the Philippines was the “call center capital of the world”, India is an IT powerhouse given its engineering talent pool. When DAL demand rose, these countries naturally took the work.`,
    citations: [
      'https://scm.ncsu.edu/scm-articles/article/a-brief-history-of-outsourcing',
    ],
  },
  // Beat 5: white + yellow nodes in Silicon Valley, zoom in
  {
    id: 'ai-hype',
    nodeFilter: 'white+orange',
    highlightCountries: null,
    autoFly: { center: [37.4, -122.0], zoom: 9, delayMs: 1200 },
    focusPlatform: null,
    image: null,
    text: `The AI hype in recent years expanded the DAL industry to unprecedented levels. Since the rise of autonomous vehicles in 2015, venture capital-backed startups like Scale AI, which specialized in data labeling, have built billion-dollar businesses. This demand didn’t come from a vacuum. AI startups, concentrated in Silicon Valley, surged after the launch of ChatGPT in 2022. AI models not only needed exponentially more training data. To ensure that the model cannot produce violent material or childporn, the models need to identify what is violent, and what is assult, and what is hate speech. Data labeling is no longer about assigning words to pictures. It is about cataloging the most gortesque corners of the internet into degrees of severities, manually judged by human workers who read violent passage after passage.`,
    citations: [],
  },
  // Beat 6: show Sama node + its relationship to other platform nodes, worldview
  {
    id: 'sama',
    nodeFilter: 'all',
    highlightCountries: null,
    autoFly: null,
    focusPlatform: 'Sama',
    image: null,
    text: `Sama, the DAL company that employed Alex, signed a $230,000 contracts with OpenAI. It previously worked on content moderation for Meta. A Times investigation by Billy Perrigo revealed the violent and graphic content that Sama workers moderated–mental health struggles after watching suicide videos were left unattended. Nearly two hundered workers were unlawfully dismissed for attempting to unionzie. This all happens while Sama speaks of its work as “impact sourcing”, which creates stable employment and economic opportunities for marginalized communities.`,
    citations: [
      'https://time.com/6147458/facebook-africa-content-moderation-employee-treatment/',
      'https://www.sama.com/impact',
    ],
  },
  // Beat 7: zoom into Kenya and Uganda
  {
    id: 'kenya-uganda',
    nodeFilter: 'red',
    highlightCountries: ['Kenya', 'Uganda'],
    autoFly: { center: [1, 35.3], zoom: 6, delayMs: 1200 },
    focusPlatform: null,
    image: null,
    text: `Sama’s workforce largely depended on delivery centers in Kenya. Like India and the Philippines, Kenya and Uganda are known for their high English literacy. After struggling for independence from the UK in the 1960s, both Kenya and Uganda fell into debt with the IMF for development funds. To meet IMF loan conditions, trade liberalized, and foreign capital poured into these two countries. These are places with skyscrapers and luxury hotels for foreign businessmen. Meanwhile, everyday people live among petty theft bred by poverty. Data work is not economic enfranchisement. It becomes the only option.`,
    citations: [],
  },
  // Beat 8: show Impact Enterprises nodes, worldview
  {
    id: 'impact-enterprises',
    nodeFilter: 'all',
    highlightCountries: null,
    autoFly: null,
    focusPlatform: 'Impact Enterprises',
    image: {
      src: 'story/ImpactEnterprises.png',
      alt: 'Zambian women jumping up and down, jolly',
      caption: 'Picture of Zambian women on the Impact Enterprises official website. Photo: Impact Enterprises',  // optional
      position: { bottom: '10%', right: '6%' },  // optional, this is the default
      width: 240,   // optional, px
    },
    text: `Sama is not the only company that works with African communities. Impact Enterprises is a data labeling company with a sole delivery center in Zambia. The company website opens with a picture of Zambian women cheerfully jumping under the bright sun. With three white men as its executive board, Impact Enterprises writes:
“We provide job skills training and income-generating opportunities for youth across Zambia, teaching computer literacy, workplace professionalism, and technical skills that open doors to the global digital economy.”`,
    citations: [],
  },
]

export default STORY_BEATS
