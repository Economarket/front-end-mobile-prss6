import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { Select as NBSelect, useToast } from "native-base";
import { Feather } from "@expo/vector-icons";
import { VStack, ScrollView } from "native-base";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";

import Input from "../../components/Input";
import Button from "../../components/Button";
import Text from "../../components/Text";
import Header from "../../components/Header";
import Heading from "../../components/Heading";
import Select from "../../components/Select";

import api from "../../api";

import { CategoryDTO } from "src/model/category";
import { MarketDTO } from "src/model/market";
import { BrandDTO } from "src/model/brand";
import { UnityDTO } from "src/model/unity";

export default function RegisterProduct() {
  const toast = useToast();
  const { navigate } = useNavigation();
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [markets, setMarkets] = useState<MarketDTO[]>([]);
  const [brands, setBrands] = useState<BrandDTO[]>([]);
  const [unities, setUnities] = useState<UnityDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      brand: "",
      category: "",
      unity: "",
      market: "",
      price: "",
    },
  });

  useEffect(() => {
    api.get<CategoryDTO[]>("/search/category").then(({ data }) => {
      setCategories(data);
    });
    api.get<MarketDTO[]>("/search/market").then(({ data }) => {
      const { content } = data;
      setMarkets(content);
    });
    api.get<BrandDTO[]>("/search/brand").then(({ data }) => {
      const { content } = data;
      setBrands(content);
    });
    api.get<UnityDTO[]>("/fieldutils/unity").then(({ data }) => {
      setUnities(data);
    });
  }, []);

  function validate(value: string) {
    const matches = value.match("^[0-9,.]+$");
    return matches?.length > 0 || "Apenas números";
  }

  function getErrorMsg(field: string) {
    const fieldError = errors[field];

    if (fieldError) {
      const { message } = fieldError;
      if (message) {
        return (
          <Text color="gray.400" marginBottom={6}>
            {message}
          </Text>
        );
      }
    }

    return null;
  }

  function OnSubmit({ name, price, unity, brand, category, market }) {
    setIsLoading(true);

    api.post("register/product", {
      name,
      price,
      unity,
      brand,
      category,
      market,
    })
      .then(() => {
        toast.show({
          description: 'Produto adiiconado com sucesso!'
        })
      })  
      .catch((err) => {
        Alert.alert("Não foi possível cadastrar o produto, tente novamente!");
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <VStack bg="gray.100" flex={1}>
      <Header title="Cadastro" />
      <ScrollView paddingX={8}>
        <Heading marginY={8}>Informe os dados do produto</Heading>

        <Controller
          control={control}
          name="name"
          rules={{
            maxLength: {
              value: 100,
              message: "Tamanho máximo de 100 caracteres",
            },
            minLength: {
              value: 3,
              message: "Tamanho mínimo de 3 caracteres",
            },
            required: "Produto é obrigatório",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Produto"
              marginBottom={!!errors.name ? 2 : 4}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              isInvalid={!!errors.name}
            />
          )}
        />

        {getErrorMsg("name")}

        <Controller
          control={control}
          name="brand"
          rules={{
            maxLength: {
              value: 100,
              message: "Tamanho máximo de 100 caracteres",
            },
            minLength: {
              value: 3,
              message: "Tamanho mínimo de 3 caracteres",
            },
            required: "Marca é obrigatório",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Select
              accessibilityLabel="Marca"
              placeholder="Marca"
              onValueChange={onChange}
              selectedValue={value}
              _selectedItem={{
                bg: "primary.400",
              }}
              mb={!!errors.brand ? 2 : 4}
            >
              {brands.map(({ brandName, id }) => (
                <NBSelect.Item
                  key={id}
                  label={brandName}
                  value={brandName}
                ></NBSelect.Item>
              ))}
            </Select>
          )}
        />

        {getErrorMsg("brand")}

        <Controller
          control={control}
          name="category"
          rules={{
            maxLength: {
              value: 50,
              message: "Tamanho máximo de 50 caracteres",
            },
            minLength: {
              value: 3,
              message: "Tamanho mínimo de 3 caracteres",
            },
            required: "Categoria é obrigatório",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Select
              accessibilityLabel="Categoria"
              placeholder="Categoria"
              onValueChange={onChange}
              selectedValue={value}
              _selectedItem={{
                bg: "primary.400",
              }}
              mb={!!errors.category ? 2 : 4}
            >
              {categories.map(({ name, id }) => (
                <NBSelect.Item
                  key={id}
                  label={name}
                  value={name}
                ></NBSelect.Item>
              ))}
            </Select>
          )}
        />
       

        {getErrorMsg("category")}

        <Controller
          control={control}
          name="unity"
          rules={{
            maxLength: {
              value: 100,
              message: "Tamanho máximo de 100 caracteres",
            },
            minLength: {
              value: 3,
              message: "Tamanho mínimo de 3 caracteres",
            },
            required: "Unidade é obrigatório",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Select
              accessibilityLabel="Unidade"
              placeholder="Unidade"
              onValueChange={onChange}
              selectedValue={value}
              _selectedItem={{
                bg: "primary.400",
              }}
              mb={!!errors.unity ? 2 : 4}
            >
              {unities.map(({ abbreviation, description }) => (
                <NBSelect.Item
                  key={abbreviation}
                  label={description}
                  value={description}
                ></NBSelect.Item>
              ))}
            </Select>
          )}
        />

        {getErrorMsg("unity")}

        <Controller
          control={control}
          name="market"
          rules={{
            maxLength: {
              value: 100,
              message: "Tamanho máximo de 100 caracteres",
            },
            minLength: {
              value: 3,
              message: "Tamanho mínimo de 3 caracteres",
            },
            required: "Mercado é obrigatório",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Select
              accessibilityLabel="Mercado"
              placeholder="Mercado"
              onValueChange={onChange}
              selectedValue={value}
              _selectedItem={{
                bg: "primary.400",
              }}
              mb={!!errors.market ? 2 : 4}
            >
              {markets.map(({ name, id }) => (
                <NBSelect.Item
                  key={id}
                  label={name}
                  value={name}
                ></NBSelect.Item>
              ))}
            </Select>
          )}
        />

        {getErrorMsg("market")}

        <Controller
          control={control}
          name="price"
          rules={{
            required: "Preço é obrigatório",
            validate,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Preço"
              marginBottom={!!errors.price ? 2 : 4}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="number-pad"
              isInvalid={!!errors.price}
            />
          )}
        />

        {getErrorMsg("price")}

        <Button
          marginBottom={2}
          endIcon={<Feather name="log-in" size={16} color="white" />}
          onPress={handleSubmit(OnSubmit)}
          isLoading={isLoading}
        >
          Cadastrar
        </Button>
      </ScrollView>
    </VStack>
  );
}
