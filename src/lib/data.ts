import { Product } from "@/components/shared/ProductCard"

export const bestSellers: Product[] = [
  { id: "1", title: "شیر کم چرب کاله 1 لیتری", price: 35000, discountPrice: 32000, image: "https://placehold.co/500x500/f8fafc/334155.png?text=Milk" },
  { id: "2", title: "روغن آفتابگردان اویلا 1.5 لیتری", price: 110000, discountPrice: 95000, image: "https://placehold.co/500x500/f8fafc/334155.png?text=Cooking+Oil", badge: "پرفروش" },
  { id: "3", title: "تخم مرغ 20 عددی تلاونگ", price: 85000, image: "https://placehold.co/500x500/f8fafc/334155.png?text=Eggs" },
  { id: "4", title: "پنیر فتا دوشه هراز 400 گرمی", price: 45000, discountPrice: 39000, image: "https://placehold.co/500x500/f8fafc/334155.png?text=Cheese" },
  { id: "5", title: "ماکارونی رشته‌ای زر ماکارون 700 گرمی", price: 24000, image: "https://placehold.co/500x500/f8fafc/334155.png?text=Pasta" },
  { id: "6", title: "رب گوجه فرنگی تبرک 800 گرمی", price: 55000, discountPrice: 48000, image: "https://placehold.co/500x500/f8fafc/334155.png?text=Tomato+Paste" },
]

export const hotOffers: Product[] = [
  { id: "7", title: "گوشت چرخ‌کرده گوساله 500 گرمی", price: 320000, discountPrice: 285000, image: "https://placehold.co/500x500/f8fafc/334155.png?text=Fresh+Meat" },
  { id: "8", title: "مرغ کامل تازه بسته بندی 2 کیلویی", price: 195000, discountPrice: 175000, image: "https://placehold.co/500x500/f8fafc/334155.png?text=Fresh+Chicken", badge: "پیشنهاد ویژه" },
  { id: "9", title: "برنج طارم هاشمی گلستان 5 کیلویی", price: 750000, discountPrice: 680000, image: "https://placehold.co/500x500/f8fafc/334155.png?text=Premium+Rice" },
  { id: "10", title: "چای سیلان محمود 500 گرمی", price: 210000, discountPrice: 165000, image: "https://placehold.co/500x500/f8fafc/334155.png?text=Ceylon+Tea" },
]

export const categories = [
  { id: "dairy", title: "لبنیات", icon: "🥛", color: "bg-blue-100 text-blue-600" },
  { id: "meat", title: "گوشت و مرغ", icon: "🥩", color: "bg-red-100 text-red-600" },
  { id: "fruits", title: "میوه و سبزیجات", icon: "🍎", color: "bg-green-100 text-green-600" },
  { id: "drinks", title: "نوشیدنی‌ها", icon: "🥤", color: "bg-orange-100 text-orange-600" },
  { id: "snacks", title: "تنقلات", icon: "🍿", color: "bg-yellow-100 text-yellow-600" },
  { id: "cleaning", title: "شوینده و بهداشتی", icon: "🧼", color: "bg-teal-100 text-teal-600" },
  { id: "pantry", title: "خواربار", icon: "🍚", color: "bg-amber-100 text-amber-600" },
  { id: "frozen", title: "مواد منجمد", icon: "❄️", color: "bg-cyan-100 text-cyan-600" },
]
