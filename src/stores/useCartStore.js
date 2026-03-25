import { create } from "zustand";
import { persist } from "zustand/middleware";
import { produce } from "immer";

const useCartStore = create(
    persist(
        (set) => ({
            cart: [],
            open: false,

            actions: {
                addToCart: (product, sabores) =>
                    set(
                        produce((state) => {
                            const existing = state.cart.find(
                                (item) => item.id === product.id
                            );

                            if (existing) {
                                // Merge sabores
                                sabores.forEach((sabor) => {
                                    const existingFlavor = existing.sabores.find(
                                        (s) => s.nombre === sabor.nombre
                                    );

                                    if (existingFlavor) {
                                        existingFlavor.cantidad += Number(sabor.cantidad);
                                    } else {
                                        existing.sabores.push({
                                            nombre: sabor.nombre,
                                            cantidad: Number(sabor.cantidad),
                                        });
                                    }
                                });

                                existing.totalCantidad = calcularCantidadSabores(existing.sabores);
                                existing.subtotal =
                                    existing.precioUnitario * existing.totalCantidad;

                            } else {
                                const saboresNormalizados = sabores.map((s) => ({
                                    nombre: s.nombre,
                                    cantidad: Number(s.cantidad),
                                }));

                                const totalCantidad = calcularCantidadSabores(saboresNormalizados);

                                state.cart.push({
                                    id: product.id,
                                    nombre: product.nombre,
                                    imagenes: product.imagenes,
                                    marca: product.marca,
                                    precioUnitario: product.precio,
                                    sabores: saboresNormalizados,
                                    totalCantidad,
                                    subtotal: product.precio * totalCantidad,
                                });
                            }
                        })
                    ),


                removeFromCart: (id) =>
                    set(
                        produce((state) => {
                            state.cart = state.cart.filter((item) => item.id !== id);
                        })
                    ),

                updateQuantity: (id, cantidad) =>
                    set(
                        produce((state) => {
                            const item = state.cart.find((p) => p.id === id);
                            if (item && cantidad > 0) {
                                item.cantidad = cantidad;
                            }
                        })
                    ),

                clearCart: () =>
                    set(
                        produce((state) => {
                            state.cart = [];
                        })
                    ),
                setOpen: (value) =>
                    set(
                        produce((state) => {
                            state.open = value;
                        })
                    ),

                setGeneralValue: (key, value) =>
                    set(
                        produce((state) => {
                            state[key] = value;
                        })
                    ),
            },
        }),
        {
            name: "gault-cart-storage",
            partialize: (state) => ({ cart: state.cart })
        }
    )
);

// DATA
export const useCartStoreData = () => 
    useCartStore((state) => state.cart);

export const useCartStoreOpen = () => 
    useCartStore((state) => state.open);

//ACTIONS
export const useCartStoreAddToCart = () => 
    useCartStore((state) => state.actions.addToCart);

export const useCartStoreRemoveFromCart = () => 
    useCartStore((state) => state.actions.removeFromCart);

export const useCartStoreUpdateQuantity = () => 
    useCartStore((state) => state.actions.updateQuantity);

export const useCartStoreClearCart = () =>
    useCartStore((state) => state.actions.clearCart);

// export const useCartStoreGetTotal = () =>
//     useCartStore((state) => state.cart.reduce((acc, item) => acc + (item.precio || 0) * item.cantidad, 0));

export const useCartStoreGetTotal = () =>
    useCartStore((state) =>
        state.cart.reduce((total, item) => total + (item.subtotal || 0), 0)
);

export const useCartStoreGetItemCount = () =>
    useCartStore((state) =>
        state.cart.reduce((total, item) => {
            const cantidadSabores = item.sabores?.reduce(
                (subTotal, sabor) => subTotal + Number(sabor.cantidad || 0),
                0
            ) || 0;

            return total + cantidadSabores;
        }, 0)
    );


export const useCartStoreSetGenValue = () =>
    useCartStore((state) => state.actions.setGeneralValue);

export const useCartStoreSetOpen = () =>
    useCartStore((state) => state.actions.setOpen);

const calcularCantidadSabores = (sabores) =>
  sabores.reduce((acc, s) => acc + Number(s.cantidad || 0), 0);