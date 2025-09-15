import React, { useState, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Users, MessageSquare, Hand, Share, Phone, PhoneOff, Monitor, Wifi } from 'lucide-react';
import { mockService, LiveClass } from '../services/mockService';
import { useI18n } from '../hooks/useI18n';

const LiveClassPage: React.FC = () => {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeClass, setActiveClass] = useState<LiveClass | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{id: string, sender: string, message: string, timestamp: string}>>([]);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const loadLiveClasses = async () => {
      setLoading(true);
      setError(null);
      try {
        const classes = await mockService.getLiveClasses();
        setLiveClasses(classes);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadLiveClasses();
  }, []);

  const retryLoadClasses = () => {
    const loadLiveClasses = async () => {
      setLoading(true);
      setError(null);
      try {
        const classes = await mockService.getLiveClasses();
        setLiveClasses(classes);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadLiveClasses();
  };

  const joinClass = async (classId: string) => {
    try {
      await mockService.joinLiveClass(classId);
      const classData = liveClasses.find(c => c.id === classId);
      if (classData) {
        setActiveClass(classData);
        setIsJoined(true);
        setChatMessages([
          {
            id: '1',
            sender: 'System',
            message: 'Welcome to the live class!',
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to join class:', error);
      alert('Failed to join class: ' + (error as Error).message);
    }
  };

  const leaveClass = () => {
    setActiveClass(null);
    setIsJoined(false);
    setChatMessages([]);
    setHandRaised(false);
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: 'You',
        message: chatMessage,
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage('');
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
  };

  const toggleHand = () => {
    setHandRaised(!handRaised);
    if (!handRaised) {
      const handMessage = {
        id: Date.now().toString(),
        sender: 'System',
        message: 'You raised your hand',
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, handMessage]);
    }
  };

  if (isJoined && activeClass) {
    return (
      <div className="h-screen bg-background flex flex-col">
        {/* Class Header */}
        <div className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">{activeClass.title}</h2>
              <p className="text-sm text-muted-foreground">
                {activeClass.instructor} • {activeClass.participants} participants
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                LIVE
              </span>
              <button
                onClick={leaveClass}
                className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90 transition-colors flex items-center space-x-2"
              >
                <PhoneOff size={16} />
                <span>Leave</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Video Area */}
          <div className="flex-1 bg-black relative">
            {/* Teacher Video (Placeholder) */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={48} />
                </div>
                <p className="text-lg font-medium">{activeClass.instructor}</p>
                <p className="text-sm text-gray-300">Teaching: {activeClass.title}</p>
              </div>
            </div>

            {/* Student Video (Self) */}
            <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg border-2 border-white overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                {isVideoOn ? (
                  <div className="text-white text-xs">Your Video</div>
                ) : (
                  <div className="text-white text-center">
                    <VideoOff size={20} />
                    <div className="text-xs mt-1">Video Off</div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full transition-colors ${
                    isAudioOn 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
                </button>
                
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full transition-colors ${
                    isVideoOn 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
                </button>
                
                <button
                  onClick={toggleHand}
                  className={`p-3 rounded-full transition-colors ${
                    handRaised 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  <Hand size={20} />
                </button>
                
                <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors">
                  <Share size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="w-80 bg-card border-l border-border flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-border">
              <h3 className="font-medium text-card-foreground flex items-center">
                <MessageSquare size={16} className="mr-2" />
                Class Chat
              </h3>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="text-sm">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`font-medium ${
                      msg.sender === 'You' ? 'text-primary' : 
                      msg.sender === 'System' ? 'text-muted-foreground' : 'text-card-foreground'
                    }`}>
                      {msg.sender}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-card-foreground">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-border">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <button
                  onClick={sendChatMessage}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-card-foreground mb-2 flex items-center">
          <Monitor className="mr-2 text-primary" size={24} />
          {t('live.title')}
        </h2>
        <p className="text-muted-foreground">{t('live.joinInteract', 'Join live classes and interact with teachers and classmates')}</p>
      </div>

      {/* Live Classes */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-destructive/20 rounded-full flex items-center justify-center">
                <Monitor className="text-destructive" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-destructive mb-1">
                  {error.includes('offline') ? t('offline.workingOffline', 'Working Offline') : 'Connection Error'}
                </h3>
                <p className="text-sm text-destructive/80">
                  {error.includes('offline') 
                    ? t('offline.enableOnline', 'Enable online mode to view live classes')
                    : error
                  }
                </p>
              </div>
            </div>
            <button
              onClick={retryLoadClasses}
              disabled={loading}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('common.loading', 'Loading...') : t('common.retry', 'Retry')}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {!error && liveClasses.length === 0 && !loading ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center shadow-sm">
            <Monitor size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-card-foreground mb-2">{t('live.noClasses', 'No Live Classes')}</h3>
            <p className="text-muted-foreground">{t('live.checkLater', 'Check back later for scheduled live classes')}</p>
          </div>
        ) : !error && (
          liveClasses.map((liveClass) => (
            <div key={liveClass.id} className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-card-foreground">{liveClass.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      liveClass.status === 'live' 
                        ? 'bg-destructive/10 text-destructive animate-pulse'
                        : liveClass.status === 'scheduled'
                        ? 'bg-chart-2/10 text-chart-2'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {liveClass.status === 'live' ? t('live.liveNow', 'LIVE NOW') : 
                       liveClass.status === 'scheduled' ? t('live.scheduled', 'Scheduled') : t('live.ended', 'Ended')}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground mb-3">
                    {t('live.instructor', 'Instructor')}: {liveClass.instructor}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>
                      {new Date(liveClass.startTime).toLocaleString()} - {new Date(liveClass.endTime).toLocaleString()}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Users size={14} className="mr-1" />
                      {liveClass.participants}/{liveClass.maxParticipants}
                    </span>
                  </div>
                </div>
                
                <div className="ml-4">
                  {liveClass.status === 'live' || liveClass.status === 'scheduled' ? (
                    <button
                      onClick={() => joinClass(liveClass.id)}
                      className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all shadow-sm flex items-center space-x-2"
                    >
                      <Phone size={16} />
                      <span>{liveClass.status === 'live' ? t('live.joinClass') : 'Join When Live'}</span>
                    </button>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">{t('live.classEnded')}</p>
                      {liveClass.recordingUrl && (
                        <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm hover:bg-secondary/80 transition-all shadow-sm">
                          {t('live.viewRecording', 'View Recording')}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Features Info */}
      <div className="bg-muted rounded-lg p-6 shadow-sm">
        <h3 className="font-medium text-card-foreground mb-4 flex items-center">
          <Wifi className="mr-2 text-primary" size={20} />
          {t('live.features', 'Live Class Features')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Video className="text-chart-2" size={20} />
            <div>
              <p className="font-medium text-card-foreground text-sm">{t('live.hdVideo', 'HD Video & Audio')}</p>
              <p className="text-xs text-muted-foreground">{t('live.clearComm', 'Crystal clear communication')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MessageSquare className="text-chart-2" size={20} />
            <div>
              <p className="font-medium text-card-foreground text-sm">{t('live.realTimeChat', 'Real-time Chat')}</p>
              <p className="text-xs text-muted-foreground">{t('live.askQuestions', 'Ask questions instantly')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Hand className="text-chart-1" size={20} />
            <div>
              <p className="font-medium text-card-foreground text-sm">{t('live.raiseHand')}</p>
              <p className="text-xs text-muted-foreground">{t('live.getAttention', "Get teacher's attention")}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Share className="text-chart-1" size={20} />
            <div>
              <p className="font-medium text-card-foreground text-sm">{t('live.shareScreen')}</p>
              <p className="text-xs text-muted-foreground">{t('live.shareWork', 'Share your work')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClassPage;