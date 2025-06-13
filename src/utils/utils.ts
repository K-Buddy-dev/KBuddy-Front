import { POST_CATEGORIES } from '@/constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const parseJwt = (token: string) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
};

export const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// Base64 URI를 File 객체로 변환
export const base64ToFile = (base64String: string, fileName: string): File => {
  const byteCharacters = atob(base64String.split(',')[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
    const slice = byteCharacters.slice(offset, offset + 1024);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: 'image/jpeg' });
  return new File([blob], fileName, { type: 'image/jpeg' });
};

// URL 문자열을 File 객체로 변환 (이미지 URL이나 Base64 문자열 처리)
export const urlToFile = async (url: string, fileName: string): Promise<File> => {
  // 이미 Base64 문자열인 경우
  if (url.startsWith('data:')) {
    return base64ToFile(url, fileName);
  }

  // 원격 URL인 경우
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
};

export function getCategoryNames(categoryId: number | number[]): string {
  if (Array.isArray(categoryId)) {
    return categoryId
      .map((id) => POST_CATEGORIES.find((cat) => cat.id === id)?.name)
      .filter(Boolean)
      .join(' | ');
  }
  return POST_CATEGORIES.find((cat) => cat.id === categoryId)?.name || '';
}
