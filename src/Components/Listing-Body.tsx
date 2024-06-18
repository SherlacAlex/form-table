import React from 'react'
import { useSelector } from 'react-redux'
import { ProductType } from '../Models/ProductType'
import { ProductState } from '../Store/ProductSlice'
import { format } from 'date-fns/format'
import { IconTrash } from '@tabler/icons-react'
import { ActionIcon, Table } from '@mantine/core'

function ListingBody() {

  const productsList = useSelector((state: ProductState) => state.products)

  const generateRows = () => {
    return productsList.map((product: ProductType) => {
      return (
        <Table.Tr key={product.productId}>
        <Table.Td>{product.productTitle}</Table.Td>
        <Table.Td>{product.productCategory}</Table.Td>
        <Table.Td>{product.productPrice}</Table.Td>
        <Table.Td>{format(product.purchasedDate as Date, "PPP")}</Table.Td>
        <Table.Td>
          <ActionIcon variant="filled" color="red">
            <IconTrash style={{ width: '70%', height: '70%' }}/>
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
      )
    })
  }

  const generateTable = () => {
    return (
      <Table miw={800} verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Date of purchase</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{generateRows()}</Table.Tbody>
      </Table>
    );
  }

  return (
    <div className='main-container  grid place-items-center'>
      <div className="table-container w-[90%]">
        {generateTable()}
      </div>
    </div>
  )
}

export default ListingBody