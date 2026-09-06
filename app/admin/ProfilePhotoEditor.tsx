'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { getSupabaseBrowserClient } from '../../lib/supabase';
import { DEFAULT_PHOTO, PHOTO_BUCKET, prepareProfilePhoto, profilePhotoUrl } from '../../lib/profile-photo';
import { DEFAULT_CROP, type PhotoCrop } from '../../lib/photo-crop';

export default function ProfilePhotoEditor() {
  const [current, setCurrent] = useState(DEFAULT_PHOTO);
  const [preview, setPreview] = useState('');
  const [pending, setPending] = useState<File | null>(null);
  const [crop, setCrop] = useState<PhotoCrop>(DEFAULT_CROP);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('Loading current photo…');
  const input = useRef<HTMLInputElement>(null);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase) return;
      const { data, error } = await supabase.from('site_content').select('content').eq('id', 'profile_photo').maybeSingle();
      if (!active) return;
      if (error || !data) { setMessage('Photo settings could not be loaded. Refresh to try again.'); return; }
      setCurrent(profilePhotoUrl(data.content));
      setReady(true);
      setMessage('');
    }
    void load().catch(() => { if (active) setMessage('Could not connect. Refresh to try again.'); });
    return () => { active = false; };
  }, [supabase]);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  async function choosePhoto(file?: File) {
    if (!file || busy) return;
    setBusy(true);
    setPending(null);
    setPreview('');
    setMessage('Preparing preview…');
    try {
      const blob = await prepareProfilePhoto(file);
      setPending(file);
      setCrop(DEFAULT_CROP);
      setPreview(URL.createObjectURL(blob));
      setMessage('Preview only. Your website changes when you click Save photo.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not read this image.');
      if (input.current) input.current.value = '';
    } finally { setBusy(false); }
  }

  async function savePhoto() {
    if (!supabase || !pending || busy || !ready) return;
    setBusy(true);
    setMessage('Uploading photo…');
    try {
      const croppedPhoto = await prepareProfilePhoto(pending, crop);
      const path = `portrait/${crypto.randomUUID()}.webp`;
      const { error: uploadError } = await supabase.storage.from(PHOTO_BUCKET).upload(path, croppedPhoto, {
        contentType: 'image/webp', cacheControl: '31536000', upsert: false,
      });
      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
      const { data, error } = await supabase.from('site_content').update({ content: path })
        .eq('id', 'profile_photo').select('content').maybeSingle();
      if (error || !data) throw new Error('The upload finished, but publishing failed. Your existing photo is unchanged. Try saving again.');
      setCurrent(profilePhotoUrl(data.content));
      setPending(null);
      setPreview('');
      if (input.current) input.current.value = '';
      setMessage('Photo saved. Refresh the homepage to see it.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save. Check your connection and try again.');
    } finally { setBusy(false); }
  }

  return <section className="admin-photo-editor" aria-labelledby="photo-title">
    <h2 id="photo-title">Profile photo</h2>
    <p>Replace the photo in “Who I am”. JPG, PNG, or WebP, up to 5 MB. Uploaded photos are public.</p>
    <div className="portrait-frame admin-photo-preview">
      <Image className="portrait-image" src={preview || current} alt="Profile photo preview" width={800} height={1000} unoptimized
        style={pending ? {
          objectPosition: `${crop.x}% ${crop.y}%`,
          transform: `scale(${crop.zoom})`,
          transformOrigin: `${crop.x}% ${crop.y}%`,
        } : undefined} />
    </div>
    <label htmlFor="profile-photo">Choose photo</label>
    <input ref={input} id="profile-photo" type="file" accept="image/jpeg,image/png,image/webp"
      disabled={busy || !ready} onChange={event => void choosePhoto(event.target.files?.[0])} />
    {pending && <fieldset className="admin-crop-controls" disabled={busy}>
      <legend>Adjust framing</legend>
      <p>Zoom in, then adjust the position to frame your face and shoulders. Strong zoom can look softer.</p>
      <label htmlFor="photo-zoom">Zoom — {crop.zoom.toFixed(1)}×</label>
      <input id="photo-zoom" type="range" min="1" max="4" step="0.05" value={crop.zoom}
        onChange={event => setCrop(value => ({ ...value, zoom: Number(event.target.value) }))} />
      <label htmlFor="photo-x">Horizontal position — {crop.x}%</label>
      <input id="photo-x" type="range" min="0" max="100" step="1" value={crop.x}
        onChange={event => setCrop(value => ({ ...value, x: Number(event.target.value) }))} />
      <label htmlFor="photo-y">Vertical position — {crop.y}%</label>
      <input id="photo-y" type="range" min="0" max="100" step="1" value={crop.y}
        onChange={event => setCrop(value => ({ ...value, y: Number(event.target.value) }))} />
      <p>Move vertical position toward 0% to show more of the top of the photo.</p>
      <button className="admin-secondary" type="button" onClick={() => setCrop(DEFAULT_CROP)}>Reset framing</button>
    </fieldset>}
    <div className="admin-actions">
      <button className="admin-primary" type="button" disabled={busy || !pending || !ready} onClick={() => void savePhoto()}>
        {busy ? 'Working…' : 'Save photo'}
      </button>
      {pending && <button className="admin-secondary" type="button" disabled={busy} onClick={() => {
        setPending(null); setPreview(''); setMessage('Selection cancelled. Your website is unchanged.');
        if (input.current) input.current.value = '';
      }}>Cancel selection</button>}
    </div>
    <p role="status" className="admin-status">{message}</p>
  </section>;
}
