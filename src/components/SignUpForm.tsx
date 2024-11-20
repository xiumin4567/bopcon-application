import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { signup } from '../apis/auth.api';
import { login as loginAction } from '../store/slices/authSlice';
import BOPCONLogo from "../assets/icons/BOPCONLogo.svg";

const SignUpForm = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [checks, setChecks] = useState({
    lengthCheck: false,
    specialCharCheck: false,
    repeatCheck: false,
  });

  // 체크박스 토글 함수
  const toggleCheck = (checkName: keyof typeof checks) => {
    setChecks((prevChecks) => ({
      ...prevChecks,
      [checkName]: !prevChecks[checkName],
    }));
  };

  // 메인 페이지로 이동
  const handleLogoClick = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeScreen' }],
    });
  };

  // 회원가입 처리
  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !nickname) {
      Alert.alert('오류', '모든 필드를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      const response = await signup({ email, password, nickname });

      // Redux 상태 업데이트
      dispatch(
        loginAction({
          token: response.accessToken,
          refreshToken: response.refreshToken,
          nickname: response.nickname,
        })
      );

      Alert.alert('회원가입 성공!', '로그인 페이지로 이동합니다.');
      navigation.navigate('LoginScreen');
    } catch (error: any) {
      console.error('회원가입 오류:', error);
      Alert.alert(
        '회원가입 실패',
        error.response?.data?.message || '알 수 없는 에러가 발생했습니다.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoContainer} onPress={handleLogoClick}>
        <BOPCONLogo width={170} height={60} />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="이메일"
          keyboardType="email-address"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="닉네임"
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="비밀번호"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="비밀번호 확인"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {/* 체크리스트 */}
      <View style={styles.checklistContainer}>
        <TouchableOpacity style={styles.checklistItem} onPress={() => toggleCheck('lengthCheck')}>
          <View style={[styles.checkbox, checks.lengthCheck && styles.checkboxChecked]} />
          <Text style={styles.checklistText}>8자 이상, 15자 이하로 설정해 주세요</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.checklistItem} onPress={() => toggleCheck('specialCharCheck')}>
          <View style={[styles.checkbox, checks.specialCharCheck && styles.checkboxChecked]} />
          <Text style={styles.checklistText}>특수 문자를 사용해 주세요</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.checklistItem} onPress={() => toggleCheck('repeatCheck')}>
          <View style={[styles.checkbox, checks.repeatCheck && styles.checkboxChecked]} />
          <Text style={styles.checklistText}>똑같은 문자가 4번 반복되면 안돼요</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
        <Text style={styles.loginButtonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const inputSpacing = 25; // 이메일/비밀번호 인풋 사이의 간격
const buttonSpacing = 7; // 인풋과 버튼 사이 간격

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    width: '80%',
    marginBottom: inputSpacing,
  },
  input: {
    height: 65,
    borderWidth: 1,
    borderColor: '#9D9D9D',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  checklistContainer: {
    width: '80%',
    marginBottom: buttonSpacing,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checklistText: {
    fontSize: 10,
    color: '#555',
    marginLeft: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#9D9D9D',
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: '#000',
  },
  loginButton: {
    width: '80%',
    height: 70,
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: buttonSpacing,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 15,
  },
});

export default SignUpForm;