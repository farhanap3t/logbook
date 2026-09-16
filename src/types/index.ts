export type LogbookCategory =
  | 'Meeting'
  | 'Development'
  | 'Testing'
  | 'Monitoring'
  | 'Analysis'
  | 'Documentation'
  | 'Issue/Incident'
  | 'Maintenance'
  | 'Other';

export type LogbookStatus =
  | 'Draft'
  | 'Submitted'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export type UserRole = 'User' | 'Supervisor' | 'Admin' | 'Viewer';

export type ViewMode = 'table' | 'board' | 'timeline';

export interface AttachmentFile {
  id: string;
  name: string;
  size: number; // in bytes
  type: string;
  dataUrl?: string; // base64 representation for preview/download
  uploadedAt: string;
}

export interface LogbookRecord {
  id: string; // LB-000001
  tanggal: string; // YYYY-MM-DD
  judul: string;
  kategori: LogbookCategory;
  deskripsi: string;
  status: LogbookStatus;
  attachment?: AttachmentFile;
  catatan?: string;
  createdBy: string;
  createdDate: string; // YYYY-MM-DD HH:mm
  updatedBy?: string;
  updatedDate?: string; // YYYY-MM-DD HH:mm
  isDeleted?: boolean; // soft delete
}

export interface AuditTrailRecord {
  id: string;
  logbookId: string;
  action: 'Create' | 'Edit' | 'Delete';
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
  changedBy: string;
  changedDate: string; // DD/MM/YYYY HH:mm
}

export interface LogbookFilterState {
  search: string;
  startDate: string;
  endDate: string;
  kategori: string; // 'All' or specific category
  status: string; // 'All' or specific status
  createdBy: string; // 'All' or user name
}

export type SortField = 'tanggal' | 'createdDate' | 'updatedDate' | 'judul';
export type SortDirection = 'asc' | 'desc';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'validation';
  message: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  email: string;
}
