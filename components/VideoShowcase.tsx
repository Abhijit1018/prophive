"use client";
import { useRef, useEffect, useState } from "react";
import AnimatedSection from "./AnimatedSection";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export default function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Auto-play when in view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
          } else {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function togglePlay() {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }

  function toggleMute() {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  }

  return (
    <section
      ref={containerRef}
      className="py-20 px-4 bg-gray-950 relative overflow-hidden"
      id="video-section"
    >
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <span className="text-orange-500 text-sm font-semibold uppercase tracking-wider">
            See It in Action
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold mt-2 text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Experience Premium Living
          </h2>
          <p className="text-gray-400 mt-3 max-w-lg mx-auto">
            Take a virtual tour of our finest listings and discover what modern living looks like
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/10 max-w-5xl mx-auto group">
            <video
              ref={videoRef}
              className="w-full aspect-video object-cover"
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
              poster="https://res.cloudinary.com/dupeyfqh8/image/upload/q_auto,f_auto,w_1280/v1776876622/prophive/hero/hero_main.jpg"
            >
              {/* We use the hero image as a poster; actual video can be uploaded later */}
              <source
                src="https://res.cloudinary.com/demo/video/upload/q_auto/dog.mp4"
                type="video/mp4"
              />
            </video>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
              <button
                onClick={togglePlay}
                className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors border border-white/20"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 text-white" />
                ) : (
                  <Play className="h-5 w-5 text-white ml-0.5" />
                )}
              </button>
              <button
                onClick={toggleMute}
                className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors border border-white/20"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 text-white" />
                ) : (
                  <Volume2 className="h-4 w-4 text-white" />
                )}
              </button>
            </div>

            {/* Center play button when paused */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center"
                aria-label="Play video"
              >
                <div className="h-20 w-20 rounded-full bg-orange-600/90 backdrop-blur-sm flex items-center justify-center hover:bg-orange-600 transition-all hover:scale-110 shadow-xl shadow-orange-500/30">
                  <Play className="h-8 w-8 text-white ml-1" />
                </div>
              </button>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
