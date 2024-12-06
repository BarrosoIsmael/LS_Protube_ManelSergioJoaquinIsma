import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import UploadVideo from '../upload-video/uploadVideo';
import { AuthProvider } from '../../context/AuthContext';

// Mock de entorno
jest.mock('../../utils/Env', () => ({
  getEnv: jest.fn(() => ({
    API_BASE_URL: 'http://localhost:8080/api',
    FRONT_BASE_URL: 'http://localhost:8080',
    __vite__: {}
  }))
}));

describe('UploadVideo', () => {

  beforeEach(() => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <UploadVideo />
        </AuthProvider>
      </MemoryRouter>
    );
  });

  it('renders all form fields correctly', () => {
    expect(screen.getByLabelText(/Title:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category:/i)).toBeInTheDocument();
    expect(screen.getByText(/Select File/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Thumbnail/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Video/i)).toBeInTheDocument();
  });

  it('uploads video and thumbnail successfully', async () => {
    const videoFile = new File(['video content'], 'testVideo.mp4', { type: 'video/mp4' });
    const thumbnailFile = new File(['image content'], 'testThumbnail.png', { type: 'image/png' });

    // Rellenar el formulario
    fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText(/Description:/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText(/Category:/i), { target: { value: 'Test Category' } });

    // Simular selección de archivos
    const videoInput = screen.getByLabelText(/Video File \(100MB max\):/i).nextElementSibling as HTMLInputElement;
    const thumbnailInput = screen.getByLabelText(/Thumbnail File \(100MB max\):/i).nextElementSibling as HTMLInputElement;

    fireEvent.change(videoInput, { target: { files: [videoFile] } });
    fireEvent.change(thumbnailInput, { target: { files: [thumbnailFile] } });

    // Mockear fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('Video and thumbnail uploaded successfully!'),
      })
    ) as jest.Mock;

    // Subir video
    fireEvent.click(screen.getByText(/Upload Video/i));

    // Esperar que el estado de subida sea actualizado
    const statusMessage = await screen.findByRole('alert');
    expect(statusMessage).toHaveClass('upload-error');
  });

  it('shows error message on upload failure', async () => {
    // Mockear fetch para lanzar un error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve('Failed to upload video and thumbnail.'),
      })
    ) as jest.Mock;

    // Completar el formulario y enviar
    fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText(/Description:/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText(/Category:/i), { target: { value: 'Test Category' } });

    const videoFile = new File(['video content'], 'testVideo.mp4', { type: 'video/mp4' });
    const thumbnailFile = new File(['image content'], 'testThumbnail.png', { type: 'image/png' });

    const videoInput = screen.getByLabelText(/Video File \(100MB max\):/i).nextElementSibling as HTMLInputElement;
    const thumbnailInput = screen.getByLabelText(/Thumbnail File \(100MB max\):/i).nextElementSibling as HTMLInputElement;

    fireEvent.change(videoInput, { target: { files: [videoFile] } });
    fireEvent.change(thumbnailInput, { target: { files: [thumbnailFile] } });

    fireEvent.click(screen.getByText(/Upload Video/i));

    // Esperar mensaje de error
    const statusMessage = await screen.findByRole('alert');
    expect(statusMessage.textContent).toBe('Error: Please fill out all fields, and select files to upload.');
  });
});
