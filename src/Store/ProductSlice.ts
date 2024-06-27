import { createSlice, nanoid } from "@reduxjs/toolkit";
import { ProductRating, ProductType } from "../Models/ProductType";
import { MobileDeviceType, ProductCategory } from "../Models/ProductEnums";

export interface ProductState {
    products: ProductType[],
}

const initialState: ProductState = {
    products: [{
        productId: '12132',
        productTitle: 'Default',
        productDescription: '',
        productCategory: ProductCategory[ProductCategory.Mobile],
        purchasedDate: new Date(Date.now()),
        productPrice: '500$',
        productMobileSpecs: {
          ramSize: '6GB',
          storageSize:'64GB',
          softwareType:MobileDeviceType[MobileDeviceType.Android]
        },
        productTelevisionSpecs: {
          displaySize: '',
          deviceType: '',
        },
        productClothSpecs: {
          clothType: '',
          clothSize: '',
          clothColor: '',
          clothFabric: '',
        },
        productReviews: [] as ProductRating[]
      }]
}

export const productSlice = createSlice({
    name: 'ProductSlice',
    initialState: initialState,
    reducers: {
        addProduct: (state, action) => {
            const product: ProductType = {...action.payload, productId: nanoid()}
            state.products.push(product);
        },
        deleteProduct: (state, action) => {
            state.products = state.products.filter((product: ProductType) => product.productId !== action.payload)
        },
        updateProduct: (state, action) => {
            state.products = state.products.map((product: ProductType) => {
                if(product.productId === (action.payload as ProductType).productId) {
                    return action.payload;
                }
                return product;
            })
        }
    }
});

export const { addProduct, deleteProduct, updateProduct } = productSlice.actions;

export default productSlice.reducer;