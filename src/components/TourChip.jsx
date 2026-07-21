import './TourChip.css'

// Floating "how to navigate the map" trigger that rides over the map. Shown
// when the bottom bar (which normally hosts the trigger) isn't available:
// when it's folded away, or on mobile where the bar doesn't exist at all.
function TourChip({ onClick = () => {} }) {
    return (
        <button className="tour-chip" onClick={onClick}>
            <span className="tour-chip-q" aria-hidden="true">?</span>
            How to navigate the map
        </button>
    )
}

export default TourChip
