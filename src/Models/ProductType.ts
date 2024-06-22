export interface ProductType{
  productId: string,
  productTitle: string,
  productDescription: string,
  productPrice: string,
  purchasedDate: Date,
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