import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import Mermaid from "@/components/Mermaid";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import ApiBlock from "@/components/ApiBlock";
import DataModelBlock from "@/components/DataModelBlock";
import CodeBlock from "@/components/CodeBlock";

const SPECIAL = ["mermaid", "arch", "api", "datamodel"];

function nodeText(node) {
  if (!node) return "";
  if (node.type === "text") return node.value || "";
  if (Array.isArray(node.children)) return node.children.map(nodeText).join("");
  return "";
}

export default function Markdown({ children }) {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeHighlight, { ignoreMissing: true }]]}
        components={{
          code({ className, children, ...props }) {
            const cls = typeof className === "string" ? className : "";
            const raw = String(children).replace(/\n$/, "");
            if (cls.includes("language-mermaid")) return <Mermaid chart={raw} />;
            if (cls.includes("language-arch")) return <ArchitectureDiagram spec={raw} />;
            if (cls.includes("language-api")) return <ApiBlock data={raw} />;
            if (cls.includes("language-datamodel")) return <DataModelBlock data={raw} />;
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          pre({ node, children }) {
            const arr = Array.isArray(children) ? children : [children];
            const child = arr.find((c) => c && typeof c === "object" && c.props);
            const rawCls = child?.props?.className;
            const cls = Array.isArray(rawCls) ? rawCls.join(" ") : rawCls || "";
            const lang = (cls.match(/language-([\w-]+)/) || [])[1];
            // Special fences (mermaid/arch/api/datamodel) render their own
            // components — pass them through untouched. Everything else (including
            // bare ``` fences) gets the CodeBlock chrome + copy button.
            if (lang && SPECIAL.includes(lang)) {
              return <>{children}</>;
            }
            return (
              <CodeBlock lang={lang || "text"} raw={nodeText(node)}>
                {children}
              </CodeBlock>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
