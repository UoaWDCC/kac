import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useEffect, useState } from "react";
import "../style/editor.css";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link2,
  List,
  ListOrdered,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
  ariaLabel?: string;
}

const RichTextEditor = ({
  value,
  onChange,
  compact = false,
  ariaLabel,
}: RichTextEditorProps) => {
  const [, setUpdateCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: {
          HTMLAttributes: {
            target: "_blank",
            rel: "noopener noreferrer",
          },
        },
      }),
      Underline,
    ],
    content: value,
    editorProps: {
      attributes: {
        "aria-label": ariaLabel ?? "Rich text editor",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onTransaction: () => {
      setUpdateCount((prev) => prev + 1);
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const handleLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl ?? "");
    if (url === null) return;

    const trimmed = url.trim();
    if (trimmed === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    const hasProtocol = /^[a-z][a-z0-9+.-]*:/i.test(trimmed);
    const isRelative = trimmed.startsWith("/") || trimmed.startsWith("#");
    const href = hasProtocol || isRelative ? trimmed : `https://${trimmed}`;

    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  };

  return (
    <div
      className={`tiptap-editor-container${
        compact ? " tiptap-editor-container--compact" : ""
      }`}
    >
      <div className="editor-toolbar">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
          title="Bold (Ctrl+B)"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
          title="Italic (Ctrl+I)"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "is-active" : ""}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon size={18} />
        </button>
        <button
          type="button"
          onClick={handleLink}
          className={editor.isActive("link") ? "is-active" : ""}
          title="Add Link"
        >
          <Link2 size={18} />
        </button>

        <div className="divider" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </button>
      </div>
      <EditorContent editor={editor} className="tiptap-content" />
    </div>
  );
};

export default RichTextEditor;
