# Multilingual (i18n) Implementation Guide

## Status: Phases 1-2 Complete, Phases 3-8 Roadmap

### Completed ✅

**Phase 1: Infrastructure**
- Database tables created: `languagePreferences`, `articleTranslations`, `categoryTranslations`, `translationMetadata`
- Schema supports 15 languages with translation status tracking
- Foreign key relationships established

**Phase 2: Language Switcher UI**
- `LanguageSwitcher` component with 15 languages
- Flag icons + native language names
- Browser language detection
- localStorage persistence
- RTL support for Arabic
- Integrated into Header navigation

### Next Steps: Phases 3-8

#### Phase 3: AI Translation Engine
**File:** `server/translation.ts`
```typescript
import { invokeLLM } from "./server/_core/llm";

export async function translateContent(
  content: string,
  targetLanguage: string,
  context: "article" | "category" | "tag"
): Promise<string> {
  const systemPrompt = `You are a professional translator specializing in ${context} content.
  Translate the following content to ${targetLanguage} with contextual accuracy.
  Maintain tone, technical terms, and SEO keywords.`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content }
    ]
  });
  
  return response.choices[0].message.content;
}
```

#### Phase 4: Auto-Translation Pipeline
**On Article Publish:**
1. Store original content in `articles` table
2. For each language:
   - Call `translateContent()` for title, description, content
   - Generate SEO-friendly slug (e.g., `/fr/titre-article`)
   - Save to `articleTranslations` table
   - Update `translationMetadata` status to "translated"

#### Phase 5: SEO Optimization
**Add hreflang Tags:**
```typescript
// In Article component
function ArticleHead({ articleId, language }) {
  const languages = ['en', 'es', 'fr', 'de', 'pt', 'it', 'zh', 'ja', 'ko', 'nl', 'tr', 'th', 'hi', 'ar', 'ru'];
  
  return (
    <>
      {languages.map(lang => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`/${lang}/article/${slug}`}
        />
      ))}
    </>
  );
}
```

#### Phase 6: RTL Support
**CSS:** Already in `index.css`
```css
html.rtl {
  direction: rtl;
  text-align: right;
}

html.rtl .ltr-element {
  direction: ltr;
}
```

#### Phase 7: Caching Strategy
```typescript
// Cache translated pages for 24 hours
const cacheKey = `article:${articleId}:${language}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

const translated = await getTranslation(articleId, language);
await redis.setex(cacheKey, 86400, JSON.stringify(translated));
```

#### Phase 8: Testing
- Test all 15 languages render correctly
- Verify RTL layout for Arabic
- Check SEO tags in HTML
- Performance test with caching
- Verify localStorage persistence

### Database Schema

```sql
-- Language preferences (per user)
SELECT * FROM languagePreferences WHERE userId = ?;

-- Article translations
SELECT * FROM articleTranslations WHERE articleId = ? AND language = ?;

-- Category translations
SELECT * FROM categoryTranslations WHERE categoryId = ? AND language = ?;

-- Translation status tracking
SELECT * FROM translationMetadata WHERE contentType = 'article' AND translationStatus = 'pending';
```

### Frontend Integration

**useLanguage Hook:**
```typescript
export function useLanguage() {
  const [language, setLanguage] = useState('en');
  
  useEffect(() => {
    window.addEventListener('languageChange', (e: any) => {
      setLanguage(e.detail.language);
    });
  }, []);
  
  return language;
}
```

### Performance Metrics

- Translation API latency: ~2-3s per article
- Cache hit rate target: >90%
- Page load time with translations: <2s
- SEO crawl efficiency: All hreflang tags indexed

### Security Considerations

- API keys stored in environment variables
- Input sanitization for all translated content
- GDPR compliance: User language preference in cookies
- No exposure of translation provider details

### Scalability

- Batch translation on publish (queue system)
- CDN caching for translated pages
- Database indexing on language + contentId
- Lazy-load translations if needed

### Quality Assurance

- Manual review for first 10 articles per language
- Community feedback mechanism
- A/B testing translation quality
- Fallback to English if translation fails

---

**Next Action:** Implement Phase 3 (AI Translation Engine) with LLM integration
