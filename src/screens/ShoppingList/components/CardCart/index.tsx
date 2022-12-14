import React, { useState } from "react";
import { Alert } from "react-native";
import { FlatList, HStack, Icon, Pressable, VStack } from "native-base";
import { Feather, AntDesign } from '@expo/vector-icons';

import { ShoppingList as ShoppingListType } from "src/model/shopping";

import Text from "../../../../components/Text";
import api from "../../../../api";
import { CardProduct } from "../CardProductList";


type Props = {
  item: ShoppingListType,
  setLoading: (bool: boolean) => void,
  setShowEditModal: React.Dispatch<React.SetStateAction<ShoppingListType>>,
  getList: () => void,
};

export function CardCart({ item, setLoading, getList, setShowEditModal }: Props) {
  const [expanded, setExpanded] = useState(false);

  function handleDelete() {
    Alert.alert('', 'Deseja mesmo deletar?', 
      [
        { text: 'Não'},
        { text: 'Sim', onPress: () => {
          setLoading(true);
          api.delete(`shopping/${item.id}`)
            .then(() => {
              getList();
            })
            .catch((err) => {
              console.log(err);
              Alert.alert('' , 'Erro ao deletar, tente novamente.');
            })
            .finally(() => setLoading(false));
        }},
      ]
    );
  }

  function handleEdit() {
    setShowEditModal(item);
  }

  const qtdProdutos = item.productList.length;

  return (
    <VStack rounded="md" bg="white" w="100%" px={2} py={2} mb={2}>
      <HStack justifyContent="space-between">
        <VStack>
          <Text fontWeight="bold" color="gray.700">
            {item.name}
          </Text>
          {!!item.totalPrice && (
            <Text fontWeight="bold" color="gray.700">
              R$ {item.totalPrice.toFixed(2).replace('.',',')}
            </Text>
          )}
        </VStack>
        
        <HStack>
          {!!qtdProdutos && (
            <Pressable mr={4} onPress={handleEdit}>
              <Feather name="edit" size={18} color="gray" />
            </Pressable>
          )}
          <Pressable onPress={handleDelete}>
            <Feather name="trash" size={18} color="red" />
          </Pressable>
        </HStack>
      </HStack>

      {expanded && (
        <FlatList
          data={item.productList}
          renderItem={({ item }) => <CardProduct item={item}/>}
        />
      )}
      
      {!!qtdProdutos && (
        <Pressable
          onPress={() => setExpanded(x => !x)}
          w="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Icon
            as={AntDesign}
            name={expanded ? "up" : "down"}
            color="gray.700"
            size="md"
          />
        </Pressable>
      )}
    </VStack>
  );
};