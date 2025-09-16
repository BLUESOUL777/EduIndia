import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Phone, Mail, MessageCircle, HelpCircle } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

interface FAQItem {
  id: string;
  question: string;
  questionHi: string;
  questionMar: string;
  answer: string;
  answerHi: string;
  answerMar: string;
  category: string;
}

const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [callbackForm, setCallbackForm] = useState({
    name: '',
    phone: '',
    issue: '',
    preferredTime: ''
  });
  const { t, language } = useI18n();

  const categories = [
    { id: 'all', name: 'All Questions', nameHi: 'सभी प्रश्न', nameMar: 'सर्व प्रश्न' },
    { id: 'technical', name: 'Technical Support', nameHi: 'तकनीकी सहायता', nameMar: 'तांत्रिक सहाय्य' },
    { id: 'account', name: 'Account Help', nameHi: 'खाता सहायता', nameMar: 'खाते मदत' },
    { id: 'lessons', name: 'Lessons & Content', nameHi: 'पाठ और सामग्री', nameMar: 'धडे आणि सामग्री' },
    { id: 'assignments', name: 'Assignments', nameHi: 'असाइनमेंट', nameMar: 'असाइनमेंट' },
    { id: 'offline', name: 'Offline Mode', nameHi: 'ऑफलाइन मोड', nameMar: 'ऑफलाइन मोड' }
  ];

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How do I download lessons for offline viewing?',
      questionHi: 'ऑफलाइन देखने के लिए पाठ कैसे डाउनलोड करें?',
      questionMar: 'ऑफलाइन पाहण्यासाठी धडे कसे डाउनलोड करावे?',
      answer: 'Go to any lesson page and click the download button. The lesson will be saved to your device and available even without internet connection.',
      answerHi: 'किसी भी पाठ पृष्ठ पर जाएं और डाउनलोड बटन पर क्लिक करें। पाठ आपके डिवाइस में सहेजा जाएगा और इंटरनेट कनेक्शन के बिना भी उपलब्ध होगा।',
      answerMar: 'कोणत्याही धड्याच्या पानावर जा आणि डाउनलोड बटणावर क्लिक करा. धडा तुमच्या डिव्हाइसमध्ये सेव्ह होईल आणि इंटरनेट कनेक्शनशिवाय देखील उपलब्ध असेल.',
      category: 'offline'
    },
    {
      id: '2',
      question: 'Why are videos not loading?',
      questionHi: 'वीडियो क्यों लोड नहीं हो रहे हैं?',
      questionMar: 'व्हिडिओ का लोड होत नाहीत?',
      answer: 'This could be due to slow internet connection. Try switching to audio-only mode or download the lesson for offline viewing. You can also try refreshing the page.',
      answerHi: 'यह धीमे इंटरनेट कनेक्शन के कारण हो सकता है। केवल ऑडियो मोड पर स्विच करने या ऑफलाइन देखने के लिए पाठ डाउनलोड करने का प्रयास करें। आप पृष्ठ को रीफ्रेश करने का भी प्रयास कर सकते हैं।',
      answerMar: 'हे मंद इंटरनेट कनेक्शनमुळे असू शकते. फक्त ऑडिओ मोडवर स्विच करण्याचा प्रयत्न करा किंवा ऑफलाइन पाहण्यासाठी धडा डाउनलोड करा. तुम्ही पान रीफ्रेश करण्याचा देखील प्रयत्न करू शकता.',
      category: 'technical'
    },
    {
      id: '3',
      question: 'How do I submit assignments?',
      questionHi: 'असाइनमेंट कैसे जमा करें?',
      questionMar: 'असाइनमेंट कसे सबमिट करावे?',
      answer: 'Go to the Assignments page, select the assignment you want to submit, and either upload a file or take a photo of your work. You can also add comments before submitting.',
      answerHi: 'असाइनमेंट पृष्ठ पर जाएं, जिस असाइनमेंट को आप जमा करना चाहते हैं उसे चुनें, और या तो एक फाइल अपलोड करें या अपने काम की फोटो लें। जमा करने से पहले आप टिप्पणियां भी जोड़ सकते हैं।',
      answerMar: 'असाइनमेंट पानावर जा, तुम्हाला जे असाइनमेंट सबमिट करायचे आहे ते निवडा, आणि एकतर फाइल अपलोड करा किंवा तुमच्या कामाचा फोटो काढा. सबमिट करण्यापूर्वी तुम्ही टिप्पण्या देखील जोडू शकता.',
      category: 'assignments'
    },
    {
      id: '4',
      question: 'I forgot my password. How do I reset it?',
      questionHi: 'मैं अपना पासवर्ड भूल गया। इसे कैसे रीसेट करें?',
      questionMar: 'मी माझा पासवर्ड विसरलो. तो कसा रीसेट करावा?',
      answer: 'Click on "Forgot Password" on the login page and enter your registered phone number. You will receive an SMS with instructions to reset your password.',
      answerHi: 'लॉगिन पृष्ठ पर "पासवर्ड भूल गए" पर क्लिक करें और अपना पंजीकृत फोन नंबर दर्ज करें। आपको अपना पासवर्ड रीसेट करने के निर्देशों के साथ एक SMS प्राप्त होगा।',
      answerMar: 'लॉगिन पानावर "पासवर्ड विसरलो" वर क्लिक करा आणि तुमचा नोंदणीकृत फोन नंबर टाका. तुम्हाला तुमचा पासवर्ड रीसेट करण्याच्या सूचनांसह SMS मिळेल.',
      category: 'account'
    },
    {
      id: '5',
      question: 'Can I change the language of the app?',
      questionHi: 'क्या मैं ऐप की भाषा बदल सकता हूं?',
      questionMar: 'मी अॅपची भाषा बदलू शकतो का?',
      answer: 'Yes! Click on the language dropdown in the header and select your preferred language. The app supports English, Hindi, Marathi, and many other Indian languages.',
      answerHi: 'हां! हेडर में भाषा ड्रॉपडाउन पर क्लिक करें और अपनी पसंदीदा भाषा चुनें। ऐप अंग्रेजी, हिंदी, मराठी और कई अन्य भारतीय भाषाओं का समर्थन करता है।',
      answerMar: 'होय! हेडरमधील भाषा ड्रॉपडाउनवर क्लिक करा आणि तुमची आवडती भाषा निवडा. अॅप इंग्रजी, हिंदी, मराठी आणि इतर अनेक भारतीय भाषांना सपोर्ट करते.',
      category: 'account'
    },
    {
      id: '6',
      question: 'How much data does the app use?',
      questionHi: 'ऐप कितना डेटा उपयोग करता है?',
      questionMar: 'अॅप किती डेटा वापरते?',
      answer: 'The app is designed for low data usage. Audio lessons use about 1-2 MB per hour, while video lessons use 10-20 MB per hour. You can enable "Low Bandwidth Mode" to reduce data usage further.',
      answerHi: 'ऐप कम डेटा उपयोग के लिए डिज़ाइन किया गया है। ऑडियो पाठ प्रति घंटे लगभग 1-2 MB का उपयोग करते हैं, जबकि वीडियो पाठ प्रति घंटे 10-20 MB का उपयोग करते हैं। डेटा उपयोग को और कम करने के लिए आप "कम बैंडविड्थ मोड" सक्षम कर सकते हैं।',
      answerMar: 'अॅप कमी डेटा वापरासाठी डिझाइन केले आहे. ऑडिओ धडे प्रति तास सुमारे 1-2 MB वापरतात, तर व्हिडिओ धडे प्रति तास 10-20 MB वापरतात. डेटा वापर आणखी कमी करण्यासाठी तुम्ही "कमी बँडविड्थ मोड" सक्षम करू शकता.',
      category: 'technical'
    }
  ];

  const getCategoryName = (category: any) => {
    switch (language) {
      case 'hi': return category.nameHi;
      case 'mar': return category.nameMar;
      default: return category.name;
    }
  };

  const getQuestion = (item: FAQItem) => {
    switch (language) {
      case 'hi': return item.questionHi;
      case 'mar': return item.questionMar;
      default: return item.question;
    }
  };

  const getAnswer = (item: FAQItem) => {
    switch (language) {
      case 'hi': return item.answerHi;
      case 'mar': return item.answerMar;
      default: return item.answer;
    }
  };

  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = getQuestion(item).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getAnswer(item).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const submitCallbackRequest = () => {
    if (!callbackForm.name || !callbackForm.phone) {
      alert('Please fill in your name and phone number');
      return;
    }
    
    alert('Callback request submitted! We will call you within 24 hours.');
    setShowCallbackForm(false);
    setCallbackForm({ name: '', phone: '', issue: '', preferredTime: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-card-foreground mb-2 flex items-center">
          <HelpCircle className="mr-2 text-primary" size={24} />
          {t('faq.title')}
        </h2>
        <p className="text-muted-foreground">{t('faq.findAnswers', 'Find answers to common questions or contact our support team')}</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder={t('faq.searchFAQ')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent shadow-sm"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent shadow-sm"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {getCategoryName(category)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center shadow-sm">
            <HelpCircle size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-card-foreground mb-2">{t('faq.noFAQs', 'No FAQs Found')}</h3>
            <p className="text-muted-foreground">{t('faq.adjustSearch', 'Try adjusting your search terms or category filter')}</p>
          </div>
        ) : (
          filteredFAQs.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button
                onClick={() => toggleExpanded(item.id)}
                className="w-full p-6 text-left hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-card-foreground pr-4">
                    {getQuestion(item)}
                  </h3>
                  {expandedItems.includes(item.id) ? (
                    <ChevronUp className="text-muted-foreground flex-shrink-0" size={20} />
                  ) : (
                    <ChevronDown className="text-muted-foreground flex-shrink-0" size={20} />
                  )}
                </div>
              </button>
              
              {expandedItems.includes(item.id) && (
                <div className="px-6 pb-6 border-t border-border">
                  <p className="text-muted-foreground leading-relaxed pt-4">
                    {getAnswer(item)}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Contact Support */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
          <Phone className="mr-2 text-primary" size={20} />
          {t('faq.contactSupport')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-chart-2/10 hover:bg-chart-2/20 rounded-lg transition-all border border-chart-2/20 shadow-sm">
            <Phone className="text-chart-2" size={24} />
            <div className="text-left">
              <p className="font-medium text-card-foreground">{t('faq.callTollFree')}</p>
              <p className="text-sm text-muted-foreground">1800-123-4567</p>
            </div>
          </button>
          
          <button 
            onClick={() => setShowCallbackForm(true)}
            className="flex items-center space-x-3 p-4 bg-chart-1/10 hover:bg-chart-1/20 rounded-lg transition-all border border-chart-1/20 shadow-sm"
          >
            <MessageCircle className="text-chart-1" size={24} />
            <div className="text-left">
              <p className="font-medium text-card-foreground">{t('faq.requestCallback')}</p>
              <p className="text-sm text-muted-foreground">{t('faq.callBack', "We'll call you back")}</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-accent hover:bg-accent/80 rounded-lg transition-all border border-border shadow-sm">
            <Mail className="text-muted-foreground" size={24} />
            <div className="text-left">
              <p className="font-medium text-card-foreground">{t('faq.emailSupport', 'Email Support')}</p>
              <p className="text-sm text-muted-foreground">support@eduindia.com</p>
            </div>
          </button>
        </div>
      </div>

      {/* Callback Form Modal */}
      {showCallbackForm && (
        <div className="fixed inset-0 z-50 min-h-screen p-4 bg-black/40 flex items-start justify-center">
          <div className="bg-white dark:bg-black h-full border border-border rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
              <Phone className="mr-2 text-primary" size={20} />
              {t('faq.requestCallback')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">{t('common.name', 'Name')} *</label>
                <input
                  type="text"
                  value={callbackForm.name}
                  onChange={(e) => setCallbackForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent shadow-sm"
                  placeholder={t('common.fullName', 'Your full name')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">{t('common.phoneNumber', 'Phone Number')} *</label>
                <input
                  type="tel"
                  value={callbackForm.phone}
                  onChange={(e) => setCallbackForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent shadow-sm"
                  placeholder="+91 9876543210"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">{t('faq.issueDescription', 'Issue Description')}</label>
                <textarea
                  value={callbackForm.issue}
                  onChange={(e) => setCallbackForm(prev => ({ ...prev, issue: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none shadow-sm"
                  placeholder={t('faq.describeIssue', 'Briefly describe your issue')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">{t('faq.preferredTime', 'Preferred Call Time')}</label>
                <select
                  value={callbackForm.preferredTime}
                  onChange={(e) => setCallbackForm(prev => ({ ...prev, preferredTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent shadow-sm"
                >
                  <option value="">{t('faq.anyTime', 'Any time')}</option>
                  <option value="morning">{t('faq.morning', 'Morning (9 AM - 12 PM)')}</option>
                  <option value="afternoon">{t('faq.afternoon', 'Afternoon (12 PM - 5 PM)')}</option>
                  <option value="evening">{t('faq.evening', 'Evening (5 PM - 8 PM)')}</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCallbackForm(false)}
                className="flex-1 px-4 py-2 border border-input rounded-lg text-muted-foreground hover:bg-muted transition-all shadow-sm"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={submitCallbackRequest}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm"
              >
                {t('faq.submitRequest', 'Submit Request')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQPage;