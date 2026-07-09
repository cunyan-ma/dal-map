// Each beat defines what the map shows and what text appears in StoryPanel.
// nodeFilter: 'red' | 'white' | 'white+orange' | 'all'
// highlightCountries: array of country names to highlight (others dimmed). null = highlight all.
// autoFly: null | { center: [lat, lng], zoom, delayMs } — triggers animated flyTo after delayMs
// focusPlatform: null | platform name — highlights that platform's node plus its
//   connected worker and customer nodes (everything else dimmed) and draws its edges

const STORY_BEATS = [
  // Beat 1: red nodes in Kenya, worldview
  {
    id: 'kenya',
    nodeFilter: 'red',
    highlightCountries: ['Kenya'],
    autoFly: null,
    focusPlatform: null,
    text: `Alex is a data worker in Nairobi, Kenya. Paid at a rate of $1.5 to $3.75 an hour, Alex, along with other folks on the team, would review paragraphs of children having intercourse with their father, animals, and even rape, and label them into severities of violence. They did not know who this work was done for, or where these paragraphs came from. All they know is they work to label data at a company called Sama.`,
    citation: `https://www.wsj.com/podcasts/the-journal/the-hidden-workforce-that-helped-filter-violence-and-abuse-out-of-chatgpt/ffc2427f-bdd8-47b7-9a4b-27e7267cf413`,
  },
  // Beat 2: red nodes in Colombia and Venezuela, worldview
  {
    id: 'colombia-venezuela',
    nodeFilter: 'red',
    highlightCountries: ['Colombia', 'Venezuela'],
    autoFly: null,
    focusPlatform: null,
    text: `This is not a single occasion. Before Trump captured Nicolás Maduro, Venezuela had been subjugated to poor economic inflation for decades–inflation, corruption, exacerbated by US sanctions on its heavily reliant oil.
Well-educated young folks flee from Venezuela to seek refuge in Colombia. This hungry workforce becomes the prized possession of data labeling companies who outsource data annotation services.`,
    citation: null,
  },
  // Beat 3: all nodes, worldview
  {
    id: 'origins',
    nodeFilter: 'all',
    highlightCountries: null,
    autoFly: null,
    focusPlatform: null,
    text: `The story of data workers dates as far back as the development of machine learning. Data annotation and labeling (DAL) is the process of making data legible to machines–that this is a tree, this is a car, this is a dog, and this is graphically violent content. This work is often repetitive and demanded in large quantities. As a result, data labeling becomes outsourced labor.`,
    citation: null,
  },
  // Beat 4: zoom into South + Southeast Asia
  {
    id: 'south-southeast-asia',
    nodeFilter: 'red',
    highlightCountries: ['India', 'Nepal', 'Philippines', 'Cambodia', 'Laos', 'Malaysia', 'Thailand', 'Singapore'],
    autoFly: { center: [15, 98], zoom: 4, delayMs: 1200 },
    focusPlatform: null,
    text: `The history of outsourcing business parallels the rise of neoliberalism in the 1980s. As global capitalism grew, companies needed to cut down costs by seeking out cheaper labor. This labor is often from the global south. These countries are usually newly liberated from decades of colonial or semi-colonial rule, who is welcoming economic opportunities to develop and earn a living. They are the perfect demographic for data work.

India and the Philippines are the two largest IT BPO markets in the world. These countries share a colonial history that fostered a large English-speaking population. Whereas the Philippines was the “call center capital of the world”, India is an IT powerhouse given its engineering talent pool. When DAL demand rose, these countries naturally took the work.`,
    citation: `https://scm.ncsu.edu/scm-articles/article/a-brief-history-of-outsourcing`,
  },
  // Beat 5: white + yellow nodes in Silicon Valley, zoom in
  {
    id: 'ai-hype',
    nodeFilter: 'white+orange',
    highlightCountries: null,
    autoFly: { center: [37.4, -122.0], zoom: 9, delayMs: 1200 },
    focusPlatform: null,
    text: `The AI hype in recent years expanded the DAL industry to unprecedented levels. Since the rise of autonomous vehicles in 2015, venture capital-backed startups like Scale AI, which specialized in data labeling, have built billion-dollar businesses. This demand didn’t come from a vacuum. AI startups, concentrated in Silicon Valley, surged after the launch of ChatGPT in 2022. AI models not only need exponentially more data to satisfy the scaling law, but they also require reinforcement learning from human feedback (RLHF) for model safety and alignment. Data labeling is no longer about assigning words to pictures. It is also about identifying “violent text” from “extremely violent text” to keep model output clean and safe.`,
    citation: null,
  },
  // Beat 6: show Sama node + its relationship to other platform nodes, worldview
  {
    id: 'sama',
    nodeFilter: 'all',
    highlightCountries: null,
    autoFly: null,
    focusPlatform: 'Sama',
    text: `Sama is such a DAL company that provides RLHF services. Thanks to some amazing journalists, Sama is notorious in media for poor pay and labor conditions. Workers consistently speak out about PTSD and work trauma. Attempts to unionize led to being fired. This all happens while Sama speaks of its work as “impact sourcing”, which creates stable employment and economic opportunities for marginalized communities.`,
    citation: `https://www.sama.com/impact`,
  },
  // Beat 7: zoom into Kenya and Uganda
  {
    id: 'kenya-uganda',
    nodeFilter: 'red',
    highlightCountries: ['Kenya', 'Uganda'],
    autoFly: { center: [1, 35.3], zoom: 6, delayMs: 1200 },
    focusPlatform: null,
    text: `Sama’s workforce is sustained by delivery centers in Kenya and Uganda. Like India and the Philippines, Kenya and Uganda are known for their high English literacy. After struggling for independence from colonial rule since WWII, both Kenya and Uganda fell into debt with the IMF for development funds. As per the IMF conditions, foreign capital pours into these two countries. These are places with skyscrapers and luxury hotels for foreign businessmen. Meanwhile, average folks seek out work in the data labeling industry; its poor labor conditions are unaddressed.`,
    citation: null,
  },
  // Beat 8: show Impact Enterprises nodes, worldview
  {
    id: 'impact-enterprises',
    nodeFilter: 'all',
    highlightCountries: null,
    autoFly: null,
    focusPlatform: 'Impact Enterprises',
    text: `Sama is not the only company that works with African communities. Impact Enterprises is a data labeling company with a sole delivery center in Zambia. The company website opens with a picture of Zambian women cheerfully jumping under the bright sun. With three white men as its executive board, Impact Enterprises writes:
“We provide job skills training and income-generating opportunities for youth across Zambia, teaching computer literacy, workplace professionalism, and technical skills that open doors to the global digital economy.”`,
    citation: null,
  },
]

export default STORY_BEATS
