export function getClientUuid(): string {
  const KEY = 'study_client_id';
  let uuid = sessionStorage.getItem(KEY);
  if (!uuid) {
    uuid = crypto.randomUUID() 
    sessionStorage.setItem(KEY, uuid);
  }
  return uuid;
}
