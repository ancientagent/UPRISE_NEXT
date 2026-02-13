import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  View, ActivityIndicator,
} from 'react-native';
import { hasValue } from '../../utilities/utilities';
import { accessToken, getUserDetails, getCommunityKey } from '../../state/selectors/UserProfile';
import URContainer from '../../components/URContainer/URContainer';
import Color from '../../theme/colors';
import styles from './AuthLoading.styles';

const AuthLoading = props => {
  const { navigation } = props;
  const token = useSelector(accessToken);
  const details = useSelector(getUserDetails);
  const communityKey = useSelector(getCommunityKey);

  useEffect(() => {
    checkIsUserLoggedIn();
  }, [token]);

  const checkIsUserLoggedIn = () => {
    if (!hasValue(token)) {
      navigation.navigate('WelcomeScreen');
      return;
    }
    // Token exists; if no community selected yet, go to Home Scene (Community) setup first
    if (!communityKey) {
      navigation.navigate('CommunitySetup', { fromLogin: true });
      return;
    }
    // Fallback: if server-side onboarding status governs other flows
    if (details.onBoardingStatus === 2) {
      navigation.navigate({ name: 'Dashboard' });
    } else {
      navigation.navigate({ name: 'Dashboard' });
    }
  };
  return (
    <URContainer safeAreaViewStyle={ { flex: 1 } }>
      <View style={ styles.container }>
        <ActivityIndicator size='large' color={ Color.White } />
      </View>
    </URContainer>
  );
};

export default AuthLoading;
