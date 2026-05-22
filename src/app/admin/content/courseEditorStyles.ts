// CSS-in-JS style constants shared across CourseEditor sub-components

export const containerStyle: React.CSSProperties = {
  padding: '32px 0',
  fontFamily: 'system-ui',
};

export const headerRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
  flexWrap: 'wrap',
  gap: 12,
};

export const breadcrumbStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#888',
  marginBottom: 4,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  flexWrap: 'wrap',
};

export const breadcrumbLink: React.CSSProperties = {
  color: '#3B82F6',
  cursor: 'pointer',
  textDecoration: 'none',
  fontWeight: 600,
};

export const editorCardStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: 12,
  border: '1px solid #E5E5E5',
  padding: 16,
  marginBottom: 12,
  cursor: 'pointer',
  transition: 'border-color 0.15s',
};

export const btnPrimary: React.CSSProperties = {
  padding: '10px 20px',
  fontSize: 14,
  fontWeight: 700,
  border: 'none',
  borderRadius: 8,
  background: '#3B82F6',
  color: 'white',
  cursor: 'pointer',
};

export const btnDanger: React.CSSProperties = {
  padding: '6px 14px',
  fontSize: 12,
  fontWeight: 700,
  border: 'none',
  borderRadius: 6,
  background: '#EF4444',
  color: 'white',
  cursor: 'pointer',
};

export const btnSecondary: React.CSSProperties = {
  padding: '6px 14px',
  fontSize: 12,
  fontWeight: 700,
  border: '1.5px solid #D1D5DB',
  borderRadius: 6,
  background: 'white',
  color: '#374151',
  cursor: 'pointer',
};

export const btnBack: React.CSSProperties = {
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: 600,
  border: '1.5px solid #D1D5DB',
  borderRadius: 8,
  background: 'white',
  color: '#374151',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
};

export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 10,
  fontSize: 14,
  border: '1px solid #ddd',
  borderRadius: 8,
  boxSizing: 'border-box',
  fontFamily: 'system-ui',
};

export const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 80,
  resize: 'vertical',
};

export const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 700,
  color: '#555',
  marginBottom: 4,
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
};

export const formSectionStyle: React.CSSProperties = {
  background: '#F8FAFF',
  border: '1.5px solid #C5D5F6',
  borderRadius: 12,
  padding: 20,
  marginBottom: 16,
};

export const formFieldStyle: React.CSSProperties = {
  marginBottom: 16,
};

export const badgeStyle = (bg: string, color: string): React.CSSProperties => ({
  fontSize: 11,
  fontWeight: 700,
  padding: '2px 8px',
  borderRadius: 6,
  background: bg,
  color,
  whiteSpace: 'nowrap',
  display: 'inline-block',
});

export const colorSwatchStyle = (color: string): React.CSSProperties => ({
  width: 20,
  height: 20,
  borderRadius: 4,
  background: color,
  border: '1px solid #ccc',
  display: 'inline-block',
  flexShrink: 0,
});

export const actionRow: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  flexShrink: 0,
};

export const formActions: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  marginTop: 20,
  flexWrap: 'wrap',
};
