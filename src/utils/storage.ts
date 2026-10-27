import type { CosplayItem, FeedbackItem, RentalOrder, UserRole } from '../types';

export const INITIAL_PRODUCTS: CosplayItem[] = [
    {
        id: '1',
        title: 'Wig Hatsune Miku Sakura Dài 120cm',
        category: 'Wig',
        rentPricePerDay: 45000,
        depositPrice: 200000,
        imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600',
        badge: 'Hot',
        rating: 4.9,
        reviews: 28,
        description: 'Tóc giả Hatsune Miku Sakura màu hồng phấn ombre xanh ngọc nhẹ nhàng, dài 120cm bồng bềnh. Sợi tơ nhân tạo chịu nhiệt cao cấp, thoáng khí và êm đầu khi đội.',
        totalStock: 6,
        availableStock: 4,
        likeCount: 42,
        rentCount: 19,
    },
    {
        id: '2',
        title: 'Fullset Váy Maid Lolita Hồng Phấn + Tạp Dề',
        category: 'Costume',
        rentPricePerDay: 90000,
        depositPrice: 350000,
        imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600',
        badge: 'Mới',
        rating: 4.8,
        reviews: 35,
        description: 'Set trang phục Maid Lolita phong cách tiểu thư ngọt ngào. Kèm tùng váy phồng xếp ly, tạp dề ren thủ công, nơ cài cổ và bờm tóc ren xinh xắn. Vải mềm thoáng mát.',
        totalStock: 5,
        availableStock: 2,
        likeCount: 56,
        rentCount: 24,
    },
    {
        id: '3',
        title: 'Tai Mèo Neko Chuông Vàng Lông Mềm',
        category: 'Accessory',
        rentPricePerDay: 25000,
        depositPrice: 80000,
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
        badge: 'Hot',
        rating: 5.0,
        reviews: 64,
        description: 'Bờm tai mèo neko tai thỏ lông mềm mịn như mèo thật, đính nơ ruy băng lụa và chuông vàng kêu leng keng siêu cưng. Kẹp cài chắc chắn không đau đầu.',
        totalStock: 12,
        availableStock: 8,
        likeCount: 88,
        rentCount: 47,
    },
    {
        id: '4',
        title: 'Giày Lolita Nơ Hồng Đế Cao 6cm',
        category: 'Shoes',
        rentPricePerDay: 50000,
        depositPrice: 250000,
        imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600',
        rating: 4.7,
        reviews: 19,
        description: 'Giày platform Lolita da bóng đính nơ kép, đế đúc 6cm siêu êm chân tôn dáng. Lót trong đệm mút thoáng khí đi fes cả ngày không mỏi. Đủ size từ 36 - 39.',
        totalStock: 8,
        availableStock: 5,
        likeCount: 31,
        rentCount: 15,
    },
    {
        id: '5',
        title: 'Set Cosplay Thủy Thủ Sailor Moon Kèm Găng',
        category: 'Costume',
        rentPricePerDay: 110000,
        depositPrice: 400000,
        imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
        badge: 'Yêu thích',
        rating: 4.9,
        reviews: 42,
        description: 'Bộ trang phục Thủy thủ Mặt Trăng chuẩn anime gồm váy xếp ly, nơ ngực đỏ, vương miện mặt trăng tráng gương, găng tay trắng viền đỏ và vòng choker cổ.',
        totalStock: 4,
        availableStock: 1,
        likeCount: 75,
        rentCount: 33,
    },
    {
        id: '6',
        title: 'Wig Nezuko Kamado Ombre Cam Đỏ',
        category: 'Wig',
        rentPricePerDay: 50000,
        depositPrice: 220000,
        imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600',
        badge: 'Hot',
        rating: 4.8,
        reviews: 26,
        description: 'Wig cosplay Nezuko Kamado dài 65cm uốn lượn sóng, chân tóc đen tuyền chuyển ombre cam đỏ rực rỡ. Đã được tỉa layer sẵn, có kèm ống tre đạo cụ chụp ảnh.',
        totalStock: 5,
        availableStock: 0, // demo hết đồ để test check tình trạng
        likeCount: 63,
        rentCount: 29,
    },
    {
        id: '7',
        title: 'Kính Mắt Mèo Pastel Hologram Y2K',
        category: 'Accessory',
        rentPricePerDay: 20000,
        depositPrice: 60000,
        imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600',
        rating: 4.6,
        reviews: 14,
        description: 'Kính mát gọng mắt mèo viền pastel hồng sữa phong cách Harajuku Y2K. Phụ kiện chụp lookbook, concept anime cực slay và cá tính.',
        totalStock: 10,
        availableStock: 7,
        likeCount: 27,
        rentCount: 12,
    },
    {
        id: '8',
        title: 'Set Cây Trượng Phép Thuật Mahou Shoujo',
        category: 'Props',
        rentPricePerDay: 40000,
        depositPrice: 180000,
        imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600',
        badge: 'Mới',
        rating: 4.9,
        reviews: 21,
        description: 'Đạo cụ trượng phép thuật dạ quang cánh thiên thần và trái tim hồng ngọc phát sáng LED. Nhẹ tay, đường nét tinh xảo chụp ảnh đêm cực lung linh.',
        totalStock: 3,
        availableStock: 2,
        likeCount: 49,
        rentCount: 16,
    },
];

export const INITIAL_FEEDBACKS: FeedbackItem[] = [
    {
        id: 'fb-1',
        productId: '1',
        userName: 'Mèo Miu Miu (Lyly)',
        rating: 5,
        comment: 'Tóc tơi mềm dã man luôn í các bà ơi! Mình đi fes Anime Expo cả ngày chạy nhảy mà không bị rối xơ tí nào. Shop giặt thơm mùi hoa anh đào cưng xỉu 🌸🐾',
        date: '25/10/2026',
        photos: [
            'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600',
            'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600',
        ],
    },
    {
        id: 'fb-2',
        productId: '1',
        userName: 'Trâm Anh Coser',
        rating: 5,
        comment: 'Màu sakura pastel ngoài đời cưng gấp chục lần trong ảnh. Mình thuê 3 ngày chụp ngoại cảnh được nguyên album ngàn like luôn.',
        date: '21/10/2026',
        photos: [
            'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600',
        ],
    },
    {
        id: 'fb-3',
        productId: '2',
        userName: 'Bé Thỏ Kawaii',
        rating: 5,
        comment: 'Form váy maid đỉnh chóp, tùng phồng tự nhiên không cần độn thêm luôn. Shop tư vấn size cực nhiệt tình, cọc trả lại siêu nhanh chóng!',
        date: '18/10/2026',
        photos: [
            'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600',
        ],
    },
    {
        id: 'fb-4',
        productId: '3',
        userName: 'An Nhiên',
        rating: 5,
        comment: 'Tai mèo xinh lắm, chuông kêu vui tai. Đeo đi cafe cosplay ai cũng hỏi thuê ở đâu hihi.',
        date: '14/10/2026',
        photos: [
            'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
        ],
    },
    {
        id: 'fb-5',
        productId: '6',
        userName: 'Yuki Chan',
        rating: 5,
        comment: 'Tóc Nezuko lên màu chuẩn chỉn, ombre mượt không bị gãy khúc. Shop còn cho mượn kèm cả ống tre nữa cưng ghê!',
        date: '08/10/2026',
        photos: [
            'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600',
        ],
    },
];

export const INITIAL_RENTAL_ORDERS: RentalOrder[] = [
    {
        id: 'ORDER-101',
        productId: '1',
        productTitle: 'Wig Hatsune Miku Sakura Dài 120cm',
        productImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600',
        customerName: 'Nguyễn Phương Thảo',
        customerPhone: '0987654321',
        customerNote: 'Lấy trước sáng thứ 7 để đi fes',
        startDate: '2026-10-26',
        endDate: '2026-10-28',
        rentalDays: 3,
        rentFee: 135000,
        deposit: 200000,
        totalInitialCost: 335000,
        status: 'active',
        createdAt: '2026-10-25 14:30',
    },
    {
        id: 'ORDER-102',
        productId: '2',
        productTitle: 'Fullset Váy Maid Lolita Hồng Phấn + Tạp Dề',
        productImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600',
        customerName: 'Hoàng Yến Nhi',
        customerPhone: '0912345678',
        customerNote: 'Size S kèm tùng',
        startDate: '2026-10-24',
        endDate: '2026-10-26',
        rentalDays: 2,
        rentFee: 180000,
        deposit: 350000,
        totalInitialCost: 530000,
        status: 'active',
        createdAt: '2026-10-23 09:15',
    },
    {
        id: 'ORDER-103',
        productId: '3',
        productTitle: 'Tai Mèo Neko Chuông Vàng Lông Mềm',
        productImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
        customerName: 'Đặng Mai Phương',
        customerPhone: '0933221100',
        customerNote: 'Thuê chụp studio',
        startDate: '2026-10-20',
        endDate: '2026-10-21',
        rentalDays: 1,
        rentFee: 25000,
        deposit: 80000,
        totalInitialCost: 105000,
        status: 'returned',
        createdAt: '2026-10-19 16:40',
    },
];

// ─── LOCAL STORAGE HELPERS ──────────────────────────────────────────────────

const STORAGE_KEYS = {
    PRODUCTS: 'meomeo_products_v2',
    FEEDBACKS: 'meomeo_feedbacks_v2',
    RENTALS: 'meomeo_rentals_v2',
    WISHLIST: 'meomeo_wishlist_v2',
    ROLE: 'meomeo_role_v2',
};

export const getStoredProducts = (): CosplayItem[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        return data ? JSON.parse(data) : INITIAL_PRODUCTS;
    } catch {
        return INITIAL_PRODUCTS;
    }
};

export const saveStoredProducts = (products: CosplayItem[]): void => {
    try {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
        console.error('Failed to save products to localStorage', e);
    }
};

export const getStoredFeedbacks = (): FeedbackItem[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
        return data ? JSON.parse(data) : INITIAL_FEEDBACKS;
    } catch {
        return INITIAL_FEEDBACKS;
    }
};

export const saveStoredFeedbacks = (feedbacks: FeedbackItem[]): void => {
    try {
        localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(feedbacks));
    } catch (e) {
        console.error('Failed to save feedbacks to localStorage', e);
    }
};

export const getStoredRentals = (): RentalOrder[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.RENTALS);
        return data ? JSON.parse(data) : INITIAL_RENTAL_ORDERS;
    } catch {
        return INITIAL_RENTAL_ORDERS;
    }
};

export const saveStoredRentals = (rentals: RentalOrder[]): void => {
    try {
        localStorage.setItem(STORAGE_KEYS.RENTALS, JSON.stringify(rentals));
    } catch (e) {
        console.error('Failed to save rentals to localStorage', e);
    }
};

export const getStoredWishlist = (): string[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
        return data ? JSON.parse(data) : ['1', '3']; // Default like a couple items
    } catch {
        return ['1', '3'];
    }
};

export const saveStoredWishlist = (wishlist: string[]): void => {
    try {
        localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
        console.error('Failed to save wishlist to localStorage', e);
    }
};

export const getStoredRole = (): UserRole => {
    try {
        const role = localStorage.getItem(STORAGE_KEYS.ROLE);
        return role === 'admin' ? 'admin' : 'guest';
    } catch {
        return 'guest';
    }
};

export const saveStoredRole = (role: UserRole): void => {
    try {
        localStorage.setItem(STORAGE_KEYS.ROLE, role);
    } catch (e) {
        console.error('Failed to save role to localStorage', e);
    }
};
