// LiveClassPage.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Users,
  MessageSquare,
  Hand,
  Share,
  PhoneOff,
  Radio,
  Square,
  Play,
  Pause,
  Download,
} from "lucide-react";

/* ----------------------------- Types ----------------------------- */
interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  status: "live" | "scheduled" | "ended";
  startTime: string;
  endTime: string;
  participants: number;
  maxParticipants: number;
  recordingUrl: string | null;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
}

/* -------------------------- Mock Service ------------------------- */
const mockService = {
  getLiveClasses: async (): Promise<LiveClass[]> => {
    return [
      {
        id: "1",
        title: "Mathematics - Algebra Basics",
        instructor: "Prof. Sharma",
        status: "live",
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(),
        participants: 24,
        maxParticipants: 50,
        recordingUrl: null,
      },
      {
        id: "2",
        title: "Science - Physics Fundamentals",
        instructor: "Dr. Patel",
        status: "scheduled",
        startTime: new Date(Date.now() + 7200000).toISOString(),
        endTime: new Date(Date.now() + 10800000).toISOString(),
        participants: 0,
        maxParticipants: 50,
        recordingUrl: null,
      },
      {
        id: "3",
        title: "English Literature - Shakespeare",
        instructor: "Prof. Johnson",
        status: "ended",
        startTime: new Date(Date.now() - 7200000).toISOString(),
        endTime: new Date(Date.now() - 3600000).toISOString(),
        participants: 35,
        maxParticipants: 50,
        recordingUrl: "https://example.com/recording-123",
      },
    ];
  },
  joinLiveClass: async (classId: string) => {
    console.log("Joining class:", classId);
    return true;
  },
  uploadRecording: async (
    title: string,
    description: string,
    blob: Blob,
    type = "video"
  ) => {
    console.log("Uploading recording:", { title, description, blob, type });
    return "lesson-" + Date.now();
  },
};

/* --------------------------- Component --------------------------- */
export default function LiveClassPage(): JSX.Element {
  // Data + UI state
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [activeClass, setActiveClass] = useState<LiveClass | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingMode, setRecordingMode] = useState<"camera" | "screen">(
    "camera"
  );
  const [hasRecording, setHasRecording] = useState(false);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides] = useState(5);
  const [isTeacher, setIsTeacher] = useState(false);

  // Device lists & selected device ids
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedAudioId, setSelectedAudioId] = useState<string | null>(null);

  // Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localAudioRef = useRef<HTMLAudioElement | null>(null); // hidden element used for mic test
  const localStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<number | null>(null);

  /* ---------------------- Lifecycle: load + devices ---------------------- */
  useEffect(() => {
    loadLiveClasses();
    enumerateDevices();

    const onDeviceChange = () => {
      enumerateDevices();
    };
    navigator.mediaDevices?.addEventListener?.("devicechange", onDeviceChange);

    return () => {
      navigator.mediaDevices?.removeEventListener?.(
        "devicechange",
        onDeviceChange
      );
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadLiveClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const classes = await mockService.getLiveClasses();
      setLiveClasses(classes);
    } catch (err: any) {
      setError(err?.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  // If device labels are empty the browser usually hasn't granted permissions yet.
  // This helper requests minimal permission and then re-enumerates devices so labels appear.
  const ensurePermissionsForDevices = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      s.getTracks().forEach((t) => t.stop());
    } catch (err) {
      // ignore
    }
  };

  const enumerateDevices = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices)
        return;
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videos = devices.filter((d) => d.kind === "videoinput");
      const audios = devices.filter((d) => d.kind === "audioinput");

      const needPermission = [...videos, ...audios].some((d) => !d.label);
      if (needPermission) {
        await ensurePermissionsForDevices();
        const devices2 = await navigator.mediaDevices.enumerateDevices();
        const videos2 = devices2.filter((d) => d.kind === "videoinput");
        const audios2 = devices2.filter((d) => d.kind === "audioinput");
        setVideoDevices(videos2);
        setAudioDevices(audios2);
        if (videos2.length && !selectedVideoId)
          setSelectedVideoId(videos2[0].deviceId);
        if (audios2.length && !selectedAudioId)
          setSelectedAudioId(audios2[0].deviceId);
        return;
      }

      setVideoDevices(videos);
      setAudioDevices(audios);
      if (videos.length && !selectedVideoId)
        setSelectedVideoId(videos[0].deviceId);
      if (audios.length && !selectedAudioId)
        setSelectedAudioId(audios[0].deviceId);
    } catch (err) {
      console.warn("enumerateDevices failed", err);
    }
  };

  /* -------------------------- Utilities -------------------------- */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const attachStreamToVideo = async (
    el: HTMLVideoElement | null,
    stream: MediaStream | null,
    muted = true
  ) => {
    if (!el || !stream) return;
    try {
      el.srcObject = stream;
      el.muted = muted;

      if (el.readyState >= 1) {
        await el.play().catch((err) => {
          console.warn(
            "video.play() blocked (autoplay policy). User interaction needed.",
            err
          );
        });
      } else {
        await new Promise<void>((resolve) => {
          const onMeta = async () => {
            el.removeEventListener("loadedmetadata", onMeta);
            await el.play().catch((err) => {
              console.warn(
                "video.play() blocked (autoplay policy). User interaction needed.",
                err
              );
            });
            resolve();
          };
          el.addEventListener("loadedmetadata", onMeta);
          setTimeout(resolve, 500);
        });
      }
    } catch (err) {
      console.warn("attachStreamToVideo error:", err);
    }
  };

  /* ------------------ NEW: attach stream after join/mount ------------------ */
  useEffect(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    let mounted = true;

    (async () => {
      if (mounted && localVideoRef.current) {
        await attachStreamToVideo(localVideoRef.current, stream, true);
      }
      if (mounted && isTeacher && remoteVideoRef.current) {
        await attachStreamToVideo(remoteVideoRef.current, stream, true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isJoined, isTeacher]);

  /* -------------------------- Join / Leave -------------------------- */
  const joinClass = async (classId: string, asTeacher = false) => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("getUserMedia not supported in this browser");
        return;
      }

      setError(null);

      const videoConstraint: any = selectedVideoId
        ? { deviceId: { exact: selectedVideoId } }
        : { facingMode: "user" };
      const audioConstraint: any = selectedAudioId
        ? { deviceId: { exact: selectedAudioId } }
        : true;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraint,
        audio: audioConstraint,
      });

      localStreamRef.current = stream;

      if (localVideoRef.current) {
        await attachStreamToVideo(localVideoRef.current, stream, true);
      }

      if (asTeacher && remoteVideoRef.current) {
        await attachStreamToVideo(remoteVideoRef.current, stream, true);
      }

      if (localAudioRef.current) {
        try {
          localAudioRef.current.srcObject = stream;
          localAudioRef.current.muted = true;
        } catch (err) {
          console.warn("attach to localAudioRef failed", err);
        }
      }

      await mockService.joinLiveClass(classId);
      const classData = liveClasses.find((c) => c.id === classId) || null;

      if (classData) {
        setActiveClass(classData);
        setIsJoined(true);
        setIsTeacher(asTeacher);
        setIsVideoOn(true);
        setIsAudioOn(true);
        setChatMessages([
          {
            id: "1",
            sender: "System",
            message: `Welcome to the live class${
              asTeacher ? " (Teacher Mode)" : ""
            }!`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (err: any) {
      console.error("Failed to access camera/microphone:", err);
      if (err?.name === "NotAllowedError" || err?.name === "SecurityError") {
        alert(
          "Permissions denied. Please allow camera & microphone for this site and try again."
        );
      } else if (err?.name === "NotFoundError") {
        alert(
          "No camera/microphone found. Please connect a device and try again."
        );
      } else {
        alert("Failed to access camera/microphone. See console for details.");
      }
      setError("Camera/Microphone access denied");
    }
  };

  const leaveClass = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    if (isRecording) stopRecording();

    setActiveClass(null);
    setIsJoined(false);
    setIsTeacher(false);
    setChatMessages([]);
    setHandRaised(false);
    setHasRecording(false);
    setRecordingTime(0);
    setIsVideoOn(true);
    setIsAudioOn(true);
  };

  /* -------------------------- Toggles -------------------------- */
  const toggleVideo = () => {
    if (!localStreamRef.current) {
      alert("No local stream available. Join the class first.");
      return;
    }
    const videoTracks = localStreamRef.current.getVideoTracks();
    if (!videoTracks.length) {
      alert("No camera track available.");
      return;
    }
    videoTracks.forEach((t) => (t.enabled = !t.enabled));
    setIsVideoOn((p) => !p);
  };

  const toggleAudio = () => {
    if (!localStreamRef.current) {
      alert("No local stream available. Join the class first.");
      return;
    }
    const audioTracks = localStreamRef.current.getAudioTracks();
    if (!audioTracks.length) {
      alert("No microphone track available.");
      return;
    }
    audioTracks.forEach((t) => (t.enabled = !t.enabled));
    setIsAudioOn((p) => !p);
  };

  const toggleHand = () => {
    setHandRaised((prev) => !prev);
    if (!handRaised) {
      const handMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "System",
        message: "You raised your hand",
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, handMessage]);
    }
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: isTeacher ? "Teacher" : "You",
        message: chatMessage,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, newMessage]);
      setChatMessage("");
    }
  };

  /* --------------------------- Mic Test --------------------------- */
  const testMic = async () => {
    if (!localStreamRef.current) {
      alert(
        "No local stream available. Join the class first (or start preview)."
      );
      return;
    }
    if (!localAudioRef.current) return;
    try {
      localAudioRef.current.muted = false;
      await localAudioRef.current.play().catch(() => {});
      setTimeout(() => {
        if (localAudioRef.current) {
          localAudioRef.current.pause();
          localAudioRef.current.muted = true;
        }
      }, 2000);
    } catch (err) {
      console.warn("Mic test failed", err);
    }
  };

  /* -------------------------- Recording -------------------------- */
  const startRecording = async () => {
    try {
      let stream: MediaStream | null = null;

      if (recordingMode === "screen") {
        // @ts-ignore
        stream = await (navigator.mediaDevices as any).getDisplayMedia({
          video: true,
          audio: true,
        });
        try {
          const mic = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          const micTrack = mic.getAudioTracks()[0];
          if (micTrack && stream) {
            (stream as MediaStream).addTrack(micTrack);
          }
        } catch {
          // continue
        }
      } else {
        stream =
          localStreamRef.current ||
          (await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          }));
      }

      recordedChunksRef.current = [];
      const options: any = { mimeType: "video/webm;codecs=vp8,opus" };
      if (!(MediaRecorder as any).isTypeSupported(options.mimeType))
        options.mimeType = "video/webm";
      if (!stream) {
        throw new Error("No media stream available for recording");
      }
      mediaRecorderRef.current = new MediaRecorder(
        stream as MediaStream,
        options
      );

      mediaRecorderRef.current.ondataavailable = (ev: BlobEvent) => {
        if (ev.data && ev.data.size > 0)
          recordedChunksRef.current.push(ev.data);
      };

      mediaRecorderRef.current.onstop = () => {
        setHasRecording(true);
        if (
          recordingMode === "screen" &&
          stream &&
          stream !== localStreamRef.current
        ) {
          stream.getTracks().forEach((t) => t.stop());
        }
      };

      mediaRecorderRef.current.start(100);
      setIsRecording(true);
      setIsPaused(false);

      intervalRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000) as unknown as number;
    } catch (err: any) {
      console.error("Error starting recording:", err);
      alert("Failed to start recording: " + (err?.message || err));
    }
  };

  const pauseRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;
    if (isPaused) {
      mediaRecorderRef.current.resume();
      intervalRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000) as unknown as number;
    } else {
      mediaRecorderRef.current.pause();
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    setIsPaused((p) => !p);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const downloadRecording = () => {
    if (!recordedChunksRef.current.length) {
      alert("No recording available");
      return;
    }
    const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recording-${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const publishLesson = async () => {
    if (!lessonTitle.trim()) {
      alert("Lesson title is required");
      return;
    }
    if (!recordedChunksRef.current.length) {
      alert("No recording available to upload");
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    const progressInterval = window.setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(100, prev + Math.random() * 15);
      });
    }, 200);

    try {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      await mockService.uploadRecording(
        lessonTitle,
        lessonDescription,
        blob,
        recordingMode === "screen" ? "screen" : "video"
      );
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        alert("Lesson published successfully!");
        setLessonTitle("");
        setLessonDescription("");
        setRecordingTime(0);
        setCurrentSlide(1);
        setHasRecording(false);
        recordedChunksRef.current = [];
      }, 1000);
    } catch (err: any) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(0);
      alert("Upload failed: " + (err?.message || err));
    }
  };

  const nextSlide = () => {
    if (currentSlide < totalSlides) setCurrentSlide((s) => s + 1);
  };

  /* --------------------------- Render --------------------------- */
  if (isJoined && activeClass) {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground mb-7">
        {/* Class Header */}
        <div className="bg-popover border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {activeClass.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {activeClass.instructor} • {activeClass.participants}{" "}
                participants
                {isTeacher && " • Teacher Mode"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                LIVE
              </span>
              <button
                onClick={leaveClass}
                className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-colors"
              >
                <PhoneOff size={16} />
                <span>Leave</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row flex-1">
          {/* Video Area */}
          <div className="flex-1 bg-card relative mb-7">
            <div className="w-full h-full flex items-center justify-center">
              {isTeacher ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
              ) : (
                <div className="text-center text-foreground">
                  <div className="w-32 h-32 bg-secondary rounded-full flex items-center justify-center mx-auto">
                    <Users size={48} />
                  </div>
                  <p className="text-lg font-medium">
                    {activeClass.instructor}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Teaching: {activeClass.title}
                  </p>
                </div>
              )}
            </div>

            {/* Local Video */}
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-card rounded-lg border-2 border-border overflow-hidden shadow-2xl">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${
                  isVideoOn ? "block" : "hidden"
                }`}
                style={{ transform: "scaleX(-1)" }}
              />
              {!isVideoOn && (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <VideoOff size={24} />
                    <div className="text-xs mt-1">Video Off</div>
                  </div>
                </div>
              )}
              <div className="absolute top-2 left-2 bg-popover text-foreground text-xs px-2 py-1 rounded">
                {isTeacher ? "You (Teacher)" : "You"}
              </div>
            </div>

            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-destructive text-destructive-foreground px-3 py-2 rounded-lg">
                <div className="w-3 h-3 bg-destructive-foreground rounded-full animate-pulse" />
                <span className="font-medium">
                  {isPaused ? "Recording Paused" : "Recording"} •{" "}
                  {formatTime(recordingTime)}
                </span>
              </div>
            )}

            {/* Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-4 bg-popover rounded-full px-6 py-3">
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full transition-colors ${
                    isAudioOn ? "bg-secondary" : "bg-destructive"
                  } text-foreground`}
                >
                  {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
                </button>

                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full transition-colors ${
                    isVideoOn ? "bg-secondary" : "bg-destructive"
                  } text-foreground`}
                >
                  {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
                </button>

                <button
                  onClick={toggleHand}
                  className={`p-3 rounded-full transition-colors ${
                    handRaised ? "bg-primary" : "bg-secondary"
                  } text-foreground`}
                >
                  <Hand size={20} />
                </button>

                <button
                  onClick={async () => {
                    try {
                      // @ts-ignore
                      const stream = await (
                        navigator.mediaDevices as any
                      ).getDisplayMedia({ video: true });
                      stream.getTracks()[0].onended = () => {
                        console.log("Screen share ended");
                      };
                    } catch (err) {
                      console.error("Error sharing screen:", err);
                    }
                  }}
                  className="p-3 rounded-full bg-secondary text-foreground transition-colors"
                >
                  <Share size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-96 bg-popover border-l border-border flex flex-col">
            {/* Teacher Recording Controls */}
            {isTeacher && (
              <div className="p-4 border-b border-border">
                <h3 className="font-medium text-foreground mb-3 flex items-center">
                  <Radio size={16} className="mr-2 text-destructive" />
                  Recording Controls
                </h3>

                {!isRecording && !hasRecording && (
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setRecordingMode("camera")}
                      className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                        recordingMode === "camera"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      Camera
                    </button>
                    <button
                      onClick={() => setRecordingMode("screen")}
                      className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                        recordingMode === "screen"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      Screen
                    </button>
                  </div>
                )}

                <div className="flex gap-2">
                  {!isRecording && !hasRecording && (
                    <button
                      onClick={startRecording}
                      className="flex-1 px-3 py-2 rounded text-sm bg-destructive text-destructive-foreground hover:opacity-90 transition-colors flex items-center justify-center gap-1"
                    >
                      <Radio size={14} />
                      Start Recording
                    </button>
                  )}

                  {isRecording && (
                    <>
                      <button
                        onClick={pauseRecording}
                        className="flex-1 px-3 py-2 rounded text-sm bg-primary text-primary-foreground hover:opacity-90 transition-colors flex items-center justify-center gap-1"
                      >
                        {isPaused ? <Play size={14} /> : <Pause size={14} />}
                        {isPaused ? "Resume" : "Pause"}
                      </button>

                      <button
                        onClick={stopRecording}
                        className="flex-1 px-3 py-2 rounded text-sm bg-secondary text-foreground hover:opacity-90 transition-colors flex items-center justify-center gap-1"
                      >
                        <Square size={14} />
                        Stop
                      </button>
                    </>
                  )}

                  {!isRecording && hasRecording && (
                    <>
                      <button
                        onClick={() => {
                          const blob = new Blob(recordedChunksRef.current, {
                            type: "video/webm",
                          });
                          const url = URL.createObjectURL(blob);
                          const w = window.open(url, "_blank");
                          if (!w)
                            alert(
                              "Popup blocked — download the recording instead"
                            );
                        }}
                        className="flex-1 px-3 py-2 rounded text-sm bg-accent text-accent-foreground hover:opacity-90 transition-colors flex items-center justify-center gap-1"
                      >
                        <Play size={14} /> Play
                      </button>

                      <button
                        onClick={downloadRecording}
                        className="flex-1 px-3 py-2 rounded text-sm bg-secondary text-foreground hover:opacity-90 transition-colors flex items-center justify-center gap-1"
                      >
                        <Download size={14} /> Download
                      </button>
                    </>
                  )}
                </div>

                {/* Recording details */}
                <div className="mt-3 text-sm text-muted-foreground">
                  <div>
                    Mode:{" "}
                    <span className="font-medium text-foreground">
                      {recordingMode}
                    </span>
                  </div>
                  <div>
                    Time:{" "}
                    <span className="font-medium text-foreground">
                      {formatTime(recordingTime)}
                    </span>
                  </div>
                  <div>
                    Slide:{" "}
                    <span className="font-medium text-foreground">
                      {currentSlide}/{totalSlides}
                    </span>
                  </div>
                </div>

                {/* Slide controls */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setCurrentSlide((s) => Math.max(1, s - 1))}
                    className="flex-1 px-3 py-2 rounded text-sm bg-secondary text-foreground hover:opacity-90"
                  >
                    Prev
                  </button>
                  <button
                    onClick={nextSlide}
                    className="flex-1 px-3 py-2 rounded text-sm bg-secondary text-foreground hover:opacity-90"
                  >
                    Next
                  </button>
                </div>

                {/* Publish */}
                <div className="mt-4">
                  <input
                    placeholder="Lesson title"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-card text-foreground text-sm mb-2"
                  />
                  <textarea
                    placeholder="Lesson description (optional)"
                    value={lessonDescription}
                    onChange={(e) => setLessonDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-card text-foreground text-sm mb-2 h-20"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={publishLesson}
                      disabled={isUploading}
                      className="flex-1 px-3 py-2 rounded text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60"
                    >
                      {isUploading
                        ? `Uploading ${Math.round(uploadProgress)}%`
                        : "Publish Lesson"}
                    </button>
                    <button
                      onClick={() => {
                        recordedChunksRef.current = [];
                        setHasRecording(false);
                        setRecordingTime(0);
                        setLessonTitle("");
                        setLessonDescription("");
                      }}
                      className="px-3 py-2 rounded text-sm bg-secondary text-foreground hover:opacity-90"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Chat & Participants */}
            <div className="flex-1 p-4 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-foreground font-medium text-sm flex items-center gap-2">
                  <MessageSquare size={14} /> Chat
                </h4>
                <div className="text-xs text-muted-foreground">
                  {activeClass.participants} participants
                </div>
              </div>

              <div
                className="flex-1 overflow-y-auto mb-3 space-y-2"
                style={{ maxHeight: "40vh" }}
              >
                {chatMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-2 rounded ${
                      m.sender === "You" || m.sender === "Teacher"
                        ? "bg-primary text-primary-foreground self-end"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <div className="text-xs opacity-80">
                      {m.sender} • {new Date(m.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="mt-1 text-sm">{m.message}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendChatMessage();
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 rounded bg-card text-foreground text-sm"
                />
                <button
                  onClick={sendChatMessage}
                  className="px-3 py-2 rounded bg-primary text-primary-foreground"
                >
                  Send
                </button>
              </div>
            </div>

            {/* Participants & quick actions */}
            <div className="p-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users size={18} />
                <div>
                  <div className="text-sm text-foreground">
                    {activeClass.instructor}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Instructor
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Raise hand toggled")}
                  className="px-3 py-2 rounded bg-secondary text-foreground"
                >
                  Raise
                </button>
                <button
                  onClick={() => alert("Request to speak sent")}
                  className="px-3 py-2 rounded bg-secondary text-foreground"
                >
                  Request
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* hidden audio element used for mic test */}
        <audio ref={localAudioRef} style={{ display: "none" }} />
      </div>
    );
  }

  // NOT JOINED: show class list + device selectors + join buttons
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SECTION - Live Classes */}
        <div className="col-span-1 lg:col-span-2 bg-card rounded-lg shadow p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h2 className="text-lg font-semibold text-foreground">
              Live Classes
            </h2>
            <div className="text-sm text-muted-foreground">
              {loading ? "Loading..." : `${liveClasses.length} classes`}
            </div>
          </div>

          {/* Device selectors */}
          <div className="mb-4 flex flex-col sm:flex-row flex-wrap items-center gap-3">
            <div className="text-sm text-muted-foreground">Devices:</div>

            <select
              value={selectedVideoId ?? ""}
              onChange={(e) => setSelectedVideoId(e.target.value || null)}
              className="w-full sm:w-auto flex-1 min-w-0 px-2 py-1 rounded
      bg-card text-foreground border border-border appearance-none
      dark:bg-black dark:text-white"
            >
              {videoDevices.length === 0 && (
                <option value="">Default Camera</option>
              )}
              {videoDevices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Camera ${d.deviceId}`}
                </option>
              ))}
            </select>

            <select
              value={selectedAudioId ?? ""}
              onChange={(e) => setSelectedAudioId(e.target.value || null)}
              className="w-full sm:w-auto flex-1 min-w-0 px-2 py-1 rounded
      bg-card text-foreground border border-border appearance-none
      dark:bg-black dark:text-white"
            >
              {audioDevices.length === 0 && (
                <option value="">Default Microphone</option>
              )}
              {audioDevices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Mic ${d.deviceId}`}
                </option>
              ))}
            </select>

            <button className="w-full sm:w-auto px-3 py-1 rounded bg-secondary text-foreground text-sm">
              Refresh
            </button>

            <button className="w-full sm:w-auto px-3 py-1 rounded bg-secondary text-foreground text-sm">
              Test Mic (2s)
            </button>
          </div>

          {error && <div className="text-destructive mb-3">{error}</div>}

          {/* Live classes list */}
          <div className="space-y-3">
            {liveClasses.map((c) => (
              <div
                key={c.id}
                className="border rounded p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between border-border gap-3"
              >
                {/* Title/Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground break-words">
                    {c.title}
                  </div>
                  <div className="text-xs text-muted-foreground break-words">
                    {c.instructor} • {c.status}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => joinClass(c.id, false)}
                    className="flex-1 sm:flex-none px-3 py-2 rounded bg-primary text-primary-foreground"
                  >
                    Join
                  </button>
                  <button
                    onClick={() => joinClass(c.id, true)}
                    className="flex-1 sm:flex-none px-3 py-2 rounded bg-accent text-accent-foreground"
                  >
                    Join as Teacher
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming */}
        <div className="bg-card rounded-lg shadow p-4">
          <div className="mb-3">
            <h3 className="font-medium text-foreground">Upcoming</h3>
            <div className="text-sm text-muted-foreground mt-1">
              Scheduled & ended classes
            </div>
          </div>
          <div className="space-y-2">
            {liveClasses
              .filter((l) => l.status !== "live")
              .map((l) => (
                <div key={l.id} className="flex items-center justify-between">
                  <div className="text-sm text-foreground">{l.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {l.status}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
