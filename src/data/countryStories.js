// Story links shown in each country's popup (CountryInfo).
// To add a story, drop a { title, url } object into that country's array:
//   Kenya: [
//     { title: 'The hidden workforce behind ChatGPT', url: 'https://...' },
//   ],
// Countries with an empty array simply don't show the section.

const COUNTRY_STORIES = {
  Argentina: [],
  Cambodia: [],
  Canada: [],
  China: [],
  Colombia: [],
  'Costa Rica': [],
  Croatia: [],
  Egypt: [],
  Germany: [{
    title: 'First-person account of being a migrant content moderator in Germany',
    url: 'https://data-workers.org/sakine/'
  }],
  Greece: [],
  India: [],
  Ireland: [],
  Japan: [],
  Kenya: [
    {
      title: 'The Hidden Workforce That Helped Filter Violence and Abuse Out of ChatGPT (WSJ)',
      url: 'https://www.wsj.com/podcasts/the-journal/the-hidden-workforce-that-helped-filter-violence-and-abuse-out-of-chatgpt/ffc2427f-bdd8-47b7-9a4b-27e7267cf413',
    },
  ],
  Laos: [],
  Madagascar: [],
  Malaysia: [],
  Mexico: [],
  Nepal: [],
  Netherlands: [],
  Philippines: [
    {
      title: 'Philippines data workers are asked to work-on-site despite natural disasters',
      url: 'https://restofworld.org/2026/philippines-disasters-bpo-workers/'
    },
    {
      title: 'Philippines: Scale AI creating ‘race to the bottom’ as outsourced workers face ‘digital sweatshop’ conditions incl. low wages & withheld payments',
      url: 'https://www.business-humanrights.org/it/ultime-notizie/philippines-scale-ai-creating-race-to-the-bottom-as-outsourced-workers-face-poor-conditions-in-digital-sweatshops-incl-low-wages-withheld-payments/'
    }
  ],
  Serbia: [],
  Singapore: [],
  Spain: [],
  Taiwan: [],
  Thailand: [],
  Uganda: [],
  Ukraine: [],
  'United Kingdom': [],
  'United States': [],
  Zambia: [],
}

export default COUNTRY_STORIES
