import StatsCard from "./statscard"
import { FileText, TrendingUp, Users, Clock } from "lucide-react"

export default function StatsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="Total Notes" value="127" description="+12 from last week" icon={FileText} />
      <StatsCard title="Downloads" value="843" description="+28% from last month" icon={TrendingUp} />
      <StatsCard title="Followers" value="56" description="+8 new followers" icon={Users} />
      <StatsCard title="Study Time" value="24h" description="This week" icon={Clock} />
    </div>
  )
}
