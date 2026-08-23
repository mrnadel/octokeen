import type { JsonLdNode } from './structured-data';
import { buildJsonLdGraph } from './structured-data';

export interface JsonLdProps {
  /** One node renders as-is. Several are merged into a single `@graph`. */
  data: JsonLdNode | readonly JsonLdNode[];
}

function isNodeList(data: JsonLdNode | readonly JsonLdNode[]): data is readonly JsonLdNode[] {
  return Array.isArray(data);
}

/**
 * Serializes structured data for a `<script type="application/ld+json">`.
 *
 * `<` is escaped so a stray `</script>` inside course copy cannot close the
 * tag and turn content into markup.
 */
export function serializeJsonLd(data: JsonLdNode): string {
  return JSON.stringify(data).replace(/</g, '\u003c');
}

/**
 * Server component that injects structured data. Render it anywhere inside a
 * page or layout; JSON-LD does not have to live in `<head>`.
 */
export function JsonLd({ data }: JsonLdProps) {
  const node = isNodeList(data) ? buildJsonLdGraph(data) : data;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(node) }}
    />
  );
}
