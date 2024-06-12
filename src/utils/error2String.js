export default function error2String(error) {
  if (error.code === 'ERR_NETWORK') { return 'Cannot connect to backend server'; }
  if (!error.code) {
    console.error(error);
    return 'Internal error, please contact the developers.';
  }
  const { detail } = error.response.data;
  if (error.response.status === 500) return 'Internal server error';
  if (typeof detail === 'string') {
    return detail;
  } if (typeof detail === 'object') {
    return `Server error message:\n${JSON.stringify(detail)}`;
  }
  return '';
}
