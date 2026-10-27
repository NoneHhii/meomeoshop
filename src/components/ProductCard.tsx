import React from 'react';
import type { CosplayItem } from '../types';

interface ProductCardProps {
    item: CosplayItem;
    isWishlisted: boolean;
    onToggleWishlist: (e: React.MouseEvent, id: string) => void;
    onOpenDetail: (item: CosplayItem) => void;
    onOpenRentModal: (item: CosplayItem) => void;
}

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
            <svg
                key={s}
                className={`w-3 h-3 ${s <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
        <span className="text-[10px] text-gray-400 font-bold ml-1">({rating})</span>
    </div>
);

export const ProductCard: React.FC<ProductCardProps> = ({
    item,
    isWishlisted,
    onToggleWishlist,
    onOpenDetail,
    onOpenRentModal,
}) => {
    const isAvailable = item.availableStock > 0;

    return (
        <div
            onClick={() => onOpenDetail(item)}
            className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border-2 border-[#FFE4E1] shadow-xs hover:shadow-xl hover:shadow-[#FFB6C1]/30 hover:-translate-y-1 active:scale-[0.98] cursor-pointer transition-all duration-300"
        >
            {/* Top Badges */}
            <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
                {item.badge && (
                    <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm text-white ${
                            item.badge === 'Hot'
                                ? 'bg-gradient-to-r from-orange-400 to-red-500'
                                : item.badge === 'Mới'
                                ? 'bg-gradient-to-r from-blue-400 to-indigo-500'
                                : item.badge === 'Sale'
                                ? 'bg-gradient-to-r from-pink-500 to-rose-500'
                                : 'bg-[#FF69B4]'
                        }`}
                    >
                        {item.badge === 'Hot' ? '🔥 ' : item.badge === 'Mới' ? '✨ ' : ''}
                        {item.badge}
                    </span>
                )}
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 shadow-xs border border-pink-100">
                    {item.category}
                </span>
            </div>

            {/* Wishlist Heart Button */}
            <button
                type="button"
                onClick={(e) => onToggleWishlist(e, item.id)}
                className="absolute top-2.5 right-2.5 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-115 active:scale-90 transition-transform"
                title={isWishlisted ? 'Bỏ thích' : 'Yêu thích'}
            >
                <span className="text-base leading-none">
                    {isWishlisted ? '❤️' : '🤍'}
                </span>
            </button>

            {/* Product Image */}
            <div className="relative w-full h-44 sm:h-48 bg-pink-50/50 overflow-hidden">
                <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                />

                {/* Stock Status Pill on Image */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                    <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md flex items-center gap-1.5 ${
                            isAvailable
                                ? 'bg-emerald-500/90 text-white'
                                : 'bg-rose-500/90 text-white'
                        }`}
                    >
                        <span
                            className={`w-1.5 h-1.5 rounded-full ${
                                isAvailable ? 'bg-emerald-200 animate-pulse' : 'bg-rose-200'
                            }`}
                        />
                        {isAvailable ? `Còn ${item.availableStock}/${item.totalStock} bộ` : 'Đang cho thuê hết'}
                    </span>

                    {item.rentCount > 0 && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
                            Đã thuê {item.rentCount} lần
                        </span>
                    )}
                </div>
            </div>

            {/* Content Info */}
            <div className="p-3.5 flex flex-col flex-1 justify-between bg-[#FFFDFE] gap-2">
                <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#333] line-clamp-2 leading-snug group-hover:text-[#FF69B4] transition-colors">
                        {item.title}
                    </h3>
                    <div className="flex items-center justify-between mt-1.5">
                        <StarRating rating={item.rating} />
                        <span className="text-[10px] text-gray-400 font-medium">
                            ❤️ {item.likeCount} lượt tim
                        </span>
                    </div>
                </div>

                {/* Rental Pricing */}
                <div className="bg-[#FFF5F8] p-2.5 rounded-2xl border border-[#FFE4E1]">
                    <div className="flex items-baseline justify-between">
                        <span className="text-[10px] font-bold text-gray-500">Giá thuê:</span>
                        <div>
                            <span className="text-base font-black text-[#FF1493]">
                                {item.rentPricePerDay.toLocaleString('vi-VN')}đ
                            </span>
                            <span className="text-[10px] font-bold text-gray-500 ml-0.5">/ngày</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-0.5 text-[10px] text-gray-500">
                        <span>Tiền cọc:</span>
                        <span className="font-bold text-gray-700">
                            {item.depositPrice.toLocaleString('vi-VN')}đ
                        </span>
                    </div>
                </div>

                {/* Action Button */}
                <div className="pt-1">
                    {isAvailable ? (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenRentModal(item);
                            }}
                            className="w-full bg-gradient-to-r from-[#FF69B4] to-[#FF1493] text-white text-xs font-black py-2.5 rounded-2xl shadow-md shadow-[#FF69B4]/20 hover:shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                        >
                            <span>Thuê ngay</span>
                            <span>🐾</span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenDetail(item);
                            }}
                            className="w-full bg-gray-100 text-gray-500 text-xs font-bold py-2.5 rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                        >
                            <span>Hết đồ • Xem chi tiết</span>
                            <span>🔍</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};