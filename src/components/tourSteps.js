// Step definitions for the "how to navigate the map" walkthrough (MapTour).
// Kept separate from the component so MapTour.jsx exports only a component
// (React Fast Refresh needs component-only modules to hot-update cleanly).
//
// targets: each entry becomes one feathered highlight around the union of its
//   selectors. inset: true draws it just inside the element instead (used for
//   the full map, whose wrap-around ellipse would leave the screen). noArrow
//   skips the text-to-target pointer for that highlight.
// card: which highlight the text hangs off (index into targets), where, and
//   how far away (dist, px) — far enough that the pointer arrow reads in full.
//   place 'corner' pins the text to the bottom-right of the viewport instead.
// arrowTo: optional selector the text points an extra arrow at (the pop-up).
// Side-effect hints read by the page (not the overlay): platform opens that
//   pop-up on arrival; foldBar folds the desktop bottom bar to demonstrate it.

// The bottom bar (and its fold tab) only exist on desktop, so that first step
// is desktop-only. Everything else circles elements present on both layouts.
const FOLD_STEP = {
    targets: [{ selectors: ['.bottombar-tab'] }],
    text: 'Fold the bottom bar for a cleaner view.',
    card: { anchor: 0, place: 'above', dist: 130 },
}

const EXAMINE_STEP = {
    targets: [
        { selectors: ['.map-wrap'], inset: true, noArrow: true },
        { selectors: ['.legend'] },
    ],
    text: 'Examine the geographic distribution of the supply chain across the map. Who demands data labeling services, who contracts those services, and what labor supplies those services?',
    card: { anchor: 0, place: 'corner' },
    foldBar: true,
}

// Desktop hovers; mobile taps. Same node, same pop-up, different verb + the
// card sits above the (bottom-docked) search box on mobile so it stays on-screen.
const nodeStep = (isMobile) => ({
    targets: [
        { selectors: ['[data-platform="Sama"]'] },
        { selectors: ['.search-dock'] },
    ],
    arrowTo: '.platform-info',
    // Extra un-darkened (but un-ringed) areas: the pop-up the arrow points at
    cutouts: ['.platform-info'],
    text: `${isMobile ? 'Tap' : 'Hover on'} a node, or search by worker location / platform / customer, to learn about its relationships with other nodes. Read relevant reporting about the node in the pop-up window.`,
    // Mobile docks the pop-up + search box down the left edge, so pin the card
    // to the bottom-right corner (arrows reach back to them) to avoid overlap.
    card: isMobile
        ? { anchor: 1, place: 'corner' }
        : { anchor: 1, place: 'below', dist: 60 },
    platform: 'Sama',
})

const STORY_STEP = {
    targets: [{ selectors: ['.story-box'] }],
    text: 'Read about the relationships between data workers, their platforms, and the socioeconomic conditions that drive such connections.',
    card: { anchor: 0, place: 'right', dist: 150 },
}

const DATABASE_STEP = {
    targets: [{ selectors: ['.navbar-links a[href$="/database"]'] }],
    text: 'Download the original database here.',
    card: { anchor: 0, place: 'below', dist: 130 },
}

const ABOUT_STEP = {
    targets: [{ selectors: ['.navbar-links a[href$="/about"]', '.navbar-links a[href$="/methodology"]'] }],
    text: 'Read more about the project here.',
    card: { anchor: 0, place: 'below', dist: 130 },
}

// The active step list. Mobile drops the desktop-only bottom-bar fold step.
export function getTourSteps(isMobile) {
    const rest = [EXAMINE_STEP, nodeStep(isMobile), STORY_STEP, DATABASE_STEP, ABOUT_STEP]
    return isMobile ? rest : [FOLD_STEP, ...rest]
}
