import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { RentalModal } from '../components/RentalModal';
import { AdminDashboard } from '../components/AdminDashboard';
import bg_cat from '../assets/bg_cat.svg';
import hero from '../assets/hero.png';
import type { CosplayItem, FeedbackItem, RentalOrder, ToastMsg, UserRole } from '../types';
import {
    getStoredProducts,
    saveStoredProducts,
    getStoredFeedbacks,
    saveStoredFeedbacks,
    getStoredRentals,
    saveStoredRentals,
    getStoredWishlist,
    saveStoredWishlist,
    getStoredRole,
    saveStoredRole,
} from '../utils/storage';

const CATEGORIES = ['All', 'Costume', 'Wig', 'Accessory', 'Shoes', 'Props'] as const;

export default function HomePage() {
    // ── Persistent State ──
    const [products, setProducts] = useState<CosplayItem[]>(getStoredProducts);
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(getStoredFeedbacks);
    const [rentals, setRentals] = useState<RentalOrder[]>(getStoredRentals);
    const [wishlist, setWishlist] = useState<string[]>(getStoredWishlist);
    const [role, setRole] = useState<UserRole>(getStoredRole);

    // ── UI Filter & Search State ──
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showWishlistOnly, setShowWishlistOnly] = useState(false);

    // ── Modals State ──
    const [selectedProduct, setSelectedProduct] = useState<CosplayItem | null>(null);
    const [rentingProduct, setRentingProduct] = useState<CosplayItem | null>(null);
    const [zoomedPhoto, setZoomedPhoto] = useState<string | null>(null);

    // ── Feedback Form State inside Detail Modal ──
    const [newFbName, setNewFbName] = useState('');
    const [newFbRating, setNewFbRating] = useState(5);
    const [newFbComment, setNewFbComment] = useState('');
    const [newFbPhotoUrl, setNewFbPhotoUrl] = useState('');
    const [showFbForm, setShowFbForm] = useState(false);

    // ── Toast System ──
    const [toasts, setToasts] = useState<ToastMsg[]>([]);
    const toastIdRef = useRef(0);

    const showToast = useCallback((text: string, type: ToastMsg['type'] = 'success') => {
        const id = ++toastIdRef.current;
        setToasts((prev) => [...prev, { id, text, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3200);
    }, []);

    // ── Wishlist Toggle (Fixed Double Trigger & Synced with Likes) ──
    const handleToggleWishlist = (e?: React.MouseEvent, id?: string) => {
        if (e) e.stopPropagation();
        if (!id) return;

        const isFav = wishlist.includes(id);
        const nextWishlist = isFav ? wishlist.filter((x) => x !== id) : [...wishlist, id];
        setWishlist(nextWishlist);
        saveStoredWishlist(nextWishlist);

        // Update product likeCount
        const nextProducts = products.map((p) => {
            if (p.id === id) {
                return {
                    ...p,
                    likeCount: Math.max(0, p.likeCount + (isFav ? -1 : 1)),
                };
            }
            return p;
        });
        setProducts(nextProducts);
        saveStoredProducts(nextProducts);

        // Single trigger toast
        if (isFav) {
            showToast('Đã bỏ yêu thích', 'info');
        } else {
            showToast('Đã thêm vào yêu thích ❤️', 'success');
        }
    };

    // ── Switch Role (Guest <-> Admin) ──
    const handleToggleRole = () => {
        const nextRole: UserRole = role === 'admin' ? 'guest' : 'admin';
        setRole(nextRole);
        saveStoredRole(nextRole);
        showToast(
            nextRole === 'admin'
                ? 'Đã chuyển sang chế độ Quản trị viên (Admin) 👑'
                : 'Đã quay lại chế độ Khách xem đồ (Guest) 🐱',
            'info'
        );
    };

    // ── Confirm Rental Order (Guest) ──
    const handleConfirmRental = (orderData: Omit<RentalOrder, 'id' | 'createdAt'>) => {
        const newOrder: RentalOrder = {
            ...orderData,
            id: 'MEODON-' + Date.now().toString().slice(-6),
            createdAt: new Date().toLocaleString('vi-VN'),
        };

        // 1. Add order
        const nextRentals = [newOrder, ...rentals];
        setRentals(nextRentals);
        saveStoredRentals(nextRentals);

        // 2. Decrement available stock, increment rentCount
        const nextProducts = products.map((p) => {
            if (p.id === orderData.productId) {
                return {
                    ...p,
                    availableStock: Math.max(0, p.availableStock - 1),
                    rentCount: p.rentCount + 1,
                };
            }
            return p;
        });
        setProducts(nextProducts);
        saveStoredProducts(nextProducts);

        setRentingProduct(null);
        setSelectedProduct(null);
        showToast(
            `Đặt thuê thành công "${orderData.productTitle}"! Shop sẽ liên hệ bạn qua SĐT/Zalo 🌸`,
            'success'
        );
    };

    // ── Admin Actions ──
    const handleSaveProduct = (product: CosplayItem) => {
        const exists = products.some((p) => p.id === product.id);
        const nextProducts = exists
            ? products.map((p) => (p.id === product.id ? product : p))
            : [product, ...products];
        setProducts(nextProducts);
        saveStoredProducts(nextProducts);
        showToast(exists ? 'Đã cập nhật sản phẩm thành công!' : 'Đã thêm sản phẩm mới thành công! 🐾');
    };

    const handleDeleteProduct = (id: string) => {
        const nextProducts = products.filter((p) => p.id !== id);
        setProducts(nextProducts);
        saveStoredProducts(nextProducts);
        showToast('Đã xóa sản phẩm khỏi kho', 'info');
    };

    const handleUpdateStock = (id: string, deltaAvailable: number) => {
        const nextProducts = products.map((p) => {
            if (p.id === id) {
                const newAvailable = Math.max(0, Math.min(p.totalStock, p.availableStock + deltaAvailable));
                return { ...p, availableStock: newAvailable };
            }
            return p;
        });
        setProducts(nextProducts);
        saveStoredProducts(nextProducts);
        showToast('Đã cập nhật số lượng khả dụng trong kho!', 'info');
    };

    const handleReturnRentalOrder = (orderId: string, productId: string) => {
        // Mark order returned
        const nextRentals = rentals.map((r) =>
            r.id === orderId ? { ...r, status: 'returned' as const } : r
        );
        setRentals(nextRentals);
        saveStoredRentals(nextRentals);

        // Restore stock
        const nextProducts = products.map((p) => {
            if (p.id === productId) {
                return { ...p, availableStock: Math.min(p.totalStock, p.availableStock + 1) };
            }
            return p;
        });
        setProducts(nextProducts);
        saveStoredProducts(nextProducts);
        showToast('Đã duyệt nhận trả đồ & cộng lại 1 bộ vào kho thành công! 🔄');
    };

    // ── Add Feedback to Product ──
    const handleAddFeedback = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;
        if (!newFbName.trim() || !newFbComment.trim()) {
            showToast('Vui lòng nhập tên và lời nhắn đánh giá nyaa~', 'error');
            return;
        }

        const newFb: FeedbackItem = {
            id: 'fb-' + Date.now(),
            productId: selectedProduct.id,
            userName: newFbName.trim(),
            rating: newFbRating,
            comment: newFbComment.trim(),
            date: new Date().toLocaleDateString('vi-VN'),
            photos: newFbPhotoUrl.trim()
                ? [newFbPhotoUrl.trim()]
                : ['https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600'],
        };

        const nextFeedbacks = [newFb, ...feedbacks];
        setFeedbacks(nextFeedbacks);
        saveStoredFeedbacks(nextFeedbacks);

        // Update product review count
        const nextProducts = products.map((p) =>
            p.id === selectedProduct.id ? { ...p, reviews: p.reviews + 1 } : p
        );
        setProducts(nextProducts);
        saveStoredProducts(nextProducts);

        setNewFbName('');
        setNewFbComment('');
        setNewFbPhotoUrl('');
        setShowFbForm(false);
        showToast('Cảm ơn bạn đã gửi feedback kèm ảnh siêu xinh! 💖');
    };

    // ── Filtering Logic ──
    const filteredProducts = products.filter((p) => {
        const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
        const matchSearch =
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchWishlist = showWishlistOnly ? wishlist.includes(p.id) : true;
        return matchCat && matchSearch && matchWishlist;
    });

    // ── Body Scroll Lock when Modals Open ──
    useEffect(() => {
        const isAnyModalOpen = !!selectedProduct || !!rentingProduct || !!zoomedPhoto;
        document.body.style.overflow = isAnyModalOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedProduct, rentingProduct, zoomedPhoto]);

    // Product's feedbacks
    const currentFeedbacks = selectedProduct
        ? feedbacks.filter((f) => f.productId === selectedProduct.id)
        : [];

    return (
        <>
            {/* ── Global Styles ── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
                * { font-family: 'Nunito', sans-serif; box-sizing: border-box; }
                @keyframes movePaws {
                    0% { background-position: 0 0; }
                    100% { background-position: 250px 250px; }
                }
                .paw-bg {
                    background-image: url('${bg_cat}');
                    animation: movePaws 25s linear infinite;
                }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .anim-slide-down { animation: slideDown .3s ease; }
                .anim-slide-up { animation: slideUp .3s ease; }
                .anim-fade { animation: fadeIn .25s ease; }
                .scrollbar-none::-webkit-scrollbar { display: none; }
                .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <div className="relative min-h-screen bg-[#FFF0F5] overflow-x-hidden selection:bg-[#FF69B4] selection:text-white">
                {/* ── Animated Background ── */}
                <div className="paw-bg fixed inset-0 opacity-[0.035] z-0 pointer-events-none bg-repeat" />

                {/* ── HEADER ── */}
                <Header
                    role={role}
                    onToggleRole={handleToggleRole}
                    wishlistCount={wishlist.length}
                    showWishlistOnly={showWishlistOnly}
                    onToggleWishlistOnly={() => {
                        setShowWishlistOnly((prev) => !prev);
                        if (!showWishlistOnly) {
                            showToast('Đang lọc danh sách đồ bạn đã thả tim ❤️', 'info');
                        }
                    }}
                />

                {/* ── ADMIN DASHBOARD (Show when role === 'admin') ── */}
                {role === 'admin' && (
                    <AdminDashboard
                        products={products}
                        rentals={rentals}
                        onSaveProduct={handleSaveProduct}
                        onDeleteProduct={handleDeleteProduct}
                        onUpdateStock={handleUpdateStock}
                        onReturnRentalOrder={handleReturnRentalOrder}
                        onCloseAdmin={() => {
                            setRole('guest');
                            saveStoredRole('guest');
                        }}
                    />
                )}

                {/* ── HERO BANNER ── */}
                <section className="relative z-10 mx-3 sm:mx-auto max-w-6xl mt-4 rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFB6D9] via-[#FF80BE] to-[#FF4D9E] shadow-xl shadow-[#FF69B4]/25">
                    <div className="flex items-center justify-between px-6 py-7 md:py-9">
                        <div className="flex-1">
                            <span className="inline-flex items-center gap-1.5 bg-white/25 backdrop-blur-md text-white text-xs font-black px-3.5 py-1 rounded-full mb-3 shadow-xs">
                                <span>🐾</span>
                                <span>Dịch Vụ Thuê Đồ Cosplay &amp; Phụ Kiện Anime</span>
                            </span>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-xs">
                                Thuê đồ cosplay <span className="text-yellow-200">siêu xinh</span>,<br />
                                sẵn sàng tỏa sáng mọi festival!
                            </h2>
                            <p className="text-white/90 text-xs sm:text-sm mt-2 max-w-xl font-medium">
                                Check ngay tình trạng còn đồ trong kho • Cọc minh bạch hoàn 100% • Giặt thơm sạch sẽ
                            </p>
                            <div className="flex items-center gap-3 mt-4">
                                <button
                                    onClick={() => {
                                        document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="bg-white text-[#FF1493] font-black text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
                                >
                                    Khám phá đồ thuê ngay 🐾
                                </button>
                                <span className="text-white/80 text-xs font-bold hidden sm:inline">
                                    Đã có hơn 100+ bạn coser tin tưởng ✨
                                </span>
                            </div>
                        </div>
                        <div className="hidden sm:block flex-shrink-0 ml-4">
                            <img src={hero} alt="Meomeo Cosplay" className="w-28 md:w-36 drop-shadow-xl" />
                        </div>
                    </div>
                </section>

                {/* ── SEARCH & FILTER CONTROLS ── */}
                <div id="catalog-section" className="relative z-10 mx-3 sm:mx-auto max-w-6xl mt-5 space-y-3">
                    {/* Search Bar */}
                    <div className="relative">
                        <svg
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF69B4]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên nhân vật, wig, váy maid, tai mèo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-10 py-3 rounded-2xl border-2 border-[#FFE4E1] bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#FF69B4] shadow-xs transition-colors font-medium"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF69B4] text-sm"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Category Filter Pills & Wishlist Reset */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex gap-2 overflow-x-auto scrollbar-none py-1 flex-1">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-black border-2 transition-all duration-200 active:scale-95 ${
                                        selectedCategory === cat
                                            ? 'bg-[#FF69B4] border-[#FF69B4] text-white shadow-md shadow-[#FF69B4]/25'
                                            : 'bg-white border-[#FFE4E1] text-[#777] hover:border-[#FF69B4] hover:text-[#FF69B4]'
                                    }`}
                                >
                                    {cat === 'All' ? '🐾 Tất cả' : cat}
                                </button>
                            ))}
                        </div>

                        {showWishlistOnly && (
                            <button
                                onClick={() => setShowWishlistOnly(false)}
                                className="flex-shrink-0 text-xs text-red-500 font-extrabold px-3 py-1.5 rounded-full bg-red-50 border border-red-200 hover:bg-red-100"
                            >
                                Đang xem Tim (Bỏ lọc ✕)
                            </button>
                        )}
                    </div>
                </div>

                {/* ── PRODUCT CATALOG GRID ── */}
                <main className="relative z-10 mx-3 sm:mx-auto max-w-6xl mt-4 pb-20">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <span className="text-xs text-gray-500 font-bold">
                            Hiển thị {filteredProducts.length} món đồ cosplay
                        </span>
                        <span className="text-[11px] text-[#FF1493] font-bold">
                            💡 Nhấn vào sản phẩm để xem ảnh feedback người thật &amp; kiểm tra kho!
                        </span>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white/70 rounded-3xl border-2 border-dashed border-[#FFE4E1]">
                            <span className="text-5xl">😿</span>
                            <p className="text-gray-500 font-bold text-sm">
                                {showWishlistOnly
                                    ? 'Bạn chưa thả tim món đồ nào cả nyaa~'
                                    : 'Không tìm thấy món đồ nào phù hợp!'}
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('All');
                                    setShowWishlistOnly(false);
                                }}
                                className="text-xs text-[#FF69B4] font-black underline hover:text-[#FF1493]"
                            >
                                Xem toàn bộ kho đồ 🐾
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                            {filteredProducts.map((item) => (
                                <ProductCard
                                    key={item.id}
                                    item={item}
                                    isWishlisted={wishlist.includes(item.id)}
                                    onToggleWishlist={handleToggleWishlist}
                                    onOpenDetail={(product) => setSelectedProduct(product)}
                                    onOpenRentModal={(product) => setRentingProduct(product)}
                                />
                            ))}
                        </div>
                    )}
                </main>

                {/* ── FOOTER ── */}
                <footer className="relative z-10 bg-white/95 border-t-2 border-[#FFE4E1] px-5 py-8 text-center backdrop-blur-md">
                    <div className="max-w-xl mx-auto space-y-2">
                        <p className="text-2xl">🐱</p>
                        <h4 className="text-[#FF69B4] font-black text-lg">Meomeo Shop • Cosplay Rental</h4>
                        <p className="text-gray-400 text-xs">
                            Hỗ trợ thử đồ trực tiếp • Đặt cọc linh hoạt • Nhận ship đồ toàn quốc
                        </p>
                        <div className="flex justify-center gap-4 text-xs font-bold text-gray-500 pt-2">
                            <span className="hover:text-[#FF69B4] cursor-pointer">Quy định thuê đồ</span>
                            <span>•</span>
                            <span className="hover:text-[#FF69B4] cursor-pointer">Chính sách cọc &amp; hoàn cọc</span>
                            <span>•</span>
                            <span className="hover:text-[#FF69B4] cursor-pointer">Liên hệ Zalo: 0987.xxx.xxx</span>
                        </div>
                        <p className="text-[10px] text-gray-400 pt-3">
                            © 2026 Meomeo Shop. Thiết kế dành riêng cho cộng đồng Cosplay &amp; Anime 🌸
                        </p>
                    </div>
                </footer>

                {/* ─────────────────────────────────────────────────────────────
                    PRODUCT DETAIL MODAL (WITH CUSTOMER FEEDBACK PHOTOS)
                ───────────────────────────────────────────────────────────── */}
                {selectedProduct && (
                    <div
                        onClick={() => setSelectedProduct(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs anim-fade overflow-y-auto"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-[#FFE4E1] overflow-hidden anim-slide-up my-auto max-h-[90vh] flex flex-col"
                        >
                            {/* Modal Header Image */}
                            <div className="relative w-full h-56 sm:h-64 bg-gray-100 flex-shrink-0">
                                <img
                                    src={selectedProduct.imageUrl}
                                    alt={selectedProduct.title}
                                    className="w-full h-full object-cover"
                                />

                                {/* Close Button */}
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors backdrop-blur-sm text-sm"
                                >
                                    ✕
                                </button>

                                {/* Wishlist Heart */}
                                <button
                                    onClick={(e) => handleToggleWishlist(e, selectedProduct.id)}
                                    className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 active:scale-90 transition-transform"
                                >
                                    <span className="text-lg">
                                        {wishlist.includes(selectedProduct.id) ? '❤️' : '🤍'}
                                    </span>
                                </button>

                                {/* Badges */}
                                <div className="absolute bottom-3 left-3 flex gap-2">
                                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FF69B4] text-white shadow-sm">
                                        {selectedProduct.category}
                                    </span>
                                    {selectedProduct.badge && (
                                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-white shadow-sm">
                                            {selectedProduct.badge}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Modal Scrollable Content */}
                            <div className="p-5 overflow-y-auto scrollbar-none flex-1 space-y-4">
                                {/* Title & Stats */}
                                <div>
                                    <h3 className="text-base sm:text-lg font-black text-gray-800 leading-snug">
                                        {selectedProduct.title}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                                        <span className="font-bold text-amber-500">⭐ {selectedProduct.rating} / 5</span>
                                        <span>•</span>
                                        <span>{currentFeedbacks.length} lượt đánh giá thực tế</span>
                                        <span>•</span>
                                        <span className="text-rose-500 font-bold">❤️ {selectedProduct.likeCount} lượt tim</span>
                                    </div>
                                </div>

                                {/* Stock Availability Alert */}
                                <div
                                    className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                                        selectedProduct.availableStock > 0
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                            : 'bg-rose-50 border-rose-200 text-rose-800'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">
                                            {selectedProduct.availableStock > 0 ? '🟢' : '🔴'}
                                        </span>
                                        <div>
                                            <p className="text-xs font-black">
                                                {selectedProduct.availableStock > 0
                                                    ? `SẴN SÀNG CHO THUÊ (Còn ${selectedProduct.availableStock}/${selectedProduct.totalStock} bộ)`
                                                    : 'TẠM HẾT ĐỒ CHO THUÊ'}
                                            </p>
                                            <p className="text-[10px] opacity-80">
                                                {selectedProduct.availableStock > 0
                                                    ? 'Trang phục đã được giặt là sạch sẽ, thơm tho, có thể nhận ngay.'
                                                    : 'Hiện các bộ đều đang có khách thuê. Bạn có thể liên hệ shop để đặt lịch trước.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Rental Rates Card */}
                                <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#FFF5F8] rounded-2xl border border-[#FFE4E1]">
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                            Giá thuê đồ
                                        </span>
                                        <div className="text-lg font-black text-[#FF1493] mt-0.5">
                                            {selectedProduct.rentPricePerDay.toLocaleString('vi-VN')}đ
                                            <span className="text-xs font-bold text-gray-500">/ngày</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                            Tiền cọc giữ đồ
                                        </span>
                                        <div className="text-lg font-black text-gray-800 mt-0.5">
                                            {selectedProduct.depositPrice.toLocaleString('vi-VN')}đ
                                        </div>
                                        <span className="text-[9px] text-pink-600 font-bold">
                                            (Hoàn lại 100% khi trả)
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                                        Mô tả trang phục &amp; phụ kiện 🌸
                                    </h4>
                                    <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-2xl">
                                        {selectedProduct.description}
                                    </p>
                                </div>

                                {/* ─────────────────────────────────────────────
                                    CUSTOMER FEEDBACK & PHOTOS SECTION
                                ───────────────────────────────────────────── */}
                                <div className="border-t border-pink-100 pt-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-xs font-black text-[#FF1493] flex items-center gap-1.5 uppercase tracking-wide">
                                                <span>📸</span>
                                                <span>Feedback từ người dùng ({currentFeedbacks.length})</span>
                                            </h4>
                                            <p className="text-[10px] text-gray-400">
                                                Ảnh chụp thực tế từ các bạn coser đã thuê
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setShowFbForm((prev) => !prev)}
                                            className="text-xs font-black text-[#FF69B4] bg-[#FFF0F5] px-3 py-1.5 rounded-full border border-[#FFE4E1] hover:bg-[#FFE4F0] transition-colors"
                                        >
                                            {showFbForm ? 'Đóng form ✕' : '+ Viết đánh giá ✍️'}
                                        </button>
                                    </div>

                                    {/* Feedback Add Form */}
                                    {showFbForm && (
                                        <form
                                            onSubmit={handleAddFeedback}
                                            className="p-3.5 bg-[#FFF9FB] rounded-2xl border border-pink-200 space-y-2.5 anim-slide-down text-xs"
                                        >
                                            <p className="font-extrabold text-gray-700">Chia sẻ trải nghiệm của bạn ✨</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Tên hoặc biệt danh của bạn *"
                                                    value={newFbName}
                                                    onChange={(e) => setNewFbName(e.target.value)}
                                                    className="px-3 py-2 rounded-xl border border-pink-200 outline-none focus:border-[#FF69B4] bg-white"
                                                    required
                                                />
                                                <select
                                                    value={newFbRating}
                                                    onChange={(e) => setNewFbRating(Number(e.target.value))}
                                                    className="px-3 py-2 rounded-xl border border-pink-200 outline-none focus:border-[#FF69B4] bg-white font-bold"
                                                >
                                                    <option value={5}>⭐⭐⭐⭐⭐ (5 sao)</option>
                                                    <option value={4}>⭐⭐⭐⭐ (4 sao)</option>
                                                    <option value={3}>⭐⭐⭐ (3 sao)</option>
                                                </select>
                                            </div>
                                            <textarea
                                                rows={2}
                                                placeholder="Cảm nhận về độ vừa vặn, mùi hương, vải..."
                                                value={newFbComment}
                                                onChange={(e) => setNewFbComment(e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl border border-pink-200 outline-none focus:border-[#FF69B4] bg-white resize-none"
                                                required
                                            />
                                            <input
                                                type="url"
                                                placeholder="Link ảnh feedback của bạn (URL ảnh)"
                                                value={newFbPhotoUrl}
                                                onChange={(e) => setNewFbPhotoUrl(e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl border border-pink-200 outline-none focus:border-[#FF69B4] bg-white"
                                            />
                                            <button
                                                type="submit"
                                                className="w-full py-2.5 bg-[#FF69B4] text-white font-black rounded-xl hover:bg-[#FF1493] transition-colors"
                                            >
                                                Gửi đánh giá &amp; Ảnh 🐾
                                            </button>
                                        </form>
                                    )}

                                    {/* Feedback List */}
                                    {currentFeedbacks.length === 0 ? (
                                        <p className="text-center text-xs text-gray-400 italic py-3 bg-gray-50 rounded-xl">
                                            Chưa có feedback nào cho sản phẩm này. Hãy là người đầu tiên thuê và chia sẻ ảnh nhé! 🌸
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {currentFeedbacks.map((fb) => (
                                                <div
                                                    key={fb.id}
                                                    className="p-3 bg-white rounded-2xl border border-pink-100 shadow-2xs space-y-2"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-full bg-[#FFF0F5] border border-pink-200 text-[#FF69B4] font-bold text-xs flex items-center justify-center">
                                                                🐱
                                                            </div>
                                                            <div>
                                                                <h5 className="font-extrabold text-xs text-gray-800">
                                                                    {fb.userName}
                                                                </h5>
                                                                <span className="text-[10px] text-gray-400">
                                                                    {fb.date}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-amber-400 text-xs">
                                                            {'★'.repeat(fb.rating)}
                                                            <span className="text-gray-200">
                                                                {'★'.repeat(5 - fb.rating)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-xs text-gray-600 leading-snug">
                                                        "{fb.comment}"
                                                    </p>

                                                    {/* Feedback Photo Thumbnails */}
                                                    {fb.photos && fb.photos.length > 0 && (
                                                        <div className="flex gap-2 pt-1">
                                                            {fb.photos.map((photo, pIdx) => (
                                                                <img
                                                                    key={pIdx}
                                                                    src={photo}
                                                                    alt={`Feedback ${fb.userName}`}
                                                                    onClick={() => setZoomedPhoto(photo)}
                                                                    className="w-16 h-16 rounded-xl object-cover border border-pink-200 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                                                                    title="Nhấn để phóng to ảnh"
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Modal Bottom CTA */}
                            <div className="p-4 bg-white border-t border-[#FFE4E1] flex gap-3 flex-shrink-0">
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors"
                                >
                                    Đóng
                                </button>
                                {selectedProduct.availableStock > 0 ? (
                                    <button
                                        onClick={() => {
                                            setRentingProduct(selectedProduct);
                                            setSelectedProduct(null);
                                        }}
                                        className="flex-2 py-3 rounded-2xl bg-gradient-to-r from-[#FF69B4] to-[#FF1493] text-white font-black text-xs shadow-lg shadow-[#FF69B4]/30 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                                    >
                                        <span>Thuê đồ cosplay ngay</span>
                                        <span>🐾</span>
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="flex-2 py-3 rounded-2xl bg-gray-200 text-gray-400 font-bold text-xs cursor-not-allowed"
                                    >
                                        Tạm hết đồ cho thuê 😿
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    RENTAL BOOKING MODAL
                ───────────────────────────────────────────────────────────── */}
                {rentingProduct && (
                    <RentalModal
                        item={rentingProduct}
                        onClose={() => setRentingProduct(null)}
                        onSubmitRental={handleConfirmRental}
                    />
                )}

                {/* ─────────────────────────────────────────────────────────────
                    PHOTO ZOOM LIGHTBOX
                ───────────────────────────────────────────────────────────── */}
                {zoomedPhoto && (
                    <div
                        onClick={() => setZoomedPhoto(null)}
                        className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 anim-fade backdrop-blur-sm cursor-zoom-out"
                    >
                        <div className="relative max-w-2xl max-h-[90vh]">
                            <img
                                src={zoomedPhoto}
                                alt="Feedback cosplay to"
                                className="max-w-full max-h-[85vh] rounded-3xl object-contain shadow-2xl border-2 border-white/20"
                            />
                            <p className="text-center text-white text-xs mt-2 font-bold">
                                Nhấn vào bất kỳ đâu để đóng ✕
                            </p>
                        </div>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TOAST NOTIFICATIONS (FIXED OVERFLOW & WRAPPING)
                ───────────────────────────────────────────────────────────── */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none px-4 w-full max-w-lg">
                    {toasts.map((toast) => (
                        <div
                            key={toast.id}
                            className={`anim-slide-up px-5 py-3 rounded-2xl shadow-2xl text-xs sm:text-sm font-black text-white max-w-md w-auto text-center break-words flex items-center justify-center gap-2 border border-white/20 pointer-events-auto backdrop-blur-md ${
                                toast.type === 'success'
                                    ? 'bg-gradient-to-r from-[#FF69B4] to-[#FF1493] shadow-pink-500/30'
                                    : toast.type === 'error'
                                    ? 'bg-gradient-to-r from-red-500 to-rose-600 shadow-red-500/30'
                                    : 'bg-gradient-to-r from-gray-700 to-slate-800 shadow-gray-500/30'
                            }`}
                        >
                            <span>{toast.type === 'success' ? '🐾' : toast.type === 'error' ? '⚠️' : 'ℹ️'}</span>
                            <span className="leading-snug">{toast.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}