import { ObjectSchema, array, date, object, string } from "yup";
import { ProductCategory } from "../Models/ProductEnums";
import { ProductBase, ProductDetails, ProductRating, ProductType, ProductReview } from "../Models/ProductType";

export class FormHelperService {
  public getDefaultDetailsValues(product?: ProductType): ProductBase {
    let defaultValue: ProductBase = {
      productTitle: product?.productTitle? product.productTitle :'',
      productDescription:  product?.productDescription? product.productDescription :'',
      productPrice: product?.productPrice? product.productPrice :'',
      purchasedDate: product?.purchasedDate? product.purchasedDate : null,
    } as ProductBase
    return defaultValue;
  }

  public getDefaultSpecificationValues(product?: ProductType): ProductDetails {
    let defaultValue: ProductDetails = {
      productCategory: product?.productCategory? product.productCategory : ProductCategory[ProductCategory.Mobile],
      productMobileSpecs: {
        ramSize: product?.productMobileSpecs?.ramSize? product.productMobileSpecs.ramSize : '',
        storageSize: product?.productMobileSpecs?.storageSize? product.productMobileSpecs.storageSize : '',
        softwareType: product?.productMobileSpecs?.softwareType? product.productMobileSpecs.softwareType : ''
      },
      productTelevisionSpecs: {
        displaySize: product?.productTelevisionSpecs?.displaySize? product.productTelevisionSpecs.displaySize : '',
        deviceType: product?.productTelevisionSpecs?.deviceType? product.productTelevisionSpecs.deviceType : '',
      },
      productClothSpecs: {
        clothType: product?.productClothSpecs?.clothType? product.productClothSpecs.clothType : '',
        clothSize: product?.productClothSpecs?.clothSize? product.productClothSpecs.clothSize : '',
        clothColor: product?.productClothSpecs?.clothColor? product.productClothSpecs.clothColor : '',
        clothFabric: product?.productClothSpecs?.clothFabric? product.productClothSpecs.clothFabric : '',
      },
    } as ProductDetails;

    return defaultValue;
  }

  public getDefaultFeedbackValues(product?: ProductType): ProductReview{
    let defaultValue: ProductReview = {
      productReviews :product?.productReviews ? product.productReviews : [] as ProductRating[]
    };
    return defaultValue;
  }

  public getDetailsValidationSchema():ObjectSchema<any> {
    let schema = object().shape({
      productTitle: string().required('Required').max(12,'Title should not exceed 12 characters'),
      productDescription: string(),
      productPrice: string().required('Required'),
      purchasedDate: date()
    });
    return schema;
  }

  public getSpecificationValidationSchema():ObjectSchema<any> {
    let schema = object().shape({
      productCategory: string().required('Required'),
      productMobileSpecs: object().when('productCategory', {
        is: (productCategory:string) => productCategory === ProductCategory[ProductCategory.Mobile],
        then: () => object().shape({
          ramSize: string().required('Required'),
          storageSize: string().required('Required'),
          softwareType: string().required('Required'),
        }),
        otherwise: () => object().shape({
          ramSize: string(),
          storageSize: string(),
          softwareType: string(),
        }),
      }),
      productTelevisionSpecs: object().when('productCategory', {
        is: (productCategory: string) => productCategory === ProductCategory[ProductCategory.Television],
        then: () => object().shape({
          displaySize: string().required('Required'),
          deviceType: string().required('Required'),
        }),
        otherwise: () => object().shape({
          displaySize: string(),
          deviceType: string(),
        }),
      }),
      productClothSpecs: object().when('productCategory', {
        is: (productCategory: string) => productCategory === ProductCategory[ProductCategory.Clothes],
        then: () => object().shape({
          clothType: string().required('Required'),
          clothSize: string().required('Required'),
          clothColor: string().required('Required'),
          clothFabric: string().required('Required'),
        }),
        otherwise: () => object().shape({
          clothType: string(),
          clothSize: string(),
          clothColor: string(),
          clothFabric: string(),
        }),
      }),
    });
    return schema;
  }

  public getFeedbackValidationSchema():ObjectSchema<any> {
    let schema = object().shape({
      productReviews: array().of(
        object().shape({
          productRating: string(),
          productFeedback: string(),
          reviewId: string(),
        })
      )
    });

    return schema;
  }

  public getProductInfo(): ProductType {
    let productInfo: ProductType = {
      productId: '',
      productTitle: '',
      productDescription: '',
      productPrice: '',
      purchasedDate: new Date(),
      productCategory: '',
      productMobileSpecs: {
        ramSize: '',
        storageSize: '',
        softwareType: '',
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
      productReviews: []
    };

    return productInfo;
  }
}

export const formHelperService = new FormHelperService();
