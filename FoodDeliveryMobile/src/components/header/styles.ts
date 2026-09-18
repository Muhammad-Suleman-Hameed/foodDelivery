import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import Fonts from '../../theme/fonts';
import { hp, wp } from '../../theme/responsive';

export const styles = StyleSheet.create({
  container: {
    height: hp(6.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  leftContainer: {
    width: wp(10),
    alignItems: 'flex-start',
  },
  backButton: {
    padding: wp(1),
  },
  backIcon: {
    fontSize: Fonts.normalize(26),
    lineHeight: Fonts.normalize(28),
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: wp(10),
    alignItems: 'flex-end',
  },
});
