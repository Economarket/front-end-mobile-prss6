import React, { useState, useContext } from 'react';
import { VStack, Center } from 'native-base';
import { Alert } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useForm, Controller  } from 'react-hook-form';

import api, { setToken } from '../../api';

import { theme } from '../../theme/theme';

import Heading from "../../components/Heading";
import Input from '../../components/Input';
import Button from '../../components/Button';
import Text from '../../components/Text';
import Loading from '../../components/Text';

import LogoAzul from '@assets/logo_azul.svg';
import AuthContext from '../../context/AuthContext';


export default function Login() {
  const { navigate } = useNavigation();
  const { setAuthenticated } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: __DEV__ ? 'manager@manager.com' : '',
      password: __DEV__ ? '@manager' : '',
    }
  });


  function getErrorMsg(field: string) {
    const fieldError = errors[field];

    if (fieldError) {
      const { message } = fieldError;
      if (message) {
        return (
          <Text
            color="gray.400"
            marginBottom={6}
          >
            {message}
          </Text>
        );
      }
    } 

    return null;
  }



  function onSubmit({ email, password }) {
    setIsLoading(true);

    api.post('/auth/login', {
      email,
      password,
    })
      .then(({ data }) => {
        const { access_token } = data;
        if (access_token) {
          setToken(access_token);
          setAuthenticated(true);
        }
      })
      .catch(err => {
        Alert.alert("Verifique se o usuario e senha estão corretos.");
      })
      .finally(() =>  setIsLoading(false));
  }


  return (
    <VStack
      bg="gray.100"
      paddingX={8}
      flex={1}
    >

      {isLoading && <Loading/>}

      <Center>
        <LogoAzul height={200} width={200} />
      </Center>

      <Heading
        textAlign="center"
        marginBottom={8}
      >
        Oi, Vamos começar?
      </Heading>

      <Controller
        control={control}
        name="email"
        rules={{
          maxLength: {
            value: 100,
            message: 'Tamanho máximo de 100 caracteres'
          },
          minLength: {
            value: 3,
            message: 'Tamanho mínimo de 3 caracteres'
          },
          required: 'Email é obrigátorio',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input 
            placeholder='Email'
            marginBottom={!!errors.email ? 2 : 8}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            isInvalid={!!errors.email}
            InputLeftElement={
              <MaterialIcons
                name="email"
                size={20}
                color={theme.colors.gray[700]}
                style={{ paddingStart: 8 }}
              />
            }
          />
        )}
      />

      {getErrorMsg('email')}
      
      <Controller
        control={control}
        name="password"
        rules={{
          maxLength: {
            value: 50,
            message: 'Tamanho máximo de 50 caracteres'
          },
          minLength: {
            value: 6,
            message: 'Tamanho mínimo de 6 caracteres'
          },
          required: 'Senha é obrigátoria',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input 
            placeholder='Senha'
            secureTextEntry={!showPassword}
            marginBottom={2}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            isInvalid={!!errors.password}
            InputLeftElement={
              <FontAwesome5
                name="key"
                size={20}
                color={theme.colors.gray[700]}
                style={{ paddingStart: 8 }}
              />
            }
            InputRightElement={
              <Feather
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color={theme.colors.gray[700]}
                style={{ paddingEnd: 8 }}
                onPress={() => setShowPassword((x) => !x)}
              />
            }
          />
        )}
      />

      {getErrorMsg('password')}

      <Text
        color="gray.400"
        marginBottom={8}
        textAlign="right"
        onPress={() => navigate("forgotPassword")}
      >
        Esqueceu a senha?
      </Text>

      <Button
        marginBottom={2}
        endIcon={<Feather name="log-in" size={16} color="white"/>}
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
      >
        Login
      </Button>

      <Text color="gray.400">
        Ainda não possui cadastro? <Text color="primary.400" fontSize="sm" onPress={() => navigate("signup")}>Cadastre-se</Text>
      </Text>
      
    </VStack>
  );
}
