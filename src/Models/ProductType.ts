export interface ProductType extends ProductBase, ProductDetails, ProductReview {
  productId: string,
}

export interface ProductBase {
  productTitle: string,
  productDescription: string,
  productPrice: string,
  purchasedDate: Date,
}

export interface ProductDetails {
  productCategory: string,
  productMobileSpecs?: {
    ramSize: string,
    storageSize: string,
    softwareType: string
  }
  productTelevisionSpecs?: {
    displaySize: string,
    deviceType: string,
  }
  productClothSpecs?: {
    clothType: string,
    clothSize: string,
    clothColor: string,
    clothFabric: string,
  }
}

export interface ProductRating {
  reviewId: string;
  productRating: number;
  productFeedback: string;
}

export interface ProductReview {
  productReviews: ProductRating[]
}