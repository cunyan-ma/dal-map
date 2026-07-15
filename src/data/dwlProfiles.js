// Data Work Landscape (TechEquity Collaborative) company profile pages,
// keyed by platform name as it appears in dal-platforms.csv.
//
// Only companies with a dedicated page at
// https://dataworklandscape.org/profiles/<slug> belong here — the popup
// shows nothing for platforms that aren't listed. As of July 2026 the site
// has dedicated profiles for exactly ten companies: Appen, GlobalLogic,
// Handshake AI, LabelBox, Mercor, Prolific, Sama, Scale AI, Surge AI, and
// Teleperformance (its /database table lists ~116 companies, but those rows
// have no company-specific URL to link to). Of our platforms only Sama
// overlaps; add entries below as they publish more profiles.
const DWL_PROFILES = {
  Sama: 'https://dataworklandscape.org/profiles/sama',
}

export default DWL_PROFILES
