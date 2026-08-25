import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useAppState } from '../context/AppStateContext';
import { GeminiService } from '../services/GeminiService';
import type { FoodEntry } from '../models/types';

export function InputModals() {
  const { addFoodEntry } = useAppState();
  const [mode, setMode] = useState<'text' | 'none'>('none');
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCameraAnalysis = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 50,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      if (image.base64String) {
        processWithGemini({ 
          type: 'image', 
          base64: image.base64String, 
          // Re-encode back to data URI for local display if needed
          uri: `data:image/jpeg;base64,${image.base64String}` 
        });
      }
    } catch (e) {
      console.warn('Camera failed or user cancelled.', e);
    }
  };

  const submitText = () => {
    if (!textInput.trim()) return;
    processWithGemini({ type: 'text', data: textInput });
  };

  const processWithGemini = async (payload: { type: 'text' | 'image', data?: string, base64?: string, uri?: string }) => {
    setIsProcessing(true);
    try {
      let result;
      if (payload.type === 'text' && payload.data) {
        result = await GeminiService.analyzeFoodText(payload.data);
      } else if (payload.type === 'image' && payload.base64) {
        result = await GeminiService.analyzeFoodImage(payload.base64, 'image/jpeg');
      }

      if (result) {
        const entry: FoodEntry = {
          id: Date.now().toString(),
          name: result.name || 'Analyzed Food',
          timestamp: new Date().toISOString(),
          calories: result.calories || 0,
          protein: result.protein || 0,
          carbs: result.carbs || 0,
          fats: result.fats || 0,
          imageUrl: payload.uri,
        };
        await addFoodEntry(entry);
        alert(`Success! Added ${result.name} (${result.calories} kcal)`);
        setTextInput('');
        setMode('none');
      }
    } catch (e) {
      alert('Analysis Failed. Make sure the API key is configured in .env (VITE_GEMINI_API_KEY).');
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="input-modals-container">
      <h3>Log Food</h3>
      
      <div className="button-row">
        <button className="action-button camera-btn" onClick={handleCameraAnalysis} disabled={isProcessing}>
          <span className="icon">📷</span> Scan Dish
        </button>
        <button className="action-button text-btn" onClick={() => setMode('text')} disabled={isProcessing}>
          <span className="icon">📝</span> Text Entry
        </button>
      </div>

      {mode === 'text' && (
        <div className="modal-overlay" onClick={(e) => { if(e.target === e.currentTarget) setMode('none')}}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>AI Text Entry</h2>
              <button className="close-btn" onClick={() => setMode('none')}>&times;</button>
            </div>
            
            <p className="modal-subtitle">Describe what you ate, e.g., "Two scrambled eggs and a slice of toast with butter".</p>
            
            <textarea
              className="text-input"
              placeholder="Type here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={isProcessing}
            />
            
            <button 
              className="submit-btn" 
              onClick={submitText}
              disabled={isProcessing}
            >
              {isProcessing ? 'Analyzing AI...' : 'Analyze & Log'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
