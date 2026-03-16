import api from './api';

export const extractNamesFromImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await api.post('/ocr/extract-names', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data.names;
};
