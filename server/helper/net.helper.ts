import os from 'node:os';

export function getLocalIp(): string {
  const interfaces = os.networkInterfaces();
  let ip = '';
  for (const iface in interfaces) {
    interfaces[iface]?.forEach(details => {
      if (details.family === 'IPv4' && !details.internal) {
        ip = details.address;
      }
    });
  }
  return ip;
}