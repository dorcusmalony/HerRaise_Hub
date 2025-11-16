# Translation Guide

## Adding New Text

When adding new text to any page:

1. **Use translation function**:
```jsx
{t('your_key')} instead of "Your Text"
```

2. **Add to useLanguage.js**:
```javascript
en: {
  'your_key': 'Your Text'
}
ar: {
  'your_key': 'النص العربي'
}
```

## Translation Keys
- Use lowercase with underscores: `new_message`
- Be descriptive: `forum_category_health` not `cat1`
- Group related keys together in the file

## Getting Arabic Translations
- Use Google Translate for basic translations
- For important content, consider professional translation
- Test with native Arabic speakers when possible