/**
 * Safely serializes a JSON-LD payload for embedding inside a
 * `<script type="application/ld+json">` tag via `dangerouslySetInnerHTML`.
 *
 * Some structured-data fields (venue name, description, FAQ, etc.) come from
 * venue-owner-controlled database columns. A raw `JSON.stringify(...)` result
 * can contain a literal `</script>` sequence, which would close the script
 * tag early and let arbitrary HTML/JS run in every visitor's browser (stored
 * XSS). Escaping `<`, `>`, and `&` as JSON unicode escapes prevents that,
 * and remains valid JSON — `\u003c` etc. decode back to the original
 * characters for any crawler or client code that parses the JSON.
 *
 * U+2028/U+2029 are also escaped since they're valid in JSON strings but
 * illegal as unescaped line terminators in JS string literals, which matters
 * if this value is ever read by client-side JS instead of just crawled.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
