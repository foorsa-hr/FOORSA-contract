
import React from 'react';
import { Article } from '../types';
import { Check } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  selectedProgram?: string;
  onSelectProgram?: (program: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  selectedProgram, 
  onSelectProgram,
}) => {
  // Special rendering for Article 20 (Fees Table)
  if (article.id === 20) {
    const tableRows = article.content.filter(line => line.includes('|'));
    // Filter out both the table data AND the static discount line to render it custom
    const otherContent = article.content.filter(line => !line.includes('|') && !line.includes('تخفيض'));

    return (
      <div className="mb-2 print-break-inside-avoid break-inside-avoid relative group">
        <div className="absolute -right-2 top-0.5 bottom-0.5 w-0.5 bg-brand-beige/30 rounded-full"></div>
        
        <h3 className="font-bold text-brand-navy text-[10px] mb-1 flex items-center gap-1.5">
          <span className="bg-brand-navy text-brand-beige text-[8px] min-w-[14px] px-1 h-3.5 flex items-center justify-center rounded-sm font-sans pt-0.5 leading-none shadow-sm">
            {article.id}
          </span>
          <span className="border-b border-gray-200 pb-0.5 w-full">
            {article.title}
          </span>
        </h3>

        <div className="pr-1 pl-2">
          {/* GUIDANCE MESSAGE - VISIBLE ON SCREEN */}
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-[8px] p-1 mb-1 rounded text-center font-bold no-print print:hidden">
             👈 المرجو النقر على الخانة في العمود الأول لاختيار البرنامج
          </div>

          <table className="w-full text-[7px] border-collapse mb-1">
            <thead>
              <tr className="bg-brand-navy/5">
                {tableRows[0].split('|').map((header, idx) => (
                  <th key={idx} className={`
                    border border-gray-300 px-1 py-1 text-brand-navy font-black whitespace-nowrap
                    ${idx === 0 ? 'w-8 bg-brand-blue/5' : 'text-center'}
                  `}>
                    {header.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(1).map((row, rowIdx) => {
                 const cells = row.split('|');
                 const programName = cells[1]?.trim();
                 const isSelected = selectedProgram === programName;

                 return (
                  <tr key={rowIdx}>
                    {cells.map((cell, cellIdx) => {
                      // Logic for custom column rendering
                      if (cellIdx === 0) {
                        // Checkbox visual column - Added darker bg for cue
                        return (
                          <td 
                             key={cellIdx} 
                             className="border border-gray-200 px-1 py-1 text-center w-8 cursor-pointer bg-brand-blue/5 hover:bg-brand-navy/10 transition-colors"
                             onClick={() => onSelectProgram && programName && onSelectProgram(programName)}
                             title="انقر للاختيار"
                          >
                             <div className={`w-3 h-3 border border-brand-navy rounded-[1px] inline-flex items-center justify-center shadow-sm mx-auto ${isSelected ? 'bg-green-600 border-green-600' : 'bg-white'}`}>
                                {isSelected && <Check size={8} className="text-white" strokeWidth={4} />}
                             </div>
                          </td>
                        );
                      }
                      
                      // Special case for merged row last cell (e.g. Re-application fee)
                      if (cells.length === 3 && cellIdx === 2) {
                        return (
                          <td key={cellIdx} colSpan={2} className="border border-gray-200 px-1 py-1.5 text-center text-brand-navy font-black font-sans text-[8px]">
                            {cell.trim()}
                          </td>
                        );
                      }
                      
                      return (
                        <td key={cellIdx} className={`
                          border border-gray-200 px-1 py-1.5 text-center text-brand-navy
                          ${cellIdx === 1 ? 'text-right font-bold' : 'font-black font-sans text-[8px]'}
                        `}>
                          {cell.trim()}
                        </td>
                      );
                    })}
                  </tr>
                 );
              })}
            </tbody>
          </table>

          {otherContent.map((line, idx) => (
             <div key={idx} className="text-[8px] font-bold text-brand-blue mt-2 text-right pr-1">
               {line}
             </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-2 print-break-inside-avoid break-inside-avoid relative group">
      {/* Decorative vertical line on hover or print */}
      <div className="absolute -right-2 top-0.5 bottom-0.5 w-0.5 bg-brand-beige/30 rounded-full"></div>
      
      <h3 className="font-bold text-brand-navy text-[10px] mb-0.5 flex items-center gap-1.5">
        <span className="bg-brand-navy text-brand-beige text-[8px] min-w-[14px] px-1 h-3.5 flex items-center justify-center rounded-sm font-sans pt-0.5 leading-none shadow-sm rounded-md">
          {article.id}
        </span>
        <span className="border-b border-gray-200 pb-0.5 w-full">
          {article.title}
        </span>
      </h3>
      
      <div className="text-[8.5px] text-right leading-tight text-gray-700 space-y-0.5 pr-1">
        {article.content.map((paragraph, index) => (
          <p key={index} className={`
            ${paragraph.startsWith('•') || paragraph.startsWith('–') || paragraph.startsWith('✔️') ? 'mr-1 text-brand-blue/90' : ''}
            ${paragraph.includes(':') && !paragraph.startsWith('•') ? 'font-bold text-brand-navy' : ''}
          `}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};
