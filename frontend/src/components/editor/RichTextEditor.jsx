import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Toolbar from './Toolbar.jsx';

export default function RichTextEditor({ content, onChange, readOnly = false }) {
  const editor = useEditor({
    // StarterKit bundles Underline itself in TipTap 3 — adding
    // @tiptap/extension-underline separately caused a duplicate-extension warning.
    extensions: [StarterKit],
    content: content || { type: 'doc', content: [{ type: 'paragraph' }] },
    editable: !readOnly,
    onUpdate: ({ editor: e }) => {
      onChange?.(e.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none px-6 py-4 focus:outline-none',
        'data-placeholder': 'Start writing…',
      },
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [editor, readOnly]);

  // Sync external content changes (e.g. loading a different document) without
  // fighting the editor while the user is actively typing in this one.
  useEffect(() => {
    if (!editor || !content) return;
    const current = JSON.stringify(editor.getJSON());
    const incoming = JSON.stringify(content);
    if (current !== incoming) {
      editor.commands.setContent(content, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, content]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
      <Toolbar editor={editor} readOnly={readOnly} />
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
