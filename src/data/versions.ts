import funcUrls from '../../backend/func2url.json';

export interface VersionFile {
  name: string;
  type: 'pdf' | 'xls' | 'doc';
  size: string;
}

export interface Version {
  id: number;
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch';
  title: string;
  description: string;
  fullDescription?: string;
  changes: string[];
  files: VersionFile[];
  authorId?: number;
  authorName?: string;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = funcUrls.versions;

export async function fetchVersions(): Promise<Version[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Ошибка загрузки версий');
  return res.json();
}

export async function fetchVersion(id: number): Promise<Version> {
  const res = await fetch(`${API_URL}?id=${id}`);
  if (!res.ok) throw new Error('Версия не найдена');
  return res.json();
}

export async function createVersion(data: Partial<Version>, token: string): Promise<{ id: number }> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Ошибка создания');
  }
  return res.json();
}

export async function updateVersion(id: number, data: Partial<Version>, token: string): Promise<void> {
  const res = await fetch(`${API_URL}?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Ошибка обновления');
  }
}

export async function deleteVersion(id: number, token: string): Promise<void> {
  const res = await fetch(`${API_URL}?id=${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Ошибка удаления');
  }
}

export const getTypeColor = (type: Version['type']) => {
  switch (type) {
    case 'major':
      return 'bg-warm-brown text-white';
    case 'minor':
      return 'bg-warm-terracotta text-white';
    case 'patch':
      return 'bg-warm-sand text-foreground';
    default:
      return 'bg-muted';
  }
};

export const getTypeLabel = (type: Version['type']) => {
  switch (type) {
    case 'major':
      return 'Крупное';
    case 'minor':
      return 'Среднее';
    case 'patch':
      return 'Исправление';
  }
};

export const getFileIcon = (type: 'pdf' | 'xls' | 'doc') => {
  switch (type) {
    case 'pdf':
      return 'FileText';
    case 'xls':
      return 'FileSpreadsheet';
    case 'doc':
      return 'FileText';
  }
};
