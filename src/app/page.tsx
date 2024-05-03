import Sidebar from "@/app/components/Sidebar";
import BoardTasks from "@/app/components/BoardTasks";

export default function Home() {
    return (
        <main className="flex h-full">
            <Sidebar />
            <BoardTasks />
        </main>
    )
}