import PopularSubjects from "./popularsubjects";
import QuickActions from "./quickactions";
import RecentActivity from "./recentactivity";
import StatsGrid from "./statsgrid";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 md:gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Welcome back, John!</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Here's an overview of your activity and popular notes</p>
          </div>
          <StatsGrid />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <RecentActivity />
            <PopularSubjects />
          </div>
          <QuickActions />
        </div>
      </main>
    </div>
  )
}
