import React, { useEffect, useState } from 'react'
import { ProductRating } from '../Models/ProductType'
import { ActionIcon, Button, Center, Rating, ScrollArea, Table} from '@mantine/core';
import { IconTrash, IconUnlink, IconPlus } from '@tabler/icons-react';
import { nanoid } from '@reduxjs/toolkit';
import ProductReview from './ProductReview';

interface ReviewTableProps {
  reviews: ProductRating[],
  tableChanged: (reviews: ProductRating[]) => void
}

function ReviewTable({ reviews, tableChanged }: ReviewTableProps) {
  
  const [productReviews, setProductReviews] = useState<ProductRating[]>(reviews)

  const deleteItem = (index: number) => {
    reviews.splice(index, 1);
    reviews = [...reviews];
    setProductReviews(reviews);
    tableChanged(reviews);
  }

  const updateRow = (row: ProductRating, index: number) => {
    const updatedReviews: ProductRating[] = [...productReviews];
    updatedReviews[index] = row;
    setProductReviews(updatedReviews);
    tableChanged(updatedReviews);
  }

  const generateRows = () => {
    if(productReviews.length > 0) {
      return productReviews.map((review: ProductRating, index: number) => {
        return (
          <Table.Tr key={review.reviewId}>
            <Table.Td ta={'center'}>{index + 1}</Table.Td>
            <Table.Td ta={'center'}>
              <Center>
                <Rating fractions={4} value={review.productRating} onChange={(val) => { review.productRating = val; updateRow(review, index)}} readOnly={review.productRating? true : false} />
              </Center>
            </Table.Td>
            <Table.Td ta={'center'} w={350}>
              <ProductReview review={review} contentChanged={(rev) => updateRow(rev, index)}/>
            </Table.Td>
            <Table.Td ta={'center'}>
              <ActionIcon variant="filled" color="red" onClick={() => deleteItem(index)}>
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
      <ScrollArea.Autosize mah={300} mx="auto">
        <Table verticalSpacing="sm" highlightOnHover stickyHeader >
            <Table.Thead>
              <Table.Tr>
                <Table.Th ta={'center'}>#</Table.Th>
                <Table.Th ta={'center'}>Rating</Table.Th>
                <Table.Th ta={'center'}>Review</Table.Th>
                <Table.Th ta={'center'}></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{generateRows()}</Table.Tbody>
          </Table>
      </ScrollArea.Autosize>
    );
  };

  
  useEffect(() => {
    generateRows()
  }, [productReviews, reviews]);

  const addNewReview = () => {
    const uuid = nanoid();
    let row: ProductRating = {
      reviewId: uuid,
      productRating: 0,
      productReview: ''
    } as ProductRating;
    const updatedReviews: ProductRating[] = [...productReviews, row ];
    setProductReviews(updatedReviews);
    tableChanged(updatedReviews);
  }

  return (
    <div className='main-container grid place-items-center'>
      <div className="add-new-contianer my-4">
        <Button radius="xl" color="lime" leftSection={<IconPlus/>} onClick={() => addNewReview()}>Add</Button>
      </div>
      <div className="table-container w-[90%] my-4" style={{border: '1px solid var(--mantine-color-gray-3)', borderRadius:'6px'}}>
        {generateTable()}
      </div>
    </div>
  )
}

export default ReviewTable