onmessage = (e) => {

  const { type, data } = e.data;

  postMessage({ type: 'FETCH_HEARTBEAT', time: Date.now() });
};
