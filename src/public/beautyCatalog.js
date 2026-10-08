/**
 * Curated Beauty & Skincare Catalog Data & Utilities
 * Provides default product items and category definitions.
 */

export const BEAUTY_CATEGORIES = [
    { id: 'all', label: 'All Products' },
    { id: 'cleanser', label: 'Cleansers' },
    { id: 'serum', label: 'Serums & Oils' },
    { id: 'moisturizer', label: 'Moisturizers' },
    { id: 'mask', label: 'Face Masks' },
    { id: 'treatment', label: 'Targeted Care' }
];

export const CONSULTATION_SERVICES = [
    { label: 'Virtual Skin Analysis (30 min)', value: 'virtual-skin-analysis' },
    { label: 'Bespoke Skincare Routine Formulation (45 min)', value: 'bespoke-routine' },
    { label: 'Hydration & Glow In-Studio Treatment (60 min)', value: 'studio-glow' },
    { label: 'Acne & Sensitivity Consultation (45 min)', value: 'acne-sensitivity' }
];

export const SAMPLE_PRODUCTS = [
    {
        _id: 'prod-001',
        title: 'Radiance Botanical Cleansing Oil',
        category: 'cleanser',
        categoryLabel: 'Cleanser',
        price: 38.00,
        formattedPrice: '$38.00',
        description: 'Gentle camellia & jojoba oil blend that dissolves impurities without stripping moisture.',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
        badge: 'Best Seller'
    },
    {
        _id: 'prod-002',
        title: 'Luminescent Vitamin C + Peptide Elixir',
        category: 'serum',
        categoryLabel: 'Serum',
        price: 64.00,
        formattedPrice: '$64.00',
        description: 'Potent 15% Vitamin C combined with tri-peptides to brighten and restore elasticity.',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
        badge: 'Award Winner'
    },
    {
        _id: 'prod-003',
        title: 'Velvet Ceramide Barrier Cream',
        category: 'moisturizer',
        categoryLabel: 'Moisturizer',
        price: 52.00,
        formattedPrice: '$52.00',
        description: 'Multi-molecular hyaluronic acid and ceramides for 72-hour deep cellular hydration.',
        image: 'https://images.unsplash.com/photo-1608248597359-0a562d984180?auto=format&fit=crop&w=600&q=80',
        badge: 'New'
    },
    {
        _id: 'prod-004',
        title: 'Pink French Clay Detoxifying Mask',
        category: 'mask',
        categoryLabel: 'Face Mask',
        price: 42.00,
        formattedPrice: '$42.00',
        description: 'Refining pink clay infused with organic rose water to gently clarify pores.',
        image: 'https://images.unsplash.com/photo-1567928815117-640a2bb128fa?auto=format&fit=crop&w=600&q=80',
        badge: 'Organic'
    },
    {
        _id: 'prod-005',
        title: 'Night Recovery Squalane Infusion',
        category: 'serum',
        categoryLabel: 'Serum',
        price: 58.00,
        formattedPrice: '$58.00',
        description: '100% plant-derived squalane and blue tansy for overnight soothing and renewal.',
        image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80',
        badge: 'Top Rated'
    },
    {
        _id: 'prod-006',
        title: 'Cellular Renewal Bakuchiol Treatment',
        category: 'treatment',
        categoryLabel: 'Treatment',
        price: 68.00,
        formattedPrice: '$68.00',
        description: 'Natural, gentle retinol alternative for fine lines and smooth, firm skin texture.',
        image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
        badge: 'Clean Beauty'
    }
];

/**
 * Filter products by category id
 * @param {Array} products 
 * @param {string} categoryId 
 * @returns {Array} filtered products
 */
export function filterProductsByCategory(products, categoryId) {
    if (!categoryId || categoryId === 'all') {
        return products;
    }
    return products.filter(item => item.category === categoryId);
}
