import React, { useState, useEffect } from 'react';
import { Card, Button, Text, Box, Stack, TextInput } from '@contentful/f36-components';
import { FieldAppSDK } from '@contentful/app-sdk';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';
import icons from '../fontawesome';
import { AppInstallationParameters } from './ConfigScreen';

interface SearchSuggestion {
  name: string;
  value: string;
  searchTerms: string[];
}

interface IconValue {
  value: string;
}

const STYLE_PREFIXES = {
  solid: 'fas',
  regular: 'far',
  light: 'fal',
  thin: 'fat',
  duotone: 'fad',
  brands: 'fab'
} as const;

const STYLE_LABELS = {
  solid: 'solid',
  regular: 'regular',
  light: 'light',
  thin: 'thin',
  duotone: 'duotone',
  brands: 'brands'
} as const;

const items: SearchSuggestion[] = [];

Object.keys(icons).forEach((key) => {
  const icon = icons[key];
  for (const style of icon.styles) {
    const prefix = STYLE_PREFIXES[style as keyof typeof STYLE_PREFIXES];
    const label = STYLE_LABELS[style as keyof typeof STYLE_LABELS];

    if (prefix && label) {
      items.push({
        name: `${key} (${label})`,
        value: `${prefix} fa-${key}`,
        searchTerms: icon.search.terms || [],
      });
    }
  }
});

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();
  useAutoResizer();
  const initialValue = sdk.field.getValue() as IconValue;
  const [selectedItem, setSelectedItem] = useState<SearchSuggestion | null>(() => {
    if (!initialValue?.value) return null;
    return items.find(item => item.value === initialValue.value) || null;
  });
  const [filteredItems, setFilteredItems] = useState<SearchSuggestion[]>([]);
  const [inputValue, setInputValue] = useState('');

  // Get the app configuration parameters
  const parameters = sdk.parameters.installation as AppInstallationParameters;
  const config = {
    maxSuggestions: parameters?.maxSuggestions ?? 5,
    minSearchChars: parameters?.minSearchChars ?? 2,
    searchInTerms: parameters?.searchInTerms ?? true,
    searchInNames: parameters?.searchInNames ?? true,
    searchInValues: parameters?.searchInValues ?? true,
    iconSize: parameters?.iconSize ?? 36,
    placeholderText: parameters?.placeholderText ?? 'Search icons... (type at least 2 characters)',
    previewBackground: parameters?.previewBackground ?? '#eee',
    previewBorder: parameters?.previewBorder ?? '#E5E5E5'
  };

  // Filter items based on allowed styles
  const filteredByStyle = React.useMemo(() => {
    const allowedStyles = parameters?.allowedStyles;
    if (!allowedStyles || allowedStyles.length === 0) return items;
    return items.filter(item => {
      const style = item.value.split(' ')[0].replace('fa', '');
      return allowedStyles.includes(style as any);
    });
  }, [parameters?.allowedStyles]);

  useEffect(() => {
    if (!initialValue?.value) {
      sdk.field.setValue({ value: '' });
    }
  }, [initialValue, sdk.field]);

  useEffect(() => {
    const detach = sdk.field.onValueChanged((newValue: IconValue) => {
      const newItem = items.find(item => item.value === newValue?.value) || null;
      setSelectedItem(newItem);
    });

    return () => {
      detach();
    };
  }, [sdk.field]);

  const handleSelectItem = async (item: SearchSuggestion) => {
    setSelectedItem(item);
    setInputValue('');
    setFilteredItems([]);
    await sdk.field.setValue({ value: item.value });
  };

  const handleInputValueChange = (value: string) => {
    setInputValue(value);
    if (value.length < config.minSearchChars) {
      setFilteredItems([]);
      return;
    }

    const searchVal = value.toLowerCase();
    const filtered = filteredByStyle.filter(item => {
      const matchesName = config.searchInNames && item.name.toLowerCase().includes(searchVal);
      const matchesValue = config.searchInValues && item.value.toLowerCase().includes(searchVal);
      const matchesSearchTerms = config.searchInTerms && item.searchTerms.some(term =>
        term.toLowerCase().includes(searchVal)
      );
      return matchesName || matchesValue || matchesSearchTerms;
    }).slice(0, config.maxSuggestions);

    setFilteredItems(filtered);
  };

  const iconStyle = {
    background: config.previewBackground,
    padding: '4px',
    borderRadius: '4px',
    fontSize: '20px',
    width: `${config.iconSize}px`,
    height: `${config.iconSize}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px solid ${config.previewBorder}`,
    flexShrink: 0
  };

  return (
    <>
      <Stack fullWidth fullHeight spacing="spacingM" alignItems="flex-start">
        <div style={{ display: 'flex', alignItems: 'center', minWidth: '200px' }}>
          <div style={iconStyle}>
            <i className={selectedItem?.value || ''}/>
          </div>
          <Box paddingLeft='spacingS'>
            <div style={{ fontWeight: 'bold' }}>{selectedItem?.name || 'No icon selected'}</div>
            <div style={{ color: '#6B7280', lineHeight: '1' }}>{selectedItem?.value || ''}</div>
          </Box>
        </div>
        <div style={{ width: '100%' }}>
          <TextInput
            value={inputValue}
            onChange={(e) => handleInputValueChange(e.target.value)}
            placeholder={config.placeholderText}
          />
          <Text marginTop="spacingXs" fontColor="gray500" fontSize="fontSizeS">
            Browse all available icons at{' '}
            <a
              href="https://fontawesome.com/search"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0077CC', textDecoration: 'underline' }}
            >
              Font Awesome's icon search
            </a>
          </Text>
        </div>
      </Stack>
      {filteredItems.length > 0 && (
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: '8px 0 0 0',
          maxHeight: '300px',
          overflowY: 'auto',
          border: `1px solid ${config.previewBorder}`,
          borderRadius: '4px',
          width: '100%'
        }}>
          {filteredItems.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelectItem(item)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: index < filteredItems.length - 1 ? `1px solid ${config.previewBorder}` : 'none',
                backgroundColor: 'transparent',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={iconStyle}>
                <i className={item.value}/>
              </div>
              <Box style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                <div style={{ color: '#6B7280', lineHeight: '1' }}>{item.value}</div>
              </Box>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Field;
