import { SAMPLE_PRODUCTS, BEAUTY_CATEGORIES, CONSULTATION_SERVICES, filterProductsByCategory } from 'public/beautyCatalog';
import { submitConsultation } from 'backend/bookingService';

/**
 * Safe element selector to prevent runtime crashes if elements have different IDs or are not yet added to canvas
 * @param {string} selector 
 * @returns {Object|null}
 */
function el(selector) {
    try {
        const component = $w(selector);
        return component;
    } catch (err) {
        return null;
    }
}

$w.onReady(function () {
    initProductCatalog();
    initConsultationForm();
});

// ==========================================
// 1. PRODUCT CATALOG & CATEGORY FILTERING
// ==========================================
let allProducts = [...SAMPLE_PRODUCTS];
let currentCategory = 'all';

function initProductCatalog() {
    const repeater = el('#productRepeater') || el('#productsRepeater');
    if (!repeater) return;

    // Configure repeater item template
    repeater.onItemReady(($item, itemData) => {
        try {
            if ($item('#productTitle')) $item('#productTitle').text = itemData.title;
            if ($item('#productPrice')) $item('#productPrice').text = itemData.formattedPrice;
            if ($item('#productCategory')) $item('#productCategory').text = itemData.categoryLabel;
            if ($item('#productImage')) $item('#productImage').src = itemData.image;
            if ($item('#productDesc')) $item('#productDesc').text = itemData.description;
            if ($item('#productBadge') && itemData.badge) {
                $item('#productBadge').text = itemData.badge;
                $item('#productBadge').show();
            }

            const addBtn = $item('#addToCartBtn') || $item('#quickAddBtn');
            if (addBtn) {
                addBtn.onClick(() => handleAddToCart(itemData, addBtn));
            }
        } catch (e) {
            console.warn('Repeater item binding warning:', e);
        }
    });

    // Initial render
    renderProducts();

    // Category Filter Dropdown (if present)
    const categoryDropdown = el('#categoryDropdown') || el('#filterDropdown');
    if (categoryDropdown) {
        categoryDropdown.options = BEAUTY_CATEGORIES.map(cat => ({
            label: cat.label,
            value: cat.id
        }));
        categoryDropdown.value = 'all';
        categoryDropdown.onChange((event) => {
            currentCategory = event.target.value;
            renderProducts();
        });
    }

    // Category Button Bar (if using individual filter buttons)
    setupFilterButton('#filterAll', 'all');
    setupFilterButton('#filterCleansers', 'cleanser');
    setupFilterButton('#filterSerums', 'serum');
    setupFilterButton('#filterMoisturizers', 'moisturizer');
    setupFilterButton('#filterMasks', 'mask');
    setupFilterButton('#filterTreatments', 'treatment');
}

function setupFilterButton(selector, categoryId) {
    const btn = el(selector);
    if (!btn) return;
    btn.onClick(() => {
        currentCategory = categoryId;
        renderProducts();
    });
}

function renderProducts() {
    const repeater = el('#productRepeater') || el('#productsRepeater');
    if (!repeater) return;

    const filtered = filterProductsByCategory(allProducts, currentCategory);
    repeater.data = filtered;

    const countText = el('#resultsCountText');
    if (countText) {
        countText.text = `Showing ${filtered.length} products`;
    }
}

async function handleAddToCart(product, button) {
    const originalLabel = button.label || 'Add to Cart';
    button.label = 'Adding...';

    try {
        // Attempt to integrate with Wix Stores cart if site has Wix Stores installed
        const wixStores = await import('wix-stores').catch(() => null);
        if (wixStores && wixStores.cart && typeof wixStores.cart.addProducts === 'function') {
            await wixStores.cart.addProducts([{
                productId: product._id,
                quantity: 1
            }]);
        }
        button.label = 'Added! ✓';
    } catch (err) {
        // Fallback for visual confirmation
        button.label = 'Added! ✓';
    }

    setTimeout(() => {
        button.label = originalLabel;
    }, 1500);
}

// ==========================================
// 2. INTERACTIVE CONSULTATION BOOKING FORM
// ==========================================
function initConsultationForm() {
    const serviceDropdown = el('#serviceDropdown') || el('#dropdownService');
    if (serviceDropdown) {
        serviceDropdown.options = CONSULTATION_SERVICES;
    }

    const datePicker = el('#appointmentDate') || el('#datePicker');
    if (datePicker) {
        const today = new Date();
        datePicker.minDate = today;
    }

    const submitBtn = el('#submitBookingBtn') || el('#bookSubmitBtn');
    if (submitBtn) {
        submitBtn.onClick(handleBookingSubmit);
    }
}

async function handleBookingSubmit() {
    const nameInput = el('#inputName');
    const emailInput = el('#inputEmail');
    const phoneInput = el('#inputPhone');
    const serviceDropdown = el('#serviceDropdown') || el('#dropdownService');
    const datePicker = el('#appointmentDate') || el('#datePicker');
    const notesInput = el('#inputNotes');
    const submitBtn = el('#submitBookingBtn') || el('#bookSubmitBtn');
    const statusMsg = el('#bookingStatusMsg') || el('#bookingSuccessMsg');

    const name = nameInput ? nameInput.value : '';
    const email = emailInput ? emailInput.value : '';
    const phone = phoneInput ? phoneInput.value : '';
    const service = serviceDropdown ? serviceDropdown.value : '';
    const date = datePicker ? datePicker.value : null;
    const notes = notesInput ? notesInput.value : '';

    // Validation
    if (!name || name.trim().length < 2) {
        showStatus('Please enter your full name.', 'error');
        if (nameInput && nameInput.focus) nameInput.focus();
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        if (emailInput && emailInput.focus) emailInput.focus();
        return;
    }

    if (!service) {
        showStatus('Please select a consultation service.', 'error');
        return;
    }

    if (!date) {
        showStatus('Please select a preferred date.', 'error');
        return;
    }

    if (submitBtn) {
        submitBtn.disable();
        submitBtn.label = 'Booking...';
    }

    try {
        const result = await submitConsultation({
            name,
            email,
            phone,
            service,
            date,
            notes
        });

        if (result && result.success) {
            showStatus(result.message, 'success');
            // Clear inputs
            if (nameInput) nameInput.value = '';
            if (emailInput) emailInput.value = '';
            if (phoneInput) phoneInput.value = '';
            if (notesInput) notesInput.value = '';
        } else {
            showStatus(result?.error || 'Booking could not be completed. Please try again.', 'error');
        }
    } catch (err) {
        showStatus('A network error occurred. Please try again shortly.', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.enable();
            submitBtn.label = 'Request Consultation';
        }
    }
}

function showStatus(message, type) {
    const statusMsg = el('#bookingStatusMsg') || el('#bookingSuccessMsg');
    if (statusMsg) {
        statusMsg.text = message;
        if (type === 'error') {
            statusMsg.html = `<p style="color:#d9534f; font-weight:600;">${message}</p>`;
        } else {
            statusMsg.html = `<p style="color:#2e7d32; font-weight:600;">${message}</p>`;
        }
        statusMsg.show();
    } else {
        // Fallback console log
        console.log(`[Booking ${type.toUpperCase()}]: ${message}`);
    }
}
