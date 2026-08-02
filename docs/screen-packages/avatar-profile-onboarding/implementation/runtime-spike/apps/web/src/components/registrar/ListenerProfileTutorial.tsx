'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@uprise/ui';
import { api } from '@/lib/api';
import { prepareBrowserCameraAccess } from '@/lib/avatar/camera-access';
import { useAuthStore } from '@/store/auth';

interface ListenerProfileTutorialProps {
  musicCommunity: string | null;
}

function captureFrame(video: HTMLVideoElement, canvas: HTMLCanvasElement): string {
  const sourceSize = Math.min(video.videoWidth, video.videoHeight);
  const sourceX = Math.max(0, (video.videoWidth - sourceSize) / 2);
  const sourceY = Math.max(0, (video.videoHeight - sourceSize) / 2);
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Camera capture could not be prepared.');
  context.drawImage(video, sourceX, sourceY, sourceSize, sourceSize, 0, 0, 512, 512);
  return canvas.toDataURL('image/jpeg', 0.84);
}

export default function ListenerProfileTutorial({ musicCommunity }: ListenerProfileTutorialProps) {
  const router = useRouter();
  const { token, setAuth, user } = useAuthStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [consent, setConsent] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [busy, setBusy] = useState<'camera' | 'generate' | 'save' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  useEffect(() => stopCamera, []);

  const startCamera = async () => {
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
      setError('This browser does not support live camera capture.');
      return;
    }

    setBusy('camera');
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
      setError('Camera access is required to create your listener avatar.');
    } finally {
      setBusy(null);
    }
  };

  const takePhoto = () => {
    try {
      if (!videoRef.current || !canvasRef.current || videoRef.current.videoWidth === 0) {
        throw new Error('Camera is still starting. Try again in a moment.');
      }
      setCapturedPhoto(captureFrame(videoRef.current, canvasRef.current));
      setCandidates([]);
      setSelectedAvatar(null);
      stopCamera();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Camera capture could not be completed.');
    }
  };

  const generateCandidates = async () => {
    if (!token || !capturedPhoto || !consent) return;
    setBusy('generate');
    setError(null);
    try {
      const response = await api.post<{ candidates: string[] }>(
        '/avatar-lab/candidates',
        {
          capturedPhoto,
          musicCommunity: musicCommunity ?? 'General',
          likenessConsent: true,
        },
        { token }
      );
      const nextCandidates = response.data?.candidates ?? [];
      if (nextCandidates.length === 0) throw new Error('No avatar candidates were returned.');
      setCandidates(nextCandidates);
      setSelectedAvatar(nextCandidates[0]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Avatar generation could not be completed.');
    } finally {
      setBusy(null);
    }
  };

  const saveProfile = async () => {
    if (!token || !selectedAvatar) return;
    setBusy('save');
    setError(null);
    try {
      const response = await api.post<{ id: string; username: string; displayName: string; bio: string | null; avatar: string }>(
        '/avatar-lab/selection',
        {
          avatar: selectedAvatar,
          musicCommunity: musicCommunity ?? 'General',
          likenessConsent: true,
          bio,
        },
        { token }
      );
      if (!response.data || !user) throw new Error('Listener profile could not be saved.');
      setAuth({ ...user, ...response.data, bio: response.data.bio ?? undefined }, token);
      router.push('/plot');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Listener profile could not be saved.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="border-2 border-black bg-[#f5f1e8] p-5 shadow-[5px_5px_0_#111] sm:p-6">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.14em]">Registrar tutorial / 1 of 1</p>
      <h2 className="mt-2 text-2xl font-black">Process your listener image</h2>
      <p className="mt-2 max-w-2xl text-sm text-black/70">
        Take one front-facing photo. The Registrar processes the captured likeness into an illustrated profile image for your Home Scene.
      </p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div>
          <div className="relative aspect-square max-w-md overflow-hidden border-2 border-black bg-black">
            {capturedPhoto ? (
              <img src={capturedPhoto} alt="Captured camera likeness" className="h-full w-full object-cover" />
            ) : (
              <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
            )}
            {!capturedPhoto && !cameraActive ? (
              <div className="absolute inset-0 flex items-center justify-center p-8 text-center font-mono text-sm text-white">
                Live camera capture required
              </div>
            ) : null}
          </div>
          <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
          <div className="mt-3 flex flex-wrap gap-2">
            {!cameraActive && !capturedPhoto ? (
              <Button className="rounded-none" type="button" disabled={busy === 'camera'} onClick={() => void startCamera()}>
                {busy === 'camera' ? 'Opening camera...' : 'Open camera'}
              </Button>
            ) : null}
            {cameraActive ? (
              <Button className="rounded-none" type="button" onClick={takePhoto}>Take photo</Button>
            ) : null}
            {capturedPhoto ? (
              <Button className="rounded-none" type="button" variant="outline" onClick={() => { setCapturedPhoto(null); setCandidates([]); setSelectedAvatar(null); }}>
                Retake photo
              </Button>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-[0.12em]">
            Starter context
            <p className="mt-1.5 border-2 border-black bg-white px-3 py-2.5 text-sm normal-case tracking-normal">
              {musicCommunity ?? 'Home Scene context will apply'}
            </p>
          </label>
          <label className="block text-xs font-bold uppercase tracking-[0.12em]">
            Short bio <span className="font-normal normal-case tracking-normal">(optional)</span>
            <textarea value={bio} onChange={(event) => setBio(event.target.value)} maxLength={1000} rows={4} className="mt-1.5 w-full resize-y border-2 border-black bg-white px-3 py-2.5 text-sm normal-case tracking-normal" />
          </label>
          <label className="flex gap-2 border-l-4 border-[#cbed19] pl-3 text-xs leading-relaxed">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 h-4 w-4" />
            <span>I authorize the Registrar to process this live camera capture into illustrated profile-image candidates.</span>
          </label>
          <Button className="w-full rounded-none" type="button" disabled={!capturedPhoto || !consent || busy === 'generate'} onClick={() => void generateCandidates()}>
            {busy === 'generate' ? 'Processing image...' : 'Process image'}
          </Button>
        </div>
      </div>

      {candidates.length > 0 ? (
        <div className="mt-6 border-t-2 border-black pt-5">
          <h3 className="font-mono text-sm font-bold uppercase tracking-[0.12em]">Select a profile image</h3>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {candidates.map((candidate, index) => (
              <button key={candidate} type="button" onClick={() => setSelectedAvatar(candidate)} className={`overflow-hidden border-2 ${selectedAvatar === candidate ? 'border-[#7e9c00] ring-2 ring-[#cbed19]' : 'border-black'}`} aria-pressed={selectedAvatar === candidate}>
                <img src={candidate} alt={`Avatar candidate ${index + 1}`} className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
          <Button className="mt-5 rounded-none" type="button" disabled={!selectedAvatar || busy === 'save'} onClick={() => void saveProfile()}>
            {busy === 'save' ? 'Saving listener profile...' : 'Save profile image and enter The Plot'}
          </Button>
        </div>
      ) : null}
      {error ? <p className="mt-4 border-l-4 border-red-700 pl-3 text-sm text-red-800">{error}</p> : null}
    </section>
  );
}
