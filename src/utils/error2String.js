export default function error2String(error) {
  if (!error.response) { return 'Cannot connect to backend server'; }
  const { detail } = error.response.data;
  if (error.response.status === 500) return 'Internal server error';
  if (typeof detail === 'string') {
    return detail;
  } if (typeof detail === 'object') {
    return `Server error message:\n${JSON.stringify(detail)}`;
  }
  return '';
}
