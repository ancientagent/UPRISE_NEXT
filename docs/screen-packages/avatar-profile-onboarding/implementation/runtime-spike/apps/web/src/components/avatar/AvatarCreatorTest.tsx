'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@uprise/ui';
import { MUSIC_COMMUNITIES } from '@/data/music-communities';
import { api } from '@/lib/api';
import { prepareBrowserCameraAccess } from '@/lib/avatar/camera-access';

function captureCameraFrame(video: HTMLVideoElement, canvas: HTMLCanvasElement): string {
  const square = Math.min(video.videoWidth, video.videoHeight);
  const sourceX = (video.videoWidth - square) / 2;
  const sourceY = (video.videoHeight - square) / 2;
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('The camera image could not be prepared.');
  context.drawImage(video, sourceX, sourceY, square, square, 0, 0, 512, 512);
  return canvas.toDataURL('image/jpeg', 0.84);
}

export default function AvatarCreatorTest() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [community, setCommunity] = useState('Punk');
  const [consent, setConsent] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'camera' | 'generating'>('idle');
  const [error, setError] = useState<string | null>(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  useEffect(() => stopCamera, []);

  const openCamera = async () => {
    setError(null);
    const cameraAccess = prepareBrowserCameraAccess();
    if (cameraAccess.kind === 'redirect') {
      window.location.assign(cameraAccess.href);
      return;
    }
    if (cameraAccess.kind === 'blocked') {
      setError('Live camera capture requires a secure HTTPS connection.');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Live camera capture is not supported in this browser.');
      return;
    }

    setStatus('camera');
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      setError('Camera access is required for this avatar test.');
    } finally {
      setStatus('idle');
    }
  };

  const takePhoto = () => {
    try {
      if (!videoRef.current || !canvasRef.current || videoRef.current.videoWidth === 0) {
        throw new Error('The camera is still starting. Try again in a moment.');
      }
      setCapturedPhoto(captureCameraFrame(videoRef.current, canvasRef.current));
      setCandidates([]);
      setSelectedCandidate(null);
      stopCamera();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Camera capture failed.');
    }
  };

  const generate = async () => {
    if (!capturedPhoto || !consent) return;
    setStatus('generating');
    setError(null);
    try {
      const response = await api.post<{ candidates: string[] }>('/avatar-lab/test-candidates', {
        capturedPhoto,
        musicCommunity: community,
        // Compatibility with the already-running API process; the current API
        // ignores this and preserves the expression in the camera capture.
        expression: 'neutral',
        likenessConsent: true,
      });
      const nextCandidates = response.data?.candidates ?? [];
      if (nextCandidates.length === 0) throw new Error('No avatar candidates were returned.');
      setCandidates(nextCandidates);
      setSelectedCandidate(nextCandidates[0]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Avatar generation failed.');
    } finally {
      setStatus('idle');
    }
  };

  return (
    <main className="min-h-screen bg-[#171717] px-4 py-6 text-black sm:px-8 sm:py-10">
      <div className="mx-auto max-w-5xl border-2 border-black bg-[#f5f0e5] p-5 shadow-[8px_8px_0_#cbed19] sm:p-8">
        <header className="border-b-2 border-black pb-5">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em]">Registrar / Image processing test</p>
          <h1 className="mt-2 text-3xl font-black sm:text-5xl">Process your listener image.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/70">
            Capture one front-facing image. This test produces illustrated profile-image candidates without saving an account record.
          </p>
        </header>

        <div className="mt-6 grid gap-7 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section>
            <div className="relative aspect-square max-w-lg overflow-hidden border-2 border-black bg-black">
              {capturedPhoto ? (
                <img className="h-full w-full object-cover" src={capturedPhoto} alt="Captured likeness reference" />
              ) : (
                <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
              )}
              {!capturedPhoto && !cameraActive ? (
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center font-mono text-sm text-white">
                  Open your camera to begin.
                </div>
              ) : null}
            </div>
            <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
            <div className="mt-3 flex flex-wrap gap-2">
              {!cameraActive && !capturedPhoto ? (
                <Button type="button" className="rounded-none" disabled={status === 'camera'} onClick={() => void openCamera()}>
                  {status === 'camera' ? 'Opening camera...' : 'Open camera'}
                </Button>
              ) : null}
              {cameraActive ? <Button type="button" className="rounded-none" onClick={takePhoto}>Take photo</Button> : null}
              {capturedPhoto ? (
                <Button type="button" className="rounded-none" variant="outline" onClick={() => { setCapturedPhoto(null); setCandidates([]); setSelectedCandidate(null); }}>
                  Retake photo
                </Button>
              ) : null}
            </div>
          </section>

          <section className="space-y-5">
            <label className="block text-xs font-bold uppercase tracking-[0.12em]">
              Music community context
              <select value={community} onChange={(event) => setCommunity(event.target.value)} className="mt-2 w-full border-2 border-black bg-white px-3 py-3 text-sm normal-case tracking-normal">
                {MUSIC_COMMUNITIES.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="flex gap-3 border-l-4 border-[#cbed19] pl-3 text-sm leading-relaxed">
              <input className="mt-1 h-4 w-4" type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
              <span>I authorize this camera capture to be processed into illustrated profile-image candidates.</span>
            </label>
            <Button type="button" className="w-full rounded-none" disabled={!capturedPhoto || !consent || status === 'generating'} onClick={() => void generate()}>
              {status === 'generating' ? 'Processing image...' : 'Process image'}
            </Button>
          </section>
        </div>

        {candidates.length > 0 ? (
          <section className="mt-8 border-t-2 border-black pt-6">
            <h2 className="font-mono text-sm font-bold uppercase tracking-[0.14em]">Select a profile image</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {candidates.map((candidate, index) => (
                <button type="button" key={candidate} aria-pressed={selectedCandidate === candidate} onClick={() => setSelectedCandidate(candidate)} className={`overflow-hidden border-2 ${selectedCandidate === candidate ? 'border-[#779400] ring-4 ring-[#cbed19]' : 'border-black'}`}>
                  <img className="aspect-square w-full object-cover" src={candidate} alt={`Avatar candidate ${index + 1}`} />
                </button>
              ))}
            </div>
          </section>
        ) : null}
        {error ? <p className="mt-6 border-l-4 border-red-700 pl-3 text-sm text-red-800">{error}</p> : null}
      </div>
    </main>
  );
}
