import os from 'node:os';


export function getAllLocalIps(): { interface: string; address: string }[] {
  const interfaces = os.networkInterfaces();
  const result: { interface: string; address: string }[] = [];

  for (const ifaceName in interfaces) {
    interfaces[ifaceName]?.forEach(details => {
      if (details.family === 'IPv4' && !details.internal) {
        result.push({
          interface: ifaceName, address: details.address,
        });
      }
    });
  }

  return result;
}