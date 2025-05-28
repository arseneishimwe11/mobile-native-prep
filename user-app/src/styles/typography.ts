import { StyleSheet } from 'react-native';
import colors from './colors';

const typography = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  body: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  caption: {
    fontSize: 14,
    color: colors.textLight,
  },
  small: {
    fontSize: 12,
    color: colors.textLight,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default typography;