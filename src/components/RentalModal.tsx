import React, { useState } from 'react';
import type { CosplayItem, RentalOrder } from '../types';

interface RentalModalProps {
    item: CosplayItem;
    onClose: () => void;
    onSubmitRental: (order: Omit<RentalOrder, 'id' | 'createdAt'>) => void;
}

export const RentalModal: React.FC<RentalModalProps> = ({
    item,
    onClose,
    onSubmitRental,
}) => {
    // Default dates: today and 2 days later
    const today = new Date().toISOString().split('T')[0];
    const defaultEnd = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(defaultEnd);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerNote, setCustomerNote] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Calculate days
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const rentalDays = isNaN(diffDays) ? 1 : diffDays;

    const rentFee = item.rentPricePerDay * rentalDays;
    const deposit = item.depositPrice;
    const totalInitialCost = rentFee + deposit;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerName.trim()) {
            setErrorMsg('Vui lòng nhập họ tên của bạn nyaa~');
            return;
        }
        if (!customerPhone.trim() || customerPhone.trim().length < 9) {
            setErrorMsg('Vui lòng nhập số điện thoại hoặc Zalo hợp lệ!');
            return;
        }

        onSubmitRental({
            productId: item.id,
            productTitle: item.title,
            productImage: item.imageUrl,
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim(),
            customerNote: customerNote.trim(),
            startDate,
            endDate,
            rentalDays,
            rentFee,
            deposit,
            totalInitialCost,
            status: 'active',
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs anim-fade overflow-y-auto">
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-[#FFE4E1] overflow-hidden anim-slide-up my-auto"
            >
                {/* Header */}
                <div className="px-5 py-4 bg-gradient-to-r from-[#FFF0F5] to-[#FFE4E1] border-b border-[#FFD1DC] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🐱</span>
                        <div>
                            <h3 className="text-base font-black text-[#FF1493] leading-none">
                                Đặt Thuê Trang Phục Cosplay
                            </h3>
                            <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                                Điền thông tin nhận đồ &amp; giữ cọc an toàn
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-[#FF1493] flex items-center justify-center text-lg font-bold transition-colors shadow-xs"
                    >
                        ✕
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-5 max-h-[80vh] overflow-y-auto scrollbar-none space-y-4">
                    {/* Item Snapshot */}
                    <div className="flex items-center gap-3 p-3 bg-[#FFF9FA] rounded-2xl border border-[#FFE4E1]">
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-16 h-16 rounded-xl object-cover border border-pink-100 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-[#FFE4F0] text-[#FF69B4]">
                                {item.category}
                            </span>
                            <h4 className="text-xs font-bold text-gray-800 truncate mt-1">
                                {item.title}
                            </h4>
                            <div className="flex items-center justify-between mt-1 text-[11px]">
                                <span className="font-extrabold text-[#FF1493]">
                                    {item.rentPricePerDay.toLocaleString('vi-VN')}đ/ngày
                                </span>
                                <span className="text-emerald-600 font-bold">
                                    🟢 Còn {item.availableStock} bộ sẵn sàng
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Date Picker Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Ngày bắt đầu thuê 📅
                            </label>
                            <input
                                type="date"
                                min={today}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#FFE4E1] focus:border-[#FF69B4] outline-none font-medium text-gray-700 bg-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Ngày trả đồ 🔄
                            </label>
                            <input
                                type="date"
                                min={startDate}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#FFE4E1] focus:border-[#FF69B4] outline-none font-medium text-gray-700 bg-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Họ và tên người thuê <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="VD: Bé Mèo Meo / Nguyễn Phương Thảo"
                                value={customerName}
                                onChange={(e) => {
                                    setCustomerName(e.target.value);
                                    if (errorMsg) setErrorMsg('');
                                }}
                                className="w-full px-3.5 py-2.5 text-xs rounded-xl border-2 border-[#FFE4E1] focus:border-[#FF69B4] outline-none text-gray-800 placeholder-gray-300"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Số điện thoại / Zalo nhận xác nhận <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                placeholder="VD: 0987654321"
                                value={customerPhone}
                                onChange={(e) => {
                                    setCustomerPhone(e.target.value);
                                    if (errorMsg) setErrorMsg('');
                                }}
                                className="w-full px-3.5 py-2.5 text-xs rounded-xl border-2 border-[#FFE4E1] focus:border-[#FF69B4] outline-none text-gray-800 placeholder-gray-300"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Ghi chú (Chiều cao, cân nặng, phụ kiện đi kèm...)
                            </label>
                            <textarea
                                rows={2}
                                placeholder="VD: Mình cao 1m58 nặng 47kg cần size M, có mang kèm tùng váy nhé shop..."
                                value={customerNote}
                                onChange={(e) => setCustomerNote(e.target.value)}
                                className="w-full px-3.5 py-2 text-xs rounded-xl border-2 border-[#FFE4E1] focus:border-[#FF69B4] outline-none text-gray-800 placeholder-gray-300 resize-none"
                            />
                        </div>
                    </div>

                    {/* Pricing Breakdown Summary */}
                    <div className="bg-[#FFF5F8] p-3.5 rounded-2xl border border-[#FFD1DC] space-y-1.5 text-xs">
                        <div className="flex justify-between text-gray-600">
                            <span>Thời gian thuê ({rentalDays} ngày):</span>
                            <span className="font-bold text-gray-800">{rentFee.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tiền đặt cọc trang phục:</span>
                            <span className="font-bold text-gray-800">{deposit.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="border-t border-pink-200 pt-2 flex justify-between items-baseline">
                            <span className="font-extrabold text-gray-800 text-sm">Tổng thanh toán ban đầu:</span>
                            <span className="text-lg font-black text-[#FF1493]">
                                {totalInitialCost.toLocaleString('vi-VN')}đ
                            </span>
                        </div>
                        <p className="text-[10px] text-pink-600 italic pt-1 leading-tight">
                            ✨ Tiền cọc ({deposit.toLocaleString('vi-VN')}đ) sẽ được shop chuyển khoản hoàn lại 100% ngay khi bạn trả đồ nguyên vẹn.
                        </p>
                    </div>

                    {errorMsg && (
                        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold text-center">
                            {errorMsg}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-2 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="flex-2 py-3 rounded-2xl bg-gradient-to-r from-[#FF69B4] to-[#FF1493] text-white font-black text-xs shadow-lg shadow-[#FF69B4]/30 hover:brightness-105 active:scale-95 transition-all"
                        >
                            Xác nhận đặt thuê 🌸
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
