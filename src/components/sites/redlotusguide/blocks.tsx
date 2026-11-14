import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import type { JsonBlock, Run } from "./pages-data";

const isInternal = (href: string) => href.startsWith("/") && !href.startsWith("//");

function styled(run: Run, content: ReactNode) {
  let node = content;
  if (run.c) node = <code>{node}</code>;
  if (run.b) node = <strong>{node}</strong>;
  if (run.i) node = <em>{node}</em>;
  if (run.u) node = <u>{node}</u>;
  return node;
}

function RunView({ run }: { run: Run }) {
  if (run.img) {
    const image = (
      <Image
        className="rl-doc-img"
        src={run.img}
        alt={run.alt ?? ""}
        width={640}
        height={360}
        sizes="(max-width: 1024px) 90vw, 591px"
      />
    );
    if (run.href) {
      return isInternal(run.href) ? (
        <Link href={run.href}>{image}</Link>
      ) : (
        <a href={run.href} target="_blank" rel="noreferrer">
          {image}
        </a>
      );
    }
    return image;
  }

  const lines = run.v.split("\n");
  const text =
    lines.length > 1 ? (
      <>
        {lines.map((line, index) => (
          <span key={index}>
            {index > 0 ? <br /> : null}
            {line}
          </span>
        ))}
      </>
    ) : (
      run.v
    );

  const content = styled(run, text);
  if (!run.href) return content;

  return isInternal(run.href) ? (
    <Link href={run.href}>{content}</Link>
  ) : (
    <a href={run.href} target="_blank" rel="noreferrer">
      {content}
    </a>
  );
}

function Inline({ runs }: { runs: Run[] }) {
  return (
    <>
      {runs.map((run, index) => (
        <RunView key={index} run={run} />
      ))}
    </>
  );
}

function BlockView({ block }: { block: JsonBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p>
          <Inline runs={block.runs} />
        </p>
      );
    case "h": {
      if (block.level === 1) return null;
      const level = Math.min(block.level, 4);
      const Tag = (["h2", "h3", "h4"] as const)[level - 2] ?? "h4";
      return (
        <Tag id={block.id}>
          <Inline runs={block.runs} />
        </Tag>
      );
    }
    case "ul":
    case "ol": {
      const Tag = block.type;
      return (
        <Tag>
          {block.items.map((item, index) => (
            <li key={index}>
              <Inline runs={item.runs} />
              {item.children.map((child, childIndex) => (
                <BlockView key={childIndex} block={child} />
              ))}
            </li>
          ))}
        </Tag>
      );
    }
    case "quote":
      return (
        <blockquote>
          {block.blocks.map((child, index) => (
            <BlockView key={index} block={child} />
          ))}
        </blockquote>
      );
    case "code":
      return (
        <pre>
          <code>{block.text}</code>
        </pre>
      );
    case "hr":
      return <hr />;
    case "img":
      return (
        <Image
          className="rl-doc-img"
          src={block.src}
          alt={block.alt}
          width={640}
          height={360}
          sizes="(max-width: 1024px) 90vw, 591px"
        />
      );
    default:
      return null;
  }
}

export function Blocks({ blocks }: { blocks: JsonBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => (
        <BlockView key={index} block={block} />
      ))}
    </>
  );
}
