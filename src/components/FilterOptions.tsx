import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { FilterCategory, FilterOption } from '../constants/filters';

type Props = {
  category: FilterCategory;
  selectedOptions: string[];
  onToggleOption: (option: FilterOption) => void;
  onTextSearch?: (text: string) => void;
  searchText?: string;
  onClearAll: () => void;
};

export default function FilterOptions({
  category, selectedOptions, onToggleOption, onTextSearch, searchText, onClearAll
}: Props) {
  const isTextSearch = category.id === 'name' || category.id === 'artist';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: `${category.color}20`, borderColor: category.color }]}>
          <Ionicons name={category.icon as any} size={16} color={category.color} />
          <Text style={[styles.categoryLabel, { color: category.color }]}>{category.label}</Text>
        </View>
        <TouchableOpacity onPress={onClearAll} style={styles.clearBtn}>
          <Text style={styles.clearText}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      {isTextSearch ? (
        <View style={styles.searchInput}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.input}
            placeholder={category.id === 'name' ? 'Nombre del tema...' : 'Nombre del artista...'}
            placeholderTextColor={COLORS.textMuted}
            value={searchText}
            onChangeText={onTextSearch}
            color={COLORS.text}
            autoFocus
          />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.optionsScroll}
        >
          {category.options.map((option) => {
            const isSelected = selectedOptions.includes(option.id);
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => onToggleOption(option)}
                activeOpacity={0.8}
                style={styles.optionWrapper}
              >
                <LinearGradient
                  colors={isSelected ? [category.color, `${category.color}CC`] : ['#1E1E3F', '#12122A']}
                  style={[
                    styles.optionPill,
                    isSelected && { borderColor: category.color },
                  ]}
                >
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceLight,
  },
  clearText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  optionsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  optionWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  optionPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
  },
  optionText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: COLORS.white,
    fontWeight: '700',
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
});
