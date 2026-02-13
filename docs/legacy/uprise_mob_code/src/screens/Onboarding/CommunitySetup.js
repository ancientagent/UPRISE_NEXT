/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Alert, Share, TouchableOpacity, Platform, PermissionsAndroid, ToastAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import TypeaheadInput from '../../components/TypeaheadInput/TypeaheadInput';
import validateCommunityRequest from '../../services/onboarding/validateCommunity.service';
import assignCommunityRequest from '../../services/onboarding/assignCommunity.service';
import { getApprovedSubGenres, getSubGenreSuggestions, requestSubGenre } from '../../services/onboarding/genreAlpha.service';
import { request } from '../../services/request/request.service';
import { setCommunityKey, setRevolutionary } from '../../state/actions/community/community.actions';
import { accessToken } from '../../state/selectors/UserProfile';
import { toCommunityKey } from '../../contracts/community';
import Colors from '../../theme/colors';
import Config from 'react-native-config';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';

export default function CommunitySetup({ navigation, route }) {
  const dispatch = useDispatch();
  const token = useSelector(accessToken);
  const [subGenre, setSubGenre] = useState(null);
  const [city, setCity] = useState(null);
  const [stateName, setStateName] = useState(null);

  const fetchSubGenres = async (query) => {
    const list = await getApprovedSubGenres();
    const q = (query || '').toLowerCase();
    return (list || [])
      .filter(g => (
        ((g.name || '').toLowerCase().includes(q))
        || ((g.id || '').toLowerCase().includes(q))
        || (Array.isArray(g.aliases) && g.aliases.some(a => (a || '').toLowerCase().includes(q)))
      ))
      .slice(0, 20)
      .map(g => ({ key: g.id, label: g.name, value: g }));
  };

  const fetchCities = async (query) => {
    // Use existing available cities endpoint via POST
    const url = Config.AVALIABLE_CITIES;
    if (!url) return [];
    const payload = { query };
    const options = { method: 'POST', data: JSON.stringify(payload), headers: token ? { Authorization: `Bearer ${token}` } : {}, url };
    try {
      const res = await request(options, true);
      const items = (res && res.data) || res || [];
      const q = query.toLowerCase();
      return items
        .filter(i => (`${i.city}, ${i.state}`.toLowerCase().includes(q)))
        .slice(0, 20)
        .map(i => ({ key: `${i.city}-${i.state}`, label: `${i.city}, ${i.state}`, value: i }));
    } catch (_) {
      return [];
    }
  };

  const onSubmit = async () => {
    if (!city || !stateName) {
      Alert.alert('Incomplete', 'Please select your city/state.');
      return;
    }
    if (!subGenre) {
      Alert.alert('Incomplete', 'Please choose your sub‑genre and city/state.');
      return;
    }

    const subSlug = subGenre && (subGenre.id || subGenre.slug || subGenre.value?.id || subGenre.value?.slug || (subGenre.name && subGenre.name.toLowerCase().replace(/\s+/g, '-')));
    const key = toCommunityKey({ city, state: stateName, genre: subSlug });
    try {
      if ((Config.COMMUNITY_VIABILITY_BYPASS || '').toString() === 'true') {
        dispatch(setCommunityKey(key));
        if (route && route.params && route.params.fromLogin) {
          navigation && navigation.replace && navigation.replace('Dashboard');
        } else {
          navigation && navigation.goBack();
        }
        return;
      }
      const resp = await validateCommunityRequest({ city, state: stateName, subGenre: subSlug, accessToken: token });
      if (resp && resp.active) {
        dispatch(setCommunityKey(resp.primary?.community_key || key));
        if (route && route.params && route.params.fromLogin) {
          navigation && navigation.replace && navigation.replace('Dashboard');
        } else {
          navigation && navigation.goBack();
        }
        return;
      }
      // Revolutionary flow
      const original = { city, state: stateName, subGenre: subSlug, community_key: key };
      dispatch(setRevolutionary(original));
      const nearest = resp && (resp.nearestActive || (resp.alternatives && resp.alternatives[0]));
      const targetKey = nearest && (nearest.community_key || toCommunityKey({ city: nearest.city, state: nearest.state, genre: (nearest.subGenre || nearest.superGenre) })) || key;

      Alert.alert(
        'You’re a Revolutionary',
        `The ${city}, ${stateName} ${subSlug} community isn’t active yet. Invite your network to bring it to life! We’ll connect you to the nearest active hub meanwhile.`,
        [
          {
            text: 'Invite',
            onPress: async () => {
              try {
                const message = `Help me bring the ${city} ${subSlug} uprising to life on UPRISE! Join: https://uprise.app/join?community=${key}`;
                // dynamic import to avoid RN bundler complain if not linked
                const RN = require('react-native');
                await RN.Share.share({ message });
              } catch (_) {}
            },
          },
          {
            text: 'Continue',
            onPress: () => {
              dispatch(setCommunityKey(targetKey));
              if (route && route.params && route.params.fromLogin) {
                navigation && navigation.replace && navigation.replace('Dashboard');
              } else {
                navigation && navigation.goBack();
              }
            },
          },
        ],
      );
    } catch (e) {
      // Fail safe: persist entered community
      dispatch(setCommunityKey(key));
      if (route && route.params && route.params.fromLogin) {
        navigation && navigation.replace && navigation.replace('Dashboard');
      } else {
        navigation && navigation.goBack();
      }
    }
  };

  // --- GPS helper ---
  const parseFormattedAddress = (addr) => {
    const parts = (addr || '').split(',');
    const n = parts.length;
    if (n >= 3) {
      const cityPart = parts[n - 3].trim();
      const statePart = parts[n - 2].replace(/[0-9]/g, '').trim();
      return { city: cityPart, state: statePart };
    }
    if (n === 2) {
      return { city: '', state: parts[0].replace(/[0-9]/g, '').trim() };
    }
    return { city: '', state: '' };
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const status = await Geolocation.requestAuthorization('whenInUse');
      return status === 'granted';
    }
    if (Platform.OS === 'android' && Platform.Version < 23) return true;
    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (granted) return true;
    const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show('Location permission denied by user', ToastAndroid.LONG);
    }
    return false;
  };

  const useMyGps = async () => {
    try {
      const ok = await requestLocationPermission();
      if (!ok) return;
      Geolocation.getCurrentPosition(async pos => {
        try {
          const apiKey = Config.GOOGLE_MAPS_API_KEY || Config.MAP_API_KEY || 'AIzaSyCNNmfTGsBatXy77JEAcjxuHCR2WSxVhvg';
          Geocoder.init(apiKey);
          const geo = await Geocoder.from(pos.coords.latitude, pos.coords.longitude);
          const formatted = geo?.results?.[1]?.formatted_address || geo?.results?.[0]?.formatted_address;
          const parsed = parseFormattedAddress(formatted || '');
          if (parsed.city) setCity(parsed.city);
          if (parsed.state) setStateName(parsed.state);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log('geocode failed', e?.message || e);
        }
      }, err => {
        Alert.alert(`Code ${err.code}`, err.message);
      }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
    } catch (e) {
      // ignore
    }
  };

  return (
    <View style={ styles.container }>
      <Text style={ styles.title }>Choose Your Community</Text>
      <Text style={ styles.note }>
        GPS verification is optional. However, only GPS‑verified users can upvote songs in their Home Scene.
      </Text>
      <TypeaheadInput
        placeholder='Sub-Genre (e.g., Hardcore Punk, Trap)'
        fetchSuggestions={ async (q) => {
          const list = await getSubGenreSuggestions({ q });
          return list.map(g => ({ key: g.id || g.key, label: g.name || g.label, value: g }));
        } }
        onSelect={ item => setSubGenre(item.value) }
      />
      <TypeaheadInput
        placeholder='City, State (e.g., Austin, Texas)'
        fetchSuggestions={ fetchCities }
        onSelect={ item => { setCity(item.value.city); setStateName(item.value.state); } }
      />
      <TouchableOpacity style={ styles.secondaryCta } onPress={ useMyGps }>
        <Text style={ styles.secondaryCtaText }>Use my GPS (recommended)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={ styles.cta } onPress={ onSubmit }>
        <Text style={ styles.ctaText }>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ContainerColor, padding: 20 },
  title: { color: '#fff', fontSize: 18, marginBottom: 6 },
  note: { color: '#cfcfcf', fontSize: 12, marginBottom: 12 },
  cta: { marginTop: 16, backgroundColor: Colors.Primary, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryCta: { marginTop: 8, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#444', borderRadius: 8 },
  secondaryCtaText: { color: '#ddd', fontSize: 14 },
});
