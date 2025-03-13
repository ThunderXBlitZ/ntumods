import { Bell, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="bg-[#1A2238] text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calendar className="h-8 w-8 text-[#4ECDC4]" />
          <h1 className="text-2xl font-bold">UniSchedule</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-[#4ECDC4]/20">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FF6B6B] flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <span className="hidden md:inline">Student</span>
          </div>
        </div>
      </div>
    </header>
  )
}

