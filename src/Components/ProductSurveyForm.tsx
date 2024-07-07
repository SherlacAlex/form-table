import { useRef, useState } from 'react'
import { ProductBase, ProductDetails, ProductRating, ProductType, ProductReview } from '../Models/ProductType'
import { ClothFabricType, ClothSizeType, ClothType, MobileDeviceType, ProductCategory, TelevisionSoftwareType } from '../Models/ProductEnums';
import { useDispatch } from 'react-redux';
import { Button, Group, Input, Paper, Radio, SegmentedControl, Select, Stepper, Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { DatePickerInput, DatesProvider } from '@mantine/dates';
import { addProduct, updateProduct } from '../Store/ProductSlice';
import ReviewTable from './ReviewTable';
import './ProducrSurveyForm.css';
import { formHelperService } from '../services/FormHelperService';

interface ProductSurveyFormType {
  product?: ProductType,
  closeDialog: (update?: boolean) => void
}

function ProductSurveyForm({product, closeDialog} : ProductSurveyFormType) {

  const [active, setActive] = useState(0);
  const [highestStepVisited, setHighestStepVisited] = useState(active);
  const [changed, setChanged] = useState(false);
  var productInfo = useRef(formHelperService.getProductInfo());

  const defaultDetailsValue: ProductBase = formHelperService.getDefaultDetailsValues(product);
  const defualtSpecificationValue: ProductDetails = formHelperService.getDefaultSpecificationValues(product);
  const defualtFeedbackValues: ProductReview = formHelperService.getDefaultFeedbackValues(product);

  const detailsValidationSchema = formHelperService.getDetailsValidationSchema();
  const specificationValidationSchema = formHelperService.getSpecificationValidationSchema();
  const feedbackValidationSchema = formHelperService.getFeedbackValidationSchema();

  const dispatch = useDispatch()

  const openDiscardModal = () => {
    if(changed) {
      modals.openConfirmModal({
        title: 'Are you sure you want to discard the changes',
        children: (
          <Text size="sm">
            This action is so important that you are required to confirm it with a modal. Please click
            one of these buttons to proceed.
          </Text>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onCancel: () => {},
        onConfirm: () => closeDialog(),
      })
    }
    else {
      closeDialog()
    }
  };

  const handleStepChange = (nextStep: number) => {
    const isOutOfBounds = nextStep > 3 || nextStep < 0;

    if (isOutOfBounds) {
      return;
    }

    setActive(nextStep);
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
  };

  // Allow the user to freely go back and forth between visited steps.
  const shouldAllowSelectStep = (step: number) => highestStepVisited >= step && active !== step;


  const submitBaseForm = (data: ProductBase) => {
    handleStepChange(active + 1);
    productInfo.current = {...productInfo.current, ...data};
  }

  const submitDetailsForm = (data: ProductDetails) => {
    handleStepChange(active + 1);
    productInfo.current = {...productInfo.current, ...data};
  }
  
  const submitFeedbackForm = (data: ProductReview) => {
    productInfo.current = {...productInfo.current, ...data};
    if(product?.productId) {
      dispatch(updateProduct(productInfo.current));
      closeDialog(true);
    }
    else {
      dispatch(addProduct(productInfo.current));
      closeDialog(false);
    }
  }

  const getNavigationButtons = (formik: FormikProps<ProductBase | ProductDetails | ProductReview>) => {
    return(
      <>
        <div className="button-container">
          <Group justify="end" mt="xl">
            <Button variant="default" onClick={openDiscardModal}>
              Cancel
            </Button>
            <Button variant="default" disabled={active === 0} onClick={() => handleStepChange(active - 1)}>
              Back
            </Button>
            <Button onClick={() => formik.submitForm()}>{active === 2? 'Submit' :'Next step'}</Button>
          </Group>
        </div>
      </>
    )
  }

  const generateForm = () => {
    return(
      <>
        <div className="form-container mt-6 w-full">
          <Paper shadow="xs" radius="lg" withBorder p="xl">
            <Stepper active={active} onStepClick={setActive}>
              <Stepper.Step allowStepSelect={shouldAllowSelectStep(0)} label={product?.productTitle ? `${product?.productTitle} Details` : 'Product Details'} description={product?.productTitle ? `Edit ${product?.productTitle}` : 'Add a Product'}>
                <Formik key={1} enableReinitialize validateOnChange={true} initialValues={defaultDetailsValue} onSubmit={submitBaseForm} validationSchema={detailsValidationSchema} >
                  {
                    (formik) => {
                      return(
                        <Form onChange={() => !changed? setChanged(true): null}>
                          {/* Product Title */}
                          <div className="content-control flex py-4  h-20 justify-items-start">
                            <div className="title-container w-1/3 flex items-center ">
                              <Title order={3}>Title</Title>
                            </div>
                            <div className="control-wrapper  w-2/3 grid">
                              <div className="control items-center">
                                <Field name='productTitle' >
                                  {
                                    ({field, meta}: FieldProps) => {
                                      return (
                                      <div className='grid w-11/12'>
                                        <Input id='productTitle' placeholder='Product Title' {...field}/>
                                        {
                                          (meta.error && meta.touched) && 
                                          <span className='text-red-500 place-self-start pt-1 pl-1'>{meta.error}</span>
                                        }
                                      </div>)
                                    }
                                  }
                                </Field>
                              </div>
                            </div>
                          </div>
                          {/* Product Description */}
                          <div className="content-control flex  py-4  h-20">
                            <div className="title-container w-1/3 flex items-center">
                              <Title order={3}>Description</Title>
                            </div>
                            <div className="control-wrapper w-2/3 grid">
                              <div className="control items-center flex">
                                <Field name='productDescription'>
                                    {
                                      ({field}: FieldProps) => {
                                        return (
                                        <div className='grid w-11/12'>
                                          <Input id='productDescription' placeholder='Product Description' {...field}/>
                                        </div>)
                                      }
                                    }
                                </Field>
                              </div>
                            </div>
                          </div>
                          {/* Product Price */}
                          <div className="content-control flex  py-4  h-20">
                            <div className="title-container w-1/3 flex items-center">
                              <Title order={3}>Product Price</Title>
                            </div>
                            <div className="control-wrapper w-2/3 grid">
                              <div className="control items-center">
                                <Field name='productPrice'>
                                    {
                                      ({field, meta}: FieldProps) => {
                                        return (
                                        <div className='grid w-11/12'>
                                          <Input id='productPrice' placeholder='Product Price' {...field}/>
                                          {
                                          (meta.error && meta.touched) && 
                                            <span className='text-red-500 place-self-start pt-1 pl-1'>{meta.error}</span>
                                          }
                                        </div>
                                        )
                                      }
                                    }
                                </Field>
                              </div>
                            </div>
                          </div>
                          {/* Purchased Date */}
                          <div className="content-control flex  py-4  h-20">
                            <div className="title-container w-1/3 flex items-center">
                              <Title order={3}>Purchased Date</Title>
                            </div>
                            <div className="control-wrapper  w-2/3 grid">
                              <div className="control flex items-center w-11/12">
                                <Field name='purchasedDate'>
                                  {
                                    ({field}: FieldProps) => {
                                      return(
                                        <DatesProvider settings={{}}>
                                          <DatePickerInput w={'100%'} value={field.value} onChange={(val) => formik.setFieldValue(field.name, val)} placeholder={field.value ? field.value : 'Purchased date'}/>
                                        </DatesProvider>
                                      )
                                    }
                                  }
                                </Field>
                                
                              </div>
                            </div>
                          </div> 
                          {
                            getNavigationButtons(formik as FormikProps<ProductBase | ProductDetails | ProductReview>)
                          }
                        </Form>
                      )
                    }
                  }
                </Formik>
              </Stepper.Step>
              <Stepper.Step allowStepSelect={shouldAllowSelectStep(1)} label={product?.productTitle ? `${product?.productTitle} Specifications` : 'Product Specifications'} description={product?.productTitle ? `Update ${product?.productTitle}` : ' Product Details'}>
                <Formik key={2} enableReinitialize validateOnChange={true} initialValues={defualtSpecificationValue} onSubmit={submitDetailsForm} validationSchema={specificationValidationSchema} >
                  {
                    (formik) => {
                      return (
                        <Form onChange={() => !changed? setChanged(true): null}>
                          {/* Product Category */}
                          <div className="content-control flex  py-4  h-20">
                            <div className="title-container w-1/3 flex items-center">
                              <Title order={3}>Category</Title>
                            </div>
                            <div className="control-wrapper  w-2/3 grid">
                              <div className="control flex items-center">
                              <Field name='productCategory'>
                                    {
                                      ({field, meta}: FieldProps) => {
                                        return (
                                          <div className='grid w-11/12'>
                                            <SegmentedControl w={'100%'} name='productCategory' data={[ProductCategory[2],ProductCategory[1],ProductCategory[0]]} color="gray" defaultValue={field.value} onChange={(val) => formik.setFieldValue(field.name, val)} />
                                            {
                                              (meta.error) && 
                                              <span className='text-red-500 place-self-start pt-1 pl-1'>{meta.error}</span>
                                            }
                                          </div>
                                        )
                                      }
                                    }
                              </Field>
                              </div>
                            </div>
                          </div>
                          {/* Mobile Choices */}
                          {
                            (formik.values.productCategory === ProductCategory[ProductCategory.Mobile]) && 
                            <div>
                              <div className="mobile-spec">
                                {/* Ram Size */}
                                  <div className="content-control flex  py-4  h-20">
                                  <div className="title-container w-1/3 flex items-center">
                                    <Title order={3}>Ram Size</Title>
                                  </div>
                                  <div className="control-wrapper  w-2/3 grid">
                                    <div className="control flex items-center">
                                      <Field name='productMobileSpecs.ramSize'>
                                        {
                                          ({field, meta}: FieldProps) => {
                                            return(
                                              <div className='grid w-11/12'>
                                                <Select name='productMobileSpecs.ramSize' data={["6GB","8GB","12GB"]} placeholder={'Ram Size'} defaultValue={field.value} onChange={(val) => formik.setFieldValue(field.name, val)} />
                                                {
                                                  (meta.error && meta.touched) && 
                                                  <span className='text-red-500 place-self-start pt-1 pl-1'>{meta.error}</span>
                                                }
                                              </div>
                                            )
                                          }
                                        }
                                      </Field>
                                    </div>
                                  </div>
                                  </div>
                                {/* Storage Size */}
                                <div className="content-control flex  py-4  h-20">
                                  <div className="title-container w-1/3 flex items-center">
                                    <Title order={3}>Storage Size</Title>
                                  </div>
                                  <div className="control-wrapper  w-2/3 grid">
                                    <div className="control flex items-center">
                                      <Field name='productMobileSpecs.storageSize'>
                                        {
                                          ({field, meta}: FieldProps) => {
                                            return (
                                              <div className='grid w-11/12'>
                                                <Select placeholder='Storage Size' data={["64GB","128GB", "256GB"]} name='productMobileSpecs.storageSize' defaultValue={field.value} onChange={(val) => formik.setFieldValue(field.name, val)}/>
                                                {
                                                  (meta.error && meta.touched) && 
                                                  <span className='text-red-500 place-self-start pt-1 pl-1'>{meta.error}</span>
                                                }
                                              </div>
                                            )
                                          }
                                        }
                                      </Field>
                                    </div>
                                  </div>
                                </div>
                                {/* OS Type */}
                                <div className="content-control flex  py-4  h-20">
                                  <div className="title-container w-1/3 flex items-center">
                                    <Title order={3}>System Software</Title>
                                  </div>
                                  <div className="control-wrapper  w-2/3 grid">
                                    <div className="control flex items-center">
                                      <Field name='productMobileSpecs.softwareType'>
                                        {
                                          ({field, meta}: FieldProps) => {
                                            return(
                                              <div className='grid w-11/12'>
                                                <SegmentedControl w={'100%'} name='productMobileSpecs.softwareType' data={[MobileDeviceType[1],MobileDeviceType[0]]} color="gray" defaultValue={field.value} onChange={(val) => formik.setFieldValue(field.name, val)} />
                                                {
                                                  (meta.error && meta.touched) && 
                                                  <span className='text-red-500 place-self-start pt-1 pl-1'>{meta.error}</span>
                                                }
                                              </div>
                                            )
                                          }
                                        }
                                      </Field>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          }

                          {/* Television Choices */}
                          {
                            (formik.values.productCategory === ProductCategory[ProductCategory.Television]) &&
                            <div>
                              <div className="television-spec">
                                {/* Display Size */}
                                  <div className="content-control flex  py-4  h-20">
                                    <div className="title-container w-1/3 flex items-center">
                                      <Title order={3}>Display Size</Title>
                                    </div>
                                    <div className="control-wrapper  w-2/3 grid">
                                      <div className="control flex items-center">
                                        <Field name='productTelevisionSpecs.displaySize'>
                                          {
                                            ({field, meta}: FieldProps) => {
                                              return(
                                                <div className='grid w-11/12'>
                                                  <Radio.Group id='productTelevisionSpecs.displaySize' name='productTelevisionSpecs.displaySize' onChange={(val: string) => formik.setFieldValue(field.name, val)} value={field.value}>
                                                    <Group mt="xs">
                                                      <Radio value='32Inch' label='32Inch' />
                                                      <Radio value='44Inch' label='44Inch' />
                                                      <Radio value='55Inch' label='55Inch' />
                                                    </Group>
                                                  </Radio.Group>
                                                  {
                                                    (meta.error && meta.touched) && 
                                                    <span className='text-red-500 place-self-start pt-1 pl-1'>{meta.error}</span>
                                                  }
                                                </div>
                                              )
                                            }
                                          }
                                        </Field>
                                      </div>
                                    </div>
                                  </div>
                                {/* Device Type */}
                                  <div className="content-control flex  py-4  h-20">
                                    <div className="title-container w-1/3 flex items-center">
                                      <Title order={3}>Device Type</Title>
                                    </div>
                                    <div className="control-wrapper  w-2/3 grid">
                                      <div className="control flex items-center">
                                        <Field name='productTelevisionSpecs.deviceType'>
                                          {
                                            ({field, meta}: FieldProps) => {
                                              return(
                                                <div className='grid w-11/12'>
                                                  <SegmentedControl w={'100%'} name='productTelevisionSpecs.deviceType' data={[TelevisionSoftwareType[1],TelevisionSoftwareType[0]]} color="gray" defaultValue={field.value} onChange={(val) => formik.setFieldValue(field.name, val)} />
                                                  {
                                                    (meta.error && meta.touched) && 
                                                    <span className='text-red-500 place-self-start pt-1 pl-1'>{meta.error}</span>
                                                  }
                                                </div>
                                              )
                                            }
                                          }
                                        </Field>
                                      </div>
                                    </div>
                                  </div>
                              </div>
                            </div>
                          }

                          {/* Cloth Choices */}
                          {
                            (formik.values.productCategory === ProductCategory[ProductCategory.Clothes]) &&
                            <div>
                              <div className="cloth-specs">
                                {/* Cloth Type */}
                                <div className="content-control flex  py-4  h-20">
                                  <div className="title-container w-1/3 flex items-center">
                                    <Title order={3}>Cloth Type</Title>
                                  </div>
                                  <div className="control-wrapper  w-2/3 grid">
                                    <div className="control flex items-center">
                                      <Field name='productClothSpecs.clothType'>
                                        {
                                          ({field, meta}: FieldProps) => {
                                            return(
                                              <div className='grid w-11/12'>
                                                <SegmentedControl w={'100%'} name='productClothSpecs.clothType' data={[ClothType[0],ClothType[1],ClothType[2],ClothType[3]]} color="gray" defaultValue={field.value} onChange={(val) => formik.setFieldValue(field.name, val)} />
                                                {
                                                    (meta.error && meta.touched) && 
                                                    <span className='text-red-500 place-self-start pt-1 pl-1'>{meta.error}</span>
                                                  }
                                              </div>
                                            )
                                          }
                                        }
                                      </Field>
                                    </div>
                                  </div>
                                </div>

                                {/* Cloth Size */}
                                {
                                  <div className="content-control flex  py-4  h-20">
                                    <div className="title-container w-1/3 flex items-center">
                                      <Title order={3}>Cloth Size</Title>
                                    </div>
                                    <div className="control-wrapper  w-2/3 grid">
                                      <div className="control flex items-center">
                                        <Field name='productClothSpecs.clothSize'>
                                          {
                                            ({field, meta}: FieldProps) => {
                                              return(
                                                <div className='grid w-11/12'>
                                                  <SegmentedControl w={'100%'} name='productTelevisionSpecs.clothSize' data={[ClothSizeType[0],ClothSizeType[1],ClothSizeType[2],ClothSizeType[3]]} color="gray" defaultValue={field.value} onChange={(val) => formik.setFieldValue(field.name, val)} />
                                                  {
                                                    (meta.error && meta.touched) && 
                                                    <span className='text-red-500 place-self-start pt-1 pl-1'>{meta.error}</span>
                                                  }
                                                </div>
                                              )
                                            }
                                          }
                                        </Field>
                                      </div>
                                    </div>
                                  </div>
                                }

                                {/* Cloth Fabric */}
                                <div className="content-control flex  py-4  h-20">
                                  <div className="title-container w-1/3 flex items-center">
                                    <Title order={3}>Cloth Fabric</Title>
                                  </div>
                                  <div className="control-wrapper  w-2/3 grid">
                                    <div className="control flex items-center">
                                      <Field name='productClothSpecs.clothFabric'>
                                        {
                                          ({field, meta}: FieldProps) => {
                                            return(
                                              <div className='grid w-11/12'>
                                                <SegmentedControl w={'100%'} name='productTelevisionSpecs.clothFabric' data={[ClothFabricType[0],ClothFabricType[1],ClothFabricType[2]]} color="gray" defaultValue={field.value} onChange={(val) => formik.setFieldValue(field.name, val)} />
                                                {
                                                  (meta.error && meta.touched) && 
                                                  <span className='text-red-500 place-self-start pt-1 pl-1'>{meta.error}</span>
                                                }
                                              </div>
                                            )
                                          }
                                        }
                                      </Field>
                                    </div>
                                  </div>
                                </div>

                                {/* Cloth Color */}
                                <div className="content-control flex  py-4  h-20">
                                  <div className="title-container w-1/3 flex items-center">
                                    <Title order={3}>Cloth Color</Title>
                                  </div>
                                  <div className="control-wrapper  w-2/3 grid">
                                    <div className="control flex items-center">
                                      <Field name='productClothSpecs.clothColor'>
                                        {
                                          ({field, meta}: FieldProps) => {
                                            return(
                                              <div className='grid w-11/12'>
                                                <Radio.Group w={'100%'} id='productClothSpecs.clothColor' name='productClothSpecs.clothColor' onChange={(val: string) => formik.setFieldValue(field.name, val)} value={field.value}>
                                                    <Group mt="xs">
                                                      <Radio value='Red' label='Red' />
                                                      <Radio value='Blue' label='Blue' />
                                                      <Radio value='Green' label='Green' />
                                                    </Group>
                                                  </Radio.Group>
                                                {
                                                  (meta.error && meta.touched) && 
                                                  <span className='text-red-500 place-self-start pt-1 pl-1'>{meta.error}</span>
                                                }
                                              </div>
                                            )
                                          }
                                        }
                                      </Field>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          }
                          {
                            getNavigationButtons(formik as FormikProps<ProductBase | ProductDetails | ProductReview>)
                          }
                        </Form>
                      )
                    }
                  }
                </Formik>
              </Stepper.Step>
              <Stepper.Step allowStepSelect={shouldAllowSelectStep(2)} label='Ratings' description='User Reviews and Feedback'>
                <Formik key={3} enableReinitialize validateOnChange={true} initialValues={defualtFeedbackValues} onSubmit={submitFeedbackForm} validationSchema={feedbackValidationSchema}>
                  {
                    (formik) => {
                      return(
                        <Form onChange={() => !changed? setChanged(true): null}>
                          {/* Product Ratings */}
                          <Field name='productReviews'>
                            {
                              ({field}: FieldProps) => {
                                return(
                                  <div className="table-container">
                                    <ReviewTable reviews={field.value} tableChanged={(val: ProductRating[]) => formik.setFieldValue(field.name, val)}/>
                                  </div>
                                )
                              }
                            }
                          </Field>
                          {
                            getNavigationButtons(formik as FormikProps<ProductBase | ProductDetails | ProductReview>)
                          }
                        </Form>
                      )
                    }
                  }
                </Formik>
              </Stepper.Step>
            </Stepper>
          </Paper>
        </div>
      </>
    )
  }

  return (
    <>
        {
          generateForm()
        }
    </>
  )
}

export default ProductSurveyForm