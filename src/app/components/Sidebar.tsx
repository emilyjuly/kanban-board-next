import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { useFetchDataFromDbQuery } from "@/redux/services/apiSlice";
import { setPageTitle } from "@/redux/features/appSlice";
import { openAddAndEditBoardModal } from "@/redux/features/appSlice";

export default function Sidebar() {
    const [active, setActive] = useState<number>(0);

    const { data } = useFetchDataFromDbQuery();
    const dispatch = useAppDispatch();

    const handleNav = (index: number, name: string) => {
        setActive(index);
        dispatch(setPageTitle(name));
    };


    return (
        <aside className="w-[18.75rem] flex-none dark:bg-dark-grey h-full py-6 pr-6">
            {data && (
                <>
                    <p className="text-medium-grey pl-[2.12rem] text-[.95rem] font-semibold uppercase pb-3">
                        {`All Boards (${data.length})`}
                    </p>
                    {data.map(
                        (board: { [key: string]: any }, index: number) => {
                            const {name, id} = board.boards;
                            const isActive = index === active;
                            return (
                                <div
                                    key={id}
                                    onClick={() => handleNav(index, name)}
                                    className={`${
                                        isActive ? 'rounded-tr-full rounded-br-full bg-blue-500 text-white' : 'text-black'
                                    } cursor-pointer flex items-center 
                  space-x-2 pl-[2.12rem] py-3 pb-3`}
                                >
                                    <p className="text-lg capitalize">{name}</p>
                                </div>
                            );
                        }
                    )}
                </>
            )}
            <div
                className="hover:bg-gray-300 rounded-tr-full rounded-br-full cursor-pointer"
                onClick={() => dispatch(openAddAndEditBoardModal("Add New Board"))}
            >
                <button
                    className="flex items-center space-x-2 pl-[2.12rem] py-3"
                >
                    <p className="text-base font-bold capitalize text-main-purple">
                        + Create New Board
                    </p>
                </button>
            </div>
        </aside>
    )
}