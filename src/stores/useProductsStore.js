import { create } from "zustand";
import { persist } from "zustand/middleware";
import { produce } from "immer";

const useProductStore = create(
    (set) => ({
        products: [],

        actions: {

            // setGeneralValue: (key, value) =>
            //     set(
            //         produce((state) => {
            //             state[key] = value;
            //         })
            //     ),
        },
    }),
);

// DATA
export const useProductStoreProducts = () => 
    useCartStore((state) => state.products);

//ACTIONS
// export const useCartStoreAddToCart = () => 
//     useCartStore((state) => state.actions.addToCart);