import React, { useState } from 'react';
import type { CosplayItem, RentalOrder } from '../types';

interface AdminDashboardProps {
    products: CosplayItem[];
    rentals: RentalOrder[];
    onSaveProduct: (product: CosplayItem) => void;
    onDeleteProduct: (id: string) => void;
    onUpdateStock: (id: string, deltaAvailable: number) => void;
    onReturnRentalOrder: (orderId: string, productId: string) => void;
    onCloseAdmin: () => void;
}

type AdminTab = 'analytics' | 'products' | 'rentals';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
    products,
    rentals,
    onSaveProduct,
    onDeleteProduct,
    onUpdateStock,
    onReturnRentalOrder,
    onCloseAdmin,
}) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
    const [editingProduct, setEditingProduct] = useState<CosplayItem | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Empty template for new item
    const emptyProduct: CosplayItem = {
        id: '',
        title: '',
        category: 'Costume',
        rentPricePerDay: 50000,
        depositPrice: 200000,
        imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600',
        badge: 'Mới',
        rating: 5.0,
        reviews: 0,
        description: '',
        totalStock: 5,
        availableStock: 5,
        likeCount: 0,
        rentCount: 0,
    };

    // Calculate Analytics KPIs
    const totalLikes = products.reduce((sum, p) => sum + p.likeCount, 0);
    const totalRentals = products.reduce((sum, p) => sum + p.rentCount, 0);
    const totalItemsInStock = products.reduce((sum, p) => sum + p.totalStock, 0);
    const currentlyRented = products.reduce((sum, p) => sum + Math.max(0, p.totalStock - p.availableStock), 0);
    const totalRevenueEst = rentals.reduce((sum, r) => sum + r.rentFee, 0);

    // Top Liked Products
    const topLikedProducts = [...products].sort((a, b) => b.likeCount - a.likeCount).slice(0, 5);
    // Top Rented Products
    const topRentedProducts = [...products].sort((a, b) => b.rentCount - a.rentCount).slice(0, 5);

    // Handle Form Submit for Add/Edit
    const handleProductFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;
        const toSave = {
            ...editingProduct,
            id: editingProduct.id || 'meo-' + Date.now(),
            totalStock: Number(editingProduct.totalStock) || 1,
            availableStock: Number(editingProduct.availableStock) || 0,
            rentPricePerDay: Number(editingProduct.rentPricePerDay) || 10000,
            depositPrice: Number(editingProduct.depositPrice) || 50000,
        };
        onSaveProduct(toSave);
        setEditingProduct(null);
        setIsCreating(false);
    };

    return (
        <section className="relative z-20 mx-3 sm:mx-auto max-w-6xl my-5 bg-white rounded-3xl border-2 border-purple-200 shadow-xl overflow-hidden anim-fade">
            {/* Top Admin Header Bar */}
            <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-[#FF1493] px-5 py-4 text-white flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 bg-white/10 rounded-2xl">👑</span>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-black tracking-wide">Bảng Điều Khiển Quản Trị Viên</h2>
                            <span className="text-[10px] bg-white/20 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Admin Mode
                            </span>
                        </div>
                        <p className="text-xs text-purple-100">
                            Thống kê tương tác người dùng • Quản lý kho &amp; đồ cho thuê
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onCloseAdmin}
                        className="px-3.5 py-1.5 rounded-full bg-white text-purple-700 font-extrabold text-xs hover:bg-purple-50 transition-colors shadow-xs"
                    >
                        Trở về xem trang Khách 🐱
                    </button>
                </div>
            </div>

            {/* KPI Cards Strip */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-purple-50/50 border-b border-purple-100">
                <div className="bg-white p-3 rounded-2xl border border-purple-100 shadow-xs">
                    <div className="text-lg">💖</div>
                    <div className="text-lg font-black text-rose-500 mt-1">{totalLikes}</div>
                    <div className="text-[11px] font-bold text-gray-500">Lượt Tim Yêu Thích</div>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-purple-100 shadow-xs">
                    <div className="text-lg">👗</div>
                    <div className="text-lg font-black text-purple-600 mt-1">{totalRentals}</div>
                    <div className="text-[11px] font-bold text-gray-500">Lượt Đã Cho Thuê</div>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-purple-100 shadow-xs">
                    <div className="text-lg">🔄</div>
                    <div className="text-lg font-black text-amber-500 mt-1">{currentlyRented} bộ</div>
                    <div className="text-[11px] font-bold text-gray-500">Đang Ngoài Kho (Khách giữ)</div>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-purple-100 shadow-xs">
                    <div className="text-lg">📦</div>
                    <div className="text-lg font-black text-indigo-600 mt-1">{totalItemsInStock} bộ</div>
                    <div className="text-[11px] font-bold text-gray-500">Tổng Số Bộ Trang Phục</div>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-purple-100 shadow-xs col-span-2 md:col-span-1">
                    <div className="text-lg">💰</div>
                    <div className="text-lg font-black text-emerald-600 mt-1">
                        {totalRevenueEst.toLocaleString('vi-VN')}đ
                    </div>
                    <div className="text-[11px] font-bold text-gray-500">Doanh Thu Thuê Tạm Tính</div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-100 px-4 pt-3 bg-white gap-2">
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-4 py-2.5 text-xs font-black rounded-t-2xl border-b-2 transition-colors flex items-center gap-1.5 ${
                        activeTab === 'analytics'
                            ? 'border-purple-600 text-purple-700 bg-purple-50/50'
                            : 'border-transparent text-gray-500 hover:text-purple-600'
                    }`}
                >
                    <span>📊</span>
                    <span>Thống Kê Tương Tác (Tim &amp; Thuê)</span>
                </button>

                <button
                    onClick={() => setActiveTab('products')}
                    className={`px-4 py-2.5 text-xs font-black rounded-t-2xl border-b-2 transition-colors flex items-center gap-1.5 ${
                        activeTab === 'products'
                            ? 'border-purple-600 text-purple-700 bg-purple-50/50'
                            : 'border-transparent text-gray-500 hover:text-purple-600'
                    }`}
                >
                    <span>📦</span>
                    <span>Quản Lý Đồ &amp; Số Lượng ({products.length})</span>
                </button>

                <button
                    onClick={() => setActiveTab('rentals')}
                    className={`px-4 py-2.5 text-xs font-black rounded-t-2xl border-b-2 transition-colors flex items-center gap-1.5 ${
                        activeTab === 'rentals'
                            ? 'border-purple-600 text-purple-700 bg-purple-50/50'
                            : 'border-transparent text-gray-500 hover:text-purple-600'
                    }`}
                >
                    <span>📋</span>
                    <span>Đơn Thuê &amp; Trả Đồ ({rentals.length})</span>
                </button>
            </div>

            {/* Tab Contents */}
            <div className="p-4 sm:p-5">
                {/* ── TAB 1: ANALYTICS & INTERACTION ── */}
                {activeTab === 'analytics' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 anim-fade">
                        {/* Top Liked Card */}
                        <div className="bg-[#FFF9FB] p-4 rounded-3xl border border-pink-100">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-black text-rose-600 flex items-center gap-2">
                                    <span>🏆</span>
                                    <span>Sản phẩm được TIM nhiều nhất</span>
                                </h3>
                                <span className="text-[10px] font-bold text-gray-400">Top 5</span>
                            </div>

                            <div className="space-y-2.5">
                                {topLikedProducts.map((p, idx) => (
                                    <div
                                        key={p.id}
                                        className="flex items-center gap-3 p-2.5 bg-white rounded-2xl border border-pink-100 shadow-2xs hover:scale-[1.01] transition-transform"
                                    >
                                        <span
                                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white ${
                                                idx === 0
                                                    ? 'bg-amber-400'
                                                    : idx === 1
                                                    ? 'bg-slate-400'
                                                    : idx === 2
                                                    ? 'bg-amber-700'
                                                    : 'bg-gray-300'
                                            }`}
                                        >
                                            {idx + 1}
                                        </span>
                                        <img src={p.imageUrl} alt={p.title} className="w-10 h-10 rounded-xl object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-bold text-gray-800 truncate">{p.title}</h4>
                                            <span className="text-[10px] text-gray-400">{p.category}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-black text-rose-500 flex items-center gap-1 justify-end">
                                                ❤️ {p.likeCount}
                                            </span>
                                            <span className="text-[9px] text-gray-400">lượt tim</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Rented Card */}
                        <div className="bg-[#F8F9FF] p-4 rounded-3xl border border-indigo-100">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-black text-indigo-600 flex items-center gap-2">
                                    <span>🚀</span>
                                    <span>Sản phẩm được THUÊ nhiều nhất</span>
                                </h3>
                                <span className="text-[10px] font-bold text-gray-400">Top 5</span>
                            </div>

                            <div className="space-y-2.5">
                                {topRentedProducts.map((p, idx) => (
                                    <div
                                        key={p.id}
                                        className="flex items-center gap-3 p-2.5 bg-white rounded-2xl border border-indigo-100 shadow-2xs hover:scale-[1.01] transition-transform"
                                    >
                                        <span
                                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white ${
                                                idx === 0
                                                    ? 'bg-amber-400'
                                                    : idx === 1
                                                    ? 'bg-slate-400'
                                                    : idx === 2
                                                    ? 'bg-amber-700'
                                                    : 'bg-gray-300'
                                            }`}
                                        >
                                            {idx + 1}
                                        </span>
                                        <img src={p.imageUrl} alt={p.title} className="w-10 h-10 rounded-xl object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-bold text-gray-800 truncate">{p.title}</h4>
                                            <span className="text-[10px] text-gray-400">
                                                Giá: {p.rentPricePerDay.toLocaleString('vi-VN')}đ/ngày
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-black text-indigo-600 flex items-center gap-1 justify-end">
                                                👗 {p.rentCount} lần
                                            </span>
                                            <span className="text-[9px] text-gray-400 font-semibold">
                                                ~{(p.rentCount * p.rentPricePerDay).toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 2: PRODUCTS CRUD & STOCK ── */}
                {activeTab === 'products' && (
                    <div className="space-y-4 anim-fade">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 font-bold">
                                Danh sách {products.length} món đồ cosplay / phụ kiện đang quản lý
                            </p>
                            <button
                                onClick={() => {
                                    setEditingProduct(emptyProduct);
                                    setIsCreating(true);
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs rounded-2xl shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5"
                            >
                                <span>+ Thêm món đồ mới</span>
                                <span>🐾</span>
                            </button>
                        </div>

                        {/* Product Table / List */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-gray-600 border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 text-gray-400 text-[11px] uppercase">
                                        <th className="py-2 px-3">Sản phẩm</th>
                                        <th className="py-2 px-2">Danh mục</th>
                                        <th className="py-2 px-2">Giá thuê / Cọc</th>
                                        <th className="py-2 px-2 text-center">Số lượng kho (Sẵn/Tổng)</th>
                                        <th className="py-2 px-2 text-center">Tương tác</th>
                                        <th className="py-2 px-3 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.map((p) => (
                                        <tr key={p.id} className="hover:bg-purple-50/30 transition-colors">
                                            <td className="py-2.5 px-3">
                                                <div className="flex items-center gap-2.5">
                                                    <img src={p.imageUrl} alt={p.title} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                                                    <div className="min-w-0 max-w-xs">
                                                        <p className="font-bold text-gray-800 truncate">{p.title}</p>
                                                        {p.badge && (
                                                            <span className="text-[9px] bg-pink-100 text-[#FF1493] px-1.5 py-0.2 rounded font-extrabold">
                                                                {p.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-2 font-medium">{p.category}</td>
                                            <td className="py-2.5 px-2">
                                                <div className="font-bold text-[#FF1493]">{p.rentPricePerDay.toLocaleString('vi-VN')}đ/ngày</div>
                                                <div className="text-[10px] text-gray-400">Cọc: {p.depositPrice.toLocaleString('vi-VN')}đ</div>
                                            </td>
                                            <td className="py-2.5 px-2">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        onClick={() => onUpdateStock(p.id, -1)}
                                                        disabled={p.availableStock <= 0}
                                                        className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30 text-xs font-bold"
                                                    >
                                                        −
                                                    </button>
                                                    <span className={`font-black text-xs ${p.availableStock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                        {p.availableStock}
                                                    </span>
                                                    <span className="text-gray-400 text-[10px]">/ {p.totalStock}</span>
                                                    <button
                                                        onClick={() => onUpdateStock(p.id, 1)}
                                                        disabled={p.availableStock >= p.totalStock}
                                                        className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30 text-xs font-bold"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-2 text-center">
                                                <span className="text-[11px] font-bold text-rose-500">❤️ {p.likeCount}</span>
                                                <span className="mx-1.5 text-gray-300">•</span>
                                                <span className="text-[11px] font-bold text-indigo-500">👗 {p.rentCount}</span>
                                            </td>
                                            <td className="py-2.5 px-3 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => {
                                                            setEditingProduct(p);
                                                            setIsCreating(false);
                                                        }}
                                                        className="px-2.5 py-1 text-xs font-bold rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                                                    >
                                                        Sửa ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm(`Bạn có chắc muốn xóa "${p.title}"?`)) {
                                                                onDeleteProduct(p.id);
                                                            }
                                                        }}
                                                        className="px-2 py-1 text-xs font-bold rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                    >
                                                        Xóa 🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── TAB 3: RENTALS & RETURNS ── */}
                {activeTab === 'rentals' && (
                    <div className="space-y-4 anim-fade">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 font-bold">
                                Danh sách {rentals.length} đơn khách đặt thuê đồ
                            </p>
                            <span className="text-xs font-bold text-indigo-600">
                                💡 Nhấn "Duyệt Trả Đồ" sẽ tự động cộng lại số lượng vào kho!
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-gray-600 border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 text-gray-400 text-[11px] uppercase">
                                        <th className="py-2 px-3">Mã đơn / Khách hàng</th>
                                        <th className="py-2 px-2">Sản phẩm thuê</th>
                                        <th className="py-2 px-2">Thời gian thuê</th>
                                        <th className="py-2 px-2">Tiền thuê &amp; Cọc</th>
                                        <th className="py-2 px-2 text-center">Trạng thái</th>
                                        <th className="py-2 px-3 text-right">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {rentals.map((r) => (
                                        <tr key={r.id} className="hover:bg-purple-50/20 transition-colors">
                                            <td className="py-3 px-3">
                                                <div className="font-extrabold text-gray-800">{r.customerName}</div>
                                                <div className="text-[11px] text-purple-700 font-bold">📞 {r.customerPhone}</div>
                                                <div className="text-[9px] text-gray-400">Mã: {r.id} • {r.createdAt}</div>
                                                {r.customerNote && (
                                                    <div className="text-[10px] text-gray-500 italic mt-0.5">
                                                        "{r.customerNote}"
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-2">
                                                <div className="flex items-center gap-2">
                                                    <img src={r.productImage} alt={r.productTitle} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                                                    <span className="font-bold text-gray-700 max-w-xs truncate">{r.productTitle}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-2">
                                                <div className="font-bold text-gray-700">{r.startDate} ➔ {r.endDate}</div>
                                                <div className="text-[10px] text-gray-400">({r.rentalDays} ngày)</div>
                                            </td>
                                            <td className="py-3 px-2">
                                                <div className="font-black text-[#FF1493]">{r.rentFee.toLocaleString('vi-VN')}đ</div>
                                                <div className="text-[10px] text-gray-500">Cọc giữ: {r.deposit.toLocaleString('vi-VN')}đ</div>
                                            </td>
                                            <td className="py-3 px-2 text-center">
                                                {r.status === 'active' ? (
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-700">
                                                        ⏳ Đang thuê
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                                                        ✅ Đã trả đồ &amp; hoàn cọc
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-3 text-right">
                                                {r.status === 'active' ? (
                                                    <button
                                                        onClick={() => onReturnRentalOrder(r.id, r.productId)}
                                                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs transition-colors shadow-xs active:scale-95"
                                                    >
                                                        Duyệt trả đồ 🔄
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 text-[11px] font-medium">Hoàn tất</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* ── PRODUCT CREATE / EDIT MODAL ── */}
            {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs anim-fade">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-purple-200 overflow-hidden anim-slide-up"
                    >
                        <div className="px-5 py-3.5 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
                            <h3 className="text-sm font-black">
                                {isCreating ? 'Thêm Sản Phẩm Thuê Mới 🐾' : 'Chỉnh Sửa Thông Tin Sản Phẩm ✏️'}
                            </h3>
                            <button
                                onClick={() => setEditingProduct(null)}
                                className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleProductFormSubmit} className="p-5 max-h-[80vh] overflow-y-auto space-y-3 text-xs">
                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Tên sản phẩm cosplay</label>
                                <input
                                    type="text"
                                    required
                                    value={editingProduct.title}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-purple-600 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Danh mục</label>
                                    <select
                                        value={editingProduct.category}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-purple-600 outline-none bg-white"
                                    >
                                        <option value="Costume">Costume (Trang phục)</option>
                                        <option value="Wig">Wig (Tóc giả)</option>
                                        <option value="Accessory">Accessory (Phụ kiện)</option>
                                        <option value="Shoes">Shoes (Giày dép)</option>
                                        <option value="Makeup">Makeup (Trang điểm)</option>
                                        <option value="Props">Props (Đạo cụ)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Badge hiển thị</label>
                                    <select
                                        value={editingProduct.badge || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, badge: (e.target.value as any) || undefined })}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-purple-600 outline-none bg-white"
                                    >
                                        <option value="">Không có</option>
                                        <option value="Hot">Hot 🔥</option>
                                        <option value="Mới">Mới ✨</option>
                                        <option value="Sale">Sale 💥</option>
                                        <option value="Yêu thích">Yêu thích ❤️</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Giá thuê 1 ngày (VNĐ)</label>
                                    <input
                                        type="number"
                                        required
                                        step={5000}
                                        value={editingProduct.rentPricePerDay}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, rentPricePerDay: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-purple-600 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Tiền cọc an toàn (VNĐ)</label>
                                    <input
                                        type="number"
                                        required
                                        step={10000}
                                        value={editingProduct.depositPrice}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, depositPrice: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-purple-600 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Tổng số lượng sở hữu</label>
                                    <input
                                        type="number"
                                        min={1}
                                        required
                                        value={editingProduct.totalStock}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, totalStock: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-purple-600 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Số bộ sẵn sàng cho thuê</label>
                                    <input
                                        type="number"
                                        min={0}
                                        required
                                        value={editingProduct.availableStock}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, availableStock: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-purple-600 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Link ảnh sản phẩm (URL)</label>
                                <input
                                    type="url"
                                    required
                                    value={editingProduct.imageUrl}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-purple-600 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Mô tả sản phẩm</label>
                                <textarea
                                    rows={3}
                                    value={editingProduct.description}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-purple-600 outline-none resize-none"
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-50"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="submit"
                                    className="flex-2 py-2.5 rounded-xl bg-purple-700 text-white font-black hover:bg-purple-800"
                                >
                                    Lưu sản phẩm 🐾
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};
