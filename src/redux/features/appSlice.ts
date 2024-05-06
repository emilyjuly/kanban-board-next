import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
    currentBoardName: "",
    isAddAndEditBoardModal: { isOpen: false, variant: "" },
};

export const features = createSlice({
    name: "features",
    initialState,

    reducers: {
        setPageTitle: (state, action: PayloadAction<string>) => {
            state.currentBoardName = action.payload;
        },
        openAddAndEditBoardModal: (state, { payload }) => {
            state.isAddAndEditBoardModal.isOpen = true;
            state.isAddAndEditBoardModal.variant = payload;
        },
        closeAddAndEditBoardModal: (state) => {
            state.isAddAndEditBoardModal.isOpen = false;
            state.isAddAndEditBoardModal.variant = "";
        },
    },
});

export const {
    setPageTitle,
    openAddAndEditBoardModal,
    closeAddAndEditBoardModal,
} = features.actions;

export const getPageTitle = (state: RootState) => state.features.currentBoardName;

export const getAddAndEditBoardModalValue = (state: RootState) => state.features.isAddAndEditBoardModal.isOpen;
export const getAddAndEditBoardModalVariantValue = (state: RootState) => state.features.isAddAndEditBoardModal.variant;

export default features.reducer;