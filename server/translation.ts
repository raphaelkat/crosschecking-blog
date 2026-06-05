import { invokeLLM } from "./_core/llm";
import { getDb } from "./db";
import { articleTranslations, categoryTranslations, translationMetadata } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "pt", name: "Portuguese" },
  { code: "it", name: "Italian" },
  { code: "zh", name: "Simplified Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "nl", name: "Dutch" },
  { code: "tr", name: "Turkish" },
  { code: "th", name: "Thai" },
  { code: "hi", name: "Hindi" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
];

/**
 * Generate SEO-friendly slug from text
 */
function generateSlug(text: string, language: string): string {
  // For non-Latin scripts, use transliteration or romanization
  let slug = text.toLowerCase();

  // Remove special characters but keep hyphens
  slug = slug.replace(/[^\w\s-]/g, "");
  // Replace spaces with hyphens
  slug = slug.replace(/\s+/g, "-");
  // Remove multiple hyphens
  slug = slug.replace(/-+/g, "-");
  // Remove leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, "");

  return slug;
}

/**
 * Translate article content using AI with contextual accuracy
 */
export async function translateArticleContent(
  title: string,
  description: string,
  content: string,
  targetLanguage: string
): Promise<{
  title: string;
  description: string;
  content: string;
  slug: string;
}> {
  const targetLangName = SUPPORTED_LANGUAGES.find((l) => l.code === targetLanguage)?.name || targetLanguage;

  const systemPrompt = `You are a professional translator specializing in technology and business content.
Translate the following article content to ${targetLangName} with high contextual accuracy.

Guidelines:
- Maintain the professional, analytical tone
- Keep technical terms accurate and industry-standard
- Preserve SEO keywords where appropriate
- Adapt cultural references for the target audience
- Maintain formatting and structure
- Do NOT translate product names, brand names, or proper nouns
- For code snippets or technical examples, keep them unchanged
- For currency, adapt to the target region if applicable

Return ONLY valid JSON with this exact structure:
{
  "title": "translated title",
  "description": "translated meta description",
  "content": "translated full content"
}`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Title: ${title}\n\nDescription: ${description}\n\nContent:\n${content}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "translation",
          strict: true,
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              content: { type: "string" },
            },
            required: ["title", "description", "content"],
            additionalProperties: false,
          },
        },
      },
    });

    const translatedText = response.choices[0].message.content;
    const translated = JSON.parse(typeof translatedText === 'string' ? translatedText : JSON.stringify(translatedText));

    return {
      title: translated.title,
      description: translated.description,
      content: translated.content,
      slug: generateSlug(translated.title, targetLanguage),
    };
  } catch (error) {
    console.error(`Translation error for ${targetLanguage}:`, error);
    throw new Error(`Failed to translate to ${targetLanguage}`);
  }
}

/**
 * Translate category content using AI
 */
export async function translateCategoryContent(
  name: string,
  description: string,
  targetLanguage: string
): Promise<{
  name: string;
  description: string;
  slug: string;
}> {
  const targetLangName = SUPPORTED_LANGUAGES.find((l) => l.code === targetLanguage)?.name || targetLanguage;

  const systemPrompt = `You are a professional translator specializing in category names and descriptions.
Translate the following category information to ${targetLangName}.

Guidelines:
- Keep category names concise and clear
- Maintain the original meaning and intent
- Ensure descriptions are accurate and helpful

Return ONLY valid JSON with this exact structure:
{
  "name": "translated category name",
  "description": "translated category description"
}`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Name: ${name}\n\nDescription: ${description}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "category_translation",
          strict: true,
          schema: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
            },
            required: ["name", "description"],
            additionalProperties: false,
          },
        },
      },
    });

    const translatedText = response.choices[0].message.content;
    const translated = JSON.parse(typeof translatedText === 'string' ? translatedText : JSON.stringify(translatedText));

    return {
      name: translated.name,
      description: translated.description,
      slug: generateSlug(translated.name, targetLanguage),
    };
  } catch (error) {
    console.error(`Category translation error for ${targetLanguage}:`, error);
    throw new Error(`Failed to translate category to ${targetLanguage}`);
  }
}

/**
 * Batch translate article to all supported languages
 */
export async function translateArticleToAllLanguages(
  articleId: number,
  title: string,
  description: string,
  content: string
): Promise<void> {
  console.log(`Starting batch translation for article ${articleId}...`);
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  for (const language of SUPPORTED_LANGUAGES) {
    if (language.code === "en") {
      // Skip English as it's the source language
      continue;
    }

    try {
      console.log(`Translating article to ${language.name}...`);

      // Mark as pending
      await db.insert(translationMetadata).values({
        contentType: "article",
        contentId: articleId,
        language: language.code,
        translationStatus: "pending",
        translationProvider: "ai",
      });

      // Translate content
      const translated = await translateArticleContent(title, description, content, language.code);

      // Save translation
      await db.insert(articleTranslations).values({
        articleId,
        language: language.code,
        title: translated.title,
        slug: translated.slug,
        metaDescription: translated.description,
        content: translated.content,
      });

      // Update metadata to translated
      await db
        .update(translationMetadata)
        .set({ translationStatus: "translated" })
        .where(
          and(
            eq(translationMetadata.contentType, "article"),
            eq(translationMetadata.contentId, articleId),
            eq(translationMetadata.language, language.code)
          )
        );

      console.log(`✓ Article translated to ${language.name}`);
    } catch (error) {
      console.error(`✗ Failed to translate article to ${language.name}:`, error);

      // Mark as failed
      await db
        .update(translationMetadata)
        .set({ translationStatus: "pending" })
        .where(
          and(
            eq(translationMetadata.contentType, "article"),
            eq(translationMetadata.contentId, articleId),
            eq(translationMetadata.language, language.code)
          )
        );
    }
  }

  console.log(`Batch translation completed for article ${articleId}`);
}

/**
 * Batch translate category to all supported languages
 */
export async function translateCategoryToAllLanguages(
  categoryId: number,
  name: string,
  description: string
): Promise<void> {
  console.log(`Starting batch translation for category ${categoryId}...`);
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  for (const language of SUPPORTED_LANGUAGES) {
    if (language.code === "en") {
      // Skip English as it's the source language
      continue;
    }

    try {
      console.log(`Translating category to ${language.name}...`);

      // Mark as pending
      await db.insert(translationMetadata).values({
        contentType: "category",
        contentId: categoryId,
        language: language.code,
        translationStatus: "pending",
        translationProvider: "ai",
      });

      // Translate content
      const translated = await translateCategoryContent(name, description, language.code);

      // Save translation
      await db.insert(categoryTranslations).values({
        categoryId,
        language: language.code,
        name: translated.name,
        slug: translated.slug,
        description: translated.description,
      });

      // Update metadata to translated
      await db
        .update(translationMetadata)
        .set({ translationStatus: "translated" })
        .where(
          and(
            eq(translationMetadata.contentType, "category"),
            eq(translationMetadata.contentId, categoryId),
            eq(translationMetadata.language, language.code)
          )
        );

      console.log(`✓ Category translated to ${language.name}`);
    } catch (error) {
      console.error(`✗ Failed to translate category to ${language.name}:`, error);

      // Mark as failed
      await db
        .update(translationMetadata)
        .set({ translationStatus: "pending" })
        .where(
          and(
            eq(translationMetadata.contentType, "category"),
            eq(translationMetadata.contentId, categoryId),
            eq(translationMetadata.language, language.code)
          )
        );
    }
  }

  console.log(`Batch translation completed for category ${categoryId}`);
}

/**
 * Get translated article by language
 */
export async function getArticleTranslation(articleId: number, language: string) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(articleTranslations).where(
    and(eq(articleTranslations.articleId, articleId), eq(articleTranslations.language, language))
  ).limit(1);
  return results[0] || null;
}

/**
 * Get translated category by language
 */
export async function getCategoryTranslation(categoryId: number, language: string) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(categoryTranslations).where(
    and(eq(categoryTranslations.categoryId, categoryId), eq(categoryTranslations.language, language))
  ).limit(1);
  return results[0] || null;
}
