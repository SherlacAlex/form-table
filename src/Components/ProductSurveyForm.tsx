import React, { useState } from 'react'
import { ProductType } from '../Models/ProductType'
import { ClothFabricType, ClothSizeType, ClothType, MobileDeviceType, ProductCategory, TelevisionSoftwareType } from '../Models/ProductEnums';
import { useDispatch } from 'react-redux';
import { Button, Group, Input, Paper, Radio, SegmentedControl, Select, Stepper, Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { Field, FieldProps, Form, Formik, FormikHelpers, FormikState } from 'formik';
import { object, string } from 'yup';
import { DatePickerInput, DatesProvider } from '@mantine/dates';
import { addProduct, updateProduct } from '../Store/ProductSlice';

interface ProductSurveyFormType {
  product?: ProductType,
  closeDialog: () => void
}

function ProductSurveyForm({product, closeDialog} : ProductSurveyFormType) {

  const [active, setActive] = useState(0);
  const [highestStepVisited, setHighestStepVisited] = useState(active);

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
  
  let defaultValue: ProductType = {
    productId: product?.productId? product.productId :'',
    productTitle: product?.productTitle? product.productTitle :'',
    productDescription:  product?.productDescription? product.productDescription :'',
    productPrice: product?.productPrice? product.productPrice :'',
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
    purchasedDate: product?.purchasedDate? product.purchasedDate : new Date()
  } as ProductType;

  const formValidationSchema = object().shape({
    productTitle: string().required('Required').max(12,'Title should not exceed 12 characters'),
    productDescription: string(),
    productPrice: string().required('Required'),
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

  const dispatch = useDispatch()

  const openDiscardModal = () => modals.openConfirmModal({
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
  });

  const submitForm = (data: ProductType, { resetForm }: FormikHelpers<ProductType>) => {
    if(data.productId) {
      dispatch(updateProduct(data));
    }
    else {
      dispatch(addProduct(data));
    }
    resetForm(defaultValue as Partial<FormikState<ProductType>>);
    closeDialog();
  }

  const generateForm = () => {
    return(
      <>
        <div className="form-container mt-6 w-full">
          {/* <Paper shadow="xs" radius="lg" withBorder p="xl">
            <Stepper active={active} onStepClick={setActive}>
              <Stepper.Step allowStepSelect={shouldAllowSelectStep(0)} label="First" description={product?.productTitle ? ` Edit${product?.productTitle}` : 'Add a Product'}>
                <div className="step-container h-[450px]">
                  Step 1 content: Create an account
                </div>
              </Stepper.Step>
              <Stepper.Step allowStepSelect={shouldAllowSelectStep(1)} label="Second" description="Verify email">
                <div className="step-container h-[450px]">
                  Step 2 content: Verify email
                </div>
              </Stepper.Step>
              <Stepper.Step allowStepSelect={shouldAllowSelectStep(2)} label="Final" description="Get full access">
                <div className="step-container h-[450px]">
                  Step 3 content: Get full access
                </div>
              </Stepper.Step>
            </Stepper>

            <Group justify="end" mt="xl">
              <Button variant="default" onClick={openDiscardModal}>
                Cancel
              </Button>
              <Button variant="default" onClick={() => handleStepChange(active - 1)}>
                Back
              </Button>
              <Button onClick={() => active === 2 ? submitForm() : handleStepChange(active + 1)}>{active === 2? 'Submit' :'Next step'}</Button>
            </Group>
          </Paper> */}
          <Formik initialValues={defaultValue} onSubmit={submitForm} validationSchema={formValidationSchema} >
            {
              (formik) => {
                return(
                  <Form>
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
                        <div className="control items-center">
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
                                          <SegmentedControl w={300} name='productMobileSpecs.softwareType' data={[MobileDeviceType[1],MobileDeviceType[0]]} color="gray" defaultValue={field.value} onChange={(val) => formik.setFieldValue(field.name, val)} />
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
                                            <SegmentedControl w={300} name='productTelevisionSpecs.deviceType' data={[TelevisionSoftwareType[1],TelevisionSoftwareType[0]]} color="gray" defaultValue={field.value} onChange={(val) => formik.setFieldValue(field.name, val)} />
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
                              <Title>Cloth Type</Title>
                            </div>
                            <div className="control-wrapper  w-2/3 grid">
                              <div className="control flex items-center">
                                <Field name='productClothSpecs.clothType'>
                                  {
                                    ({field, meta}: FieldProps) => {
                                      return(
                                        <div className='grid w-11/12'>
                                          <SegmentedControl w={300} name='productClothSpecs.clothType' data={[ClothType[0],ClothType[1],ClothType[2],ClothType[3]]} color="gray" defaultValue={field.value} onChange={(val) => formik.setFieldValue(field.name, val)} />
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
                                <Title>Cloth Size</Title>
                              </div>
                              <div className="control-wrapper  w-2/3 grid">
                                <div className="control flex items-center">
                                  <Field name='productClothSpecs.clothSize'>
                                    {
                                      ({field, meta}: FieldProps) => {
                                        return(
                                          <div className='grid w-11/12'>
                                            <SegmentedControl w={300} name='productTelevisionSpecs.clothSize' data={[ClothSizeType[0],ClothSizeType[1],ClothSizeType[2],ClothSizeType[3]]} color="gray" defaultValue={field.value} onChange={(val) => formik.setFieldValue(field.name, val)} />
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
                              <Title>Cloth Fabric</Title>
                            </div>
                            <div className="control-wrapper  w-2/3 grid">
                              <div className="control flex items-center">
                                <Field name='productClothSpecs.clothFabric'>
                                  {
                                    ({field, meta}: FieldProps) => {
                                      return(
                                        <div className='grid w-11/12'>
                                          <SegmentedControl w={300} name='productTelevisionSpecs.clothFabric' data={[ClothFabricType[0],ClothFabricType[1],ClothFabricType[2]]} color="gray" defaultValue={field.value} onChange={(val) => formik.setFieldValue(field.name, val)} />
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
                              <Title>Cloth Color</Title>
                            </div>
                            <div className="control-wrapper  w-2/3 grid">
                              <div className="control flex items-center">
                                <Field name='productClothSpecs.clothColor'>
                                  {
                                    ({field, meta}: FieldProps) => {
                                      return(
                                        <div className='grid w-11/12'>
                                          <Radio.Group id='productClothSpecs.clothColor' name='productClothSpecs.clothColor' onChange={(val: string) => formik.setFieldValue(field.name, val)} value={field.value}>
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
                    {/* Purchased Date */}
                    <div className="content-control flex  py-4  h-20">
                      <div className="title-container w-1/3 flex items-center">
                        <Title order={3}>Purchased Date</Title>
                      </div>
                      <div className="control-wrapper  w-2/3 grid">
                        <div className="control flex items-center">
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
                    <Button type='submit'>Submit</Button>
                  </Form>
                )
              }
            }
          </Formik>
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