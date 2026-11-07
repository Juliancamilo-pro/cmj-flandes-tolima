/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Eye,
  Edit3,
  Undo
} from 'lucide-react';
import { MediaUploaderModal } from '../common/MediaUploaderModal';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Redacta el contenido institucional aquí...',
  minHeight = '240px',
}) => {
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState<boolean>(false);

  const insertTag = (tagStart: string, tagEnd: string = '') => {
    const textarea = document.getElementById('rich-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const replacement = `${tagStart}${selectedText || 'texto'}${tagEnd}`;
    const nextVal = value.substring(0, start) + replacement + value.substring(end);

    onChange(nextVal);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagStart.length, start + tagStart.length + (selectedText.length || 5));
    }, 50);
  };

  const handleMediaUploaded = (media: any) => {
    insertTag(`\n<img src="${media.url}" alt="${media.altText || media.title}" class="rounded-xl my-4 max-w-full" />\n`, '');
    setIsMediaModalOpen(false);
  };

  return (
    <div className="border border-stone-300 dark:border-stone-700 rounded-xl overflow-hidden bg-white dark:bg-stone-900 focus-within:ring-2 focus-within:ring-red-900/30 transition-all">
      {/* Toolbar */}
      <div className="bg-stone-50 dark:bg-stone-800/80 px-3 py-2 border-b border-stone-200 dark:border-stone-700 flex flex-wrap items-center justify-between gap-1">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertTag('<strong>', '</strong>')}
            className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-700 rounded text-stone-700 dark:text-stone-300 transition-colors"
            title="Negrita"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<em>', '</em>')}
            className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-700 rounded text-stone-700 dark:text-stone-300 transition-colors"
            title="Cursiva"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<u>', '</u>')}
            className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-700 rounded text-stone-700 dark:text-stone-300 transition-colors"
            title="Subrayado"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-4 bg-stone-300 dark:bg-stone-600 mx-1" />

          <button
            type="button"
            onClick={() => insertTag('<h2>', '</h2>')}
            className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-700 rounded text-stone-700 dark:text-stone-300 transition-colors text-xs font-bold"
            title="Título 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<h3>', '</h3>')}
            className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-700 rounded text-stone-700 dark:text-stone-300 transition-colors text-xs font-bold"
            title="Título 3"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-4 bg-stone-300 dark:bg-stone-600 mx-1" />

          <button
            type="button"
            onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')}
            className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-700 rounded text-stone-700 dark:text-stone-300 transition-colors"
            title="Lista con viñetas"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<ol>\n  <li>', '</li>\n</ol>')}
            className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-700 rounded text-stone-700 dark:text-stone-300 transition-colors"
            title="Lista numerada"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<blockquote class="border-l-4 border-red-900 pl-4 italic my-2">', '</blockquote>')}
            className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-700 rounded text-stone-700 dark:text-stone-300 transition-colors"
            title="Cita"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-4 bg-stone-300 dark:bg-stone-600 mx-1" />

          <button
            type="button"
            onClick={() => {
              const url = prompt('Ingrese la URL del enlace:');
              if (url) insertTag(`<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-red-900 underline">`, '</a>');
            }}
            className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-700 rounded text-stone-700 dark:text-stone-300 transition-colors"
            title="Insertar enlace"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsMediaModalOpen(true)}
            className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-700 rounded text-stone-700 dark:text-stone-300 transition-colors flex items-center gap-1 text-[11px] font-semibold"
            title="Insertar fotografía"
          >
            <ImageIcon className="w-3.5 h-3.5 text-red-800 dark:text-red-400" />
            <span className="hidden sm:inline">Foto</span>
          </button>
        </div>

        {/* Preview switch */}
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            isPreview
              ? 'bg-red-900 text-white'
              : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300'
          }`}
        >
          {isPreview ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          <span>{isPreview ? 'Editar' : 'Vista Previa'}</span>
        </button>
      </div>

      {/* Editor Body */}
      {isPreview ? (
        <div
          className="p-4 prose dark:prose-invert max-w-none text-xs text-stone-800 dark:text-stone-200 overflow-y-auto leading-relaxed"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: value || '<p class="text-stone-400 italic">Sin contenido aún...</p>' }}
        />
      ) : (
        <textarea
          id="rich-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight }}
          className="w-full p-4 text-xs font-mono bg-transparent text-stone-800 dark:text-stone-200 focus:outline-none resize-y"
        />
      )}

      {/* Media Uploader Modal */}
      <MediaUploaderModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onUploaded={handleMediaUploaded}
        defaultCategory="institucional"
      />
    </div>
  );
};
