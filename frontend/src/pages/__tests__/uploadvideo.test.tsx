import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
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
      <AuthProvider>
        <UploadVideo />
      </AuthProvider>
    );
  });

  it('renders all form fields correctly', () => {
    expect(screen.getByLabelText(/Title:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Video File:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Thumbnail File:/i)).toBeInTheDocument();
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
    const videoInput = screen.getByLabelText(/Video File:/i).nextElementSibling as HTMLInputElement;
    const thumbnailInput = screen.getByLabelText(/Thumbnail File:/i).nextElementSibling as HTMLInputElement;

    fireEvent.change(videoInput, { target: { files: [videoFile] } });
    fireEvent.change(thumbnailInput, { target: { files: [thumbnailFile] } });

    // Mockear fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;

    // Subir video
    fireEvent.click(screen.getByText(/Upload Video/i));

    // Esperar que el estado de subida sea actualizado
    await screen.findByRole('alert');

  });

  it('shows error message on upload failure', async () => {
    // Mockear fetch para lanzar un error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;

    // Completar el formulario y enviar
    fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText(/Description:/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText(/Category:/i), { target: { value: 'Test Category' } });

    const videoFile = new File(['video content'], 'testVideo.mp4', { type: 'video/mp4' });
    const thumbnailFile = new File(['image content'], 'testThumbnail.png', { type: 'image/png' });

    const videoInput = screen.getByLabelText(/Video File:/i).nextElementSibling as HTMLInputElement;
    const thumbnailInput = screen.getByLabelText(/Thumbnail File:/i).nextElementSibling as HTMLInputElement;

    fireEvent.change(videoInput, { target: { files: [videoFile] } });
    fireEvent.change(thumbnailInput, { target: { files: [thumbnailFile] } });

    fireEvent.click(screen.getByText(/Upload Video/i));

    // Esperar mensaje de error
    const statusMessage = await screen.findByRole('alert');
    console.log(statusMessage.textContent);
    expect(statusMessage).toHaveClass('upload-error');
  });
});
