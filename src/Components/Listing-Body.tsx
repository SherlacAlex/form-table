import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ProductType } from '../Models/ProductType'
import { ProductState, deleteProduct } from '../Store/ProductSlice'
import { format } from 'date-fns/format'
import { IconPlus, IconTrash, IconUnlink } from '@tabler/icons-react'
import { ActionIcon, Button, Table } from '@mantine/core'

function ListingBody() {

  const productsList = useSelector((state: ProductState) => state.products)

  const dispatch = useDispatch();

  const deleteItem = (prop: ProductType) => {
    dispatch(deleteProduct(prop.productId));
  }

  const triggerModal = (product: ProductType) => {

  }

  const generateRows = () => {
    if(productsList.length > 0) {
       return productsList.map((product: ProductType) => {
        return (
          <Table.Tr key={product.productId}>
            <Table.Td ta={'center'}>
              <div className="name-container" onClick={() => triggerModal(product)}>
                {product.productTitle}
              </div>
            </Table.Td>
            <Table.Td ta={'center'}>{product.productCategory}</Table.Td>
            <Table.Td ta={'center'}>{product.productPrice}</Table.Td>
            <Table.Td ta={'center'}>{format(product.purchasedDate as Date, "PPP")}</Table.Td>
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
      <Table miw={800} verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th ta={'center'}>Name</Table.Th>
            <Table.Th ta={'center'}>Category</Table.Th>
            <Table.Th ta={'center'}>Price</Table.Th>
            <Table.Th ta={'center'}>Date of purchase</Table.Th>
            <Table.Th ta={'center'}></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{generateRows()}</Table.Tbody>
      </Table>
    );
  }

  return (
    <div className='main-container  grid place-items-center'>
      <div className="add-new-contianer my-4">
        <Button radius="xl" color="lime" leftSection={<IconPlus/>}>Add</Button>
      </div>
      <div className="table-container w-[90%] my-4" style={{border: '1px solid var(--mantine-color-gray-3)', borderRadius:'6px'}}>
        {generateTable()}
      </div>
    </div>
  )
}

export default ListingBody
