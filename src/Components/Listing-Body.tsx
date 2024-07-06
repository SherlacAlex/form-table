import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ProductRating, ProductType } from '../Models/ProductType'
import { ProductState, deleteProduct } from '../Store/ProductSlice'
import { format } from 'date-fns/format'
import { IconPlus, IconTrash, IconUnlink,IconX, IconCheck } from '@tabler/icons-react'
import { ActionIcon, Button, Center, Modal, Rating, Table, rem } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import ProductSurveyForm from './ProductSurveyForm'
import { ModalsProvider } from '@mantine/modals'
import { notifications } from '@mantine/notifications';

function ListingBody() {

  const productsList = useSelector((state: ProductState) => state.products)
  
  const [currentProduct, setCurrentProduct] = useState<ProductType>({} as ProductType);

  const [modalOpened, { open, close }] = useDisclosure(false);

  const dispatch = useDispatch();

  const deleteItem = (prop: ProductType) => {
    dispatch(deleteProduct(prop.productId));
    notifications.show({
      title: 'Product Removed',
      message: 'The product was successfully removed from the system.',
      icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
      color:'red',
      autoClose: 4000,
      withBorder: true,
    })
  }

  const triggerModal = (prop?: ProductType) => {
    if(!prop){
      setCurrentProduct({} as ProductType)
    }
    else {
      setCurrentProduct(prop)
    }
    open()
  }

  const productUpdate = (update?: boolean) => {
    close();
    if(update === true) {
      notifications.show({
        title: 'Product Updated',
        message: 'Updates were successfully entered into the system.',
        icon: <IconCheck  style={{ width: rem(20), height: rem(20) }} />,
        color: 'teal',
        autoClose: 4000,
        withBorder: true
      })
    }else if(update === false) {
      notifications.show({
        title: 'Product Added',
        message: 'The product was successfully entered into the system',
        icon: <IconCheck style={{ width: rem(20), height: rem(20) }} />,
        color: 'teal',
        autoClose: 4000,
        withBorder: true,
      })
    }
  }

  const openModal = () => {
    return(
      <>
        <Modal.Root opened={modalOpened} onClose={close} >
        <Modal.Overlay />
        <Modal.Content miw={'85%'}>
          <Modal.Header bg={'indigo.2'}>
            <Modal.Title>{currentProduct?.productTitle ? ` Edit ${currentProduct?.productTitle}` : 'Add Product'}</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <div>
              <ModalsProvider>
                <ProductSurveyForm product={currentProduct} closeDialog={(val?: boolean)=> productUpdate(val)}/>
              </ModalsProvider>
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      </>
    )
  }

  const getRating = (product: ProductType) => {
    let totalRating: number = product.productReviews.reduce((ratings: number, reviews: ProductRating) => reviews.productRating + ratings, 0)
    if(!!totalRating) {
      let rating =  (totalRating/ product.productReviews.length);
      return(
        <Center>
          <Rating fractions={4} value={rating} readOnly={true} />
        </Center>
      )
    }
    return 'N/A';
  }

  const generateRows = () => {
    if(productsList.length > 0) {
      return productsList.map((product: ProductType) => {
        return (
          <Table.Tr key={product.productId}>
            <Table.Td ta={'center'}>
              <div className="name-container text-blue-600 underline underline-offset-4" onClick={() => triggerModal(product)}>
                {product.productTitle}
              </div>
            </Table.Td>
            <Table.Td ta={'center'}>{product.productCategory}</Table.Td>
            <Table.Td ta={'center'}>{product.productPrice}</Table.Td>
            <Table.Td ta={'center'}>{format(product.purchasedDate as Date, "PPP")}</Table.Td>
            <Table.Td ta={'center'}>{getRating(product)}</Table.Td>
            <Table.Td ta={'center'}>
              <ActionIcon variant="filled" color="red" onClick={() => deleteItem(product)}>
                <IconTrash style={{ width: '70%', height: '70%' }}/>
              </ActionIcon>
            </Table.Td>
          </Table.Tr>
        )
      })
    }
    return(
      <Table.Tr h={120}>
        <Table.Td colSpan={5} p={0}>
          <div className="no-rows flex h-30 align-middle justify-center">
            <IconUnlink style={{ width: '5%', height: '100%' }}/>
            <span className='mx-4 font-semibold text-lg'>No Data</span>
          </div>
        </Table.Td>
      </Table.Tr>
    )
  }

  const generateTable = () => {
    return (
      <Table miw={'90%'} verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th ta={'center'}>Name</Table.Th>
            <Table.Th ta={'center'}>Category</Table.Th>
            <Table.Th ta={'center'}>Price</Table.Th>
            <Table.Th ta={'center'}>Date of purchase</Table.Th>
            <Table.Th ta={'center'}>Rating</Table.Th>
            <Table.Th ta={'center'}></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{generateRows()}</Table.Tbody>
      </Table>
    );
  }

  return (
    <div className='main-container  grid place-items-center'>
      {openModal()}
      <div className="add-new-contianer my-4">
        <Button radius="xl" color="lime" leftSection={<IconPlus/>} onClick={() => triggerModal()}>Add</Button>
      </div>
      <div className="table-container my-4 mx-4" style={{border: '1px solid var(--mantine-color-gray-3)', borderRadius:'6px'}}>
        {generateTable()}
      </div>
    </div>
  )
}

export default ListingBody
