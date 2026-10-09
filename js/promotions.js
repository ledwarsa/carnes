// Helper to calculate promotions for products
class PromotionEngine {
    constructor(promotions) {
        this.promotions = promotions || [];
    }

    getActivePromotions() {
        const now = new Date();
        const currentDay = now.getDay(); // 0-6 (Sun-Sat)
        const currentDateString = now.toISOString().split('T')[0];

        return this.promotions.filter(p => {
            if (p.is_active === false) return false;

            if (p.schedule_type === 'days_of_week') {
                if (!p.days || !p.days.includes(currentDay)) return false;
            } else if (p.schedule_type === 'date_range') {
                if (p.start_date && currentDateString < p.start_date) return false;
                if (p.end_date && currentDateString > p.end_date) return false;
            }
            
            return true;
        });
    }

    getBestDiscount(product) {
        const activePromos = this.getActivePromotions();
        let maxDiscount = 0;
        let bestPromo = null;

        activePromos.forEach(p => {
            let applies = false;
            if (p.type === 'global') {
                applies = true;
            } else if (p.type === 'category') {
                if (product.category && (p.target_ids || []).includes(product.category.toLowerCase())) {
                    applies = true;
                }
            } else if (p.type === 'product') {
                if ((p.target_ids || []).includes(product.id)) {
                    applies = true;
                }
            }

            if (applies && p.discount > maxDiscount) {
                maxDiscount = p.discount;
                bestPromo = p;
            }
        });

        return bestPromo;
    }

    applyToProduct(product) {
        const promo = this.getBestDiscount(product);
        let originalPrice = parseInt(String(product.price).replace(/[^0-9]/g, ''), 10);
        
        if (isNaN(originalPrice)) originalPrice = 0;

        if (!promo) {
            return {
                hasPromotion: false,
                originalPrice,
                finalPrice: originalPrice,
                promoName: null,
                discountPercent: 0
            };
        }

        const finalPrice = Math.round(originalPrice - (originalPrice * (promo.discount / 100)));

        return {
            hasPromotion: true,
            originalPrice,
            finalPrice,
            promoName: promo.name,
            discountPercent: promo.discount
        };
    }
}

window.PromotionEngine = PromotionEngine;
