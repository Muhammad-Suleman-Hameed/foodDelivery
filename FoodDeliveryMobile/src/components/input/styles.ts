import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import Fonts from '../../theme/fonts';
import { hp, wp } from '../../theme/responsive';

export const styles = StyleSheet.create({
  container: {
    marginBottom: hp(2),
  },
  label: {
    marginBottom: hp(0.8),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: Fonts.normalize(11),
  },
  inputContainer: {
    height: hp(6.2),
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3.5),
  },
  focusedInput: {
    borderColor: Colors.primary,
  },
  errorInput: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    height: '100%',
    color: Colors.text,
    fontSize: Fonts.normalize(14),
  },
  leftIcon: {
    marginRight: wp(2.5),
  },
  rightIcon: {
    marginLeft: wp(2.5),
  },
  errorText: {
    marginTop: hp(0.5),
    marginLeft: wp(1),
  },
});
