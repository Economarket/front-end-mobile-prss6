import React from 'react';
import { HStack, VStack } from 'native-base';

import { Product } from 'src/model/product';

import Card from '../../../../components/Card';
import Text from '../../../../components/Text';


interface Props {
    item: Product,
}


export default function ProductCard({ item } : Props) {
    const {
        id,
        name,
        brand,
        market,
        date,
        price,
        unid,
    } = item;

  return (
    <Card bg="white" rounded="md" mb={2}>
        <VStack px={2}>
            <HStack
                w="100%"
                alignItems="center"
                justifyContent="space-between"
            >
                <Text
                    fontFamily="body"
                    fontSize="md"
                    color="gray.800"
                >
                    {name}
                </Text>
                <Text
                    fontFamily="body"
                    fontSize="md"
                    color="gray.700"
                >
                    {unid}
                </Text>
            </HStack>
            <Text
                fontFamily="body"
                fontSize="md"
                color="gray.700"
            >
                {brand}
            </Text>
            <Text
                fontFamily="body"
                fontSize="md"
                color="gray.700"
            >
                {market}
            </Text>
            
            <HStack
                w="100%"
                alignItems="flex-end"
                justifyContent="space-between"
            >
                <Text
                    fontFamily="body"
                    fontSize="sm"
                    color="gray.500"
                >
                    {date}
                </Text>
                <Text
                    fontFamily="heading"
                    fontSize="lg"
                    color="gray.800"
                >
                    {price}
                </Text>
            </HStack>
        </VStack>
    </Card>
  );
}
