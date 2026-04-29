type ShakedownEvent = {
  timestamp: string;
  partnerName: string;
  shakedownCode: string;
  offer: string;
};

// In a "zero-backend" hackathon build, we can use an in-memory log 
// for the duration of the server process. 
// For a production app, this would go to a database like Supabase or Vercel KV.
let shakedownLog: ShakedownEvent[] = [];

export function logShakedown(event: Omit<ShakedownEvent, 'timestamp'>) {
  const newEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };
  
  shakedownLog.unshift(newEvent); // Keep newest first
  
  // Also log to console with a unique prefix for easy filtering/piping
  console.log(`[SHAKEDOWN_RECORDED] ${newEvent.timestamp} - ${newEvent.partnerName} (${newEvent.shakedownCode})`);
  
  // Limit to last 50 events
  if (shakedownLog.length > 50) {
    shakedownLog = shakedownLog.slice(0, 50);
  }
}

export function getShakedownLogs() {
  return shakedownLog;
}
