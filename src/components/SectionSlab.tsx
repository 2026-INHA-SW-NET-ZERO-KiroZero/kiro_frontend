import { StyleSheet, View } from 'react-native';

import { color } from '@/theme/theme';

type SectionSlabProps = {
  marginTop?: number;
  marginBottom?: number;
};

export function SectionSlab({ marginTop = 20, marginBottom = 0 }: SectionSlabProps) {
  return <View style={[styles.slab, { marginTop, marginBottom }]} />;
}

const styles = StyleSheet.create({
  slab: {
    width: '100%',
    height: 8,
    backgroundColor: color.sectionGap,
  },
});
