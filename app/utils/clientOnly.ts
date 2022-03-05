/**
 * Run callback on client only.
 */
const clientOnly = (callback: () => void) => {
  if (typeof window !== 'undefined') {
    callback();
  }
};

export default clientOnly;
