export interface CosplayItem {
    id: string;
    title: string;
    category: 'Costume' | 'Wig' | 'Accessory' | 'Shoes' | 'Makeup' | 'Props';
    rentPricePerDay: number; // Giá thuê theo ngày (VNĐ)
    depositPrice: number;    // Tiền đặt cọc (VNĐ)
    imageUrl: string;
    badge?: 'Hot' | 'Mới' | 'Sale' | 'Yêu thích';
    rating: number;
    reviews: number;
    description: string;
    totalStock: number;      // Tổng số lượng đồ shop sở hữu
    availableStock: number;  // Số lượng khả dụng sẵn sàng cho thuê
    likeCount: number;       // Tổng lượt người dùng thả tim
    rentCount: number;       // Tổng số lần đã được thuê
}

export interface FeedbackItem {
    id: string;
    productId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    date: string;
    photos: string[];        // Danh sách link ảnh feedback thực tế
}

export interface RentalOrder {
    id: string;
    productId: string;
    productTitle: string;
    productImage: string;
    customerName: string;
    customerPhone: string;
    customerNote?: string;
    startDate: string;
    endDate: string;
    rentalDays: number;
    rentFee: number;
    deposit: number;
    totalInitialCost: number; // Tiền cọc + Tiền thuê
    status: 'active' | 'returned' | 'cancelled'; // 'active': đang thuê, 'returned': đã trả đồ và hoàn cọc
    createdAt: string;
}

export interface ToastMsg {
    id: number;
    text: string;
    type: 'success' | 'error' | 'info';
}

export type UserRole = 'guest' | 'admin';
