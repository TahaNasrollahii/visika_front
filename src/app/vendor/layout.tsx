"use client"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Store, Package, ShoppingBag, Bell, LogOut, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { toast } from "sonner"

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "vendor") {
        router.push("/")
        toast.error("شما به پنل فروشندگان دسترسی ندارید")
      }
    }
  }, [user, loading, router])

  if (loading || !user || user.role !== "vendor") {
    return <div className="flex justify-center items-center h-screen font-bold text-muted-foreground">در حال بررسی دسترسی...</div>
  }

  if (user.status === 1) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)] gap-4 text-center">
        <Store className="w-16 h-16 text-muted-foreground opacity-50" />
        <h2 className="text-2xl font-black">حساب کاربری در انتظار تایید</h2>
        <p className="text-muted-foreground max-w-md">
          درخواست شما برای فعالیت به عنوان فروشنده با موفقیت ثبت شد. لطفا منتظر بمانید تا اطلاعات شما توسط مدیریت بررسی و تایید شود.
        </p>
        <Button onClick={() => {
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
            window.dispatchEvent(new Event("user-updated"))
            router.push("/")
          }} variant="outline" className="mt-4">
          خروج موقت
        </Button>
      </div>
    )
  }

  const handleLogout = async () => {
    try {
      await api.post("/users/logout/", { refresh: localStorage.getItem("refresh_token") })
    } catch (e) {}
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    window.dispatchEvent(new Event("user-updated"))
    toast.success("با موفقیت خارج شدید")
    router.push("/")
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8 overflow-hidden min-h-[calc(100vh-200px)]">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-72 shrink-0">
          <div className="sticky top-28 bg-white dark:bg-zinc-950 rounded-3xl p-6 border border-border shadow-sm flex flex-col gap-6 h-full">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <Store className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg text-foreground">{user.full_name}</span>
                <span className="text-sm text-muted-foreground font-medium">پنل فروشنده</span>
              </div>
            </div>

            <div className="h-px w-full bg-border" />

            <nav className="flex flex-col gap-2">
              <Link href="/vendor/products">
                <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-base hover:bg-secondary rounded-xl font-bold">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  مدیریت محصولات
                </Button>
              </Link>
              <Link href="/vendor/orders">
                <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-base hover:bg-secondary rounded-xl font-bold">
                  <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                  سفارشات مشتریان
                </Button>
              </Link>
              <Link href="/vendor/notifications">
                <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-base hover:bg-secondary rounded-xl font-bold">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  ارسال اعلان
                </Button>
              </Link>
              <Link href="/vendor/rules">
                <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-base hover:bg-secondary rounded-xl font-bold">
                  <Settings2 className="w-5 h-5 text-muted-foreground" />
                  قوانین فروشگاه
                </Button>
              </Link>
            </nav>

            <div className="h-px w-full bg-border mt-auto" />

            <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-3 h-12 text-base hover:bg-destructive/10 text-destructive hover:text-destructive rounded-xl font-bold">
              <LogOut className="w-5 h-5" />
              خروج از حساب
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 self-stretch">
          {children}
        </main>
      </div>
    </div>
  )
}
