import React from 'react';
import type { UserRole } from '../types';
import logo from '../assets/logo.svg';

interface HeaderProps {
    role: UserRole;
    onToggleRole: () => void;
    wishlistCount: number;
    showWishlistOnly: boolean;
    onToggleWishlistOnly: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    role,
    onToggleRole,
    wishlistCount,
    showWishlistOnly,
    onToggleWishlistOnly,
}) => {
    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-[#FFE4E1] shadow-xs">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
                {/* Logo & Shop Brand */}
                <div className="flex items-center gap-3">
                    <div className="relative group cursor-pointer">
                        <img
                            src={logo}
                            alt="Meomeo Logo"
                            className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-[#FF69B4] bg-[#FFF0F5] object-cover shadow-sm group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute -bottom-1 -right-1 text-xs bg-white rounded-full p-0.5 shadow">🐾</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg md:text-xl font-black text-[#FF69B4] tracking-wide leading-none">
                                Meomeo Shop
                            </h1>
                            <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 bg-[#FFF0F5] text-[#FF1493] rounded-full border border-[#FFD1DC]">
                                Cosplay Rental
                            </span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium mt-0.5 hidden xs:block">
                            Tiệm cho thuê đồ cosplay &amp; phụ kiện anime kawaii 🌸
                        </p>
                    </div>
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-2 md:gap-3">
                    {/* Wishlist Filter Button */}
                    <button
                        onClick={onToggleWishlistOnly}
                        className={`relative flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-200 active:scale-95 ${
                            showWishlistOnly
                                ? 'bg-red-500 text-white shadow-md shadow-red-200'
                                : 'bg-[#FFF0F5] text-red-500 border border-[#FFE4E1] hover:bg-red-50'
                        }`}
                        title="Xem danh sách yêu thích"
                    >
                        <span>❤️</span>
                        <span className="hidden sm:inline">Yêu thích</span>
                        {wishlistCount > 0 && (
                            <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                                showWishlistOnly ? 'bg-white text-red-500' : 'bg-red-500 text-white'
                            }`}>
                                {wishlistCount}
                            </span>
                        )}
                    </button>

                    {/* Role Switcher Button */}
                    <button
                        onClick={onToggleRole}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-200 active:scale-95 shadow-xs ${
                            role === 'admin'
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-200'
                                : 'bg-[#FF69B4] text-white hover:bg-[#ff52a8] shadow-[#FF69B4]/20'
                        }`}
                        title="Chuyển chế độ Khách / Quản trị viên"
                    >
                        <span>{role === 'admin' ? '👑' : '🐱'}</span>
                        <span className="font-extrabold">
                            {role === 'admin' ? 'Chế độ Admin' : 'Khách xem'}
                        </span>
                        <span className="text-[10px] opacity-80 border-l border-white/30 pl-1.5">
                            {role === 'admin' ? 'Đổi qua Khách' : 'Đổi qua Admin'}
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
};