/**
 * Global site code (runs on every page)
 */
import wixLocation from 'wix-location';

$w.onReady(function () {
    // Global Header & Navigation Setup
    setupGlobalNavigation();
});

function setupGlobalNavigation() {
    // If a user clicks a consultation action button anywhere on site, navigate to home and scroll to booking
    const bookNavBtn = $w('#bookNavBtn');
    if (bookNavBtn) {
        bookNavBtn.onClick(() => {
            if (wixLocation.path.length > 0) {
                wixLocation.to('/#booking');
            } else {
                const bookingSection = $w('#bookingSection') || $w('#bookingBox');
                if (bookingSection && typeof bookingSection.scrollTo === 'function') {
                    bookingSection.scrollTo();
                }
            }
        });
    }
}
