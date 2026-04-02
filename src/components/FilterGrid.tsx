import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { FILTER_CATEGORIES, FilterCategory } from '../constants/filters';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 48) / 2;

type Props = {
  onSelectFilter: (category: FilterCategory) => void;
};

export default function FilterGrid({ onSelectFilter }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>🔍 Buscar por...</Text>
      <View style={styles.grid}>
        {FILTER_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.item}
            onPress={() => onSelectFilter(category)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[`${category.color}30`, `${category.color}10`]}
              style={styles.itemGradient}
            >
              <View style={[styles.iconCircle, { backgroundColor: `${category.color}20`, borderColor: category.color }]}>
                <Ionicons name={category.icon as any} size={28} color={category.color} />
              </View>
              <Text style={[styles.label, { color: category.color }]}>{category.label}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 16,
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  item: {
    width: ITEM_SIZE,
    height: ITEM_SIZE * 0.75,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  itemGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
});
