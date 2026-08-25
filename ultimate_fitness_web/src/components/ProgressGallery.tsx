
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useAppState } from '../context/AppStateContext';
import type { ProgressPhoto } from '../models/types';

export function ProgressGallery() {
  const { photos, addPhoto } = useAppState();

  const takeProgressPhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });

      if (image.webPath) {
        const newPhoto: ProgressPhoto = {
          id: Date.now().toString(),
          uri: image.webPath,
          date: new Date().toISOString()
        };
        await addPhoto(newPhoto);
      }
    } catch (e) {
      console.warn('User cancelled or camera error', e);
    }
  };

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h3>Physique Gallery</h3>
        <button onClick={takeProgressPhoto} className="camera-btn">
          📸 Add Photo
        </button>
      </div>

      <div className="photo-grid">
        {photos.length === 0 ? (
          <div className="empty-state">No progress photos yet. Take one to track your gains!</div>
        ) : (
          photos.map(photo => (
            <div key={photo.id} className="photo-card">
              <img src={photo.uri} alt="Progress" />
              <div className="photo-date">
                {new Date(photo.date).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
