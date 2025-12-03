
import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { ArticleCard } from './components/ArticleCard';
import { Watermark } from './components/Watermark';
import { COMPANY_INFO, CONTRACT_ARTICLES } from './constants';
import { ClientDetails } from './types';
import { Download, Loader2, Check, User, Phone, CreditCard, Users, Percent, GraduationCap, AlertCircle } from 'lucide-react';
import { Input } from './components/Input';

declare global {
  interface Window {
    html2pdf: any;
  }
}

const App: React.FC = () => {
  const [client, setClient] = useState<ClientDetails>({
    fullName: '',
    phone: '',
    cin: '',
    guardianFor: '',
    selectedProgram: '',
    discount: '%     -'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Validation Logic
  const isFormValid = client.fullName.trim() !== '' && 
                      client.phone.trim() !== '' && 
                      client.cin.trim() !== '' && 
                      client.selectedProgram !== '' &&
                      client.discount.trim() !== '';

  // Split Articles for Two Pages
  // Slice increased to 12 to move Article 12 (Financials) to Page 1, making room on Page 2
  const articlesPage1 = CONTRACT_ARTICLES.slice(0, 12);
  const articlesPage2 = CONTRACT_ARTICLES.slice(12);

  const calculateServiceFee = () => {
    if (!client.selectedProgram) return '---';
    const article20 = CONTRACT_ARTICLES.find(a => a.id === 20);
    if (!article20) return '---';
    
    // Find the row corresponding to the selected program
    const row = article20.content.find(line => line.includes(client.selectedProgram!));
    if (!row) return '---';
    
    const cells = row.split('|');
    // If len 4: [box, name, fileFee, serviceFee] -> index 3
    // If len 3: [box, name, fee] -> index 2
    const feeStr = cells.length === 4 ? cells[3] : cells[2];
    const baseFee = parseFloat(feeStr.replace(/[^0-9.]/g, ''));
    
    if (isNaN(baseFee)) return '---';
    
    const discountVal = parseFloat(client.discount?.replace(/[^0-9.]/g, '') || '0');
    const finalFee = baseFee * (1 - (discountVal / 100));
    
    return finalFee.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  const handleDownloadPDF = async () => {
    if (!isFormValid) {
        alert("المرجو ملء جميع البيانات الضرورية (الاسم، الهاتف، البطاقة الوطنية، واختيار البرنامج، ونسبة التخفيض) قبل تحميل العقد.");
        return;
    }

    if (window.html2pdf && contentRef.current) {
      setIsGenerating(true);
      window.scrollTo(0, 0); // Reset scroll to ensure clean capture
      const element = contentRef.current;
      
      // Determine student name for filename
      // If guardian field is filled, that is the student. Otherwise the main applicant is the student.
      const studentName = client.guardianFor || client.fullName || 'Client';

      const opt = {
        margin:       0,
        filename:     `FOORSA x ${studentName}.pdf`,
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 2, useCORS: true, logging: false, scrollY: 0 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' },
        pagebreak:    { mode: 'css', avoid: '.break-inside-avoid' }
      };

      try {
        element.classList.add('pdf-generating');
        // Small delay to ensure CSS class is applied and layout settles
        await new Promise(resolve => setTimeout(resolve, 500));
        await window.html2pdf().set(opt).from(element).save();
      } catch (error) {
        console.error('PDF Error:', error);
        window.print();
      } finally {
        element.classList.remove('pdf-generating');
        setIsGenerating(false);
      }
    } else {
      window.print();
    }
  };

  const handleProgramSelect = (programName: string) => {
    setClient(prev => ({
      ...prev,
      selectedProgram: prev.selectedProgram === programName ? '' : programName
    }));
  };

  const handleDiscountChange = (value: string) => {
    setClient(prev => ({ ...prev, discount: value.toUpperCase() }));
  };

  const today = new Date().toLocaleDateString('ar-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Reusable Signature Section Component
  const SignatureSection = () => (
    <section className="mt-2 pt-2 border-t-2 border-gray-100 break-inside-avoid bg-white/80 backdrop-blur-sm relative z-30">
       <div className="flex justify-between items-end gap-8">
          
          {/* Company */}
          <div className="text-center w-56">
             <div className="text-[8px] text-gray-400 mb-1">الطرف الأول</div>
             <div className="text-[10px] font-bold text-brand-navy mb-2">{COMPANY_INFO.name}</div>
             <div className="h-20 border border-dashed border-gray-300 rounded bg-white flex items-center justify-center relative overflow-hidden">
                {/* Clean box for manual stamp */}
             </div>
             <div className="text-[8px] text-gray-400 mt-1 font-mono">
               Rabat, {today}
             </div>
          </div>

          {/* Agreement Note */}
          <div className="text-center pb-2 opacity-70 flex-1">
             <p className="text-[7px] text-brand-navy max-w-[300px] mx-auto leading-relaxed border p-1.5 rounded bg-brand-navy/5 border-brand-navy/5">
                بتوقيع هذا العقد، يقر الطرف الثاني باستلام نسخة منه، وبأنه اطلع على جميع البنود والشروط الواردة في الصفحتين وفهمها ووافق عليها دون أي تحفظ أو إكراه.
             </p>
          </div>

          {/* Client */}
          <div className="text-center w-56">
             <div className="text-[8px] text-gray-400 mb-1">الطرف الثاني</div>
             <div className="mb-2 h-4 px-2">
                {/* Empty space for manual signature */}
             </div>
             <div className="h-20 border border-dashed border-gray-300 rounded bg-gray-50/50 flex flex-col items-center justify-center relative overflow-hidden">
                <span className="text-[7px] text-gray-400 relative z-10">توقيع الزبون</span>
                <span className="text-[6px] text-gray-300 mt-1 relative z-10">("قرأت ووافقت")</span>
             </div>
          </div>

       </div>
    </section>
  );

  const inputStyle = "bg-transparent border-b border-gray-300 py-0.5 text-[10px] font-black text-green-700 focus:border-brand-blue outline-none placeholder:text-gray-300 uppercase w-full";

  // Programs extraction for mobile selector
  const article20Content = CONTRACT_ARTICLES.find(a => a.id === 20)?.content || [];
  const programOptions = article20Content
    .filter(line => line.includes('|') && line.includes('box'))
    .map(line => line.split('|')[1].trim());

  return (
    <div className="min-h-screen py-4 md:py-8 font-sans bg-gray-100 flex flex-col items-center">
      
      {/* ================= MOBILE EDITOR ================= */}
      <div className="w-full max-w-lg px-4 mb-6 md:hidden">
        <div className="bg-white rounded-xl shadow-lg border border-brand-beige/20 p-5">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
             <div className="bg-brand-navy text-white p-2 rounded-lg">
                <User size={18} />
             </div>
             <div>
               <h2 className="text-lg font-black text-brand-navy leading-tight">بيانات العقد</h2>
               <p className="text-xs text-gray-400">املأ البيانات هنا لتحديث العقد تلقائياً</p>
             </div>
          </div>
          
          <div className="space-y-3">
             {/* Full Name */}
             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
                   <User size={12} /> الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input 
                   type="text" 
                   value={client.fullName}
                   onChange={(e) => setClient({...client, fullName: e.target.value.toUpperCase()})}
                   className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 outline-none text-green-700 font-bold"
                   placeholder="الاسم الكامل"
                />
             </div>

             <div className="grid grid-cols-2 gap-3">
                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
                     <Phone size={12} /> الهاتف <span className="text-red-500">*</span>
                  </label>
                  <input 
                     type="tel" 
                     value={client.phone}
                     onChange={(e) => setClient({...client, phone: e.target.value.toUpperCase()})}
                     className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-blue outline-none text-green-700 font-bold"
                     placeholder="06........"
                  />
                </div>
                {/* CIN */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
                     <CreditCard size={12} /> رقم البطاقة <span className="text-red-500">*</span>
                  </label>
                  <input 
                     type="text" 
                     value={client.cin}
                     onChange={(e) => setClient({...client, cin: e.target.value.toUpperCase()})}
                     className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-blue outline-none text-green-700 font-bold"
                     placeholder="CIN"
                  />
                </div>
             </div>

             {/* Guardian */}
             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
                   <Users size={12} /> ولي أمر (إن وجد)
                </label>
                <input 
                   type="text" 
                   value={client.guardianFor}
                   onChange={(e) => setClient({...client, guardianFor: e.target.value.toUpperCase()})}
                   className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-blue outline-none text-green-700 font-bold"
                   placeholder="اسم الطالب (إذا كان الزبون ولي أمر)"
                />
             </div>

             {/* Program Selection */}
             <div className="space-y-1 pt-2 border-t border-dashed border-gray-200 mt-2">
                <label className="text-xs font-bold text-brand-blue flex items-center gap-1">
                   <GraduationCap size={12} /> اختيار البرنامج <span className="text-red-500">*</span>
                </label>
                <p className="text-[10px] text-gray-400 mb-1">يرجى تحديد البرنامج الدراسي للطالب:</p>
                <div className="grid gap-2">
                  {programOptions.map((prog, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleProgramSelect(prog)}
                      className={`
                        p-2 rounded-md border text-xs cursor-pointer flex items-center justify-between transition-all
                        ${client.selectedProgram === prog 
                           ? 'bg-green-50 border-green-500 text-green-800 font-bold shadow-sm' 
                           : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}
                      `}
                    >
                       <span>{prog}</span>
                       {client.selectedProgram === prog && <Check size={14} />}
                    </div>
                  ))}
                </div>
             </div>

             {/* Discount */}
             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
                   <Percent size={12} /> نسبة التخفيض <span className="text-red-500">*</span>
                </label>
                <input 
                   type="text" 
                   value={client.discount}
                   onChange={(e) => handleDiscountChange(e.target.value)}
                   className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-blue outline-none text-green-700 font-bold text-left"
                   dir="ltr"
                />
             </div>
          </div>
        </div>
        
        {/* Mobile Download Button */}
        <button 
          onClick={handleDownloadPDF}
          disabled={!isFormValid || isGenerating}
          className={`
            w-full p-4 rounded-xl shadow-xl flex items-center justify-center gap-3 transition-all
            ${!isFormValid || isGenerating 
                ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                : 'bg-brand-navy text-white active:scale-95'}
          `}
        >
          {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
          <div className="flex flex-col items-center leading-none">
             <span className="font-bold text-lg">تحميل العقد (PDF)</span>
             {!isFormValid && <span className="text-[10px] opacity-80 mt-1">يرجى ملء جميع البيانات أولاً</span>}
          </div>
        </button>
        
        <p className="text-center text-[10px] text-gray-400 mt-3 flex items-center justify-center gap-1">
           <span>⬇</span> 
           <span>يمكنك معاينة العقد أسفله</span>
        </p>
      </div>

      
      {/* Wrapper for horizontal scrolling on mobile */}
      <div className="w-full overflow-x-auto md:overflow-visible pb-20 md:pb-0 flex justify-center items-start">
        
        {/* Document Container - Fixed Width */}
        <div ref={contentRef} className="document-container bg-white min-w-[297mm] mx-auto shadow-2xl md:shadow-lg scale-90 md:scale-100 origin-top">

          {/* ================= PAGE 1 ================= */}
          <div className="document-page relative overflow-hidden text-right">
            <Watermark />
            
            {/* Decorative Frame */}
            <div className="absolute inset-2 border-2 border-brand-navy/10 pointer-events-none z-10"></div>
            <div className="absolute inset-3 border border-brand-beige/30 pointer-events-none z-10"></div>

            {/* Page 1 Content */}
            <div className="relative z-20 px-10 pt-6 pb-4 h-full flex flex-col justify-between">
              <div className="flex-grow">
                <Header />

                {/* PARTIES SECTION */}
                <section className="grid grid-cols-12 gap-4 mb-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm relative z-20">
                  {/* Right: Company */}
                  <div className="col-span-4 border-l border-gray-100 pl-4 flex flex-col justify-center">
                    <h4 className="text-brand-navy font-bold text-[9px] uppercase tracking-wider mb-1">الطرف الأول (مقدم الخدمة)</h4>
                    <div className="text-brand-blue font-bold text-xs mb-1">{COMPANY_INFO.name}</div>
                    <div className="text-[8px] text-gray-500 leading-snug">
                      <span className="font-bold text-brand-navy">ICE:</span> <span className="font-mono">{COMPANY_INFO.ice}</span>
                    </div>
                    <div className="text-[8px] text-gray-400 mt-1">
                      {COMPANY_INFO.address.split('–')[0]}
                    </div>
                  </div>
                  {/* Left: Client Inputs */}
                  <div className="col-span-8 pr-2">
                    <h4 className="text-brand-navy font-bold text-[9px] uppercase tracking-wider mb-2">الطرف الثاني (الزبون)</h4>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                        {/* Name */}
                        <div className="flex flex-col relative group">
                          <label className="text-[8px] text-gray-500 mb-0.5">الاسم الكامل <span className="text-red-400">*</span></label>
                          <input 
                            type="text" 
                            value={client.fullName}
                            onChange={(e) => setClient({...client, fullName: e.target.value.toUpperCase()})}
                            placeholder="..................................."
                            className={inputStyle}
                          />
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col relative group">
                          <label className="text-[8px] text-gray-500 mb-0.5">الهاتف <span className="text-red-400">*</span></label>
                          <input 
                            type="text" 
                            value={client.phone}
                            onChange={(e) => setClient({...client, phone: e.target.value.toUpperCase()})}
                            placeholder="..................................."
                            className={inputStyle}
                          />
                        </div>

                        {/* Calculated Fee Display (Read only) */}
                        <div className="flex flex-col justify-end">
                            <div className="flex items-center gap-2 bg-brand-blue/5 px-2 py-1 rounded-full border border-brand-blue/10 h-[22px]">
                                <span className="text-[7px] font-bold text-brand-navy whitespace-nowrap">مصاريف الخدمة بعد التخفيض:</span>
                                <span className="text-[8px] font-black text-brand-blue flex-grow text-center">
                                {calculateServiceFee()} DH
                                </span>
                            </div>
                        </div>

                        {/* CIN */}
                        <div className="flex flex-col relative group">
                          <label className="text-[8px] text-gray-500 mb-0.5">رقم البطاقة الوطنية <span className="text-red-400">*</span></label>
                          <input 
                            type="text" 
                            value={client.cin}
                            onChange={(e) => setClient({...client, cin: e.target.value.toUpperCase()})}
                            placeholder="..................................."
                            className={inputStyle}
                          />
                        </div>

                        {/* Guardian */}
                        <div className="flex flex-col relative group">
                          <label className="text-[8px] text-gray-500 mb-0.5">مُمثِّلًا لنفسه أو بصفته وليًّا على</label>
                          <input 
                            type="text" 
                            value={client.guardianFor}
                            onChange={(e) => setClient({...client, guardianFor: e.target.value.toUpperCase()})}
                            placeholder="..................................."
                            className={inputStyle}
                          />
                        </div>

                        {/* Discount Input */}
                        <div className="flex flex-col justify-end">
                             <div className="flex items-center gap-2">
                                <label className="text-[7px] font-bold text-brand-navy whitespace-nowrap flex items-center gap-0.5">
                                <span className="text-red-500">*</span>
                                <span>نسبة التخفيض:</span>
                                </label>
                                <input
                                type="text"
                                value={client.discount || ''}
                                onChange={(e) => handleDiscountChange(e.target.value)}
                                className="w-full bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5 text-[8px] font-black text-green-700 text-center outline-none focus:bg-white focus:border-brand-blue/50 transition-colors uppercase shadow-inner"
                                dir="ltr"
                                />
                            </div>
                        </div>

                    </div>
                  </div>
                </section>

                {/* ARTICLES PART 1 */}
                <div className="article-columns columns-3 gap-6" style={{ columnRule: '1px dashed #f0f0f0' }}>
                  <div className="mb-3 break-inside-avoid bg-brand-navy/5 p-2 rounded text-[8px] text-brand-navy italic text-center leading-relaxed">
                      اتفق الطرفان على ما يلي لتنظيم عملية استكمال الدراسة في الصين، حيث يلتزم الطرف الأول ببذل العناية اللازمة، ويلتزم الطرف الثاني باحترام الشروط والمواعيد.
                  </div>
                  {articlesPage1.map((article) => (
                    <ArticleCard 
                      key={article.id} 
                      article={article} 
                      selectedProgram={client.selectedProgram}
                      onSelectProgram={handleProgramSelect}
                    />
                  ))}
                </div>
              </div>
              
              <div className="mt-auto">
                {/* Signature on Page 1 */}
                <SignatureSection />
                
                {/* Page Number */}
                <div className="absolute bottom-5 left-10 text-[8px] text-gray-300 font-mono bg-white px-2">
                  Page 1 / 2
                </div>
              </div>
            </div>
          </div>


          {/* ================= PAGE 2 ================= */}
          <div className="document-page relative overflow-hidden text-right">
            <Watermark />
            
            {/* Decorative Frame */}
            <div className="absolute inset-2 border-2 border-brand-navy/10 pointer-events-none z-10"></div>
            <div className="absolute inset-3 border border-brand-beige/30 pointer-events-none z-10"></div>

            {/* Page 2 Content */}
            <div className="relative z-20 px-10 pt-6 pb-4 h-full flex flex-col justify-between">
              <div className="flex-grow flex flex-col">
                {/* Header continuation */}
                <div className="flex justify-between items-end border-b border-gray-100 pb-2 mb-4">
                  <div className="text-[9px] font-bold text-brand-navy opacity-40">تتمة بنود العقد - Opportunity Solutions</div>
                </div>

                {/* ARTICLES PART 2 */}
                <div className="article-columns columns-3 gap-6" style={{ columnRule: '1px dashed #f0f0f0' }}>
                  {articlesPage2.map((article) => (
                    <ArticleCard 
                      key={article.id} 
                      article={article} 
                      selectedProgram={client.selectedProgram}
                      onSelectProgram={handleProgramSelect}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                {/* Signature on Page 2 */}
                <SignatureSection />

                {/* Page Number */}
                <div className="absolute bottom-5 left-10 text-[8px] text-gray-300 z-30 font-mono bg-white px-2">
                  Page 2 / 2
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Action Button - Desktop Only */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 no-print hidden md:flex gap-2">
         {/* Validation Tooltip/Warning if disabled */}
         {!isFormValid && (
           <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] py-1 px-3 rounded-full shadow-lg whitespace-nowrap animate-bounce flex items-center gap-1">
             <AlertCircle size={12} />
             <span>يرجى ملء جميع البيانات واختيار البرنامج لتحميل العقد</span>
           </div>
         )}
         
         <button 
            onClick={handleDownloadPDF}
            disabled={!isFormValid || isGenerating}
            className={`
               pl-6 pr-4 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all border border-brand-beige/20 group
               ${!isFormValid || isGenerating ? 'bg-gray-500 cursor-not-allowed opacity-80 grayscale' : 'bg-brand-navy text-white hover:scale-105'}
            `}
          >
            <div className="flex flex-col text-right mr-2">
               <span className="text-[10px] text-brand-beige font-bold tracking-wider uppercase">DOWNLOAD CONTRACT</span>
               <span className="text-[9px] font-light text-gray-300">Format: PDF A4 Landscape</span>
            </div>
            <div className={`
               p-2 rounded-full transition-colors
               ${!isFormValid ? 'bg-gray-400 text-gray-200' : 'bg-brand-beige text-brand-navy group-hover:bg-white'}
            `}>
               {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
            </div>
         </button>
      </div>

    </div>
  );
};

export default App;
