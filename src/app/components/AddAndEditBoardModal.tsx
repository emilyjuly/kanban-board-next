import { useState, useEffect } from "react";
import { Modal, ModalBody } from "./Modal";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
    getAddAndEditBoardModalValue,
    getAddAndEditBoardModalVariantValue,
    closeAddAndEditBoardModal,
    getPageTitle,
} from "@/redux/features/appSlice";
import {
    useFetchDataFromDbQuery,
    useUpdateBoardToDbMutation,
} from "@/redux/services/apiSlice";
import { FaTimes } from "react-icons/fa";
import { id } from '../utils/data';

interface IBoardData {
    id: string,
    name: string;
    columns: {
        id: string;
        name: string;
        columns?: { name: string; tasks?: { [key: string]: any }[] };
    }[];
}

let addBoardData = {
    id: id(),
    name: "",
    columns: [
        {
            id: id(),
            name: "",
            tasks:
                [],
        },
    ],};

export default function AddAndEditBoardModal() {
    const [boardData, setBoardData] = useState<IBoardData>();
    const [isBoardNameEmpty, setIsBoardNameEmpty] = useState<boolean>(false);
    const [emptyColumnIndex, setEmptyColumnIndex] = useState<number>();

    const modalVariant: string = useAppSelector(getAddAndEditBoardModalVariantValue);
    const isVariantAdd: boolean = modalVariant === "Add New Board";
    const dispatch = useAppDispatch();
    const isOpen: boolean = useAppSelector(getAddAndEditBoardModalValue);
    const currentBoardTitle = useAppSelector(getPageTitle);
    const closeModal = () => dispatch(closeAddAndEditBoardModal());
    let { data } = useFetchDataFromDbQuery();
    const [updateBoardToDb, { isLoading }] = useUpdateBoardToDbMutation();

    useEffect((): void => {
        if (data) {

            if (isVariantAdd) {
                setBoardData(addBoardData);
            } else {
                const activeBoard = data.find(
                    (board: { name: string }): boolean => board.boards.name === currentBoardTitle
                );
                setBoardData(activeBoard);
            }
        }
    }, [data, modalVariant]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsBoardNameEmpty(false);
            setEmptyColumnIndex(undefined);
        }, 3000);
        return () => clearTimeout(timeoutId);
    }, [emptyColumnIndex, isBoardNameEmpty]);

    const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (boardData) {
            const newName = { ...boardData, name: e.target.value };
            setBoardData(newName);
        }
    };

    const handleColumnNameChange = (index: number) => {
        return function (e: React.ChangeEvent<HTMLInputElement>): void {
            if (boardData) {
                const modifyColumns = boardData.columns.map((column, columnIndex: number) => {
                    if (columnIndex === index) {
                        return { ...column, name: e.target.value };
                    }
                    return column;
                });
                const modifiedColumn = { ...boardData, columns: modifyColumns };
                setBoardData(modifiedColumn);
            }
        };
    };

    const handleAddNewColumn = (): void => {
        if (boardData && boardData.columns.length < 6) {
            const updatedBoardData = { ...boardData };
            const newColumn = { id: id(), name: "", tasks: [] };
            updatedBoardData.columns = [...updatedBoardData.columns, newColumn];
            setBoardData(updatedBoardData);
        }
    };

    const handleDeleteColumn = (index: number): void => {
        if (boardData) {
            const filteredColumns = boardData.columns.filter(
                (_column, columnIndex: number): boolean => columnIndex !== index
            );
            setBoardData({ ...boardData, columns: filteredColumns });
        }
    };

    const handleAddNewBoardToDb = async (e: React.FormEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault();

        const emptyColumnStringChecker: boolean = boardData?.columns.some(
            (column): boolean => column.name === ""
        );

        if (boardData?.name === "") {
            setIsBoardNameEmpty(true);
        }

        if (emptyColumnStringChecker) {
            const emptyColumn: number = boardData?.columns.findIndex(
                (column): boolean => column.name == ""
            );
            setEmptyColumnIndex(emptyColumn);
        }

        if (boardData?.name !== "" && !emptyColumnStringChecker) {
            try {
                const result = await updateBoardToDb(boardData);

                if (result.error) {
                    console.error("Erro ao atualizar o documento:", result.error);
                } else {
                    console.log("Documento atualizado com sucesso!");
                }
            } catch (error) {
                console.error("Ocorreu um erro inesperado:", error);
            }
        }
    };

    const handleEditBoardToDb = (e: React.FormEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        const emptyColumnStringChecker: boolean = boardData?.columns.some(
            (column): boolean => column.name === ""
        );
        if (boardData?.name === "") {
            setIsBoardNameEmpty(true);
        }
        if (emptyColumnStringChecker) {
            const emptyColumn: number = boardData?.columns.findIndex(
                (column): boolean => column.name == ""
            );
            setEmptyColumnIndex(emptyColumn);
        }
        if (boardData?.name !== "" && !emptyColumnStringChecker) {
            if (data) {
                const [boards] = data;
                const boardsCopy = [...boards.boards];
                const activeBoardIndex: number = boardsCopy.findIndex(
                    (board: { name: string }): boolean => board.name === currentBoardTitle
                );
                const updatedBoard = {
                    ...boards.boards[activeBoardIndex],
                    name: boardData!.name,
                    columns: boardData!.columns,
                } ;
                boardsCopy[activeBoardIndex] = updatedBoard;
                updateBoardToDb(boardsCopy);
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={closeModal}>
            <ModalBody>
                {boardData && (
                    <>
                        <p className="text-lg font-bold">{modalVariant}</p>
                        <div className="py-6">
                            <div>
                                <label htmlFor="boardName" className="text-sm">
                                    Board Name
                                </label>
                                <div className="pt-2">
                                    <input
                                        id="boardName"
                                        className={`${
                                            isBoardNameEmpty ? "border-red-500" : "border-stone-200"
                                        } border w-full p-2 rounded text-sm cursor-pointer focus:outline-none`}
                                        placeholder="Name"
                                        value={boardData.name}
                                        onChange={handleBoardNameChange}
                                    />
                                </div>
                                {isBoardNameEmpty ? (
                                    <p className="text-xs text-red-500">
                                        Board name cannot be empty
                                    </p>
                                ) : (
                                    ""
                                )}
                            </div>

                            <div className="mt-6">
                                <label htmlFor="" className="text-sm">
                                    Board Column
                                </label>
                                {boardData &&
                                    boardData.boards.columns.map(
                                        (column: { name: string, id: string }, index: number) => {
                                            let { name, id } = column;
                                            return (
                                                <div key={id} className="pt-2">
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            className={`${
                                                                emptyColumnIndex === index
                                                                    ? "border-red-500"
                                                                    : "border-stone-200"
                                                            } border border-stone-200 focus:outline-none text-sm cursor-pointer w-full p-2 rounded`}
                                                            placeholder="e.g Doing"
                                                            onChange={(e) => handleColumnNameChange(index)(e)}
                                                            value={name!}
                                                        />
                                                        <div>
                                                            <FaTimes
                                                                onClick={() => handleDeleteColumn(index)}
                                                            />
                                                        </div>
                                                    </div>
                                                    {emptyColumnIndex === index ? (
                                                        <p className="text-xs text-red-500">
                                                            Column name cannot be empty
                                                        </p>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            );
                                        }
                                    )}
                                <div className="mt-3">
                                    <button
                                        type="button"
                                        onClick={handleAddNewColumn}
                                        className="bg-stone-200 rounded-3xl py-2 w-full text-sm font-bold"
                                    >
                                        <p>+ Add New Column</p>
                                    </button>
                                </div>
                            </div>
                            <div className="pt-6">
                                <button
                                    type="submit"
                                    onClick={(e: React.FormEvent<HTMLButtonElement>) => {
                                        isVariantAdd
                                            ? handleAddNewBoardToDb(e)
                                            : handleEditBoardToDb(e);
                                    }}
                                    className="bg-blue-500 rounded-3xl py-2 w-full text-sm font-bold"
                                >
                                    <p>
                                        {isLoading
                                            ? "Loading"
                                            : `${isVariantAdd ? "Create New Board" : "Save Changes"}`}
                                    </p>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </ModalBody>
        </Modal>
    );
}