import React, { useState } from 'react';
import {
  View, Text, Platform, Dimensions, TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Icon, Button } from 'react-native-elements';
import { Formik, Field } from 'formik';
import URTextfield from '../../components/URTextfield/URTextfield';
import Colors from '../../theme/colors';
import { strings } from '../../utilities/localization/localization';
import styles from './Signup.styles';
import SignupValidators from './SignupValidators';
import { signupRequestSagaAction } from '../../state/actions/sagas';
import URCheckBox from '../../components/URCheckBox/URCheckBox';

const SignupForm = props => {
  const { navigation } = props;
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [showRequire, setShowRequire] = useState(false);
  const dispatch = useDispatch();
  const onSubmitForm = values => {
    const payload = {
      userName: values.userName.trim(),
      email: values.email,
      password: values.password.trim(),
      role: 'listener',
    };
    dispatch(signupRequestSagaAction(payload));
  };
  const screenHeight = Platform.OS === 'ios' ? 200 : 100;
  const height = Dimensions.get('window').height - screenHeight;
  return (
    <View style={ { height, width: '100%' } }>
      <Formik
        initialValues={ {
          userName: '',
          email: '',
          password: '',
          confirmPassword: '',
          privacyCheck: false,
        } }
        validationSchema={ SignupValidators(false) }
        onSubmit={ value => onSubmitForm(value) }
      >
        { ({
          handleSubmit,
          isValid,
          values,
          setFieldValue,
        }) => (
          <>
            <Field
              inputBox={ styles.inputBox }
              placeholder={ strings('SignUp.usernamePlaceholder') }
              component={ URTextfield }
              value={ values.userName.trim() }
              name='userName'
              autoCapitalize='none'
              autoCorrect={ false }
              label={ strings('SignUp.usernameLabel') }
              showAstric
            />
            <Field
              inputBox={ styles.inputBox }
              placeholder={ strings('SignUp.emailPlaceholder') }
              component={ URTextfield }
              name='email'
              autoCapitalize='none'
              autoCorrect={ false }
              label={ strings('SignUp.emailLabel') }
              showAstric
            />
            <Field
              inputBox={ styles.inputBox }
              placeholder={ strings('SignUp.passwordPlaceholder') }
              component={ URTextfield }
              value={ values.password.trim() }
              name='password'
              showAstric
              autoCapitalize='none'
              rightIcon={ (
                <Icon
                  type='ionicon'
                  name={ hidePassword ? 'eye-off-outline' : 'eye-outline' }
                  size={ 18 }
                  color={ hidePassword ? Colors.textColor : Colors.URbtnColor }
                  onPress={ () => setHidePassword(!hidePassword) }
                />
                ) }
              autoCorrect={ false }
              secureTextEntry={ !!hidePassword }
              label={ strings('SignUp.passwordLabel') }
            />
            <Field
              inputBox={ styles.inputBox }
              placeholder={ strings('SignUp.confirmPasswordPlaceholder') }
              component={ URTextfield }
              value={ values.confirmPassword.trim() }
              name='confirmPassword'
              showAstric
              autoCapitalize='none'
              rightIcon={ (
                <Icon
                  type='ionicon'
                  name={ hideConfirmPassword ? 'eye-off-outline' : 'eye-outline' }
                  size={ 18 }
                  color={ hideConfirmPassword ? Colors.textColor : Colors.URbtnColor }
                  onPress={ () => setHideConfirmPassword(!hideConfirmPassword) }
                />
                ) }
              autoCorrect={ false }
              secureTextEntry={ !!hideConfirmPassword }
              label={ strings('SignUp.confirmPasswordLabel') }
            />
            <View style={ { marginTop: 10 } }>
              <View style={ { flexDirection: 'row', alignItems: 'center' } }>
                <URCheckBox
                  checked={ values.privacyCheck }
                  containerStyle={ styles.iconContainer }
                  iconSize={ 16 }
                  onPress={ () => setFieldValue('privacyCheck', !values.privacyCheck) }
                />
                <Text style={ styles.checkText }>
                  { strings('SignUp.conditionsAgree') }
                </Text>
                <Text style={ styles.highlightedText }>
                  { strings('SignUp.conditions') }
                </Text>
                <Text style={ styles.checkText }>
                  { strings('SignUp.and') }
                </Text>
                <Text style={ styles.highlightedText }>
                  { strings('SignUp.privacy') }
                </Text>
              </View>
              { (!values.privacyCheck && showRequire) && (
                <Text style={ { color: Colors.URbtnColor, marginTop: 6 } }>
                  { strings('SignupValidators.acceptTerms') || 'Please accept Terms & Privacy to continue.' }
                </Text>
              ) }
            </View>
            <View style={ { marginTop: 23 } }>
              <Button
                buttonStyle={ styles.signupBtn }
                titleStyle={ styles.signupTitle }
                onPress={ () => { setShowRequire(true); handleSubmit(); } }
                TouchableComponent={ TouchableOpacity }
                title={ strings('SignUp.signUp') }
                disabled={ !isValid }
              />
              <View style={ styles.signUpContainer }>
                <Text style={ styles.accountText }>{ strings('SignUp.account') }</Text>
                <TouchableOpacity onPress={ () => navigation.navigate('Login') }>
                  <Text style={ styles.loginText }>{ strings('General.login') }</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) }
      </Formik>
    </View>
  );
};

export default SignupForm;
