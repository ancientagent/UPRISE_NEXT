import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { isSuperAdmin, getCommunityKey } from '../../state/selectors/UserProfile';
import Colors from '../../theme/colors';

export default function AdminTools() {
  const superAdmin = useSelector(isSuperAdmin);
  const currentKey = useSelector(getCommunityKey);
  const [seedKey, setSeedKey] = useState(currentKey || '');
  const [minutes, setMinutes] = useState('50');

  return (
    <View style={ styles.container }>
      <Text style={ styles.title }>Admin Tools (SUPERADMIN)</Text>
      {!superAdmin && (
        <Text style={ styles.note }>
          You do not have SUPERADMIN permissions. This panel is hidden for normal users.
        </Text>
      )}
      {superAdmin && (
        <>
          <Text style={ styles.label }>Viability Bypass (client-only)</Text>
          <Text style={ styles.note }>
            Set COMMUNITY_VIABILITY_BYPASS=true in react-native-config or use server toggle when available.
          </Text>
          <View style={ styles.section }>
            <Text style={ styles.label }>Seed Minutes / Force Activate (staging)</Text>
            <TextInput
              placeholder='community_key'
              value={ seedKey }
              onChangeText={ setSeedKey }
              style={ styles.input }
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder='minutes (e.g., 50)'
              value={ minutes }
              onChangeText={ setMinutes }
              keyboardType='numeric'
              style={ styles.input }
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={ styles.cta } onPress={() => Alert.alert('Stub', 'Wire to /admin endpoints when available.') }>
              <Text style={ styles.ctaText }>Seed Minutes (stub)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ styles.ctaSecondary } onPress={() => Alert.alert('Stub', 'Wire to /admin endpoints when available.') }>
              <Text style={ styles.ctaText }>Force Activate (stub)</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ContainerColor, padding: 20 },
  title: { color: '#fff', fontSize: 18, marginBottom: 10 },
  note: { color: '#bdbdbd', fontSize: 12, marginBottom: 12 },
  label: { color: '#fff', fontSize: 14, marginBottom: 6 },
  section: { marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#444', borderRadius: 8, color: '#fff', paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10 },
  cta: { backgroundColor: Colors.Primary, paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  ctaSecondary: { backgroundColor: '#39424e', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  ctaText: { color: '#fff', fontSize: 14 },
});

