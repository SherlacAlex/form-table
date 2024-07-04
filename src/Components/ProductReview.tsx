import { ActionIcon, Paper, Textarea, Text } from '@mantine/core';
import { IconCheck, IconEdit } from '@tabler/icons-react';
import React, { useState } from 'react'
import { ProductRating } from '../Models/ProductType';

interface ProductReviewProps {
  review: ProductRating;
  contentChanged: (review:ProductRating) => void;
}

function ProductReview({ review, contentChanged }: ProductReviewProps) {

  const [showEdit, setShowEdit] = useState<Boolean>(review.productFeedback? true: false);
  const [reviewContent, setProductReview] = useState<string>(review.productFeedback);
  
  const updateReview = () => { 
    const newReview: ProductRating = {...review, productFeedback: reviewContent}
    setShowEdit(true)
    contentChanged(newReview)
  }

  const showContent = () => {
    if(showEdit) {
      return(
        <div className="review-container flex items-center">
          <Paper shadow="xs" p="sm" w={'100%'}>
            <Text w={'95%'}>{reviewContent}</Text>
          </Paper>
          <ActionIcon size="md" radius="md" ml={5} onClick={() => setShowEdit(false)}>
            <IconEdit style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        </div>
      )
    }
    else {
      return(
        <div className="review-container flex items-center">
          <Textarea maxRows={2} w={'95%'} size="sm" radius="md" placeholder="Enter Review" value={reviewContent} onChange={(val) => setProductReview(val.target.value)}/>
          <ActionIcon size="md" radius="md" ml={5} onClick={updateReview}>
            <IconCheck style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        </div>
      )
    }
  }

  return (
    <div>
      {showContent()}
    </div>
  )
}

export default ProductReview