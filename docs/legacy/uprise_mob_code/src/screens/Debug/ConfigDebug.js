import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Config from 'react-native-config';

const ConfigDebug = () => {
  const allConfigKeys = Object.keys(Config);
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>React Native Config Debug</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key API Variables:</Text>
        <Text style={styles.keyValue}>API_BASE_URL: "{Config.API_BASE_URL}"</Text>
        <Text style={styles.keyValue}>BASE_URL: "{Config.BASE_URL}"</Text>
        <Text style={styles.keyValue}>REFRESH_TOKEN_URL: "{Config.REFRESH_TOKEN_URL}"</Text>
        <Text style={styles.keyValue}>UPDATED_USERDETAILS: "{Config.UPDATED_USERDETAILS}"</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Config Keys ({allConfigKeys.length}):</Text>
        {allConfigKeys.length === 0 ? (
          <Text style={styles.error}>❌ No config keys found!</Text>
        ) : (
          allConfigKeys.map((key) => (
            <Text key={key} style={styles.keyValue}>
              {key}: "{Config[key]}"
            </Text>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Debug Info:</Text>
        <Text style={styles.info}>Total keys: {allConfigKeys.length}</Text>
        <Text style={styles.info}>Config object type: {typeof Config}</Text>
        <Text style={styles.info}>Is Config empty: {Object.keys(Config).length === 0 ? 'YES' : 'NO'}</Text>
        <Text style={styles.info}>NODE_ENV: {process.env.NODE_ENV || 'undefined'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Raw Config Object:</Text>
        <Text style={styles.raw}>{JSON.stringify(Config, null, 2)}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#111',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  keyValue: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: '#FFC107',
    marginBottom: 4,
  },
  error: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: 'bold',
  },
  raw: {
    fontSize: 10,
    color: '#BBB',
    fontFamily: 'monospace',
  },
});

export default ConfigDebug;