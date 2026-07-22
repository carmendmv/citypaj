'use client';

interface PageHeaderProps {
  titulo: string;
  subtitulo?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ titulo, subtitulo, children }: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{titulo}</h1>
            {subtitulo && <p className="text-base sm:text-lg text-gray-600">{subtitulo}</p>}
          </div>
          {children && <div className="shrink-0">{children}</div>}
        </div>
      </div>
    </div>
  );
}
