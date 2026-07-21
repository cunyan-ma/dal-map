// Story links shown in each platform's popup (PlatformInfo).
// To add a story, drop a { title, url } object into that platform's array:
//   Sama: [
//     { title: 'Inside the company that trained ChatGPT', url: 'https://...' },
//   ],
// Platforms with an empty array simply don't show the section.

const PLATFORM_STORIES = {
  Centific: [],
  CloudFactory: [],
  Cognizant: [],
  DesiCrew: [],
  'Digital Divide Data': [],
  'Impact Enterprises': [],
  Ingedata: [],
  Innodata: [],
  Keymakr: [],
  NextWealth: [],
  Sama: [
    {
      title: "Sama's company profile on TechEquity's Data Work Landscape",
      url: 'https://dataworklandscape.org/profiles/sama',
    },
  ],
  TaskUs: [],
  iMerit: [],
}

export default PLATFORM_STORIES
