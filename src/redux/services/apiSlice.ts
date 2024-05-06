import {createApi, fakeBaseQuery} from "@reduxjs/toolkit/query/react";
import {getSession} from "next-auth/react";
import {collection, doc, getDocs, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/utils/firebaseConfig";

export const fireStoreApi = createApi({
    reducerPath: "firestoreApi",
    baseQuery: fakeBaseQuery(),
    tagTypes: ["Tasks"],
    endpoints: (builder) => ({
        fetchDataFromDb: builder.query<{ [key: string]: any }[], void>({
            async queryFn() {
                try {
                    const session = await getSession();
                    if (session?.user) {
                        const {user} = session;
                        const ref = collection(db, `users/${user.email}/tasks`);
                        const querySnapshot = await getDocs(ref);
                        return {data: querySnapshot.docs.map((doc) => doc.data())};
                    }
                } catch (e) {
                    return {error: e};
                }
            },
            providesTags: ["Tasks"],
        }),
        updateBoardToDb: builder.mutation({
            async queryFn(boardData) {
                try {
                    const session = await getSession();
                    if (session?.user) {
                        const { user } = session;
                        const ref = collection(db, `users/${user.email}/tasks`);
                        const querySnapshot = await getDocs(ref);
                        const boardId = querySnapshot.docs.map((doc) => doc.id)[0];

                        const docRef = doc(db, `users/${user.email}/tasks/${boardId}`);
                        const docSnap = await getDoc(docRef);

                        if (docSnap.exists()) {
                            await updateDoc(docRef, {
                                boards: boardData,
                            });
                        } else {
                            throw new Error(`Documento não encontrado: ${boardId}`);
                        }
                    }
                    return { data: null };
                } catch (e) {
                    return { error: e.message || 'Ocorreu um erro ao atualizar o documento.' };
                }
            },
            invalidatesTags: ["Tasks"],
        }),
    }),
});

export const {useFetchDataFromDbQuery, useUpdateBoardToDbMutation} =
    fireStoreApi;